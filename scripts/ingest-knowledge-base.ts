import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { getEmbeddingProvider } from "../lib/embeddings";

/**
 * Reads the local knowledge-base JSON, embeds every document and upserts
 * the chunks into the `knowledge_chunks` table. Run with:
 *
 *   pnpm ingest   |   npm run ingest   |   npx tsx scripts/ingest-knowledge-base.ts
 */

type KB = {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  metadata?: Record<string, unknown>;
};

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[ingest] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const file = path.join(process.cwd(), "data", "Elzada_Institute_of_Technology_RAG_Knowledge_Base.json");
  if (!fs.existsSync(file)) {
    console.error(`[ingest] Knowledge base file not found at ${file}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(file, "utf-8");
  const docs: KB[] = JSON.parse(raw);
  console.log(`[ingest] Loaded ${docs.length} documents`);

  const provider = await getEmbeddingProvider();
  console.log(`[ingest] Using embedding provider: ${provider.name} (dim=${provider.dim})`);

  let ok = 0;
  let failed = 0;

  // Process in small batches so we don't blow memory or rate limits.
  const BATCH = 8;
  for (let i = 0; i < docs.length; i += BATCH) {
    const slice = docs.slice(i, i + BATCH);
    const texts = slice.map((d) => `${d.title}\n\n${d.content}`);
    let embeddings: number[][];
    try {
      embeddings = await provider.embed(texts);
    } catch (err) {
      console.error(`[ingest] Embedding batch failed (${i}):`, err);
      failed += slice.length;
      continue;
    }

    const rows = slice.map((d, idx) => ({
      id: d.id,
      category: d.category,
      title: d.title,
      content: d.content,
      keywords: d.keywords,
      metadata: d.metadata ?? {},
      embedding: embeddings[idx],
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("knowledge_chunks").upsert(rows, { onConflict: "id" });
    if (error) {
      console.error(`[ingest] Upsert batch failed (${i}):`, error.message);
      failed += slice.length;
    } else {
      ok += slice.length;
      console.log(`[ingest] Upserted ${ok}/${docs.length}`);
    }
  }

  console.log(`[ingest] Done. success=${ok} failed=${failed}`);
}

main().catch((err) => {
  console.error("[ingest] Fatal:", err);
  process.exit(1);
});

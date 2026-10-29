import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import knowledgeBase from "@/data/Elzada_Institute_of_Technology_RAG_Knowledge_Base.json";

export const runtime = "nodejs";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  return token && token === process.env.ADMIN_DASHBOARD_TOKEN;
}

/**
 * Rows pulled per table for distribution maths. Authoritative totals always
 * come from Postgrest's `count: "exact"`, so the dashboard never under-reports
 * when a table has more rows than we fetch.
 */
const MAX_ROWS = 1000;

/** The literal values declared for `enquiries.status` in `sql/schema.sql`. */
const KNOWN_STATUSES = ["new", "in_progress", "resolved", "spam"] as const;

export type SystemCheck = {
  id: string;
  label: string;
  status: "ok" | "warn" | "down";
  detail: string;
};

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const range = url.searchParams.get("range") ?? "7d";
  const days = range === "30d" ? 30 : range === "24h" ? 1 : 7;

  const supabase = getSupabaseAdmin();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseConfigured = Boolean(supabaseUrl && serviceKey);

  const startedAt = Date.now();
  const [enquiries, conversations, knowledge] = await Promise.all([
    supabase
      .from("enquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(MAX_ROWS),
    supabase
      .from("conversations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(MAX_ROWS),
    supabase.from("knowledge_chunks").select("id,category,title", { count: "exact" }).limit(1),
  ]);
  const dbMs = Date.now() - startedAt;

  const enquiryRows = Array.isArray(enquiries.data) ? (enquiries.data as any[]) : [];
  const conversationRows = Array.isArray(conversations.data) ? (conversations.data as any[]) : [];

  const enquiryError = enquiries.error?.message ?? null;
  const conversationError = conversations.error?.message ?? null;
  const knowledgeError = knowledge.error?.message ?? null;

  // ---- Authoritative totals (Postgrest count, independent of the row cap) ---
  const totalEnquiries = typeof enquiries.count === "number" ? enquiries.count : enquiryRows.length;
  const totalConversations =
    typeof conversations.count === "number" ? conversations.count : conversationRows.length;
  const totalKnowledge = knowledge.count ?? 0;

  // ---- Windowed counts (existing contract — consumed by other modules) ------
  const since = new Date(Date.now() - days * 86400 * 1000).toISOString();
  const recentConversations = conversationRows.filter((c) => c.created_at >= since);
  const recentEnquiries = enquiryRows.filter((e) => e.created_at >= since);

  const intentCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  let latencies = 0;
  let latSum = 0;
  let confSum = 0;
  let confN = 0;
  for (const c of recentConversations) {
    if (c.intent) intentCounts[c.intent] = (intentCounts[c.intent] ?? 0) + 1;
    if (c.category) categoryCounts[c.category] = (categoryCounts[c.category] ?? 0) + 1;
    if (typeof c.latency_ms === "number") {
      latencies++;
      latSum += c.latency_ms;
    }
    if (typeof c.confidence === "number") {
      confN++;
      confSum += c.confidence;
    }
  }

  // ---- Enquiry status distribution (real rows only) -------------------------
  const statusCounts: Record<string, number> = {};
  for (const s of KNOWN_STATUSES) statusCounts[s] = 0;
  let otherStatuses = 0;
  for (const e of enquiryRows) {
    const s = String(e.status ?? "new");
    if (s in statusCounts) statusCounts[s] += 1;
    else otherStatuses += 1;
  }

  // ---- Most requested programs ---------------------------------------------
  const programTally = new Map<string, number>();
  for (const e of enquiryRows) {
    const p = String(e.program ?? "").trim();
    if (!p) continue;
    programTally.set(p, (programTally.get(p) ?? 0) + 1);
  }
  const programs = [...programTally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));
  const enquiriesWithoutProgram = enquiryRows.filter((e) => !String(e.program ?? "").trim()).length;

  const timeline = buildTimeline(recentConversations, recentEnquiries, days);
  const system = buildSystemChecks({
    supabaseConfigured,
    dbMs,
    enquiryError,
    conversationError,
    knowledgeError,
    totalEnquiries,
    totalConversations,
    totalKnowledge,
  });

  return NextResponse.json({
    range,
    // Windowed counts — unchanged shape, still what analytics-charts reads.
    counts: {
      conversations: recentConversations.length,
      enquiries: recentEnquiries.length,
      knowledge: totalKnowledge,
    },
    // All-time totals, derived from `count: "exact"`.
    totals: {
      enquiries: totalEnquiries,
      conversations: totalConversations,
      knowledge: totalKnowledge,
      fetchedEnquiries: enquiryRows.length,
      fetchedConversations: conversationRows.length,
      maxRows: MAX_ROWS,
      /** true when distribution maths saw every row in the table. */
      distributionsComplete:
        enquiryRows.length >= totalEnquiries && conversationRows.length >= totalConversations,
    },
    status: { ...statusCounts, other: otherStatuses },
    funnel: {
      total: totalEnquiries,
      fresh: statusCounts.new,
      contacted: statusCounts.in_progress,
      resolved: statusCounts.resolved,
      spam: statusCounts.spam,
      other: otherStatuses,
    },
    programs,
    enquiriesWithoutProgram,
    intents: intentCounts,
    categories: categoryCounts,
    latency: {
      avgMs: latencies ? Math.round(latSum / latencies) : 0,
      samples: latencies,
    },
    confidence: {
      avg: confN ? Number((confSum / confN).toFixed(3)) : 0,
      samples: confN,
    },
    timeline,
    enquiries: enquiryRows.slice(0, 25),
    conversations: conversationRows.slice(0, 25),
    notes: {
      statuses: [...KNOWN_STATUSES],
      contactedStatus: "in_progress",
      convertedStatus: null,
      caveat:
        "The enquiries table declares status 'new' | 'in_progress' | 'resolved' | 'spam' only — " +
        "there is no 'contacted' or 'converted' value in sql/schema.sql. This dashboard counts " +
        "in_progress as contacted and resolved as the terminal state. A distinct conversion flag " +
        "would require a schema change, which this phase deliberately does not make.",
    },
    system: { checkedAt: new Date().toISOString(), dbMs, supabaseConfigured, checks: system },
  });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { id, status, notes } = body ?? {};
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (typeof notes === "string") update.notes = notes;
  const { error } = await supabase.from("enquiries").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/* -------------------------------------------------------------------------- */
/* Timeline                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Daily buckets across the selected window for BOTH series.
 *
 * The previous version only ever incremented `conversations`, so the enquiry
 * series was permanently zero — that is why it now receives both arrays.
 */
function buildTimeline(conversations: any[], enquiries: any[], days: number) {
  const buckets: Record<string, { date: string; conversations: number; enquiries: number }> = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets[key] = { date: key, conversations: 0, enquiries: 0 };
  }
  for (const c of conversations) {
    const key = toDayKey(c?.created_at);
    if (key && buckets[key]) buckets[key].conversations += 1;
  }
  for (const e of enquiries) {
    const key = toDayKey(e?.created_at);
    if (key && buckets[key]) buckets[key].enquiries += 1;
  }
  return Object.values(buckets);
}

/** UTC `YYYY-MM-DD`, or "" for anything unparseable (never throws). */
function toDayKey(iso: unknown): string {
  if (typeof iso !== "string") return "";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  return new Date(t).toISOString().slice(0, 10);
}

/* -------------------------------------------------------------------------- */
/* Real system checks                                                         */
/* -------------------------------------------------------------------------- */

function buildSystemChecks(input: {
  supabaseConfigured: boolean;
  dbMs: number;
  enquiryError: string | null;
  conversationError: string | null;
  knowledgeError: string | null;
  totalEnquiries: number;
  totalConversations: number;
  totalKnowledge: number;
}): SystemCheck[] {
  const checks: SystemCheck[] = [];

  checks.push({
    id: "admin-api",
    label: "Admin API",
    status: "ok",
    detail: "ADMIN_DASHBOARD_TOKEN is set and this request was accepted.",
  });

  if (!input.supabaseConfigured) {
    checks.push({
      id: "database",
      label: "Database",
      status: "down",
      detail:
        "Not configured — NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are missing. " +
        "Copy .env.example to .env.local, fill in a Supabase project, then run sql/pgvector-setup.sql " +
        "followed by sql/schema.sql on it. No tables were created by this app.",
    });
  } else {
    const anyError = input.enquiryError ?? input.conversationError ?? input.knowledgeError;
    checks.push({
      id: "database",
      label: "Database",
      status: anyError ? "down" : "ok",
      detail: anyError
        ? `Reachable but a query failed: ${anyError}`
        : `Reachable — 3 tables queried in ${input.dbMs}ms.`,
    });

    const table = (
      id: string,
      label: string,
      error: string | null,
      count: number,
      plural: string,
    ): SystemCheck => ({
      id,
      label,
      status: error ? "down" : "ok",
      detail: error ? error : `${count.toLocaleString("en-IN")} ${plural}`,
    });

    checks.push(
      table(
        "table-enquiries",
        "Table: enquiries",
        input.enquiryError,
        input.totalEnquiries,
        "rows",
      ),
      table(
        "table-conversations",
        "Table: conversations",
        input.conversationError,
        input.totalConversations,
        "rows",
      ),
      table(
        "table-knowledge",
        "Table: knowledge_chunks",
        input.knowledgeError,
        input.totalKnowledge,
        "rows",
      ),
    );
  }

  // Local RAG corpus — read straight from the shipped JSON, no embedding work.
  const localDocs = Array.isArray(knowledgeBase) ? knowledgeBase.length : 0;
  checks.push({
    id: "rag-dataset",
    label: "RAG dataset",
    status: localDocs > 0 ? "ok" : "down",
    detail:
      localDocs > 0
        ? `${localDocs} records in data/…_RAG_Knowledge_Base.json (bundled, no database needed)`
        : "Bundled knowledge-base JSON is missing or empty.",
  });

  // Same selection rule lib/embeddings.ts applies — read-only, nothing changed.
  const openAi = Boolean(process.env.OPENAI_API_KEY);
  checks.push({
    id: "embeddings",
    label: "Embeddings",
    status: openAi ? "ok" : "warn",
    detail: openAi
      ? "OpenAI text-embedding-3-small (1536 dims)"
      : `local-hash fallback (${
          process.env.EMBEDDING_DIM || "384"
        } dims) — deterministic, fine for development; set OPENAI_API_KEY for production vectors.`,
  });

  const llm = process.env.OPENAI_API_KEY
    ? `OpenAI (${process.env.OPENAI_MODEL || "gpt-4o-mini"})`
    : process.env.ANTHROPIC_API_KEY
      ? `Anthropic (${process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet"})`
      : process.env.GOOGLE_API_KEY
        ? `Google (${process.env.GOOGLE_MODEL || "gemini-1.5-flash"})`
        : null;
  checks.push({
    id: "llm",
    label: "LLM provider",
    status: llm ? "ok" : "warn",
    detail: llm
      ? `${llm} configured`
      : "No provider key set — /api/chat answers from the strict extractive RAG fallback only.",
  });

  return checks;
}

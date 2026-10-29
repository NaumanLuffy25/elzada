import { tokenize, unique } from "./utils";

/**
 * Embedding provider abstraction.
 *
 * In production this calls OpenAI's text-embedding-3-small (or any compatible
 * provider). When no API key is configured it falls back to a deterministic
 * hashed bag-of-words embedder so the rest of the pipeline can be developed
 * and unit-tested offline. Both implementations produce unit-normalised
 * vectors, which keeps cosine similarity numerically stable.
 */

const DEFAULT_DIM = Number(process.env.EMBEDDING_DIM || 384);

export type EmbeddingProvider = {
  name: string;
  dim: number;
  embed: (texts: string[]) => Promise<number[][]>;
  embedOne: (text: string) => Promise<number[]>;
};

async function openAIEmbed(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const model = process.env.OPENAI_MODEL || "text-embedding-3-small";
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input: texts, model }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI embeddings failed: ${res.status} ${body}`);
  }
  const json = (await res.json()) as { data: { embedding: number[] }[] };
  return json.data.map((d) => d.embedding);
}

// ---------- Local fallback embedder ---------------------------------------

function hash32(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function localEmbedOne(text: string, dim: number): number[] {
  const vec = new Array(dim).fill(0);
  const tokens = tokenize(text);
  if (tokens.length === 0) return vec;

  // Sub-linear TF
  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  for (const [tok, c] of counts) {
    const tf = 1 + Math.log(c);
    const idx = hash32(tok) % dim;
    const sign = (hash32(tok + "|s") % 2) === 0 ? 1 : -1;
    vec[idx] += sign * tf;
  }

  // Bigrams for a bit more signal
  for (let i = 0; i < tokens.length - 1; i++) {
    const bg = `${tokens[i]}_${tokens[i + 1]}`;
    const idx = hash32(bg) % dim;
    const sign = (hash32(bg + "|s") % 2) === 0 ? 1 : -1;
    vec[idx] += sign * 0.5;
  }

  // L2 normalise
  let norm = 0;
  for (const v of vec) norm += v * v;
  norm = Math.sqrt(norm) || 1;
  return vec.map((v) => v / norm);
}

async function localEmbed(texts: string[]): Promise<number[][]> {
  const dim = DEFAULT_DIM;
  return texts.map((t) => localEmbedOne(t, dim));
}

// ---------- Public provider ------------------------------------------------

export async function getEmbeddingProvider(): Promise<EmbeddingProvider> {
  if (process.env.OPENAI_API_KEY) {
    const dim = 1536; // text-embedding-3-small default
    return {
      name: "openai",
      dim,
      embed: openAIEmbed,
      embedOne: async (t) => (await openAIEmbed([t]))[0],
    };
  }
  return {
    name: "local-hash",
    dim: DEFAULT_DIM,
    embed: localEmbed,
    embedOne: async (t) => localEmbedOne(t, DEFAULT_DIM),
  };
}

// ---------- Math helpers ---------------------------------------------------

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    // Pad / truncate to the shorter length to be forgiving.
    const n = Math.min(a.length, b.length);
    a = a.slice(0, n);
    b = b.slice(0, n);
  }
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
}

export function topK<T>(items: T[], scores: number[], k: number): { item: T; score: number }[] {
  const idx = scores
    .map((score, i) => ({ score, i }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ i }) => ({ item: items[i], score: scores[i] }));
  return idx;
}

// ---------- BM25 keyword fallback -----------------------------------------

export function bm25Score(query: string, doc: string, avgdl: number, idf: Map<string, number>): number {
  const k1 = 1.5;
  const b = 0.75;
  const qTokens = tokenize(query);
  const dTokens = tokenize(doc);
  const dl = dTokens.length || 1;
  const tf = new Map<string, number>();
  for (const t of dTokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  let score = 0;
  for (const qt of qTokens) {
    const f = tf.get(qt) ?? 0;
    const idfVal = idf.get(qt) ?? 0;
    if (f === 0) continue;
    score += idfVal * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * dl) / (avgdl || 1))));
  }
  return score;
}

export function buildIDF(corpus: string[]): { idf: Map<string, number>; avgdl: number } {
  const N = corpus.length;
  const df = new Map<string, number>();
  let totalLen = 0;
  for (const doc of corpus) {
    const toks = unique(tokenize(doc));
    totalLen += toks.length;
    for (const t of toks) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [t, c] of df) idf.set(t, Math.log(1 + (N - c + 0.5) / (c + 0.5)));
  return { idf, avgdl: totalLen / Math.max(1, N) };
}

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAllDocs, retrieve } from "@/lib/rag";

export const runtime = "nodejs";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? new URL(req.url).searchParams.get("token");
  return Boolean(token) && token === process.env.ADMIN_DASHBOARD_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const limit = Number(url.searchParams.get("limit") ?? 20);

  if (q) {
    const results = await retrieve(q, limit);
    return NextResponse.json({
      query: q,
      count: results.length,
      results: results.map((r) => ({
        id: r.doc.id,
        title: r.doc.title,
        category: r.doc.category,
        score: Number(r.score.toFixed(4)),
        snippet: r.doc.content.slice(0, 220),
      })),
    });
  }

  const docs = await getAllDocs();
  return NextResponse.json({
    count: docs.length,
    categories: summarize(docs.map((d) => d.category)),
    docs: docs.slice(0, limit).map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      keywords: d.keywords,
      snippet: d.content.slice(0, 220),
    })),
  });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { id, title, category, content, keywords, metadata } = body ?? {};
  if (!id || !title || !category || !content) {
    return NextResponse.json({ error: "id, title, category and content are required" }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("knowledge_chunks").upsert({
    id,
    title,
    category,
    content,
    keywords: Array.isArray(keywords) ? keywords : [],
    metadata: metadata ?? {},
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("knowledge_chunks").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

function summarize(arr: string[]) {
  const map: Record<string, number> = {};
  for (const x of arr) map[x] = (map[x] ?? 0) + 1;
  return map;
}

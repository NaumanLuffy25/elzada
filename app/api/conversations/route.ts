import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function checkAuth(req: NextRequest) {
  const token =
    req.headers.get("x-admin-token") ?? new URL(req.url).searchParams.get("token");
  return Boolean(token) && token === process.env.ADMIN_DASHBOARD_TOKEN;
}

/**
 * Admin-only conversations viewer.
 *
 * Two shapes:
 *  - Without `?session_id=`: lists conversation sessions (grouped by session_id)
 *    with message count, first/last message, intent, category and date, with
 *    server-side pagination and search.
 *  - With `?session_id=`: returns the full message history for that session,
 *    ordered chronologically, so the admin can inspect the actual chat.
 *
 * Guarded by the shared `x-admin-token` header (or `?token=`).
 */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? "50")));
  const search = (url.searchParams.get("search") ?? "").trim();

  const supabase = getSupabaseAdmin();

  // --- Message history for a single session -------------------------------
  if (sessionId) {
    let query = supabase
      .from("conversations")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });
    if (search) {
      query = query.ilike("user_message", `%${search}%`).or(
        `user_message.ilike.%${search}%,bot_reply.ilike.%${search}%`,
      );
    }
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({
      session_id: sessionId,
      messages: (data ?? []).map((m) => ({
        id: m.id,
        session_id: m.session_id,
        user_message: m.user_message,
        bot_reply: m.bot_reply,
        intent: m.intent,
        category: m.category,
        confidence: m.confidence,
        latency_ms: m.latency_ms,
        sources: m.sources,
        created_at: m.created_at,
      })),
    });
  }

  // --- Session list (grouped by session_id) -------------------------------
  const { data, error } = await supabase
    .from("conversations")
    .select("session_id, user_message, bot_reply, intent, category, confidence, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const sessions = new Map<
    string,
    {
      session_id: string;
      message_count: number;
      first_message: string;
      last_message: string;
      created_at: string;
      intent?: string;
      category?: string;
    }
  >();

  for (const r of rows) {
    const existing = sessions.get(r.session_id);
    if (!existing) {
      sessions.set(r.session_id, {
        session_id: r.session_id,
        message_count: 1,
        first_message: r.user_message,
        last_message: r.user_message,
        created_at: r.created_at,
        intent: r.intent,
        category: r.category,
      });
    } else {
      existing.message_count += 1;
      existing.last_message = r.user_message;
      if (r.created_at > existing.created_at) existing.created_at = r.created_at;
    }
  }

  let list = Array.from(sessions.values());
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (c) =>
        c.session_id.toLowerCase().includes(s) ||
        c.first_message.toLowerCase().includes(s) ||
        c.last_message.toLowerCase().includes(s) ||
        (c.intent ?? "").toLowerCase().includes(s) ||
        (c.category ?? "").toLowerCase().includes(s),
    );
  }
  list.sort((a, b) => b.created_at.localeCompare(a.created_at));

  const total = list.length;
  const from = (page - 1) * limit;
  const pageList = list.slice(from, from + limit);

  return NextResponse.json({
    sessions: pageList,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

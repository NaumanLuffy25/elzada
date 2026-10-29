import { NextRequest, NextResponse } from "next/server";
import { generateAnswer, type RagResult } from "@/lib/rag";
import { getSupabaseAdmin } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? new URL(req.url).searchParams.get("token");
  return Boolean(token) && token === process.env.ADMIN_DASHBOARD_TOKEN;
}

export async function POST(req: NextRequest) {
  // Rate limit public chat submissions (10 requests per minute per IP)
  const ip = getClientIp(req);
  if (!rateLimit(ip, 10, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const message = String(body?.message ?? "").trim();
    const sessionId = String(body?.sessionId ?? "anon");
    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const result: RagResult = await generateAnswer(message, 5);

    // Fire-and-forget persistence
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("conversations").insert({
        session_id: sessionId,
        user_message: message,
        bot_reply: result.answer,
        intent: result.intent,
        category: result.category,
        confidence: result.confidence,
        latency_ms: result.latency_ms,
        sources: result.sources.map((s) => ({
          id: s.doc.id,
          title: s.doc.title,
          category: s.doc.category,
          score: s.score,
          evidence_passed: s.evidencePassed,
        })),
      });
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[chat] persistence failed:", e);
      }
    }

    return NextResponse.json({
      answer: result.answer,
      intent: result.intent,
      category: result.category,
      confidence: Number(result.confidence.toFixed(4)),
      latency_ms: result.latency_ms,
      provider: result.provider,
      grounded: result.grounded,
      responseType: result.responseType,
      sources: result.sources.map((s) => ({
        id: s.doc.id,
        title: s.doc.title,
        category: s.doc.category,
        score: Number(s.score.toFixed(4)),
        evidencePassed: s.evidencePassed,
      })),
      evidenceSources: result.evidenceSources.map((s) => ({
        id: s.id,
        title: s.title,
        category: s.category,
        score: Number(s.score.toFixed(4)),
      })),
    });
  } catch (err: any) {
    console.error("[chat] error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { messageId, feedback } = body ?? {};
    if (!messageId || !["up", "down"].includes(feedback)) {
      return NextResponse.json({ error: "Invalid feedback payload" }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    await supabase.from("conversations").insert({
      session_id: "feedback",
      user_message: String(messageId),
      bot_reply: `feedback:${feedback}`,
      intent: "feedback",
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    status: "ok",
    pipeline: "Strict dataset-only RAG (hybrid retrieval: cosine + BM25 RRF + extractive grounded generation)",
    knowledgeSource: "@/data/Elzada_Institute_of_Technology_RAG_Knowledge_Base.json",
    records: 37,
    guardrails: [
      "evidence_score_threshold",
      "token_overlap_minimum",
      "prompt_injection_detection",
      "out_of_scope_classifier",
      "llm_citation_requirement",
      "deterministic_fallback_template",
    ],
    fallbackResponse:
      "I'm sorry, but I couldn't find verified information about this in the official Elzada Institute of Technology knowledge base. Please contact the college administration for confirmation.",
    endpoints: { POST: "ask a question", PATCH: "submit feedback" },
  });
}

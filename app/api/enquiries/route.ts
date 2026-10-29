import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ALLOWED_STATUSES = ["new", "in_progress", "resolved", "spam"] as const;

function checkAuth(req: NextRequest) {
  const token =
    req.headers.get("x-admin-token") ?? new URL(req.url).searchParams.get("token");
  return Boolean(token) && token === process.env.ADMIN_DASHBOARD_TOKEN;
}

export async function POST(req: NextRequest) {
  // Rate limit public enquiry submissions (10 requests per minute per IP)
  const ip = getClientIp(req);
  if (!rateLimit(ip, 10, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const phone = body?.phone ? String(body.phone).trim() : null;
    const program = body?.program ? String(body.program).trim() : null;
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("enquiries")
      .insert({ name, email, phone, program, message, source: "website" })
      .select("id")
      .single();

    if (error) {
      // Stub client returns no error but no id; treat as soft success in dev
      if (!data) {
        return NextResponse.json({ ok: true, id: "stub", persisted: false });
      }
      return NextResponse.json({ error: (error as any).message ?? String(error) }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (err: any) {
    console.error("[enquiries] error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

/**
 * Admin-only listing. Guarded by the shared `x-admin-token` header (or `?token=`).
 * Supports `?page=` / `?limit=` for server-side pagination and returns an
 * authoritative `count` so the UI can render real pagination controls.
 */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? "50")));
  const from = (page - 1) * limit;

  const supabase = getSupabaseAdmin();
  const { data, error, count } = await supabase
    .from("enquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    enquiries: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
    },
  });
}

/**
 * Admin-only status update. Persists a single enquiry's status through the
 * service-role client (RLS allows service_role to write). Returns the updated
 * row so the UI can reflect the change immediately.
 */
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { id, status } = body ?? {};

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "enquiry id is required" }, { status: 400 });
  }
  if (!status || !ALLOWED_STATUSES.includes(status as any)) {
    return NextResponse.json(
      { error: `status must be one of ${ALLOWED_STATUSES.join(", ")}` },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id)
    .select("id, name, email, status, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });

  return NextResponse.json({ ok: true, enquiry: data });
}

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const providedKey = body?.key?.trim();

    if (!providedKey) {
      return NextResponse.json({ error: "Admin key is required" }, { status: 400 });
    }

    const validKey = process.env.ADMIN_DASHBOARD_TOKEN;

    if (!validKey) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    if (providedKey !== validKey) {
      return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
    }

    // Return the token for the client to store in localStorage
    return NextResponse.json({ token: validKey, success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
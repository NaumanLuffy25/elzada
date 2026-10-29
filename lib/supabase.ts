import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client. Uses the public anon key.
 * Safe to import in client components.
 */
let _browser: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (_browser) return _browser;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Return a stub so the app still boots without a configured backend.
    return stubClient();
  }
  _browser = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _browser;
}

/**
 * Server-only Supabase client with service-role privileges.
 * Never import this from a client component.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return stubClient();
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Stub client used when Supabase env vars are missing. All data calls return
 * empty arrays / null so the front-end keeps rendering cleanly. In production
 * the SQL files in /sql should be run on a real Supabase project.
 */
function stubClient(): SupabaseClient {
  const empty = Promise.resolve({ data: [], error: null, count: 0, status: 200, statusText: "OK" });
  const builder: any = {
    from: () => builder,
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    delete: () => builder,
    eq: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    gte: () => builder,
    lte: () => builder,
    ilike: () => builder,
    textSearch: () => builder,
    match: () => builder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: empty.then.bind(empty),
  };
  return builder as SupabaseClient;
}

export type EnquiryRow = {
  id: string;
  created_at: string;
  updated_at?: string;
  name: string;
  email: string;
  phone?: string;
  program?: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "spam";
  source?: string;
  notes?: string;
};

export type ConversationRow = {
  id: string;
  created_at: string;
  updated_at: string;
  session_id: string;
  user_message: string;
  bot_reply: string;
  intent?: string;
  category?: string;
  confidence?: number;
  latency_ms?: number;
};

export type KnowledgeDoc = {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  embedding?: number[];
  metadata?: Record<string, unknown>;
};

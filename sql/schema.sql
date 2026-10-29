-- =====================================================
-- Elzada AI Admission Website – Supabase Schema
-- =====================================================
-- Run this AFTER pgvector-setup.sql. Safe to re-run.

create extension if not exists "uuid-ossp";

-- -----------------------------------------------------
-- Knowledge base chunks (RAG corpus)
-- -----------------------------------------------------
create table if not exists public.knowledge_chunks (
  id text primary key,
  category text not null,
  title text not null,
  content text not null,
  keywords text[] default '{}',
  metadata jsonb default '{}'::jsonb,
  embedding vector(384),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_chunks_category_idx on public.knowledge_chunks (category);
create index if not exists knowledge_chunks_keywords_gin on public.knowledge_chunks using gin (keywords);
create index if not exists knowledge_chunks_embedding_ivf on public.knowledge_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- -----------------------------------------------------
-- Conversations (chatbot transcripts)
-- -----------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null,
  user_message text not null,
  bot_reply text not null,
  intent text,
  category text,
  confidence double precision,
  latency_ms integer,
  sources jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists conversations_session_idx on public.conversations (session_id, created_at desc);
create index if not exists conversations_intent_idx on public.conversations (intent);

-- -----------------------------------------------------
-- Enquiries (form submissions)
-- -----------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  program text,
  message text not null,
  status text not null default 'new',
  source text default 'website',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- -----------------------------------------------------
-- Evaluation runs (offline RAG / classifier metrics)
-- -----------------------------------------------------
create table if not exists public.eval_runs (
  id uuid primary key default uuid_generate_v4(),
  pipeline text not null,
  metrics jsonb not null,
  notes text,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------
alter table public.knowledge_chunks   enable row level security;
alter table public.conversations      enable row level security;
alter table public.enquiries          enable row level security;
alter table public.eval_runs          enable row level security;

-- Public read-only access to the knowledge base
drop policy if exists "kb public read" on public.knowledge_chunks;
create policy "kb public read" on public.knowledge_chunks
  for select using (true);

-- Anyone can insert a conversation or enquiry
drop policy if exists "conversations public insert" on public.conversations;
create policy "conversations public insert" on public.conversations
  for insert with check (true);

drop policy if exists "enquiries public insert" on public.enquiries;
create policy "enquiries public insert" on public.enquiries
  for insert with check (true);

-- Only the service role (admin) can update / delete
drop policy if exists "enquiries service role write" on public.enquiries;
create policy "enquiries service role write" on public.enquiries
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "conversations service role write" on public.conversations;
create policy "conversations service role write" on public.conversations
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "kb service role write" on public.knowledge_chunks;
create policy "kb service role write" on public.knowledge_chunks
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "eval service role write" on public.eval_runs;
create policy "eval service role write" on public.eval_runs
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- -----------------------------------------------------
-- Touch updated_at trigger
-- -----------------------------------------------------
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists trg_kb_touch on public.knowledge_chunks;
create trigger trg_kb_touch before update on public.knowledge_chunks
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_enquiries_touch on public.enquiries;
create trigger trg_enquiries_touch before update on public.enquiries
  for each row execute function public.touch_updated_at();

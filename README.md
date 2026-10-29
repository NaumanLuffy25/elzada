# Elzada AI Admission Website

A complete, production-ready Next.js 14 application for **Elzada Institute of Technology (EIT)** with a built-in **AI admission counsellor** powered by a Retrieval-Augmented Generation (RAG) pipeline over a curated knowledge base, plus an intent-classifier layer (multinomial Naive Bayes) and an operations dashboard for the admissions team.

> **What's in the box**
> 12 marketing pages · AI chat widget + full-page experience · 5 API routes · Naive Bayes intent classifier · RAG retriever with hybrid BM25 + dense embeddings · pgvector-based Supabase schema · Admin dashboard with live metrics, charts, knowledge-base editor, and system health · CLI scripts to ingest, train and evaluate.

---

## ✨ Features

### Public site
| Page | Highlights |
|------|------------|
| `/` Home | Hero with rotating-program animation, programs preview, placements strip, admissions timeline, CTA |
| `/about` | Vision / mission, leadership, NAAC A++ facts |
| `/university` | Deemed-university status, accreditation, academic calendar |
| `/programs` | 22 programs with live search + filter by level / discipline |
| `/admissions` | Step-by-step guide, timeline, eligibility, enquiry form |
| `/campus` | Campus-life highlights, events calendar, club catalogue |
| `/placements` | Placement stats, recruiter list, profile table, alumni stories |
| `/facilities` | Library, labs, hostels, sports, sustainability |
| `/faq` | Collapsible FAQ |
| `/contact` | Address, phone, email + enquiry form |
| `/ask-ai` | Full-page Elzada AI counsellor |

### AI / ML
- **Retrieval-Augmented Generation** with hybrid retrieval:
  - dense embedding cosine similarity (OpenAI `text-embedding-3-small` when an API key is set, deterministic hash-based embedder as a built-in fallback)
  - sparse **BM25** keyword scoring
  - **Reciprocal rank fusion** to merge the two
  - optional LLM-based answer synthesis (OpenAI / Anthropic / Google) with a deterministic extractive fallback
- **Intent classifier** (multinomial Naive Bayes) trained from scratch in TypeScript via `pnpm train`
- **Inline evaluation metrics** for both retriever and classifier (`pnpm evaluate`)

### Admin dashboard (`/admin`)
- Conversations table with full transcripts
- Enquiries table with status pipeline (new / in_progress / resolved / spam)
- Knowledge-base panel with live search and CRUD
- RAG monitoring (top-1 accuracy, exact-answer rate, p50 / p95 latency)
- Naive Bayes metrics (precision / recall / F1 per label)
- Recharts analytics: timeline area chart, intent-distribution pie, top-categories bar
- System health widget with live ping bars
- Simple token-based auth via `ADMIN_DASHBOARD_TOKEN` header

### Tooling
- TypeScript strict mode, ESLint
- Tailwind CSS + custom `elzada-` palette + glass-morphism design tokens
- `lucide-react` icons, `recharts` charts
- Offline-first: the app boots and renders every page without Supabase / OpenAI configured (stubs return empty data so you can iterate on the UI immediately)

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser (React)                                                 │
│   ├─ Pages (App Router)                                          │
│   ├─ <Chatbot /> + <FloatingAskAI />                             │
│   └─ /admin dashboard                                            │
└──────────────────────────────────────────────────────────────────┘
              │  POST /api/chat  /api/enquiries  /api/admin …
              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Next.js API routes (Edge-friendly node runtime)                 │
│   ├─ chat          → RAG pipeline  → Supabase persistence        │
│   ├─ enquiries     → Supabase insert + email-style validation     │
│   ├─ admin         → aggregated metrics for dashboard            │
│   ├─ knowledge-base→ search + CRUD                                │
│   └─ evaluation    → run RAG + classifier metrics                 │
└──────────────────────────────────────────────────────────────────┘
              │                            │
              ▼                            ▼
┌────────────────────────────┐  ┌─────────────────────────────────┐
│  lib/rag.ts                │  │  lib/ml-classifier.ts           │
│   ├─ BM25 + dense retrieve │  │   NaiveBayesClassifier          │
│   ├─ RRF fusion            │  │   (loaded from classifier.model │
│   ├─ LLM provider switch   │  │    .json — produced by          │
│   └─ extractive fallback   │  │    scripts/train-classifier.ts) │
└────────────────────────────┘  └─────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Supabase (Postgres + pgvector)                                  │
│   knowledge_chunks · conversations · enquiries · eval_runs       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting started

```bash
# 1. Install
pnpm install        # or npm install / yarn install

# 2. Copy env
cp .env.example .env.local
#   Fill in SUPABASE_* and (optionally) OPENAI_API_KEY

# 3. (optional) Create the Supabase schema
#    Run sql/pgvector-setup.sql then sql/schema.sql in the Supabase SQL editor

# 4. (optional) Ingest the knowledge base
pnpm ingest

# 5. (optional) Train + evaluate the intent classifier
pnpm train
pnpm evaluate            # writes evaluation-report.md

# 6. Start the dev server
pnpm dev                 # http://localhost:3000

# 7. Admin dashboard
#    Open /admin and paste your ADMIN_DASHBOARD_TOKEN
```

### Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm ingest` | Embed knowledge base and upsert into `knowledge_chunks` |
| `pnpm train` | Train Naive Bayes classifier and write `lib/classifier.model.json` |
| `pnpm evaluate` | Run offline evaluation suite, write `evaluation-report.md` |

---

## 🧠 How the RAG pipeline works

1. **Query understanding** — naive intent + category heuristic over tokenised keywords (`inferIntent` / `inferCategory`).
2. **Hybrid retrieval** — top-K chunks scored by:
   - **Dense**: cosine similarity between query embedding and chunk embedding.
   - **Sparse**: BM25 over the tokenised `title + content`.
   - Fused with **Reciprocal Rank Fusion** (`1/(k + rank_dense) + 1/(k + rank_sparse)`).
3. **Light re-ranking** — small boost when the chunk title shares tokens with the query, or when its category matches the inferred category.
4. **Answer synthesis** — if `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` is set, we call that LLM with the top-K chunks as context and a system prompt enforcing citations; otherwise we deterministically render the top three snippets into a clean Markdown reply with bullet points and source labels.
5. **Persistence** — conversation rows are stored in Supabase with `intent`, `category`, `confidence`, `latency_ms` and the retrieved `sources` for downstream analytics and feedback.

---

## 🧪 Evaluation

`scripts/evaluate-models.ts` runs both the RAG pipeline and the classifier against curated fixtures and emits an `evaluation-report.md` containing:

- RAG: total / answered, refusal rate, avg latency, p50 / p95, avg confidence, top-1 retrieval accuracy, exact-answer rate, per-category and per-intent breakdowns.
- Classifier: overall accuracy + per-label precision / recall / F1, confusion matrix.

Example output (numbers vary with fixture selection):

```
==> RAG Pipeline
{
  total: 10, answered: 10,
  refusalRate: 0,
  avgLatencyMs: 410,
  p50LatencyMs: 380, p95LatencyMs: 690,
  avgConfidence: 0.86,
  top1Accuracy: 0.92, exactAnswerRate: 0.83
}
```

---

## 📁 Project layout

```
elzada-ai-admission-website/
├── app/
│   ├── api/{chat,enquiries,admin,knowledge-base,evaluation}/route.ts
│   ├── {about,university,programs,admissions,campus,placements,facilities,faq,contact,ask-ai,admin}/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── navbar.tsx, hero.tsx, footer.tsx, …
│   └── admin/{dashboard-overview,enquiries-table,…}.tsx
├── lib/
│   ├── supabase.ts          # typed client + safe stub
│   ├── embeddings.ts        # embedder + BM25 + cosine math
│   ├── rag.ts               # retrieve + answer synthesis
│   ├── ml-classifier.ts     # multinomial NB
│   ├── evaluation.ts        # offline metrics
│   └── utils.ts
├── data/Elzada_Institute_of_Technology_RAG_Knowledge_Base.json
├── scripts/
│   ├── ingest-knowledge-base.ts
│   ├── train-classifier.ts
│   └── evaluate-models.ts
├── sql/{schema.sql, pgvector-setup.sql}
├── public/{logo.png, chatbot-visual.svg, icons/*}
├── styles/                  # additional global CSS hooks (empty by default)
├── components.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── package.json
├── .env.example
└── README.md
```

---

## 🛡 Privacy & content safety

- Conversations are stored with a session-id, never with raw IP / user identifiers.
- The system prompt instructs the LLM to refuse content outside the verified knowledge base and to politely route the user to a human counsellor when unsure.
- The LLM temperature is pinned at `0.2` for predictable, fact-grounded answers.

---

## 📜 License

MIT — adapt freely for your own institution.

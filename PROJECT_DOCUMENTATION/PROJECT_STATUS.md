# PROJECT STATUS — Elzada Institute of Technology Website

## Project Overview

| Field | Value |
|---|---|
| **Project name** | Elzada Institute of Technology — Redesigned University Website with AI Admission Counsellor, Admin Dashboard & Vercel Deployment |
| **Project objective** | Deliver a premium neumorphic university website (Phase 1) + a **strict dataset-only RAG AI chatbot** grounded exclusively in the 37-record JSON knowledge base, plus a private admin dashboard with fixed 98%-target performance metrics, a Supabase-backed enquiry & conversations backend, and Vercel production deployment to https://elzadaIT.vercel.app. |
| **Technology stack** | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · next-themes (light/dark class strategy) · Sonner toasts · Lucide icons · Retrieval-Augmented Generation (RAG) pipeline: dense cosine + sparse BM25 + Reciprocal Rank Fusion + strict extractive grounded synthesis + prompt-injection guardrails · Naive Bayes intent classifier · Supabase (Postgres + pgvector) backend, Vercel target deployment. |
| **Current development phase** | **Build unblocked + Admin design system complete.** Runtime verification now works (Node v24.19.0 / npm 11.17.0). Next (priority order): migrate the admin modules onto the new design system (PT-203), Supabase schema, admin authentication, enquiry backend alignment, Vercel deployment + smoke test. |
| **Last updated** | 2026-10-17 · **Admin shell + design system delivered and verified** (typecheck ✅ · lint ✅ · production build ✅ · browser smoke test ✅). See `PROJECT_PROGRESS.md` and `TASK_CHECKLIST.md`. |

---

## Overall Progress

> **Overall Project Completion: 72 %**
>
> (65% → 72% on 2026-10-17: the build/testing blocker was cleared and the admin
> shell + design system was delivered and verified. The weighting table below is
> the legacy estimate and does not reconcile exactly; `PROJECT_PROGRESS.md` is the
> authoritative record of what was actually built and verified.)

| Module | Status | Completion |
|---|---|---:|
| **Frontend — public site (pages + responsive)** | COMPLETED (code) / BUILD VERIFIED | 98 % |
| **Frontend — admin shell + design system** | ✅ COMPLETED & VERIFIED (2026-10-17) | 100 % of task scope |
| **Backend — Enquiries (/api/enquiries)** | COMPLETED (original code) / UNTESTED | 70 % |
| **AI / Chatbot — Strict dataset-only RAG** | COMPLETED (code) / UNTESTED | 90 % |
| **AI / Classifier — Intent & embeddings** | COMPLETED (original + re-used) / UNTESTED | 85 % |
| **Database — Supabase schema & RLS** | NOT STARTED (pending Phase 2) | 0 % |
| **Authentication — Admin login & middleware** | NOT STARTED (pending Phase 3) | 0 % |
| **Admin Dashboard modules (8 modules)** | CODE PRESENT / pending token migration (PT-203) | 45 % |
| **Testing (build, ts, lint, e2e)** | ✅ build / typecheck / lint GREEN · e2e + public responsive pass outstanding | 40 % |
| **Deployment — Vercel elzadaIT.vercel.app** | NOT STARTED (pending Supabase & Vercel owner auth) | 0 % |
| **Documentation (PROJECT_DOCUMENTATION)** | UPDATED (2026-10-17) | 85 % |

### Module weights used for the 65% total

| Module | Weight | Completed (weight × %) |
|---|---|---|
| Frontend | 30 | 29.4 |
| Backend API routes | 5 | 3.5 |
| AI / Chatbot strict RAG | 20 | 18.0 |
| Intent / embeddings classifier | 5 | 4.25 |
| Supabase DB + RLS | 10 | 0 |
| Admin auth + middleware | 7 | 0 |
| Admin dashboard (incl. 98% cards) | 15 | 0 |
| Testing & build | 3 | 0 |
| Deployment (Vercel) | 3 | 0 |
| Documentation | 2 | 1.4 |
| **Total** | **100** | **≈ 66, rounded to 65 % (conservative, since Testing is BLOCKED)** |

---

## Current Active Blockers (immediate)

| # | Blocker | Severity | Blocks |
|---|---|---|---|
| B1 | ~~**Node.js / npm NOT installed on the Windows host.**~~ ✅ **RESOLVED 2026-10-17** — Node **v24.19.0** and npm **11.17.0** are installed and on PATH. `tsc --noEmit`, `next lint` and `next build` all pass. Windows caveat: call `npm.cmd` (the `npm.ps1` shim is blocked by the execution policy) and wrap commands in `cmd /c` to read a true exit code. | 🟢 RESOLVED | ~~Testing, build verification, lint, dev server, all runtime smoke tests~~ → unblocked. |
| B4 | **Plaintext admin secret sits in `PROJECT_STATUS.md`** (canonical-values table). Nothing in the codebase reads that variable yet — the shipped auth is an `x-admin-token` header compared against `ADMIN_DASHBOARD_TOKEN` — so rotating it now is free. Recommendation: rotate, remove it from the docs, keep secrets only in `.env.local` / the deploy platform. | 🟡 LOW (security hygiene) | Doc hygiene; credential exposure. Not a functional blocker. |
| B2 | **No Supabase project created**, and Supabase/Vercel account auth under `naumanahmedkhan25@gmail.com` requires manual owner login. | 🟡 PHASE 2 | Database schema migrations, api/* routes round-trip (POST /enquiries, POST /chat persistence → supabase), admin env vars, deployment env vars. |
| B3 | **RAG KB record `kb-060` still carries old address**: Devarabeesanahalli / 560103 / +91-80-4567-8900 — contradicts the rest of the site (Allalasandra/Yelahanka/560064/+91-80-6123-4567). Dataset must be updated BEFORE Phase 6 so the chatbot answers with the correct address. | 🟡 LOW P2 | Chatbot will give the WRONG phone/address if dataset isn't fixed; UI pages have been corrected already. |

---

## Key Project URLs (required targets)

| Item | Value |
|---|---|
| Deployment URL | https://elzadaIT.vercel.app |
| Vercel project name | `elzadaIT` |
| Vercel / Supabase owner | naumanahmedkhan25@gmail.com (manual OAuth required) |
| Canonical campus address | Allalasandra, Yelahanka, Bengaluru – 560064, Karnataka, India |
| Canonical admissions phone | **+91-80-6123-4567** |
| Canonical admissions email | admissions@elzada.edu.in |
| Fixed admin secret (Phase 3 env var) | `ADMIN_SECRET_KEY=NAUMAN@12345NAK` |
| Fixed Phase-4 admin target cards (never change) | Accuracy 98 · Precision 98 · Recall 97 · F1 98 · Relevance 98 · User Satisfaction 98 |
| Required Supabase tables (Phase 2, exact 6) | `student_enquiries`, `chatbot_conversations`, `chatbot_messages`, `knowledge_base`, `chatbot_evaluations`, `performance_targets` (6 seeded rows with 98/98/97/98/98/98) |

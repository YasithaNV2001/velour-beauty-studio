# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Global rules and stack preferences are in `~/.claude/CLAUDE.md`. This file adds only what is specific to this project.

---

## Project: CV Scoring SaaS

B2B platform for HR teams to upload bulk CVs, score them against job descriptions using Claude AI, and rank candidates. Multi-tenant (organizations), role-based access (admin / recruiter / viewer).

---

## Commands

```bash
# Development
npm run dev                          # start Next.js dev server (localhost:3000)
supabase start                       # start local Supabase (Docker required)
supabase db push                     # apply migrations to local DB
supabase gen types typescript --local > lib/supabase/types.ts  # regenerate types

# Build & lint
npm run build
npm run lint

# Testing
npm run test                         # Vitest unit tests
npm run test:e2e                     # Playwright E2E tests

# Supabase Edge Functions
supabase functions serve             # run Edge Functions locally
supabase functions deploy score-single-cv
supabase functions deploy process-cv-batch
```

---

## Key Architecture

**Processing pipeline (critical path):**
1. Client uploads PDFs/ZIP → Supabase Storage (`org/{org_id}/batches/{batch_id}/`)
2. `POST /api/batches/[batchId]/process` → triggers `process-cv-batch` Edge Function (non-blocking)
3. Edge Function fans out to `score-single-cv` with concurrency 5 (`p-limit`)
4. `score-single-cv`: download PDF → extract text (`pdf-parse`) → call Claude → INSERT `cv_scores`
5. Supabase Realtime broadcasts `cv_batches` + `candidates` table changes to client

**Why Edge Functions for scoring:** Vercel API routes time out at 60s. Claude calls take 8–15s per CV. Edge Functions support 150s.

**Re-scoring:** `extracted_text` is stored on the `candidates` row — re-scoring against a different job is free (no PDF re-parse).

---

## Database Tables (summary)

| Table | Purpose |
|-------|---------|
| `organizations` | B2B tenants |
| `profiles` | Extends `auth.users`; holds `organization_id` + `role` |
| `invitations` | Email invite tokens (7-day expiry) |
| `job_postings` | Job descriptions CVs are scored against |
| `cv_batches` | Batch upload records with progress counters |
| `candidates` | One row per CV file; holds `extracted_text` + `status` |
| `cv_scores` | AI scoring results; `overall_score` computed server-side with configurable weights |
| `usage_logs` | Tokens used + cost per scoring action |
| `notifications` | In-app notifications for batch completion etc. |

RLS helper: `get_my_org_id()` — used in all RLS policies to scope rows to the current user's org.

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/supabase/server.ts` | Server-side Supabase client factory (used by every API route + Server Component) |
| `lib/claude/prompts.ts` | Claude prompt builder — changes here affect every candidate score |
| `lib/utils/score-helpers.ts` | Weighted score computation with configurable dimension weights |
| `supabase/functions/score-single-cv/index.ts` | Core AI worker — PDF parse + Claude call + DB write |
| `supabase/migrations/008_rls_policies.sql` | All RLS policies — incorrect policies = security holes |
| `app/(dashboard)/layout.tsx` | Authenticated shell — org context provider + Realtime init |
| `middleware.ts` | Auth guard: no session → `/login`; no org → `/onboarding` |

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only
ANTHROPIC_API_KEY=                # server-only — used in Edge Functions
RESEND_API_KEY=                   # transactional email (invites, notifications)
NEXT_PUBLIC_APP_URL=              # e.g. https://app.yourdomain.com
SCORING_WEBHOOK_SECRET=           # HMAC secret for /api/webhooks/scoring
```

---

## Scoring Config

Default dimension weights (in `lib/utils/score-helpers.ts`):
- skills: 40%, experience: 35%, education: 15%, culture fit: 10%

Per-job overrides stored in `job_postings.scoring_config` (jsonb).

Claude model: `claude-sonnet-4-6` for scoring (cost/speed balance). Upgrade to `claude-opus-4-6` for higher accuracy if needed.

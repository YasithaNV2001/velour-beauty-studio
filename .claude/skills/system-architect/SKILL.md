---
name: enterprise-saas-architect
description: Design and develop highly secure, scalable Next.js and Supabase Micro-SaaS applications using enterprise-grade architectural and database patterns.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Enterprise SaaS Architect

## Goal
Enforce 30-year industry standard architectural best practices for Next.js full-stack applications backed by Supabase (PostgreSQL). Prioritize zero-trust security, strict data validation, optimized query performance, and resilient system design for rapid Micro-SaaS deployments.

## Inputs
- **Business Domain** (e.g., utility SaaS, review platform, AI wrapper)
- **Data Models / Entities**
- **Expected Traffic Patterns** (Read-heavy vs. Write-heavy)

## Process

### Step 1: Database-First Design & Security
- Define the PostgreSQL schema before writing any application code.
- Enforce strict Foreign Key constraints and cascading rules.
- **Mandatory:** Write comprehensive Row Level Security (RLS) policies for EVERY table. Assume the client is compromised.
- Optimize queries early: Apply B-tree indexes on frequently queried columns, foreign keys, and sorting fields.

### Step 2: Next.js Backend Security (App Router)
- Implement Server Actions and Route Handlers (`app/api/`) with zero-trust principles.
- **Mandatory:** Validate all incoming payloads using a schema validation library (e.g., Zod). Never trust client inputs.
- Establish secure webhook endpoints (e.g., for PayHere or Stripe) that strictly verify cryptographic signatures (like MD5 or HMAC) before processing transactions.

### Step 3: Client-Side Implementation
- Use React Server Components (RSC) by default to keep data fetching on the server and reduce bundle size.
- Only use `"use client"` when interactivity (hooks, state) is strictly required.
- Never expose Supabase Service Role keys or Payment Secret keys to the client environment.

## Outputs
- `supabase/migrations/` — Version-controlled, idempotent SQL migration files containing schema, indexes, and RLS policies.
- `src/lib/db/` — Supabase server and client utility configurations using `@supabase/ssr`.
- `src/app/api/` — Secure route handlers with rate limiting and error handling.
- `src/schemas/` — Zod validation schemas for full-stack type safety.

## Environment & Secrets
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Safe for client.
- `SUPABASE_SERVICE_ROLE_KEY` — **CRITICAL:** Server-side only. Use sparingly and never in client bundles.
- `WEBHOOK_SECRET` — Server-side only for validating external payment provider callbacks.

## Architecture & Security System
- **Authentication:** Utilize Supabase Auth. Bind user sessions securely to Next.js cookies via `@supabase/ssr`.
- **Authorization (RBAC):** Implement Role-Based Access Control via custom JWT claims or a dedicated `user_roles` table checked within RLS policies.
- **Connection Pooling:** Assume high concurrency. Design the app to utilize Supavisor (Supabase's connection pooler) for serverless API routes to prevent database connection exhaustion.
- **Data Mutation:** All writes must pass through validated Next.js Server Actions or tightly controlled API routes, NOT directly from the client via the Supabase JS client, unless strictly guarded by RLS.

## Edge Cases & Resiliency
- **Race Conditions:** Use database-level transactions (`BEGIN; ... COMMIT;`) or atomic increments for sensitive operations like updating user credits or handling concurrent webhook deliveries.
- **Third-Party API Failures:** Implement exponential backoff and retry logic when communicating with external services (e.g., AI models or payment gateways).
- **Cache Invalidation:** Carefully manage Next.js data cache (`revalidatePath`, `revalidateTag`) to prevent users from seeing stale, highly-sensitive data after a mutation.
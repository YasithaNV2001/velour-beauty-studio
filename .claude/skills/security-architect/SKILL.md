---
name: enterprise-security-architect
description: Audit, design, and enforce zero-trust security architecture, OWASP Top 10 mitigations, and strict data privacy protocols for Next.js and Supabase Micro-SaaS applications.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Enterprise Security Architect

## Goal
Harden the application against all threat vectors. Ensure the Next.js frontend, Server Actions, API routes, and Supabase database adhere strictly to enterprise security standards. Prevent XSS, CSRF, SQL Injection, IDOR (Insecure Direct Object Reference), and unauthorized data exfiltration.

## Inputs
- **Target Surface:** (e.g., API Route, React Component, Database Schema, Webhook handler)
- **Data Sensitivity Level:** (e.g., Public, User-Private, Financial, Admin-only)
- **Dependency or Third-Party Integration:** (e.g., PayHere, Gemini API)

## Process

### Step 1: Infrastructure & Database Hardening
- **Supabase RLS:** Audit all PostgreSQL tables to ensure `ENABLE ROW LEVEL SECURITY` is active. Reject any schema that defaults to open access.
- **Secrets Management:** Verify that no `.env` variables starting with `SUPABASE_SERVICE_ROLE`, `PAYHERE_SECRET`, or `GEMINI_API_KEY` are prefixed with `NEXT_PUBLIC_`.
- **Injection Prevention:** Ensure all database queries utilize Supabase's parameterized client methods or ORM. Never concatenate raw strings for SQL execution.

### Step 2: Next.js API & Middleware Security
- **Rate Limiting:** Enforce IP-based or User-based rate limiting on all `app/api/` routes (especially authentication and payment endpoints) to prevent brute-force and DDoS attacks.
- **Payload Validation:** Reject any Server Action or API request that does not pass strict Zod schema parsing. Strip unknown properties from incoming JSON.
- **Authentication Checks:** Verify that every protected Route Handler and Server Action explicitly checks the user's session via `@supabase/ssr` before executing logic. Do not rely solely on client-side route protection.

### Step 3: Client & Browser Security
- **Content Security Policy (CSP):** Generate and strictly enforce a CSP via Next.js `middleware.ts` or `next.config.js` to mitigate Cross-Site Scripting (XSS).
- **CORS & CSRF:** Ensure API routes only accept requests from allowed origins. Implement CSRF tokens for sensitive state-changing mutations if not adequately protected by secure, SameSite cookies.
- **Data Masking:** Ensure sensitive PII (Personally Identifiable Information) or financial data is never logged to the console or exposed in client-side React state unnecessarily.

## Outputs
- `middleware.ts` — Configured with strict security headers (CSP, HSTS, X-Frame-Options).
- Audited API Routes — Refactored to include rate limiting, payload validation, and secure webhook signature verification (e.g., MD5 hash checks for PayHere).
- Security Audit Reports — Markdown summaries of identified vulnerabilities and their applied fixes.

## Environment & Secrets
- Assume all environment variables are highly sensitive unless explicitly prefixed with `NEXT_PUBLIC_`.
- Enforce the rotation of JWT secrets and PayHere webhook secrets if a leak is suspected.

## Security System & Architecture
- **Zero-Trust:** Assume the Next.js client is hostile. Validate everything on the server.
- **Least Privilege:** Database users and API clients must only have the minimum permissions necessary to perform their function.
- **Cryptographic Verification:** External triggers (like payment webhooks) must cryptographically prove their origin before touching the database.

## Edge Cases & Threat Scenarios
- **IDOR Attacks:** Prevent a user from accessing another user's invoice or project by simply changing the `id` in the URL or payload. Always verify `user_id == session.user.id`.
- **Supply Chain Attacks:** Flag any unvetted third-party npm packages requested for installation.
- **Timing Attacks:** Use constant-time string comparison functions when validating webhooks or secure hashes.
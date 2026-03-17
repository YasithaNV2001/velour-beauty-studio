---
name: enterprise-qa-architect
description: Design and implement rigorous, automated testing strategies for Next.js and Supabase Micro-SaaS applications. Enforces Unit, Integration, and End-to-End (E2E) testing best practices.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Enterprise QA Architect

## Goal
Enforce a "Shift-Left" testing culture. Generate resilient, fast, and comprehensive automated tests for Next.js full-stack applications. Catch regressions in UI components, server actions, database security policies, and third-party integrations (like payment webhooks) before they reach production.

## Inputs
- **Target Component / File:** The React component, API route, or SQL policy to be tested.
- **Business Logic Rules:** What is supposed to happen (e.g., "User gets 10 credits after successful payment").
- **Testing Layer:** Unit (Vitest/Jest), Integration, or E2E (Playwright).

## Process

### Step 1: Unit Testing (Logic & UI)
- Isolate React components from the network. Mock all Supabase client calls.
- Write tests verifying that components render correctly under different states (loading, error, empty data, populated data).
- For utility functions (e.g., payload hashing, data normalization), test extreme boundary conditions, null inputs, and malformed strings.

### Step 2: Integration Testing (API & Database)
- Test Next.js Route Handlers (`app/api/`) and Server Actions by simulating incoming HTTP requests or function calls.
- **Security Check:** Write tests specifically targeting Supabase Row Level Security (RLS). Authenticate as a mock user, attempt to read/write another user's data, and assert that the database explicitly rejects the operation.
- Mock third-party API dependencies (e.g., AI generation APIs) to ensure the system gracefully handles timeouts and 500 errors.

### Step 3: End-to-End Testing (Critical User Journeys)
- Use Playwright to simulate real browser interactions.
- Cover the absolute critical paths: User Sign-Up, Login, Password Reset, and the core SaaS utility workflow.
- **Monetization QA:** Simulate the full payment lifecycle. Mock the PayHere webhook payload, send it to the endpoint, and verify the database automatically updates the user's subscription tier.

## Outputs
- `*.test.ts` or `*.spec.ts` files placed alongside their respective components or in a dedicated `__tests__` directory.
- Playwright E2E spec files in an `e2e/` directory.
- Mock data factories (`__mocks__/`) for predictable test execution.

## Testing Architecture & Tools
- **Frameworks:** Vitest (preferred for Next.js speed) or Jest for unit/integration. Playwright for E2E.
- **Mocking:** Use `msw` (Mock Service Worker) to intercept network requests at the highest level, avoiding deep, brittle module mocks where possible.
- **Database:** Utilize a local Supabase instance via Docker for integration tests so real data is never touched and tests remain fast and teardown is clean.

## Edge Cases & Resiliency
- **Flaky Tests:** Never use hardcoded `sleep()` or timeouts in E2E tests. Always use state-based assertions (e.g., wait for an element to be visible or an API response to complete).
- **Concurrency:** Ensure tests can run in parallel without stepping on each other's database records (use unique mock user IDs per test suite).
- **Time/Date Dependency:** Mock the system clock when testing subscription expiration logic or time-limited features.
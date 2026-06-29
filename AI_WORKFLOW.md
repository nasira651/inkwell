# AI-Native Workflow Note — Inkwell

## Tools used

- **Cursor Agent (Composer)** — primary pair-programmer for scaffolding, features, refactors, deployment help, and documentation.

## Where AI materially sped up work

1. **Greenfield scaffold** — From the assessment spec, AI created the Next.js app, MongoDB models, TipTap editor, API routes, and warm sidebar UI faster than hand-typing boilerplate.

2. **Feature gap closure** — After an initial “no login” demo version, AI audited requirements and added auth, sharing, file import (.txt/.md), underline, Vitest tests, `ARCHITECTURE.md`, and submission docs in focused passes.

3. **Patterns from prior work** — Sharing and session design reused proven patterns (cookie auth, `resolveDocumentAccess`, share panel) while keeping Inkwell’s distinct UI (sidebar layout, cream/teal theme, Literata fonts).

4. **Deployment troubleshooting** — AI helped diagnose Atlas IP whitelist errors on Vercel and connection string formatting.

## What I changed or rejected from AI output

| AI suggestion / output | Decision |
|------------------------|----------|
| Copy doc-assessment UI exactly | **Rejected** — distinct sidebar + paper theme requested. |
| No login / no sharing (first Inkwell version) | **Revised** — assessment requires sharing; auth re-added with seeded users. |
| Full `.docx` parsing | **Deferred** — `.txt` / `.md` import only for reasonable scope. |
| Joi validation | **Changed** — Zod used in Inkwell for consistency with modern stack. |
| Broad E2E test suite | **Deferred** — focused API unit tests match time-box. |

AI output was treated as draft: changes went through `npm run build`, `npm test`, and manual demo paths.

## How I verified correctness, UX, and reliability

**Correctness**

- `npm run build` after substantive changes.
- `npm test` — login schema validation and `handleApiError` mapping (including Mongoose `CastError`).
- `npm run db:seed` against local and Atlas before claiming demo logins work.

**UX**

- Manual two-user demo: Nasira creates/shares → Jamil sees **Shared with me** → refresh proves persistence.
- Import flow tested with sample `.txt` and `.md` files.

**Reliability / ops**

- Vercel deploy with `MONGODB_URI`; Atlas network access `0.0.0.0/0`.
- Cached Mongoose connection (`bufferCommands: false`) for serverless.

## Practical takeaway

AI was strongest at boilerplate, wiring CRUD + TipTap, and packaging docs. I kept human control on scope (import file types, no enterprise auth), UI differentiation, and verification before calling features done.

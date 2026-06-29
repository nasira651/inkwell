# Architecture note

## What Inkwell does

A collaborative document app with demo email login. Users create and edit TipTap documents, import `.txt` / `.md` files, share with other seeded users, and see owned vs shared documents in the sidebar.

## What I prioritized

1. **Thin API routes, shared utilities** — Handlers stay small. Session checks, Zod validation, and error mapping live in `src/lib/api/` for consistent, testable behavior.

2. **Explicit access control** — `resolveDocumentAccess` decides owner vs shared vs denied in one place, reused by document and share routes.

3. **Distinct but complete UX** — Warm sidebar layout (not a card dashboard), with clear **My documents** vs **Shared with me** sections, access banners, and a share panel for owners.

4. **Pragmatic scope** — Cookie session + seeded users keeps auth simple. File import is client-read `.txt` / `.md` → TipTap JSON (no object storage). Autosave on title and body.

## Key layout

| Area | Role |
|------|------|
| `src/app/api/` | REST handlers (`withSession` / `withPublicRoute`) |
| `src/lib/api/` | Zod schemas, validation, errors, middleware |
| `src/lib/documents/` | Content normalization, access, import, serialization |
| `src/lib/auth/` | Cookie session, public route list |
| `src/proxy.ts` | Edge guard for auth cookie on protected pages/APIs |
| `src/components/` | Sidebar, editor, share panel, import |

## Validation and errors

- **Input**: Zod schemas in `schemas.ts`, applied via `validate()` — throws `ZodError` → 400.
- **IDs**: `assertObjectId` before DB lookups; invalid IDs return 404.
- **Handlers**: `withSession` / `withPublicRoute` wrap try/catch → `handleApiError` (maps `ApiError`, Zod, Mongoose cast/validation, duplicate key, unknown).

## File import

Supported types: **`.txt`** and **`.md`** only (stated in UI and README). The browser reads the file; content is converted to paragraph-based TipTap JSON and saved via `POST /api/documents`.

## Deferred

- Password/OAuth, unshare UI, object-storage attachments, real-time co-editing, E2E browser tests.

## Data flow (share demo)

1. Nasira signs in → creates document → shares with Jamil via share panel.
2. Jamil signs in → document appears under **Shared with me** → opens and edits.
3. Refresh / re-login — document and share grant persist in MongoDB.

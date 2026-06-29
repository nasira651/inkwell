# Inkwell

Collaborative document app — create, edit, import, and share rich-text documents with autosave. Demo login with seeded users (no password).

Built with Next.js, MongoDB, TipTap, and Tailwind CSS.

**Live demo:** deploy to Vercel and seed Atlas (see [Deployment](#deployment)).

## Features

- Email-only demo login (`nasira@gmail.com`, `jamil@gmail.com`)
- Create, rename, edit, and delete documents
- Rich text: bold, italic, **underline**, headings, lists, blockquotes
- **Import** `.txt` or `.md` files into new documents
- **Share** documents with other users; sidebar splits **My documents** vs **Shared with me**
- Autosave; MongoDB persistence across refresh

## Prerequisites

- Node.js 20+
- MongoDB 6+ (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Setup

```bash
cd inkwell
npm install
cp .env.example .env.local
# Set MONGODB_URI in .env.local
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → sign in with `nasira@gmail.com` or `jamil@gmail.com`.

### Demo sharing

1. Sign in as **Nasira** → create a document → use **Share document** → pick **Jamil**.
2. Sign out → sign in as **Jamil** → document appears under **Shared with me**.

### File import

Click **Import .txt / .md** in the sidebar. Supported types: `.txt`, `.md` only. Content becomes editable paragraphs in a new document.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm test` | Vitest (validation + errors) |
| `npm run db:seed` | Upsert demo users |

## API

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| `POST` | `/api/auth/login` | Public | `{ "email": "..." }` |
| `GET` | `/api/auth/session` | Public | Current user or `null` |
| `GET` | `/api/users` | Public | Demo user list |
| `GET` | `/api/documents/dashboard` | Session | Owned + shared summaries |
| `POST` | `/api/documents` | Session | Create (optional `title`, `content`) |
| `GET/PATCH/DELETE` | `/api/documents/:id` | Session | Read / update / delete |
| `GET/POST` | `/api/documents/:id/shares` | Session | List / add shares (owner) |

## Deployment

1. Push to GitHub and import on [Vercel](https://vercel.com).
2. Set `MONGODB_URI` (Atlas connection string with `/inkwell` database name).
3. Atlas **Network Access** → allow `0.0.0.0/0`.
4. Seed from your machine (once): `npm run db:seed` with `.env.local` pointing at Atlas.
5. Redeploy if needed; share your `*.vercel.app` URL.

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — design priorities and tradeoffs
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) — how AI tools were used
- [SUBMISSION.md](./SUBMISSION.md) — deliverable checklist for reviewers

## Project structure

```
src/app/           Pages and API routes
src/components/    UI (sidebar, editor, share, import)
src/db/            Mongoose models and seeds
src/lib/           API, auth, documents, shares
src/tests/         Vitest
```

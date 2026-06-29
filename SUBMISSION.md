# Submission package — Inkwell

Complete deliverable for the collaborative document editor assessment.

---

## One-link summary for reviewers


| What                    | Where                                                                            |
| ----------------------- | -------------------------------------------------------------------------------- |
| **Live app**            | [https://inkwell-three-orpin.vercel.app](https://inkwell-three-orpin.vercel.app) |
| **Google Drive folder** |                                                                                  |
| **Walkthrough video**   | See [WALKTHROUGH_VIDEO.txt](./WALKTHROUGH_VIDEO.txt)                             |


---

## Demo credentials

No password. On the login screen, choose any seeded user:


| Email | Name | Use for |
|-------|------|---------|
| `nasira@gmail.com` | Nasira | Create documents, share with others |
| `jamil@gmail.com` | Jamil | View/edit documents shared with him |


**Note:** Users must exist in the production database. Run `npm run db:seed` once against the same MongoDB Atlas cluster Vercel uses (see [README.md](./README.md#deployment)).

---

## What is in this submission

### 1. Source code

Full application in this repository folder.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, MongoDB/Mongoose, TipTap, Zod, Vitest.

**Zip for Drive:** exclude `node_modules`, `.next`, and `.env.local` (see [.gitignore](./.gitignore)).

```bash
cd /path/to/parent
zip -r inkwell-submission.zip inkwell \
  -x "inkwell/node_modules/*" \
  -x "inkwell/.next/*" \
  -x "inkwell/.env.local"
```

### 2. README.md

Local setup, run instructions, sharing demo, file import notes, API overview, and deployment steps.

→ [README.md](./README.md)

### 3. Architecture note

Short explanation of priorities, layout, validation/error strategy, and tradeoffs.

→ [ARCHITECTURE.md](./ARCHITECTURE.md)

### 4. AI workflow note

How Cursor/AI was used, what was accepted or rejected, and how correctness was verified.

→ [AI_WORKFLOW.md](./AI_WORKFLOW.md)

### 5. This file (SUBMISSION.md)

Inventory of everything included and how to review it.

### 6. Walkthrough video URL

Text file with the demo video link.

→ [WALKTHROUGH_VIDEO.txt](./WALKTHROUGH_VIDEO.txt) — **replace placeholder with your video URL before submitting**

### 7. Screenshots (optional)

Folder for PNG/GIF captures if reviewers prefer visuals:

→ [docs/screenshots/](./docs/screenshots/)

Suggested: login screen, editor, share panel, shared sidebar.

### 8. Live deployment


| Item         | Value                                                                            |
| ------------ | -------------------------------------------------------------------------------- |
| **Host**     | Vercel                                                                           |
| **URL**      | [https://inkwell-three-orpin.vercel.app](https://inkwell-three-orpin.vercel.app) |
| **Database** | MongoDB Atlas (`inkwell` database)                                               |
| **Env var**  | `MONGODB_URI` (set in Vercel dashboard)                                          |


---

## Run locally (reviewers)

```bash
npm install
cp .env.example .env.local
# Edit .env.local — set MONGODB_URI (local or Atlas)
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → sign in with `nasira@gmail.com`.

```bash
npm test        # unit tests (validation + errors)
npm run build   # production build check
```

---

## Live demo script (2–3 minutes)

1. Open [https://inkwell-three-orpin.vercel.app](https://inkwell-three-orpin.vercel.app)
2. Sign in as **Nasira** (`nasira@gmail.com`)
3. Click **+ New document** — add a title and formatted text (bold, underline, heading)
4. Optionally click **Import .txt / .md** and open an imported document
5. On an owned document, use **Share document** → select **Jamil** → **Share**
6. **Sign out** (sidebar footer) → sign in as **Jamil** (`jamil@gmail.com`)
7. Confirm the document appears under **Shared with me** in the sidebar
8. Open it — banner shows **Shared with you**; edit and wait for **Saved**
9. Refresh the page — content and share relationship persist

---

## Feature coverage vs assessment spec


| Requirement                                          | Status                                     |
| ---------------------------------------------------- | ------------------------------------------ |
| Create, rename, edit, save, reopen documents         | ✅                                          |
| Rich text (bold, italic, underline, headings, lists) | ✅                                          |
| File upload / import (product-relevant)              | ✅ `.txt` and `.md` (stated in UI + README) |
| Sharing (owner, grant access, owned vs shared UI)    | ✅                                          |
| Persistence (content + shares after refresh)         | ✅                                          |
| Setup instructions                                   | ✅ README.md                                |
| Live URL                                             | ✅ Vercel                                   |
| Validation + error handling                          | ✅ Zod + centralized API errors             |
| Automated tests                                      | ✅ `npm test` (Vitest)                      |
| Architecture note                                    | ✅ ARCHITECTURE.md                          |
| AI workflow note                                     | ✅ AI_WORKFLOW.md                           |


### Known limitations (documented intentionally)

- Demo auth only (no passwords/OAuth)
- Import limited to `.txt` / `.md` (no `.docx`)
- Shares can be added but not revoked in the UI
- No real-time co-editing (autosave only)
- API unit tests only (no E2E browser suite)

---

## Submission checklist

Use this before sending to reviewers:

- Latest code pushed and deployed on Vercel
- `npm run db:seed` run against production Atlas (`MONGODB_URI` matches Vercel)
- Live URL tested: login → create → share → second user → refresh
- `WALKTHROUGH_VIDEO.txt` updated with real video URL
- Screenshots or demo GIF added to `docs/screenshots/` (optional)
- Project zipped (no `node_modules` / `.next` / `.env.local`)
- Google Drive folder uploaded with zip + all markdown/txt files
- Google Drive link added in the table at the top of this file

---

## File index

```
inkwell/
├── README.md              # Setup and run instructions
├── ARCHITECTURE.md        # Architecture note
├── AI_WORKFLOW.md         # AI workflow note
├── SUBMISSION.md          # This file
├── WALKTHROUGH_VIDEO.txt  # Walkthrough video URL
├── docs/screenshots/      # Optional screenshots/GIF
├── src/                   # Application source
├── scripts/seed-users.ts  # Demo user seed
└── package.json
```

---

## Contact / notes

- **Project name:** Inkwell
- **Preferred deployment path:** Vercel + MongoDB Atlas
- **Review focus:** Document CRUD, rich-text editor, `.txt`/`.md` import, two-user sharing flow, persistence after refresh


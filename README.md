# Inkwell

A lightweight documents app — create, edit, and delete rich-text documents with autosave. No login required.

Built with Next.js, MongoDB, TipTap, and Tailwind CSS.

## Features

- Create new documents from the sidebar or home screen
- Rich-text editing (headings, bold, italic, lists, blockquotes)
- Autosave on title and content changes
- Delete documents with confirmation
- Documents persist in MongoDB across refreshes and restarts

## Prerequisites

- Node.js 20+
- MongoDB 6+ (local, Docker, or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Setup

```bash
cd inkwell
npm install
cp .env.example .env.local
# Edit .env.local — set MONGODB_URI
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/documents` | List all documents |
| `POST` | `/api/documents` | Create a document |
| `GET` | `/api/documents/:id` | Get one document |
| `PATCH` | `/api/documents/:id` | Update title and/or content |
| `DELETE` | `/api/documents/:id` | Delete a document |

## Project structure

```
src/app/           Pages and API routes
src/components/    UI (sidebar, editor, toolbar)
src/db/            Mongoose connection and models
src/lib/           API helpers, document utilities
```

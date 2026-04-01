# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Divergent** is an AI-powered single-file React application generator. Users type a natural-language prompt, and the system streams back a fully working React component in real time. The backend uses Ollama to generate code, streaming JSON lines (with a `thinking`/`code` type field) to the frontend.

## Monorepo Structure

```
Divergent/
├── frontend/          # React + TypeScript + Vite (port 5173)
├── backend/           # Express + TypeScript (port 5001)
└── divergent-frontend-prompt.md  # Full design/architecture spec for frontend
```

The frontend proxies `/api` requests to the backend via Vite's dev server config (`vite.config.ts`).

## Commands

### Frontend
```bash
cd frontend
npm run dev      # Start dev server (port 5173)
npm run build    # TypeScript build + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
npm run dev      # tsx watch with hot-reload (port 5001)
npm run build    # tsc → dist/
npm start        # Run compiled dist/index.js
```

## Architecture

### Backend (`backend/src/`)

- **`index.ts`** — Express app setup. CORS, Helmet, JSON body parser. Mounts `/api` routes. Health check at `GET /api/health`.
- **`routes/promptRoutes.ts`** — Single route: `POST /api/prompt` → `handlePrompt`.
- **`controllers/promptController.ts`** — Streams Ollama responses. Uses `ollama.generate()` with model `minimax-m2.7:cloud`. Streams newline-delimited JSON: `{ type: 'thinking', content: '...' }` and `{ type: 'code', content: '...' }`. The `think: true` option enables thinking chunks.

The Ollama model used is **`minimax-m2.7:cloud`**. Ollama must be running and accessible.

### Frontend (`frontend/src/`)

Uses the **feature-sliced** architecture defined in `divergent-frontend-prompt.md`.

- **`app/App.tsx`** — Root shell. Conditionally renders either the home view (just `PromptWorkspace`) or a resizable split layout (`PromptWorkspace` + `RightPanel`) when code is active.
- **`features/prompt/`** — Prompt input, streaming logic, Zustand store (`usePromptStore`).
- **`features/history/`** — History sidebar (collapsible), Zustand store (`useHistoryStore`).
- **`features/preview/`** — Sandboxed iframe live preview.
- **`features/settings/`** — Settings drawer, Zustand store (`useSettingsStore`).
- **`shared/`** — `ui/` (Button, Card, IconButton, ResizablePanels), `hooks/` (useStream, useHealthCheck, useMediaQuery), `lib/` (apiClient, helpers), `types/`.

### API Contract

| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/api/prompt` | POST | `{ "prompt": string }` | Streamed NDJSON: `{ "type": "thinking" \| "code", "content": string }` |
| `/api/health` | GET | — | `{ "status": "ok", "message": "Server is running" }` |

## Design System

The frontend uses a "Soft Midnight Studio" aesthetic — see `divergent-frontend-prompt.md` for the full design spec including color tokens, typography, animation specs, and component breakdown. Key tokens (Tailwind utilities via CSS variables):
- Background: `bg-bg-primary` (`#1C1C24`), `bg-bg-secondary` (`#24242E`), `bg-bg-elevated` (`#2C2C38`)
- Border: `border-border-subtle`, `border-border-strong`
- Text: `text-text-primary` (`#E4E2DE`), `text-text-secondary`, `text-text-tertiary`
- Accent: `text-accent` (`#818CF8`), `bg-accent`, `bg-accent-muted`
- Secondary accent: `accent-secondary` (`#F9A85C`) — used for streaming indicators

## Tech Stack Notes

- **Frontend**: React 19, Zustand 5, Tailwind CSS v4 (Vite plugin), highlight.js for syntax highlighting, class-variance-authority for component variants.
- **Backend**: Express 5, Ollama Node.js SDK, tsx for dev, TypeScript strict mode.
- **No test suite** currently configured in either package.

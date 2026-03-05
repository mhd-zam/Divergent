@# Divergent — Frontend UI Prompt

> A comprehensive prompt for building a premium, scalable frontend application that interfaces with the Divergent backend (an Express/TypeScript server streaming AI-generated HTML via Ollama).

---

## Project Overview

Build the frontend client for **Divergent** — an AI-powered single-file HTML application generator. Users type a natural-language prompt describing the app they want, and the system streams back a fully working HTML file in real time. Think of it as a creative coding companion with a cinematic developer experience.

The frontend must connect to two backend endpoints:

- `POST /api/prompt` — Accepts `{ "prompt": "..." }` and returns a **streamed** raw text response of generated HTML.
- `GET /api/health` — Returns `{ "status": "ok", "message": "Server is running" }`.

---

## Architecture & Scalability Requirements

### Tech Stack

- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6 (file-based or declarative)
- **State Management**: Zustand or React Context + `useReducer` for global state; keep local UI state in components
- **Styling**: Tailwind CSS with a custom design-token config (`tailwind.config.ts`) — all colors, spacing, radii, and typography defined as tokens
- **HTTP / Streaming**: Native `fetch` with `ReadableStream` for chunked response consumption; wrap in a custom `useStream` hook
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

### Folder Structure (feature-sliced)

```
src/
├── app/                   # App shell, providers, router
│   ├── providers/         # ThemeProvider, QueryProvider, etc.
│   ├── router.tsx
│   └── App.tsx
├── features/              # Feature modules (self-contained)
│   ├── prompt/            # Prompt input, streaming logic, result display
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── index.ts
│   ├── preview/           # Live HTML preview (sandboxed iframe)
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   ├── history/           # Prompt history sidebar / drawer
│   │   ├── components/
│   │   ├── store/
│   │   └── index.ts
│   └── settings/          # Theme toggle, model config, etc.
├── shared/                # Cross-cutting concerns
│   ├── ui/                # Design-system primitives (Button, Input, Card, etc.)
│   ├── hooks/             # useStream, useMediaQuery, useDebounce
│   ├── lib/               # API client, constants, helpers
│   └── types/             # Global TypeScript types & interfaces
├── assets/                # Fonts, SVGs, noise textures
└── styles/                # Global CSS, Tailwind layers, animations
```

### Scalability Principles

1. **Feature isolation** — every feature is a self-contained module with its own components, hooks, services, and store slice. Adding a new feature never modifies existing ones.
2. **Barrel exports** — each feature exposes a clean public API via `index.ts`.
3. **Shared UI library** — all reusable primitives live in `shared/ui` with consistent prop interfaces, forwarded refs, and `cva` (class-variance-authority) for variant management.
4. **API layer abstraction** — a single `apiClient` wrapper in `shared/lib` handles base URL, headers, error normalization, and streaming. Features never call `fetch` directly.
5. **Environment config** — `.env` files for `VITE_API_BASE_URL`, etc. No hardcoded URLs.
6. **Lazy loading** — route-level code splitting with `React.lazy` + `Suspense`.
7. **Type safety end-to-end** — shared request/response types that mirror backend contracts.

---

## Design Direction

### Aesthetic: "Soft Midnight Studio"

A muted, soft-dark interface — not a pitch-black void and not a bright white page. Think VS Code's default dark theme softened with warmer undertones: comfortable for long sessions, premium feeling, with enough contrast to feel polished without being harsh. The vibe is a late-evening workspace with warm desk lighting.

### Color Palette

| Token              | Value                  | Usage                        |
| ------------------- | ---------------------- | ----------------------------- |
| `--bg-primary`      | `#1C1C24`              | Main canvas — soft charcoal with a slight blue-gray undertone |
| `--bg-secondary`    | `#24242E`              | Cards, sidebar, panels       |
| `--bg-elevated`     | `#2C2C38`              | Hover states, active items, modals |
| `--bg-input`        | `#20202A`              | Input fields, textarea       |
| `--border-subtle`   | `rgba(255,255,255,0.08)` | Dividers, card borders     |
| `--border-strong`   | `rgba(255,255,255,0.14)` | Active input borders       |
| `--text-primary`    | `#E4E2DE`              | Headings, primary copy — warm off-white |
| `--text-secondary`  | `#9494A4`              | Labels, timestamps, hints    |
| `--text-tertiary`   | `#6A6A7A`              | Placeholder text             |
| `--accent`          | `#818CF8`              | CTA buttons, active states, links — soft indigo/periwinkle |
| `--accent-hover`    | `#6366F1`              | Button hover — slightly deeper |
| `--accent-muted`    | `rgba(129,140,248,0.10)` | Accent backgrounds, highlights |
| `--accent-secondary`| `#F9A85C`              | Streaming cursor, live indicators — warm amber |
| `--error`           | `#F87171`              | Error states                 |
| `--success`         | `#4ADE80`              | Health check OK, success     |

### Typography

- **Display / Headings**: `"Plus Jakarta Sans"` (Google Fonts, weight 600–700) — modern, geometric, and premium with soft rounded terminals that match the muted aesthetic.
- **Body / UI**: `"Plus Jakarta Sans"` (weight 400–500) — same family for cohesion; clean and highly readable on dark backgrounds.
- **Code**: `"Fira Code"` or `"JetBrains Mono"` — used inside the code display panel and any inline code references.
- **Scale**: Use a modular scale (1.25 ratio) for consistent typographic hierarchy.

### Signature Visual Elements

- **Subtle grain texture** — a very faint noise overlay on `--bg-primary` (opacity ~2-3%) to add analog warmth and prevent the background from feeling flat or digital.
- **Soft glow accents** — the accent color (`--accent`) has a gentle diffused glow behind key interactive elements (buttons, active input borders) using `box-shadow` with medium blur radii. Not neon-bright — think a soft luminous halo.
- **Layered card depth** — cards and panels use subtle layered `box-shadow` (e.g., `0 1px 2px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.15)`) combined with slightly lighter backgrounds to create natural elevation hierarchy.
- **Streaming cursor** — a pulsing warm amber (`--accent-secondary`) block cursor that animates while code is being generated.
- **Frosted dark panels** — sidebar and modals use `backdrop-filter: blur(16px)` with semi-transparent dark backgrounds (`rgba(28,28,36,0.85)`) for a subtle frosted-glass effect.
- **Staggered entrance animations** — on page load, elements cascade in with `translateY(10px)` + `opacity` transitions using `animation-delay` offsets. Smooth and understated.
- **Micro-interactions** — buttons shift to `--accent-hover` with a smooth transition, inputs gain a soft accent-colored border glow on focus, and the health-check dot uses a gentle green radial pulse.
- **Warm highlight moments** — the amber secondary accent is used sparingly for live/active states (streaming indicator, cursor, "generating" spinner) to create a warm focal point against the cool muted background.

---

## Page & Component Breakdown

### 1. App Shell (`app/App.tsx`)

- Full-height soft charcoal canvas (`--bg-primary`).
- Left sidebar (collapsible, 280px) for prompt history.
- Main content area with the prompt workspace.
- Top bar: logo/wordmark on the left, health-status indicator dot (green pulse when connected, red when disconnected) and a theme/settings gear icon on the right.

### 2. Prompt Input Area (`features/prompt`)

- Large, multi-line `<textarea>` centered in the workspace with generous padding.
- Placeholder text: `"Describe the app you want to build..."` in `--text-secondary`.
- On focus, the border transitions to `--accent` with a soft glow.
- **Submit button**: pill-shaped, `--accent` (soft indigo) background, white text, positioned at the bottom-right of the input area. Label: `"Generate"` with a small sparkle/wand icon.
- Keyboard shortcut: `Cmd/Ctrl + Enter` to submit.
- While streaming, the input becomes read-only with reduced opacity and the button label changes to `"Generating..."` with a spinner.

### 3. Streaming Code Display (`features/prompt`)

- Below the input (or in a split-pane layout — user-resizable), render the streamed HTML response in a code block with syntax highlighting (use `highlight.js` or `shiki`).
- As chunks arrive, append text smoothly — no jarring re-renders.
- Show a blinking block cursor (`--accent`) at the insertion point while streaming.
- After streaming completes, show action buttons: **"Preview"**, **"Copy Code"**, **"Download .html"**.

### 4. Live Preview (`features/preview`)

- Opens in a **sandboxed iframe** (`sandbox="allow-scripts"`) to safely render the generated HTML.
- Can be toggled between a side-by-side split view and a full-screen overlay/modal.
- Include a responsive-preview toolbar (desktop / tablet / mobile width presets).
- The iframe border should have a subtle `--border-subtle` outline with rounded corners.

### 5. History Sidebar (`features/history`)

- Lists previous prompts with truncated text, timestamp, and a small preview thumbnail (optional).
- Clicking an entry reloads the prompt and its generated output.
- Search/filter bar at the top.
- Data persisted in `localStorage` (or IndexedDB for scale).
- Empty state: a subtle illustration or message encouraging the user to create their first generation.

### 6. Settings Panel (`features/settings`)

- Accessible from the gear icon.
- Options: API base URL override, theme toggle (dark/light — design both), font size adjustment, streaming speed preference.
- Slide-over drawer from the right, glass-morphism background.

---

## Streaming Implementation Notes

```typescript
// shared/hooks/useStream.ts — conceptual outline
export function useStream() {
  const [chunks, setChunks] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = async (prompt: string) => {
    setChunks("");
    setIsStreaming(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setChunks((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsStreaming(false);
    }
  };

  return { chunks, isStreaming, error, startStream };
}
```

---

## Animation Specs

| Element              | Property                    | Duration | Easing                     | Delay         |
| --------------------- | --------------------------- | -------- | --------------------------- | ------------- |
| Page load cascade     | `opacity, translateY(12px)` | 500ms    | `cubic-bezier(.16,1,.3,1)` | 0–300ms stagger |
| Input border glow     | `box-shadow, border-color`  | 200ms    | `ease-out`                 | —             |
| Button hover scale    | `transform: scale(1.02)`    | 150ms    | `ease-out`                 | —             |
| Streaming cursor blink| `opacity 0↔1`               | 800ms    | `steps(1)`                 | —             |
| Sidebar slide-in      | `translateX(-100%→0)`       | 300ms    | `cubic-bezier(.16,1,.3,1)` | —             |
| Code chunk append     | `opacity`                   | 80ms     | `linear`                   | —             |
| Health dot pulse      | `box-shadow scale`          | 1.5s     | `ease-in-out` (infinite)   | —             |

---

## Accessibility

- All interactive elements must be keyboard-navigable.
- Color contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text.
- `aria-live="polite"` on the streaming output region so screen readers announce new content.
- Focus rings visible on all interactive elements (use `--accent` outline).
- Respect `prefers-reduced-motion`: disable non-essential animations.
- Semantic HTML: `<main>`, `<nav>`, `<aside>`, `<header>`, proper heading hierarchy.

---

## Performance Targets

- **Lighthouse score**: ≥ 95 across all categories.
- **First Contentful Paint**: < 1s.
- **Bundle size**: < 150KB gzipped (initial load).
- **Streaming latency**: first chunk rendered within 100ms of response start.

---

## Summary

Divergent's frontend should feel like a premium creative studio at dusk — fast, beautiful, and focused. The soft-dark aesthetic with warm accent moments, combined with real-time streaming and a well-organized codebase, positions it to scale from a single-page prototype to a multi-feature product without architectural rewrites. Every pixel, animation, and interaction should feel intentional.

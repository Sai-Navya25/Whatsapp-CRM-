WhatsappCRM — Mini Project

A compact full‑stack demo that turns a recipient name + short prompt into an editable, ready‑to‑send message using curated templates and optional document context.

Live Site: https://sainavyasigmoidwhatscrm.netlify.app/

Features:
- Enter recipient name and a short prompt to generate a personalized message.
- Curated templates (Diwali, Christmas, Birthday, Welcome, Thanks) that pre-fill the prompt.
- Optional document context (Promo, Policy, Newsletter) appended to prompt for richer content.
- Editable generated message with Copy (clipboard) support and robust fallback.
- Rule-based backend message generator (server-side templates) with clean shared TypeScript types.

Tech Stack:
- Frontend: React 18 + TypeScript, Vite, Tailwind CSS
- Backend: Express (integrated as Vite middleware)
- UI: Radix primitives, custom Button (cva), Sonner for toasts
- Tooling: pnpm, TypeScript, Vitest (tests available)

Local Setup:
Prerequisites: Node 18+, pnpm

1. Install dependencies:
   pnpm install

2. Run dev server (client + server middleware):
   pnpm dev

3. Open browser:
   http://localhost:8080

Important Scripts:
- pnpm dev — run dev server (Vite + Express middleware)
- pnpm build — produce client and server builds
- pnpm start — run production server after build
- pnpm test — run unit tests with Vitest

API:
POST /api/generateMessage

Request JSON:
{ "prompt": "<your prompt>", "namePlaceholder": "<recipient or {name}>" }

Response JSON:
{ "message": "Hello {name}, ...", "occasion": "diwali" | "birthday" | null }

Where to Look in the Code:
- client/pages/Index.tsx — main UI
- client/pages/WhatsappCRM.tsx — page alias for main UI
- client/App.tsx — app shell, header, routing
- server/routes/generate-message.ts — backend generator logic and templates
- server/index.ts — route registration
- shared/api.ts — shared TypeScript types
- client/global.css & tailwind.config.ts — theme tokens and Tailwind config

Extending the Project:
- Persist templates/documents: add a DB (Supabase recommended) and CRUD endpoints
- LLM integration: replace rule-based generator with an LLM call
- WhatsApp sending: integrate Twilio or WhatsApp Business API

Troubleshooting & Notes:
- Clipboard may be blocked in embedded iframes; fallback implemented using textarea + execCommand
- Duplicate import/identifier errors: check client/pages/* and remove repeats
- If /api/generateMessage returns 404, ensure dev server is running (pnpm dev)

Deployment:
- Recommended: Netlify or Vercel
- Build command: pnpm build
- Start script: pnpm start

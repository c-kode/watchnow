# WatchNow — Project Guide

## Architecture

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS → Vercel
- **Backend:** Express.js + TypeScript → Railway
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- Stateless. No database. No auth.

## Monorepo Layout

```
watchnow/
├── frontend/   → Next.js app (port 3000)
└── backend/    → Express API (port 3001)
```

## Running Locally

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

## Environment Variables

**Frontend `.env.local`:** `NEXT_PUBLIC_API_URL=http://localhost:3001`
**Backend `.env`:** `ANTHROPIC_API_KEY`, `PORT=3001`, `FRONTEND_URL=http://localhost:3000`

The API key must never appear in the frontend or be committed to Git.

## Key Rules

- All TypeScript, strict mode, no `any`
- Backend validates all input before calling Claude
- Strip markdown fences from Claude response before JSON parsing
- CORS locked to `FRONTEND_URL` only
- Rate limiting: 20 req/IP/15 min
- 30s timeout on Claude API calls
- Every error state has a corresponding UI

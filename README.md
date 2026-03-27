# WatchNow

Answer 7 questions. Get the perfect thing to watch.

WatchNow is an AI-powered streaming recommendation assistant. It asks about your mood, available time, who you're watching with, and what services you have — then returns 1–3 personalised picks with explanations of why each fits.

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS (Vercel)
- **Backend:** Express.js + TypeScript (Railway)
- **AI:** Anthropic Claude API

## Local Development

```bash
# 1. Clone and install
git clone <repo-url>
cd watchnow

# 2. Backend
cd backend
cp .env.example .env    # Add your ANTHROPIC_API_KEY
npm install
npm run dev             # Runs on port 3001

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev             # Runs on port 3000
```

## Environment Variables

**Backend `.env`:**
- `ANTHROPIC_API_KEY` — Your Anthropic API key
- `PORT` — Server port (default: 3001)
- `FRONTEND_URL` — Allowed CORS origin (default: http://localhost:3000)

**Frontend `.env.local`:**
- `NEXT_PUBLIC_API_URL` — Backend URL (default: http://localhost:3001)

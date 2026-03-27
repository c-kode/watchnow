# WatchNow — Build Tasks

## Milestone 1 — Repo & Project Setup
- [x] 1.1 `git init` at `watchnow/` root, create `.gitignore`
- [x] 1.2 Create `CLAUDE.md`
- [x] 1.3 Create `TASKS.md`
- [x] 1.4 Scaffold frontend (Next.js 14, TypeScript, Tailwind, App Router, src/)
- [x] 1.5 Scaffold backend (Express + TypeScript, install all deps)
- [x] 1.6 Create `frontend/vercel.json`
- [x] 1.7 Create `backend/railway.toml`
- [x] 1.8 Create `.env` placeholder files (not committed)
- [x] 1.9 Verify frontend runs locally
- [x] 1.10 Verify backend runs locally
- [x] 1.11 Create `README.md`
- [x] 1.12 Commit: `[M1] scaffold repo and both packages`

## Milestone 2 — Backend API
- [x] 2.1 `types.ts` — all shared types
- [x] 2.2 `validator.ts` — input validation
- [x] 2.3 `prompt.ts` — Claude prompt builder
- [x] 2.4 `recommend.ts` — POST /api/recommend with full error handling
- [x] 2.5 `index.ts` — Express server with CORS, rate limiting, health check
- [x] 2.6 Test `/health` endpoint
- [x] 2.7 Test `/api/recommend` end-to-end
- [x] 2.8 Commit: `[M2] backend API complete`

## Milestone 3 — Frontend Questionnaire
- [x] 3.1 `types.ts`
- [x] 3.2 `questions.ts` — all 7 questions defined
- [x] 3.3 `ProgressBar` component
- [x] 3.4 `QuestionStep` component
- [x] 3.5 `LandingScreen` component
- [x] 3.6 State machine in `page.tsx` using `useReducer`
- [x] 3.7 API call wired with 30s timeout and error handling
- [x] 3.8 Full flow tested locally end-to-end
- [x] 3.9 Commit: `[M3] frontend questionnaire complete`

## Milestone 4 — Results Screen
- [x] 4.1 `LoadingScreen` with rotating messages
- [x] 4.2 `ResultCard` component
- [x] 4.3 Results layout (1 card centred; 2–3 cards responsive grid)
- [x] 4.4 "Start Over" reset
- [x] 4.5 Error state UI with "Try Again"
- [x] 4.6 Commit: `[M4] results screen complete`

## Milestone 5 — Design & Polish
- [x] 5.1 Fonts via `next/font` — DM Serif Display + DM Sans
- [x] 5.2 Colour palette in Tailwind config
- [x] 5.3 Step transition animations
- [x] 5.4 Results staggered reveal animation
- [x] 5.5 Mobile audit at 375px
- [x] 5.6 Accessibility audit
- [x] 5.7 Commit: `[M5] design and polish complete`

## Milestone 6 — Deployment
- [x] 6.1 Push to GitHub — https://github.com/c-kode/watchnow
- [x] 6.2 Deploy backend to Railway — https://backend-production-6a8f.up.railway.app
- [x] 6.3 Deploy frontend to Vercel — https://frontend-alpha-ten-34.vercel.app
- [x] 6.4 Update `FRONTEND_URL` in Railway to Vercel URL — redeployed
- [ ] 6.5 End-to-end test on live URLs (pending Anthropic credits)
- [x] 6.6 Update `README.md` with live URLs
- [x] 6.7 Commit: `[M6] deployed`

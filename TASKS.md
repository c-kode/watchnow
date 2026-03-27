# WatchNow — Build Tasks

## Milestone 1 — Repo & Project Setup
- [x] 1.1 `git init` at `watchnow/` root, create `.gitignore`
- [x] 1.2 Create `CLAUDE.md`
- [x] 1.3 Create `TASKS.md`
- [ ] 1.4 Scaffold frontend (Next.js 14, TypeScript, Tailwind, App Router, src/)
- [ ] 1.5 Scaffold backend (Express + TypeScript, install all deps)
- [ ] 1.6 Create `frontend/vercel.json`
- [ ] 1.7 Create `backend/railway.toml`
- [ ] 1.8 Create `.env` placeholder files (not committed)
- [ ] 1.9 Verify frontend runs locally
- [ ] 1.10 Verify backend runs locally
- [ ] 1.11 Create `README.md`
- [ ] 1.12 Commit: `[M1] scaffold repo and both packages`

## Milestone 2 — Backend API
- [ ] 2.1 `types.ts` — all shared types
- [ ] 2.2 `validator.ts` — input validation
- [ ] 2.3 `prompt.ts` — Claude prompt builder
- [ ] 2.4 `recommend.ts` — POST /api/recommend with full error handling
- [ ] 2.5 `index.ts` — Express server with CORS, rate limiting, health check
- [ ] 2.6 Test `/health` endpoint
- [ ] 2.7 Test `/api/recommend` end-to-end
- [ ] 2.8 Commit: `[M2] backend API complete`

## Milestone 3 — Frontend Questionnaire
- [ ] 3.1 `types.ts`
- [ ] 3.2 `questions.ts` — all 7 questions defined
- [ ] 3.3 `ProgressBar` component
- [ ] 3.4 `QuestionStep` component
- [ ] 3.5 `LandingScreen` component
- [ ] 3.6 State machine in `page.tsx` using `useReducer`
- [ ] 3.7 API call wired with 30s timeout and error handling
- [ ] 3.8 Full flow tested locally end-to-end
- [ ] 3.9 Commit: `[M3] frontend questionnaire complete`

## Milestone 4 — Results Screen
- [ ] 4.1 `LoadingScreen` with rotating messages
- [ ] 4.2 `ResultCard` component
- [ ] 4.3 Results layout (1 card centred; 2–3 cards responsive grid)
- [ ] 4.4 "Start Over" reset
- [ ] 4.5 Error state UI with "Try Again"
- [ ] 4.6 Commit: `[M4] results screen complete`

## Milestone 5 — Design & Polish
- [ ] 5.1 Fonts via `next/font` — DM Serif Display + DM Sans
- [ ] 5.2 Colour palette in Tailwind config
- [ ] 5.3 Step transition animations
- [ ] 5.4 Results staggered reveal animation
- [ ] 5.5 Mobile audit at 375px
- [ ] 5.6 Accessibility audit
- [ ] 5.7 Commit: `[M5] design and polish complete`

## Milestone 6 — Deployment
- [ ] 6.1 Push to GitHub
- [ ] 6.2 Deploy backend to Railway
- [ ] 6.3 Deploy frontend to Vercel
- [ ] 6.4 Update `FRONTEND_URL` in Railway to Vercel URL — redeploy
- [ ] 6.5 End-to-end test on live URLs
- [ ] 6.6 Update `README.md` with live URLs
- [ ] 6.7 Commit: `[M6] deployed`

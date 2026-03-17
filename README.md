# quizy-front
Quizy Frontend is a modular, enterprise‑ready web client for an online quiz platform where users solve timed quizzes, earn points, and compete on leaderboards across multiple time ranges.

## Frontend architecture (API.md + INFO.md aligned)

Project is structured by app shell + domain features:

```
src/
	app/
		providers/
		realtime/
		router.tsx
		App.tsx
	pages/
		LoginPage.tsx
		QuizSetupPage.tsx
		QuizPlayPage.tsx
		QuizResultPage.tsx
		LeaderboardPage.tsx
		CategoriesPage.tsx
	features/
		auth/
		quiz/
		leaderboard/
		categories/
	entities/
		User.ts
		Quiz.ts
		Leaderboard.ts
		Category.ts
	shared/
		api/
		lib/
		ui/
```

## Implemented phase 1 features

- Auth login/logout, token session handling, protected routes.
- Quiz flow (`/api/quiz/start`, answer submit, timer countdown, result page).
- Leaderboard periods (`7d`, `30d`, `3m`, `6m`, `12m`) + authenticated `my-position`.
- Categories listing from `/api/categories`.
- Centralized API client (Axios) + TanStack Query for all server communication.

## Realtime preparation (phase 2)

- Added `src/app/realtime/socket.placeholder.ts` as integration seam for future WebSocket/SignalR live quiz mode.

## Environment

Create `.env` from `.env.example`:

```
VITE_API_BASE_URL=http://localhost:3000
```

## Run

```bash
npm install
npm run dev
```

Build validation:

```bash
npm run build
```

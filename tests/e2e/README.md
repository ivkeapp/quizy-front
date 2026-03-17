# E2E smoke test

This smoke test runs with mocked `/api/*` responses to validate frontend flow:

- login
- start quiz
- answer questions
- open result page

Run:

```bash
npm run test:e2e
```

If you want a real backend integration scenario, remove route mocks in `smoke.spec.ts` and ensure backend is running at `http://localhost:3000` with valid CORS for frontend origin.

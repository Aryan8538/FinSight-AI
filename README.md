# FinSight AI

FinSight AI is a MERN-stack financial education and paper-investing platform for students. It combines a responsive dashboard, market watchlists, simulated portfolios, short learning modules, quizzes, progress badges, and a context-aware AI advisor powered by Groq.

> FinSight is an educational product. It does not execute trades or provide regulated financial, legal, or tax advice.

## Architecture

- **Client:** React 19, Vite, React Router, Recharts, Lucide
- **API:** Node.js, Express 5, Zod validation
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT and bcrypt
- **AI:** Groq's OpenAI-compatible chat-completions API
- **Market data:** Finnhub when configured, deterministic demo data otherwise

## Quick start

Prerequisites: Node.js 20+, npm, and MongoDB 7+ (local or Atlas).

```powershell
Copy-Item .env.example .env
npm install
npm install --prefix server
npm install --prefix client
npm run seed
npm run dev
```

Open `http://localhost:5173`.

For live integrations, add these values to `.env`:

```env
GROQ_API_KEY=your_key
FINNHUB_API_KEY=your_key
```

Without them, the app remains fully navigable using safe demo AI responses and sample market quotes.

## Main workflows

1. Register and set a student profile, goals, experience, and risk comfort.
2. Search stocks and add symbols to a personal watchlist.
3. Create multiple paper portfolios and add hypothetical purchases.
4. Review calculated value, cost basis, gain/loss, and CSV exports.
5. Complete financial literacy modules and quizzes to earn badges.
6. Ask the AI advisor questions; chat sessions retain context and incorporate the user's profile and paper portfolios.

## API

All endpoints are versioned under `/api/v1` and use:

```json
{ "status": "success", "data": {}, "error": null }
```

Key routes:

- `POST /auth/register`, `POST /auth/login`, `PATCH /auth/profile`
- `GET /market/search`, `GET /market/quote/:symbol`, `/market/watchlist`
- CRUD under `/portfolios`, including holdings and CSV export
- `GET /learning`, `GET /learning/:slug`, `POST /learning/:slug/quiz`
- `GET /chat/sessions`, `POST /chat/messages`

## Scripts

- `npm run dev` — client and API development servers
- `npm run build` — production client build
- `npm run start` — production API
- `npm run seed` — upsert the starter curriculum
- `npm test` — server tests

## Production checklist

- Use MongoDB Atlas or another managed MongoDB deployment.
- Set a long random `JWT_SECRET`.
- Restrict `CLIENT_URL` to the deployed frontend origin.
- Put the API behind HTTPS and a reverse proxy.
- Replace demo market history with a licensed historical-data endpoint before public launch.
- Add email verification, password reset, observability, backups, and a privacy policy.
- Review financial disclaimers and data-handling practices with qualified legal counsel.

# FinSight AI — Product and Engineering Plan

## 1. PRD translation

The supplied PRD described React with FastAPI and PostgreSQL. This implementation uses the requested MERN stack:

| PRD layer | MERN implementation |
| --- | --- |
| React SPA | React 19 + Vite |
| FastAPI / Uvicorn | Express 5 on Node.js |
| PostgreSQL / SQLite | MongoDB + Mongoose |
| Groq API | Groq OpenAI-compatible chat completions |
| Financial data API | Finnhub adapter with demo fallback |

The MVP deliberately remains paper-trading and education-only.

## 2. Experience design

The product uses a calm “financial study desk” visual language:

- Deep green communicates trust without resembling a high-pressure trading terminal.
- Soft mint, cream, lavender, and coral distinguish educational content.
- Plain-language labels replace brokerage jargon.
- The dashboard highlights learning and practice, not urgency or market hype.
- Every AI and portfolio workflow includes an educational-use cue.
- Responsive breakpoints support the PRD's 375 px minimum viewport.

Primary navigation:

1. Overview — progress and useful next actions
2. Market — watchlist and historical movement
3. Portfolio — multiple simulated strategies
4. Learn — lessons, quizzes, progress, badges
5. AI Advisor — contextual, persistent conversations
6. Profile — experience, risk comfort, and goals

## 3. Domain model

- **User:** identity, hashed password, profile, watchlist, badges
- **Portfolio:** owner, name, benchmark, embedded holdings
- **LearningModule:** educational content, takeaways, quiz answers
- **LearningProgress:** score, attempts, completion state
- **ChatSession:** conversation title and ordered messages

## 4. API design

- Version prefix: `/api/v1`
- Authentication: `Authorization: Bearer <JWT>`
- Successful envelope: `{ status: "success", data, error: null }`
- Error envelope: `{ status: "error", data: null, error }`
- Zod validates public write endpoints.
- Global and AI-specific rate limits protect the API.
- Helmet, CORS, JSON limits, password hashing, ownership filters, and JWT verification form the security baseline.

## 5. AI safety design

The advisor system prompt:

- identifies itself as an educator for students;
- uses the user's experience, goals, risk comfort, and paper holdings;
- avoids guarantees and direct buy/sell instructions;
- recommends relevant learning topics;
- includes a financial-education disclaimer.

If no Groq key is configured, the app returns a clearly identified educational demo response so local development remains usable.

## 6. Delivery sequence

### Phase A — Foundation

- Monorepo and environment configuration
- MongoDB connection and schemas
- Express middleware and response conventions
- React shell, routing, design tokens, responsive navigation

### Phase B — Core MVP

- Registration, login, JWT sessions, profile personalization
- Market search, quotes, ranges, and watchlist
- Multiple paper portfolios, holdings, valuation, returns, CSV export
- Seeded lessons, quizzes, progress, and badges
- Groq advisor with session memory

### Phase C — Quality gate

- Production client build
- Server unit tests
- Input validation and centralized error handling
- Demo integration fallbacks
- Setup and deployment documentation

### Phase D — Recommended next iteration

- Email verification and password recovery
- Real historical candle data and benchmark comparison
- Price-alert worker and in-app notification center
- Admin curriculum editor
- Accessibility and end-to-end browser tests
- Analytics, logging, error monitoring, and uptime checks
- Refresh-token rotation and session revocation

## 7. Acceptance checklist

- [x] Student can create an account and sign in.
- [x] Student can set experience, risk comfort, and goals.
- [x] Student can search and follow stocks.
- [x] Student can inspect quote movement across time ranges.
- [x] Student can create several paper portfolios.
- [x] Student can add/remove holdings and see calculated performance.
- [x] Student can export a portfolio to CSV.
- [x] Student can read modules, complete quizzes, and earn badges.
- [x] Student can start and revisit contextual AI conversations.
- [x] App works without paid API keys using local demo fallbacks.
- [x] Production frontend compiles successfully.
- [x] Server tests pass.


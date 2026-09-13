<div align="center">

# 🔍 CodeReviewAI

### AI-Powered Code Review Platform

**Detect bugs. Identify vulnerabilities. Improve code quality — instantly.**

[![CI](https://github.com/yourusername/ai-code-review/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/ai-code-review/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

</div>

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](screenshots/landing.png)

### 🔐 Sign In Page
![Sign In Page](screenshots/signin.png)

### 🖥️ Code Review Dashboard
![Dashboard](screenshots/dashboard.png)

### 📋 Review History
![History](screenshots/history.png)

---

## 🚀 About the Project

**CodeReviewAI** is a full-stack MERN application that integrates the **Anthropic Claude API** to perform deep, structured code reviews across 15+ programming languages. It returns severity-categorized findings — Critical, High, Medium, Low, and Good Practice — with detailed explanations, line-level references, and suggested fixes.

Beyond the core feature set, v2.1 focuses on making the app **production-ready**: input validation, rate limiting, centralized error handling, structured logging, environment validation, an automated test suite, Docker images, and a CI pipeline.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Claude AI Reviews** | Structured, severity-classified code analysis via the Anthropic SDK |
| 🔐 **JWT Authentication** | Registration/login with bcrypt hashing, rate-limited auth endpoints |
| 📋 **Review History** | Paginated history per user, backed by an indexed MongoDB query |
| 🌙 **Dark & Light Mode** | Theme toggle persisted via React Context + localStorage |
| 🔔 **Toast Notifications** | In-app success/error alerts, no browser `alert()` |
| 🛡️ **Hardened API** | Helmet security headers, per-route rate limiting, request size caps, input validation |
| 🧯 **Centralized Error Handling** | Every route funnels errors through one handler — no leaked stack traces |
| ✅ **Automated Tests** | Jest + Supertest integration tests against an in-memory MongoDB |
| 🐳 **Dockerized** | Multi-stage client (nginx) and server images, plus a full `docker-compose` stack |
| ⚙️ **CI Pipeline** | GitHub Actions runs the test suite and a production build on every push |

---

## 🛠️ Tech Stack

**Frontend** — React 19 · Vite · React Router DOM v7 · React Markdown · Context API · Vanilla CSS

**Backend** — Node.js · Express · MongoDB (Mongoose) · JWT · bcryptjs · Helmet · express-rate-limit · express-validator · morgan

**AI Integration** — Anthropic Claude API, structured prompt engineering for severity-classified output

**Tooling** — Jest · Supertest · mongodb-memory-server · Docker · GitHub Actions

---

## 🏗️ Architecture

```
ai-code-review/
├── .github/workflows/ci.yml       # Test + build on every push/PR
├── docker-compose.yml              # Full local stack: mongo + server + client
│
├── client/                         # React 19 + Vite frontend
│   ├── Dockerfile / nginx.conf     # Production static build, served by nginx
│   └── src/
│       ├── context/ThemeContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Toast.jsx
│       │   └── ErrorBoundary.jsx   # Catches render errors, shows a recovery screen
│       ├── pages/                  # Landing, Login, Register, Dashboard, History
│       └── api/axios.js            # Env-driven base URL, JWT interceptor, 401 auto-logout
│
└── server/                         # Node.js + Express backend
    ├── Dockerfile
    ├── config/env.js               # Validates required env vars on boot; fails fast
    ├── middleware/
    │   ├── errorHandler.js         # Centralized error + 404 handling
    │   ├── rateLimiter.js          # Per-route limits (auth / review / general API)
    │   ├── validate.js             # express-validator result -> consistent 400s
    │   ├── asyncHandler.js         # Forwards async route rejections to the error handler
    │   └── protect.js              # JWT auth middleware
    ├── routes/
    │   ├── auth.js                 # POST /register, POST /login (validated, rate-limited)
    │   └── review.js               # POST /review, GET /review/history (paginated)
    ├── models/
    │   ├── User.js
    │   └── Review.js               # Compound index on {userId, createdAt}
    ├── tests/                      # Jest + Supertest integration tests
    └── index.js                    # App bootstrap, health check, graceful shutdown
```

---

## ⚡ Getting Started

### Option A — Docker (recommended)

```bash
cp server/.env.example server/.env   # fill in JWT_SECRET and ANTHROPIC_API_KEY
docker compose up --build
```

This starts MongoDB, the API (`http://localhost:5000`), and the frontend (`http://localhost:5173`) together.

### Option B — Run locally

**Prerequisites:** Node.js v18+, a MongoDB instance (Atlas or local), an [Anthropic API key](https://console.anthropic.com).

```bash
# Backend
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY
npm run dev             # http://localhost:5000

# Frontend (new terminal)
cd client
npm install
cp .env.example .env    # VITE_API_URL defaults to http://localhost:5000/api
npm run dev              # http://localhost:5173
```

### Running the test suite

```bash
cd server
npm test
```

Tests spin up an in-memory MongoDB (`mongodb-memory-server`) — no real database needed. They also run automatically in CI on every push/PR (see `.github/workflows/ci.yml`).

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Rate-limited | Description |
|--------|----------|------|--------------|--------------|
| `POST` | `/api/auth/register` | ❌ | ✅ | Create a new user account |
| `POST` | `/api/auth/login` | ❌ | ✅ | Login and receive a JWT |
| `POST` | `/api/review` | ✅ JWT | ✅ (strict) | Submit code for AI review |
| `GET` | `/api/review/history?page=&limit=` | ✅ JWT | ✅ | Paginated review history for the logged-in user |
| `GET` | `/health` | ❌ | — | Liveness/readiness check, reports DB connection state |

---

## 🧠 How the AI Review Works

1. User pastes code and selects a language on the Dashboard.
2. Frontend calls `POST /api/review` with `{ code, language }` (validated: known language, code within `MAX_CODE_LENGTH`).
3. Backend sends a structured prompt to Claude via the Anthropic SDK.
4. Claude returns severity-classified markdown findings.
5. Frontend parses the response into a findings list with severity badges and a raw report view.
6. The review is persisted to MongoDB against the authenticated user.

---

## 🔒 Production Hardening Notes

- **CORS** is allow-listed via `CORS_ORIGINS` (comma-separated) rather than wide open or hardcoded to one URL.
- **Rate limiting** is tiered: a loose general API limit, a tighter auth limit (brute-force mitigation), and a strict per-minute limit on `/api/review` since each call costs real money against the Anthropic API.
- **Input validation** (`express-validator`) rejects bad payloads before they reach business logic — including a max code length and an allow-list of supported languages.
- **Environment validation** on boot (`config/env.js`) fails fast with a clear message instead of crashing deep inside a request handler when a secret is missing.
- **Error handling** is centralized: route handlers `throw`/reject and one middleware decides the client-facing message, so stack traces never leak in production.
- **Auth responses** use a single generic "Invalid email or password" message for both "no such user" and "wrong password" to avoid confirming which emails are registered.

---

## 🌐 Deployment

**Backend → Render/Railway/Fly.io** — set the root directory to `/server`, build command `npm install`, start command `node index.js`, and configure `MONGO_URI`, `JWT_SECRET`, `ANTHROPIC_API_KEY`, `CORS_ORIGINS` as environment variables. The Dockerfile in `/server` also works directly on any container platform.

**Frontend → Netlify/Vercel** — root directory `/client`, build command `npm run build`, publish directory `dist`, environment variable `VITE_API_URL=https://your-backend-url/api`.

---

## 🧪 Test the App

Paste this buggy JavaScript snippet into the editor to test the review system:

```javascript
function getUserData(users, id) {
  for (var i = 0; i <= users.length; i++) {
    if (users[i].id == id) {
      return users[i]
    }
  }
}

var result = getUserData(null, 5)
console.log(result.name)
```

**Expected findings:** off-by-one loop bound, missing null check on `users`, unsafe property access on `result`, loose equality (`==`), and `var` vs `const`/`let`.

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

## 🙋‍♀️ Author

**Souparnika C** — Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077b5?style=flat-square&logo=linkedin)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/yourusername)

---

<div align="center">
  <sub>Built with React, Node.js, MongoDB, and the Anthropic Claude API</sub>
</div>

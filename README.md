# Learning Tracker

A full-stack web app to track mainly programming concepts but can also track any other concepts topics, confidence levels, study hours and mastery.
I built this as a internship portfolio project.

## Live demo

| **Frontend** | [https://learning-tracker-lac.vercel.app/](https://learning-tracker-lac.vercel.app/) |
| **Backend API** | [https://learning-tracker-4f8j.onrender.com/](https://learning-tracker-4f8j.onrender.com/) |

## What it does

 **Accounts:** Register with validation (strong password), then log in with JWT-based auth.
 **Topics:** Add topics, update confidence (0–5), hours studied, last practiced date, and mastered status.
 **Filtering:** Search by name, filter by confidence, optionally show only mastered topics.
 **Overview:** Simple stats (totals, averages, most practiced topic).
 **UI:** React + Tailwind for a clean, readable layout; toast notifications for feedback.

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, Vite, React Router, Tailwind CSS, Axios, react-hot-toast |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, express-rate-limit |
| Testing | Playwright (frontend), Jest + Supertest (backend API) |
| Hosting | Vercel (frontend), Render (backend) |

## Repository layout

Learning-Tracker/
── Learning-tracker/          # React + Vite frontend
── Learning-tracker-backend/  # Express API

## Run locally

### Prerequisites

- Node.js (LTS recommended)
- MongoDB URI (local MongoDB or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Backend

```bash
cd Learning-tracker-backend
npm install
```

Create a `.env` file in `Learning-tracker-backend/`:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `SECRET` | Secret used to sign and verify JWTs |
| `PORT` | Optional; defaults to `3001` |
| `TEST_MONGODB_URI` | Separate DB URI when running `npm test` |

```bash
npm run dev
```

API runs at `http://localhost:3001` (or your `PORT`).

### Frontend

```bash
cd Learning-tracker
npm install
```

Create `Learning-tracker/.env` (or `.env.local`):

```env
VITE_API_BASE_URL=http://localhost:3001
```

```bash
npm run dev
```

The Vite dev server proxies `/api` to the backend as well; the app uses `VITE_API_BASE_URL` for API calls, so keep it aligned with where your API runs.

```bash
npm run build    # production build
npm run preview  # preview production build locally
```

### Tests

```bash
# Frontend E2E (from Learning-tracker/)
npm test

# Backend API tests (from Learning-tracker-backend/)
npm test
```

## API overview

Base URL in production: `https://learning-tracker-4f8j.onrender.com`

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/api/users` | Register |
| `POST` | `/api/login` | Login → returns token + user fields |
| `GET/POST/PUT/DELETE` | `/api/topics` | CRUD for topics (auth required for protected routes) |

Exact behavior matches the Express routers under `Learning-tracker-backend/controllers/`.

## Deployment notes

- **Vercel:** Set `VITE_API_BASE_URL` to your Render backend origin (no trailing slash), e.g. `https://learning-tracker-4f8j.onrender.com`.
- **Render:** Set `MONGODB_URI`, `SECRET`, and `NODE_ENV=production` (or rely on Render defaults). Cold starts on free tier can add a short delay on first request.

## License

This project is for learning and portfolio use. Adjust or add a license file if you open-source it formally.

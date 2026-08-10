# Bumblearn

Swipe-matching for educators and learners — find tutors, teachers, and mentors the way you browse a deck of cards.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + Prisma ORM (required)
- **Auth:** Email/password with JWT sessions (Google OAuth next)
- **Realtime chat:** Socket.io
- **Storage:** Local disk (dev) / S3-compatible (prod)

## Monorepo layout

```
client/   # Vite React app
server/   # Express API + Prisma + Socket.io
```

## Getting started

```bash
# Install deps (from repo root)
npm install
cp .env.example server/.env

# Start Postgres, then sync schema
docker compose up -d          # or use a local Postgres matching DATABASE_URL
npm run db:generate
npm run db:push

# Run BOTH servers
npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173
```

Open **http://localhost:5173/welcome** → create an account → choose Learn / Educate / Both → finish onboarding.

Accounts, profiles, matches, and chat messages are stored in PostgreSQL and **persist across API restarts**.

## Current milestone

Original teal UI + signup/onboarding with role choice + Socket.io chat + Postgres persistence via Prisma.

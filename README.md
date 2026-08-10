# Bumblearn

Swipe-matching for educators and learners — find tutors, teachers, and mentors the way you browse a deck of cards.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Email/password + Google OAuth (JWT sessions)
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

# Copy env (chat works without Postgres for now)
cp .env.example server/.env

# Run BOTH servers (chat needs the API)
npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173
```

Open **http://localhost:5173** → **Matches** → pick Maya or Sofia → send a message.

Optional later (when wiring Prisma persistence):

```bash
docker compose up -d
npm run db:generate
npm run db:push
```

## Current milestone

Scaffold + Prisma schema + swipe deck (mock data) + **live Socket.io chat** with seeded matches and session proposals. Auth + real matching persistence come next.

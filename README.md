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

# Copy env and start Postgres, then:
cp .env.example server/.env
# edit DATABASE_URL as needed

npm run db:generate
npm run db:push

# Dev servers
npm run dev:client   # http://localhost:5173
npm run dev:server   # http://localhost:4000
```

## Current milestone

Scaffold + Prisma schema + swipe deck UI with mock data (gestures & animations). Backend auth, matching, and chat come next.

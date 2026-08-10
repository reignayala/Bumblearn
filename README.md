# Bumblearn

**Find your perfect learning match.**  
Swipe through educators and learners — built for Philippine college programs.

## Live demo (GitHub Pages)

**https://reignayala.github.io/Bumblearn/**

Open the link, swipe educators, and try matches — runs in your browser as a demo (no server setup).

For signup, chat persistence, and Postgres, run locally (below) or deploy the full stack with Docker/Render.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React + TypeScript + Vite + Tailwind |
| Backend | Node.js + Express + Socket.io |
| Database | PostgreSQL + Prisma |
| Auth | Email/password + JWT |

## Monorepo layout

```
client/   # Vite React app (deployed to GitHub Pages)
server/   # Express API + Prisma + Socket.io
```

## Getting started (local full stack)

```bash
npm install
cp .env.example server/.env

docker compose up -d          # or local Postgres matching DATABASE_URL
npm run db:generate
npm run db:push

npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173
```

Open **http://localhost:5173/welcome** → sign up → choose Learn / Educate / Both → finish onboarding.

## Share

- **Live demo:** https://reignayala.github.io/Bumblearn/
- **Code:** https://github.com/reignayala/Bumblearn

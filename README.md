# Bumblearn

**Find your perfect learning match.**  
Swipe through educators and learners the way you’d browse a deck of cards — built for Philippine college programs.

**Repo:** https://github.com/reignayala/Bumblearn  

## Live demo

**Open the hosted app:** https://weekly-edward-promotes-sea.trycloudflare.com/welcome

This demo is served over a public HTTPS tunnel. Create an account, pick a program, and swipe.

> For a **permanent** free host (stays up after this session), click **Deploy to Render** below (needs a free Render account linked to GitHub).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/reignayala/Bumblearn)

## What’s in this project

- Tinder-style **Discover** deck (interested / pass / undo)
- **Signup + role choice:** Learn, Educate, or Both
- **Program picker** for Philippine BS/BA and professional programs
- **Matches + live chat** (Socket.io)
- **Postgres** persistence for accounts, profiles, matches, and messages
- Mock deck with **26 educators** and **4 learners** for demos
- Production build: API serves the React app on one URL (`Dockerfile` + `render.yaml`)

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React + TypeScript + Vite + Tailwind |
| Backend | Node.js + Express + Socket.io |
| Database | PostgreSQL + Prisma |
| Auth | Email/password + JWT |

## Monorepo layout

```
client/   # Vite React app
server/   # Express API + Prisma + Socket.io
```

## Getting started (local)

```bash
# From repo root
npm install
cp .env.example server/.env

# Start Postgres, then sync schema
docker compose up -d          # or local Postgres matching DATABASE_URL
npm run db:generate
npm run db:push

# Run BOTH servers (two terminals)
npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173
```

1. Open **http://localhost:5173/welcome**
2. Create an account
3. Choose **Learn** / **Educate** / **Both**
4. Finish onboarding (pick your program)
5. Swipe on Discover

## Production (Docker / Render)

```bash
npm run build
NODE_ENV=production PORT=8080 CORS_ORIGIN="*" node server/dist/index.js
```

Or deploy with the **Deploy to Render** button (uses `render.yaml`: free web service + Postgres).

## Share this project

- **Live demo:** https://weekly-edward-promotes-sea.trycloudflare.com/welcome
- **Code:** https://github.com/reignayala/Bumblearn
- **Clone:** `git clone https://github.com/reignayala/Bumblearn.git`

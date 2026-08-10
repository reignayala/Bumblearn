# Bumblearn

**Find your perfect learning match.**  
Swipe through educators and learners the way you’d browse a deck of cards — built for Philippine college programs.

**Repo:** https://github.com/reignayala/Bumblearn  

## What’s in this project

- Tinder-style **Discover** deck (interested / pass / undo)
- **Signup + role choice:** Learn, Educate, or Both
- **Program picker** for Philippine BS/BA and professional programs
- **Matches + live chat** (Socket.io)
- **Postgres** persistence for accounts, profiles, matches, and messages
- Mock deck with **26 educators** and **4 learners** for demos

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

## Getting started

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

Accounts and chat survive API restarts.

## Share this project

Anyone can view the code here:

- **Code (main):** https://github.com/reignayala/Bumblearn
- **Clone:** `git clone https://github.com/reignayala/Bumblearn.git`

# Bumblearn

**Find your perfect learning match.**  
Swipe through educators and learners — built for Philippine college programs.

## Live app (GitHub Pages)

**https://reignayala.github.io/Bumblearn/**

The frontend is hosted on GitHub Pages. Signup, login, chat, and saved data use the **Render API** at `https://bumblearn-api.onrender.com`.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React + TypeScript + Vite + Tailwind (GitHub Pages) |
| Backend | Node.js + Express + Socket.io (Render) |
| Database | PostgreSQL + Prisma |
| Auth | Email/password + JWT |

## Deploy the API (one-time)

GitHub Pages only serves static files — the API must run on Render:

1. Open **https://render.com/deploy?repo=https://github.com/reignayala/Bumblearn**
2. Sign in with GitHub and create the free `bumblearn-api` service + Postgres
3. Copy your service URL (e.g. `https://bumblearn-api-xxxx.onrender.com`)
4. In this repo go to **Settings → Secrets and variables → Actions → Variables**
5. Add `BUMBLEARN_API_URL` = your Render URL (no trailing slash)
6. Re-run the **Deploy GitHub Pages** workflow (or push to `main`)

## Local development

```bash
npm install
cp .env.example server/.env

docker compose up -d
npm run db:generate
npm run db:push

npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173
```

Open **http://localhost:5173/welcome** → sign up → choose Learn / Educate / Both → finish onboarding.

## Share

- **Live app:** https://reignayala.github.io/Bumblearn/
- **Code:** https://github.com/reignayala/Bumblearn

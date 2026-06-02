# 🌴 Backend Remote Job Roadmap

<div align="center">

**A 180-day, day-by-day interactive roadmap to land your first remote backend developer job.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Turso](https://img.shields.io/badge/Turso-LibSQL-4FF8D2?style=flat-square&logo=sqlite&logoColor=black)](https://turso.tech)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📖 About

This is my personal learning tracker built to keep myself accountable on the journey from **Junior Backend Developer** → **Remote Job**. Instead of a static checklist, I wanted something that:

- Breaks the 180-day journey into **clear daily tasks**
- Gives a specific **goal** and **4 hands-on exercises** for each day
- Saves my **progress and notes** to a real database (not just localStorage)
- Looks good enough that I actually want to open it every day

Built with **Next.js 14**, **Turso (SQLite at the edge)**, and deployed for free on **Vercel**.

---

## ✨ Features

| Feature | Description |
|---|---|
| ✅ **Day Tracker** | Click any day to mark it complete — saved instantly to the database |
| 🎯 **Daily Goals** | Each day has a single, clear outcome to achieve |
| 💪 **Exercises** | 4 specific hands-on tasks per day — not just "study this topic" |
| 📝 **Notes per Day** | Write what you learned, links, blockers — saved to Turso SQLite |
| 📊 **Progress Dashboard** | Overall %, streak counter, per-phase progress bars |
| 🔒 **Persistent Storage** | Works across devices and browser sessions via real database |
| 🗂️ **Phase Navigation** | Jump between the 5 phases with sticky nav tabs |

---

## 🗺️ The 5-Phase Roadmap

```
Phase 1 (Days 1–30)    → Foundation & Environment Setup
Phase 2 (Days 31–75)   → Core Backend Engineering
Phase 3 (Days 76–120)  → Build 2 Production-Grade Projects
Phase 4 (Days 121–160) → Profile Build & First Applications
Phase 5 (Days 161–180) → Interviews, Offers & Negotiation
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | Turso — LibSQL (SQLite at the edge) |
| **ORM** | Drizzle ORM |
| **Hosting** | Vercel (Hobby — free) |
| **Styling** | Inline styles + Google Fonts (Outfit + JetBrains Mono) |

---

## 📁 Project Structure

```
backend-roadmap/
├── app/
│   ├── layout.tsx                  # Root layout + Google Fonts
│   ├── page.tsx                    # Home page
│   ├── globals.css
│   └── api/
│       └── progress/
│           ├── route.ts            # GET — load all progress + notes
│           ├── toggle/route.ts     # POST — toggle a day done/undone
│           └── note/route.ts       # POST — save a note for a day
├── components/
│   └── RoadmapClient.tsx           # Full roadmap UI (client component)
├── lib/
│   ├── db.ts                       # Turso/LibSQL + Drizzle client
│   └── schema.ts                   # Database schema
├── drizzle/
│   └── migrate.sql                 # SQL to create tables (run once)
├── .env.example                    # Environment variable template
├── drizzle.config.ts               # Drizzle Kit config
└── package.json
```

---

## 🗄️ Database Schema

```sql
-- Tracks which days are marked complete
CREATE TABLE progress (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id       TEXT    NOT NULL UNIQUE,  -- e.g. "d1", "d42"
  is_done      INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT                       -- ISO timestamp
);

-- Stores personal notes per day
CREATE TABLE notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id     TEXT NOT NULL UNIQUE,
  content    TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL
);
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- [Turso CLI](https://docs.turso.tech/cli/introduction)

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/backend-roadmap.git
cd backend-roadmap

# 2. Install dependencies
npm install

# 3. Set up Turso (first time only)
turso auth signup
turso db create roadmap-db
turso db show roadmap-db           # → copy URL
turso db tokens create roadmap-db  # → copy token

# 4. Configure environment
cp .env.example .env.local
# Fill in TURSO_DATABASE_URL and TURSO_AUTH_TOKEN

# 5. Create database tables (first time only)
turso db shell roadmap-db < drizzle/migrate.sql

# 6. Start the dev server
npm run dev
# → http://localhost:3000
```

---

## ☁️ Deploy to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
gh repo create backend-roadmap --public --push
```

### Step 2 — Create Turso database

```bash
turso auth signup
turso db create roadmap-db
turso db show roadmap-db           # → note the URL
turso db tokens create roadmap-db  # → note the token
turso db shell roadmap-db < drizzle/migrate.sql
```

### Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Add these **Environment Variables** before deploying:

| Variable | Value |
|---|---|
| `TURSO_DATABASE_URL` | `libsql://roadmap-db-yourname.turso.io` |
| `TURSO_AUTH_TOKEN` | `your-token-here` |

4. Click **Deploy** ✅

Your roadmap will be live at `https://backend-roadmap-xyz.vercel.app` 🎉

---

## 💡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/progress` | Fetch all completed days + notes |
| `POST` | `/api/progress/toggle` | Toggle a day done/undone |
| `POST` | `/api/progress/note` | Save or update a note for a day |

**Toggle request body:**
```json
{ "dayId": "d18", "isDone": true }
```

**Note request body:**
```json
{ "dayId": "d18", "content": "Built JWT auth from scratch today!" }
```

---

## 💰 Cost

| Service | Plan | Cost |
|---|---|---|
| Vercel | Hobby (free) | $0 / month |
| Turso | Free tier — 5GB, 500M reads/month | $0 / month |
| **Total** | | **$0 / month** |

---

## 🔧 Available Scripts

```bash
npm run dev        # Start development server at localhost:3000
npm run build      # Build for production
npm run start      # Start production server
npm run db:push    # Push schema changes to Turso (via Drizzle Kit)
npm run db:studio  # Open Drizzle Studio (visual DB browser)
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module '@libsql/client'` | Run `npm install` |
| `TURSO_DATABASE_URL is not defined` | Check `.env.local` exists and has correct values |
| `turso: command not found` | Restart terminal after CLI install |
| Tables don't exist error | Re-run `turso db shell roadmap-db < drizzle/migrate.sql` |
| Port 3000 in use | Run `npm run dev -- -p 3001` |

---

## 📄 License

MIT — free to use, fork, and adapt for your own learning journey.

---

<div align="center">

Built with ❤️ from **Batubulan Gianyar, Bali** 🌴 · Aiming for **Remote** 🌏

</div>

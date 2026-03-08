# DevLog

DevLog is a lightweight project tracking app for developers. It helps you organize projects, write progress logs, save useful resources, and monitor activity from a dashboard in one place.

## What is this?

This repository contains a full-stack Next.js application (App Router) with a Prisma + SQLite backend.

With DevLog, you can:
- Create and manage projects.
- Add development log entries for each project.
- Save links/resources by project.
- View high-level stats and contribution-style activity on the dashboard.

## Tech Stack

- **Framework:** Next.js 16 + React 19
- **Language:** TypeScript
- **Database:** SQLite (via Prisma + better-sqlite3 adapter)
- **Styling/UI:** Tailwind CSS + component primitives

## Clone and Run Locally

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd DevLog
```

### 2) Install dependencies

```bash
npm install
```

### 3) Generate Prisma client (recommended)

```bash
npx prisma generate
```

### 4) Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Database Notes

- Prisma is configured for SQLite.
- The app points to `file:./dev.db`.
- If you need to reset or re-apply schema changes:

```bash
npx prisma migrate dev
```

## Project Structure (high level)

- `app/` – routes, pages, and API endpoints
- `components/` – reusable UI and layout components
- `lib/` – shared utilities and database client setup
- `prisma/` – schema and migrations

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

---
If you want, I can also add a short **API endpoint reference** and a **screenshots** section to this README.

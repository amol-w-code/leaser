# Pocket — a budget & expense tracker

A budgets-and-expenses dashboard: sidebar navigation, stat cards, an activity
bar chart, and budget cards with emoji icons and progress bars. Built with
Next.js (App Router) + TypeScript + Tailwind.

## What it does

- **Dashboard** — total budget, total spend, and budget count at a glance,
  plus an activity chart (budgeted amount vs. actual spend per category) and
  your two most recent budgets
- **Budgets** — grid of budget cards with an emoji, spend/remaining, and a
  progress bar; "Create New Budget" opens a modal with a full emoji picker
- **Expenses** — every expense across all budgets, or scoped to a single
  budget (click a budget card to drill in); add or delete expenses
- Data persists in the browser via `localStorage` — no backend needed to try it out
- Seeded with sample budgets/expenses on first load

## Run it locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 (redirects to `/dashboard`).

## Deploy to Vercel

1. Go to https://vercel.com/new and import the project.
2. Leave settings at their defaults (Next.js is auto-detected) and click **Deploy**.

No environment variables are required for this version.

## Where the data lives

Budgets and expenses are stored in `localStorage` (`lib/storage.ts`), scoped
to each visitor's browser. That's deliberate — it means you can deploy and
use the app today without setting up a database or auth first.

## Adding a real database (next step)

When you want data to sync across devices:

- **Database**: Postgres via [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Auth**: [Clerk](https://clerk.com) or Supabase Auth, if multiple people need separate accounts

Suggested schema:

```
budgets
  id          uuid primary key
  user_id     uuid references users(id)
  name        text
  emoji       text
  amount      numeric(10,2)
  created_at  date

expenses
  id          uuid primary key
  budget_id   uuid references budgets(id)
  name        text
  amount      numeric(10,2)
  date        date
```

The `Budget` and `Expense` types in `lib/types.ts` already match this shape,
so only `lib/storage.ts` and `lib/use-finance-data.ts` need to change —
swapped for `fetch` calls to API routes — the UI components stay the same.

## Project structure

```
app/
  page.tsx                          Redirects to /dashboard
  layout.tsx                        Root layout, loads fonts
  globals.css                       Design tokens
  dashboard/
    layout.tsx                      Sidebar + mobile nav shell
    page.tsx                        Dashboard (stat cards, activity chart, latest budgets)
    budgets/page.tsx                Budgets grid + create modal
    expenses/page.tsx               All expenses
    expenses/[budgetId]/page.tsx    Expenses scoped to one budget
components/
  sidebar.tsx, mobile-nav.tsx, topbar.tsx
  stat-card.tsx, budget-card.tsx, activity-chart.tsx
  create-budget-modal.tsx           Uses emoji-picker-react
  add-expense-modal.tsx
lib/
  types.ts             Budget & Expense types
  storage.ts           localStorage load/save + seed data
  use-finance-data.ts  Shared hook: state, persistence, computed stats
  utils.ts             Formatting helpers
```

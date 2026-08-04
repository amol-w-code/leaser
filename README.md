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

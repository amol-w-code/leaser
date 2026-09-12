"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/dashboard/budgets", label: "Budgets", icon: BudgetsIcon },
  { href: "/dashboard/expenses", label: "Expenses", icon: ExpensesIcon },
  { href: "/dashboard/ledger", label: "Ledger", icon: LedgerIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-slide hidden md:flex md:w-64 shrink-0 flex-col border-r border-border bg-white dark-card px-5 py-6">
      <Link href="/dashboard" className="group flex items-center gap-2.5 px-2 mb-8">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow transition-transform group-hover:scale-105">
          <WalletIcon />
        </span>
        <span className="font-display text-xl font-semibold text-ink">Leaser</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-brand-light text-brand-dark nav-active-accent"
                  : "text-ink-soft hover:bg-surface hover:text-ink hover:translate-x-0.5"
              }`}
            >
              <Icon active={active} />
              {label}
              {active && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-brand" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <ThemeToggle />
        <Link
          href="/dashboard/budgets"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface hover:text-ink transition-colors"
        >
          <UpgradeIcon />
          Upgrade
        </Link>
        <button
          onClick={() => signOut(auth)}
          className="btn-press flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-negative hover:bg-red-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="13" r="1.3" fill="currentColor" />
    </svg>
  );
}

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function BudgetsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21c4.5-2.7 8-6.4 8-10.7A5.3 5.3 0 0014.7 5c-1.1 0-2.1.4-2.9 1.1L12 6.5l-.2-.4A5.3 5.3 0 004.7 5 5.3 5.3 0 004 10.3C4 14.6 7.5 18.3 12 21z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ExpensesIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 12h6M9 16h6M9 8h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function UpgradeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l7 4v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V7l7-4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9.5 12l1.8 1.8L14.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19 12a6.8 6.8 0 00-.1-1l1.9-1.5-2-3.4-2.3 1a6.8 6.8 0 00-1.7-1l-.3-2.5h-4l-.3 2.5a6.8 6.8 0 00-1.7 1l-2.3-1-2 3.4 1.9 1.5a6.8 6.8 0 000 2l-1.9 1.5 2 3.4 2.3-1a6.8 6.8 0 001.7 1l.3 2.5h4l.3-2.5a6.8 6.8 0 001.7-1l2.3 1 2-3.4-1.9-1.5c.1-.3.1-.7.1-1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LedgerIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

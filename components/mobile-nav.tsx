"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { href: "/dashboard", label: "Overview", icon: DashboardIcon },
    { href: "/dashboard/budgets", label: "Budgets", icon: BudgetsIcon },
    { href: "/dashboard/expenses", label: "Expenses", icon: ExpensesIcon },
    { href: "/dashboard/ledger", label: "Ledger", icon: LedgerIcon },
    { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe pt-2">
      <nav className="glass-card mb-4 flex items-center justify-around rounded-[24px] p-2.5 shadow-xl mx-auto max-w-sm">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors btn-press"
            >
              {active && (
                <span className="absolute inset-0 rounded-xl bg-brand/10 transition-transform scale-100" />
              )}
              <span className={`relative z-10 transition-colors duration-300 ${active ? "text-brand" : "text-ink-faint group-hover:text-ink-soft"}`}>
                <Icon active={active} />
              </span>
              {active && (
                <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-brand breathe" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
      <rect x="13" y="3" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
      <rect x="3" y="13" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
      <rect x="13" y="13" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
    </svg>
  );
}

function BudgetsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21c4.5-2.7 8-6.4 8-10.7A5.3 5.3 0 0014.7 5c-1.1 0-2.1.4-2.9 1.1L12 6.5l-.2-.4A5.3 5.3 0 004.7 5 5.3 5.3 0 004 10.3C4 14.6 7.5 18.3 12 21z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.2 : 0}
      />
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ExpensesIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.2 : 0}
      />
      <path d="M9 12h6M9 16h6M9 8h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.2 : 0}
      />
    </svg>
  );
}

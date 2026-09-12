"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/dashboard/budgets",
    label: "Budgets",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c4.5-2.7 8-6.4 8-10.7A5.3 5.3 0 0014.7 5c-1.1 0-2.1.4-2.9 1.1L12 6.5l-.2-.4A5.3 5.3 0 004.7 5 5.3 5.3 0 004 10.3C4 14.6 7.5 18.3 12 21z" />
        <circle cx="12" cy="11" r="2.2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/expenses",
    label: "Expenses",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path d="M9 12h6M9 16h6M9 8h3" />
      </svg>
    ),
  },
  {
    href: "/dashboard/ledger",
    label: "Ledger",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M19 12a6.8 6.8 0 00-.1-1l1.9-1.5-2-3.4-2.3 1a6.8 6.8 0 00-1.7-1l-.3-2.5h-4l-.3 2.5a6.8 6.8 0 00-1.7 1l-2.3-1-2 3.4 1.9 1.5a6.8 6.8 0 000 2l-1.9 1.5 2 3.4 2.3-1a6.8 6.8 0 001.7 1l.3 2.5h4l.3-2.5a6.8 6.8 0 001.7-1l2.3 1 2-3.4-1.9-1.5c.1-.3.1-.7.1-1z" />
      </svg>
    ),
  },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex border-t border-border bg-white/80 backdrop-blur-xl dark-card safe-bottom">
      {ITEMS.map((item) => {
        const active =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
              active ? "text-brand" : "text-ink-faint"
            }`}
          >
            {item.icon(active)}
            <span className="text-[10px] font-medium">{item.label}</span>
            {active && (
              <span className="absolute bottom-1 h-1 w-1 rounded-full bg-brand" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

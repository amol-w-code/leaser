"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/use-profile";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/dashboard/budgets", label: "Budgets", icon: BudgetsIcon },
  { href: "/dashboard/expenses", label: "Expenses", icon: ExpensesIcon },
  { href: "/dashboard/ledger", label: "Ledger", icon: LedgerIcon },
  { href: "/dashboard/ai-advisor", label: "AI Advisor", icon: AIAdvisorIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { profile } = useProfile();

  const avatarUrl = user?.photoURL || profile?.profileImage;
  const displayName = user?.displayName || profile?.fullName || "User";
  const email = user?.email || profile?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="sidebar-slide hidden md:flex md:w-[260px] shrink-0 flex-col border-r border-border bg-sidebar dark-card">
      {/* Logo */}
      <div className="px-5 pt-6 pb-2">
        <Link href="/dashboard" className="group flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(91,79,233,0.3)]">
            <WalletIcon />
          </span>
          <span className="font-display text-xl font-semibold text-ink">Leaser</span>
        </Link>
      </div>

      {/* User profile mini card */}
      <div className="mx-5 mt-4 mb-2">
        <div className="flex items-center gap-3 rounded-2xl bg-surface/80 p-3 transition-colors hover:bg-surface">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-9 w-9 rounded-xl object-cover ring-2 ring-brand/10"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-purple-600 text-sm font-semibold text-white">
              {initial}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{displayName}</p>
            <p className="truncate text-xs text-ink-faint">{email}</p>
          </div>
        </div>
      </div>

      <div className="sidebar-divider mx-5" />

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-3 mt-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                active
                  ? "bg-brand/[0.08] text-brand nav-active-accent"
                  : "text-ink-soft hover:bg-surface hover:text-ink hover:translate-x-0.5"
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                active
                  ? "bg-brand/[0.12] text-brand"
                  : "text-ink-faint group-hover:text-ink-soft"
              }`}>
                <Icon active={active} />
              </span>
              {label}
              {active && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-brand breathe" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto px-3 pb-5 space-y-0.5">
        <div className="sidebar-divider mx-2 mb-2" />
        <ThemeToggle />

        {/* Upgrade CTA */}
        <div className="mx-2 mt-2 mb-2">
          <div className="upgrade-shimmer relative rounded-2xl bg-gradient-to-r from-brand to-purple-600 p-4 text-white overflow-hidden">
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />
            <p className="relative text-xs font-semibold mb-1">Upgrade to Pro</p>
            <p className="relative text-[11px] text-white/70 leading-relaxed">Unlock AI insights, export reports & more.</p>
            <button className="relative mt-3 rounded-lg bg-white/20 px-3 py-1.5 text-[11px] font-medium hover:bg-white/30 transition-colors btn-press">
              Learn More →
            </button>
          </div>
        </div>

        <button
          onClick={() => signOut(auth)}
          className="btn-press flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-negative/80 hover:text-negative hover:bg-red-50/80 transition-all duration-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <rect x="13" y="3" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <rect x="3" y="13" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <rect x="13" y="13" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
    </svg>
  );
}

function BudgetsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21c4.5-2.7 8-6.4 8-10.7A5.3 5.3 0 0014.7 5c-1.1 0-2.1.4-2.9 1.1L12 6.5l-.2-.4A5.3 5.3 0 004.7 5 5.3 5.3 0 004 10.3C4 14.6 7.5 18.3 12 21z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.15 : 0}
      />
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ExpensesIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.1 : 0}
      />
      <path d="M9 12h6M9 16h6M9 8h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
        fillOpacity={active ? 0.1 : 0}
      />
    </svg>
  );
}

function AIAdvisorIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  );
}

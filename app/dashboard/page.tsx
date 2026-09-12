"use client";

import Link from "next/link";
import { TopBar } from "@/components/topbar";
import { StatCard } from "@/components/stat-card";
import { ActivityChart } from "@/components/activity-chart";
import { useFinanceData } from "@/lib/use-finance-data";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/use-profile";

export default function DashboardPage() {
  const { loaded, budgetsWithStats, totalBudget, totalSpend } = useFinanceData();
  const { user } = useAuth();
  const { profile } = useProfile();

  if (!loaded) return null;

  const displayName = user?.displayName || profile.fullName || "there";
  const latest = [...budgetsWithStats].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 2);

  return (
    <div>
      <TopBar
        title={`Hi, ${displayName} ✌️`}
        subtitle="Here's what happening with your money. Let's manage your expenses."
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Total Budget" value={totalBudget} icon={<PiggyIcon />} delay={0} />
        <StatCard label="Total Spend" value={totalSpend} icon={<ReceiptIcon />} delay={80} />
        <StatCard label="No. of Budgets" value={budgetsWithStats.length} isCurrency={false} icon={<WalletIcon />} delay={160} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="fade-in-up rounded-card border border-border bg-white p-6 shadow-card dark-card" style={{ animationDelay: "200ms" }}>
          <h2 className="font-semibold text-ink mb-6">Activity</h2>
          <ActivityChart budgets={budgetsWithStats} />
        </div>

        <div className="fade-in-up" style={{ animationDelay: "280ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Latest Budgets</h2>
            <Link href="/dashboard/budgets" className="text-xs text-brand font-medium hover:underline transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {latest.length === 0 && (
              <div className="rounded-card border border-dashed border-border bg-white/50 p-8 text-center dark-card">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-2xl">
                  📊
                </div>
                <p className="text-sm font-medium text-ink-soft">No budgets yet</p>
                <p className="text-xs text-ink-faint mt-1">Create your first budget to see it here.</p>
              </div>
            )}
            {latest.map((b, i) => {
              const overBudget = b.remaining < 0;
              return (
                <Link
                  key={b.id}
                  href={`/dashboard/expenses/${b.id}`}
                  className="block rounded-card border border-border bg-white p-4 shadow-card hover-lift transition-all dark-card"
                  style={{ animationDelay: `${320 + i * 80}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-lg">
                        {b.emoji}
                      </span>
                      <div>
                        <p className="font-medium text-ink text-sm">{b.name}</p>
                        <p className="text-xs text-ink-faint">
                          {b.itemCount} {b.itemCount === 1 ? "Item" : "Items"}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-brand text-sm">{formatCurrency(b.amount)}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
                    <span>{formatCurrency(b.spent)} Spent</span>
                    <span className={overBudget ? "text-negative font-medium" : ""}>
                      {overBudget
                        ? `${formatCurrency(Math.abs(b.remaining))} Over`
                        : `${formatCurrency(b.remaining)} Remaining`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-pill bg-track overflow-hidden">
                    <div
                      className={`h-full rounded-pill progress-fill ${overBudget ? "bg-negative" : "bg-brand"}`}
                      style={{ width: `${Math.min(100, Math.round(b.percentUsed))}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PiggyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12a5 5 0 015-5h3.5c2 0 3.5.8 4.5 2h1.5l1.5 2-1.5 1.5H18a5 5 0 01-1.5 3.5V18h-2v-1.5a8 8 0 01-2 .25H9v1.25H7V16a5 5 0 01-3-4z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="10.2" r="0.7" fill="white" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h12v18l-2-1.3L14 21l-2-1.3L10 21l-2-1.3L6 21V3z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 12h6" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="13" r="1.2" fill="white" />
    </svg>
  );
}

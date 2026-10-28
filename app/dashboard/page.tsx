"use client";

import Link from "next/link";
import { TopBar } from "@/components/topbar";
import { StatCard } from "@/components/stat-card";
import { ActivityChart } from "@/components/activity-chart";
import { useFinanceData } from "@/lib/use-finance-data";
import { useTransactions } from "@/lib/use-transactions";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/use-profile";
import { useAIInsights } from "@/lib/use-ai-insights";

export default function DashboardPage() {
  const { loaded, budgetsWithStats, expenses, totalBudget, totalSpend } = useFinanceData();
  const { loaded: txLoaded, transactions, income, expenses: monthExp, balance, categoryTotals, month } = useTransactions();
  const { user } = useAuth();
  const { profile } = useProfile();

  const insightsCtx = {
    budgets: budgetsWithStats,
    expenses,
    transactions: transactions || [],
    currency: profile.currency || "USD",
    monthLabel: month?.toLocaleDateString("en", { month: "long", year: "numeric" }) || "",
    totalBudget,
    totalSpend,
    monthIncome: income || 0,
    monthExpenses: monthExp || 0,
    monthBalance: balance || 0,
    categoryTotals: categoryTotals || [],
  };

  const { insights, loading: insightsLoading, configured: aiConfigured } = useAIInsights(insightsCtx, loaded && txLoaded);

  if (!loaded) return null;

  const displayName = user?.displayName || profile.fullName || "there";
  const latest = [...budgetsWithStats].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 2);
  const savingsRate = totalBudget > 0 ? Math.round(((totalBudget - totalSpend) / totalBudget) * 100) : 0;

  const insightColors: Record<string, {bg: string, border: string, text: string}> = {
    tip: { bg: "from-blue-500/10 to-cyan-500/10", border: "border-blue-200/60", text: "text-blue-600" },
    warning: { bg: "from-amber-500/10 to-orange-500/10", border: "border-amber-200/60", text: "text-amber-600" },
    success: { bg: "from-emerald-500/10 to-green-500/10", border: "border-emerald-200/60", text: "text-emerald-600" },
    info: { bg: "from-brand/10 to-purple-500/10", border: "border-brand/20", text: "text-brand" },
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div>
      <TopBar
        title={`${greeting()}, ${displayName} 👋`}
        subtitle="Here's what's happening with your money. Let's manage your expenses."
      />

      {/* Quick Summary Banner */}
      <div className="fade-in-up mb-6 relative overflow-hidden rounded-[20px] border border-border bg-white p-6 dark-card shadow-card" style={{ animationDelay: "60ms" }}>
        <div className="mesh-gradient absolute inset-0 opacity-50" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-1">Monthly Overview</p>
            <p className="text-2xl sm:text-3xl font-semibold text-ink font-mono tabular-nums">
              {formatCurrency(totalBudget - totalSpend)}
            </p>
            <p className="text-sm text-ink-soft mt-1">remaining across all budgets</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface/80 px-5 py-3">
              <span className="text-xs text-ink-faint font-medium">Savings</span>
              <span className={`text-lg font-semibold font-mono ${savingsRate >= 50 ? "text-positive" : savingsRate >= 20 ? "text-amber-500" : "text-negative"}`}>
                {savingsRate}%
              </span>
            </div>
            <Link
              href="/dashboard/budgets"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-purple-600 px-5 py-3 text-sm font-medium text-white shadow-glow hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 btn-press"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Budget
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Total Budget" value={totalBudget} icon={<PiggyIcon />} delay={100} />
        <StatCard label="Total Spend" value={totalSpend} icon={<ReceiptIcon />} delay={180} />
        <StatCard label="No. of Budgets" value={budgetsWithStats.length} isCurrency={false} icon={<WalletIcon />} delay={260} />
      </div>

      {/* Activity + Latest Budgets */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="fade-in-up rounded-[20px] border border-border bg-white p-6 shadow-card dark-card" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-ink font-display text-lg">Activity</h2>
            <span className="text-xs text-ink-faint font-medium px-2.5 py-1 rounded-full bg-surface">
              {budgetsWithStats.length} budget{budgetsWithStats.length !== 1 ? "s" : ""}
            </span>
          </div>
          <ActivityChart budgets={budgetsWithStats} />
        </div>

        <div className="fade-in-up" style={{ animationDelay: "380ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink font-display text-lg">Latest Budgets</h2>
            <Link href="/dashboard/budgets" className="text-xs text-brand font-medium hover:underline transition-colors flex items-center gap-1">
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="space-y-3">
            {latest.length === 0 && (
              <div className="rounded-[20px] border border-dashed border-border bg-white/50 p-8 text-center dark-card">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-2xl">
                  📊
                </div>
                <p className="text-sm font-medium text-ink-soft">No budgets yet</p>
                <p className="text-xs text-ink-faint mt-1.5">Create your first budget to see it here.</p>
              </div>
            )}
            {latest.map((b, i) => {
              const overBudget = b.remaining < 0;
              return (
                <Link
                  key={b.id}
                  href={`/dashboard/expenses/${b.id}`}
                  className="group block rounded-[20px] border border-border bg-white p-5 shadow-card transition-all duration-300 hover:shadow-[0_8px_30px_rgba(21,22,30,0.08)] hover:-translate-y-0.5 dark-card"
                  style={{ animationDelay: `${420 + i * 80}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-lg transition-transform duration-200 group-hover:scale-110">
                        {b.emoji}
                      </span>
                      <div>
                        <p className="font-medium text-ink text-sm">{b.name}</p>
                        <p className="text-xs text-ink-faint mt-0.5">
                          {b.itemCount} {b.itemCount === 1 ? "Item" : "Items"}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-brand text-sm font-mono">{formatCurrency(b.amount)}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-soft mb-2.5">
                    <span>{formatCurrency(b.spent)} Spent</span>
                    <span className={overBudget ? "text-negative font-medium" : ""}>
                      {overBudget
                        ? `${formatCurrency(Math.abs(b.remaining))} Over`
                        : `${formatCurrency(b.remaining)} Remaining`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-track overflow-hidden">
                    <div
                      className={`h-full rounded-full progress-fill transition-colors ${overBudget ? "bg-negative" : "bg-gradient-to-r from-brand to-purple-500"}`}
                      style={{ width: `${Math.min(100, Math.round(b.percentUsed))}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="fade-in-up mt-6" style={{ animationDelay: "460ms" }}>
        <div className="rounded-[20px] border border-border bg-white p-6 shadow-card dark-card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-ink font-display text-lg">AI Insights</h2>
                <p className="text-xs text-ink-faint">Powered by Gemini</p>
              </div>
            </div>
            <Link
              href="/dashboard/ai-advisor"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-purple-600 px-4 py-2 text-xs font-medium text-white shadow-glow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 btn-press"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
              </svg>
              Ask AI
            </Link>
          </div>

          {!aiConfigured ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-ink-soft mb-1">AI not configured</p>
              <p className="text-xs text-ink-faint">Add your Gemini API key in <code className="font-mono bg-surface px-1 py-0.5 rounded text-brand text-[11px]">.env.local</code> to see insights</p>
            </div>
          ) : insightsLoading ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-surface/50 p-4 dark-card">
                  <div className="shimmer h-4 w-20 rounded mb-3" />
                  <div className="shimmer h-3 w-full rounded mb-1.5" />
                  <div className="shimmer h-3 w-3/4 rounded" />
                </div>
              ))}
            </div>
          ) : insights.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {insights.map((insight, i) => {
                const colors = insightColors[insight.type] || insightColors.info;
                return (
                  <div
                    key={i}
                    className={`fade-in-up rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm`}
                    style={{ animationDelay: `${500 + i * 100}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{insight.icon}</span>
                      <h3 className={`text-xs font-semibold ${colors.text}`}>{insight.title}</h3>
                    </div>
                    <p className="text-xs text-ink-soft leading-relaxed">{insight.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-6 text-center">
              <p className="text-sm text-ink-soft">No insights available yet</p>
              <p className="text-xs text-ink-faint mt-1">Add some transactions and budgets to get started</p>
            </div>
          )}
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

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

  const displayName = user?.displayName || profile.fullName || "User";
  const latest = [...budgetsWithStats].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 2);

  return (
    <div>
      <TopBar title="Overview" />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Total Budget" value={totalBudget} delay={50} />
        <StatCard label="Total Spend" value={totalSpend} delay={100} />
        <StatCard label="Budgets" value={budgetsWithStats.length} isCurrency={false} delay={150} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Activity Chart */}
        <div className="fade-in-up rounded-card border border-border bg-white p-6 shadow-card dark-card" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-medium text-ink">Activity</h2>
          </div>
          <ActivityChart budgets={budgetsWithStats} />
        </div>

        {/* Latest Budgets */}
        <div className="fade-in-up" style={{ animationDelay: "250ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-ink">Recent Budgets</h2>
            <Link href="/dashboard/budgets" className="text-xs text-ink-soft hover:text-ink transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {latest.length === 0 && (
              <div className="rounded-card border border-border bg-white p-6 text-center dark-card shadow-card">
                <p className="text-sm text-ink-soft">No budgets yet</p>
                <p className="text-xs text-ink-faint mt-1">Create one to see it here.</p>
              </div>
            )}
            {latest.map((b, i) => {
              const overBudget = b.remaining < 0;
              return (
                <Link
                  key={b.id}
                  href={`/dashboard/expenses/${b.id}`}
                  className="group block rounded-card border border-border bg-white p-4 shadow-card hover-lift dark-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{b.emoji}</span>
                      <p className="font-medium text-ink text-sm">{b.name}</p>
                    </div>
                    <p className="font-mono font-medium text-ink text-sm">{formatCurrency(b.amount)}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-ink-soft mb-2">
                    <span>{formatCurrency(b.spent)}</span>
                    <span className={overBudget ? "text-negative font-medium" : ""}>
                      {overBudget ? "Over budget" : `${formatCurrency(b.remaining)} left`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-track overflow-hidden">
                    <div
                      className={`h-full rounded-full progress-fill ${overBudget ? "bg-negative" : "bg-ink"}`}
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
      <div className="fade-in-up mt-6" style={{ animationDelay: "300ms" }}>
        <div className="rounded-card border border-border bg-white p-6 shadow-card dark-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-medium text-ink flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
              Insights
            </h2>
            <Link
              href="/dashboard/ai-advisor"
              className="text-xs text-ink-soft hover:text-ink transition-colors"
            >
              Ask AI
            </Link>
          </div>

          {!aiConfigured ? (
            <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center">
              <p className="text-sm font-medium text-ink">AI not configured</p>
              <p className="text-xs text-ink-faint mt-1">Add your Gemini API key in .env.local</p>
            </div>
          ) : insightsLoading ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-surface/50 p-4">
                  <div className="shimmer h-3 w-16 bg-border rounded mb-2" />
                  <div className="shimmer h-3 w-full bg-border rounded mb-1" />
                  <div className="shimmer h-3 w-2/3 bg-border rounded" />
                </div>
              ))}
            </div>
          ) : insights.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {insights.map((insight, i) => (
                <div
                  key={insight.id}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm">{insight.icon}</span>
                    <h3 className="text-xs font-semibold text-ink">{insight.title}</h3>
                  </div>
                  <p className="text-[13px] text-ink-soft leading-relaxed">{insight.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-soft">No insights available yet. Check back when you have more data.</p>
          )}
        </div>
      </div>
    </div>
  );
}

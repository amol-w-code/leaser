"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AddExpenseModal } from "@/components/add-expense-modal";
import { useFinanceData } from "@/lib/use-finance-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BudgetExpensesPage() {
  const params = useParams<{ budgetId: string }>();
  const router = useRouter();
  const { loaded, budgets, expenses, addExpense, deleteExpense } = useFinanceData();
  const [showAdd, setShowAdd] = useState(false);

  if (!loaded) return null;

  const budget = budgets.find((b) => b.id === params.budgetId);
  const items = expenses
    .filter((e) => e.budgetId === params.budgetId)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!budget) {
    return (
      <div className="rounded-card border border-border bg-white p-12 text-center text-ink-faint">
        <p className="mb-4">That budget doesn&apos;t exist anymore.</p>
        <Link href="/dashboard/budgets" className="text-brand font-medium text-sm">
          Back to budgets
        </Link>
      </div>
    );
  }

  const spent = items.reduce((s, e) => s + e.amount, 0);
  const remaining = budget.amount - spent;

  return (
    <div>
      <button
        onClick={() => router.push("/dashboard/budgets")}
        className="text-sm text-ink-soft hover:text-ink mb-4 flex items-center gap-1"
      >
        ← Back to budgets
      </button>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-2xl">
            {budget.emoji}
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{budget.name}</h1>
            <p className="text-ink-soft text-sm mt-1">
              {formatCurrency(spent)} spent of {formatCurrency(budget.amount)} ·{" "}
              <span className={remaining < 0 ? "text-negative" : ""}>
                {remaining < 0
                  ? `${formatCurrency(Math.abs(remaining))} over`
                  : `${formatCurrency(remaining)} remaining`}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded-xl bg-brand text-white px-4 py-2.5 text-sm font-medium hover:bg-brand-dark transition-colors whitespace-nowrap"
        >
          + Add Expense
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-card border border-border bg-white p-12 text-center text-ink-faint">
          No expenses logged against this budget yet.
        </div>
      ) : (
        <div className="rounded-card border border-border bg-white shadow-card overflow-hidden">
          {items.map((e) => (
            <div
              key={e.id}
              className="group flex items-center justify-between px-5 h-[56px] border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-ink-faint w-20">{formatDate(e.date)}</span>
                <span className="text-sm text-ink">{e.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-ink">{formatCurrency(e.amount)}</span>
                <button
                  onClick={() => deleteExpense(e.id)}
                  aria-label={`Delete ${e.name}`}
                  className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-ink-faint hover:text-negative text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddExpenseModal
          budgets={budgets}
          defaultBudgetId={budget.id}
          onCreate={addExpense}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

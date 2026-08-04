"use client";

import { useState } from "react";
import { TopBar } from "@/components/topbar";
import { AddExpenseModal } from "@/components/add-expense-modal";
import { EditExpenseModal } from "@/components/edit-expense-modal";
import { useFinanceData } from "@/lib/use-finance-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ExpensesPage() {
  const { loaded, budgets, expenses, addExpense, updateExpense, deleteExpense } = useFinanceData();
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState<null | (typeof expenses)[number]>(null);

  if (!loaded) return null;

  const budgetById = new Map(budgets.map((b) => [b.id, b]));
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">All Expenses</h1>
          <p className="text-ink-soft text-sm mt-1.5">Every expense across all your budgets.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded-xl bg-brand text-white px-4 py-2.5 text-sm font-medium hover:bg-brand-dark transition-colors whitespace-nowrap"
        >
          + Add Expense
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-card border border-border bg-white p-12 text-center text-ink-faint">
          No expenses yet. Add your first one.
        </div>
      ) : (
        <div className="rounded-card border border-border bg-white shadow-card overflow-hidden">
          <div className="grid grid-cols-[90px_1fr_130px_100px_36px] gap-3 px-5 py-3 text-xs uppercase tracking-wide text-ink-faint border-b border-border">
            <span>Date</span>
            <span>Expense</span>
            <span>Budget</span>
            <span className="text-right">Amount</span>
            <span />
          </div>
          {sorted.map((e) => {
            const b = budgetById.get(e.budgetId);
            return (
              <div
                key={e.id}
                className="group grid grid-cols-[90px_1fr_130px_100px_36px] gap-3 px-5 items-center h-[56px] border-b border-border last:border-b-0"
              >
                <span className="text-sm text-ink-faint">{formatDate(e.date)}</span>
                <span className="text-sm text-ink truncate">{e.name}</span>
                <span className="flex items-center gap-1.5 text-sm text-ink-soft">
                  <span>{b?.emoji}</span>
                  {b?.name ?? "—"}
                </span>
                <span className="text-right text-sm font-medium text-ink">{formatCurrency(e.amount)}</span>
                <div className="flex items-center gap-2 justify-self-end">
                  <button
                    onClick={() => setEditingExpense(e)}
                    className="text-xs font-medium text-brand hover:text-brand-dark"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExpense(e.id)}
                    aria-label={`Delete ${e.name}`}
                    className="text-ink-faint hover:text-negative text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <AddExpenseModal budgets={budgets} onCreate={addExpense} onClose={() => setShowAdd(false)} />
      )}

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          budgets={budgets}
          onSave={(updated) => {
            updateExpense(updated);
            setEditingExpense(null);
          }}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}

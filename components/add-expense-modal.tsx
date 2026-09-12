"use client";

import { useState, FormEvent } from "react";
import { Budget, Expense } from "@/lib/types";
import { getCurrencySymbol } from "@/lib/utils";

interface AddExpenseModalProps {
  budgets: Budget[];
  defaultBudgetId?: string;
  onCreate: (expense: Omit<Expense, "id">) => void;
  onClose: () => void;
}

export function AddExpenseModal({
  budgets,
  defaultBudgetId,
  onCreate,
  onClose,
}: AddExpenseModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [budgetId, setBudgetId] = useState(defaultBudgetId ?? budgets[0]?.id ?? "");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!name.trim()) {
      setError("Give the expense a name.");
      return;
    }
    if (!parsed || parsed <= 0) {
      setError("Amount needs to be greater than zero.");
      return;
    }
    if (!budgetId) {
      setError("Choose a budget for this expense.");
      return;
    }
    onCreate({ name: name.trim(), amount: parsed, budgetId, date });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-ink/40 backdrop-blur-[2px] p-4 overflow-y-auto"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="rise-in relative w-full max-w-md bg-white rounded-card shadow-xl mt-16 sm:mt-0 p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-ink">Add Expense</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-faint hover:text-ink text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-ink">Expense Name</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Groceries"
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-ink placeholder:text-ink-faint focus:border-brand focus:bg-white"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-ink">Amount</span>
              <div className="mt-1.5 flex items-center rounded-xl border border-border bg-surface px-3.5 focus-within:border-brand focus-within:bg-white">
                <span className="text-ink-faint mr-1">{getCurrencySymbol()}</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full bg-transparent py-2.5 text-ink outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-ink focus:border-brand focus:bg-white"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-ink">Budget</span>
            <select
              value={budgetId}
              onChange={(e) => setBudgetId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-ink focus:border-brand focus:bg-white"
            >
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.emoji} {b.name}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm text-negative">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand text-white py-3 font-medium hover:bg-brand-dark transition-colors"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}

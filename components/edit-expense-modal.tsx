"use client";

import { useEffect, useState, FormEvent } from "react";
import { Budget, Expense } from "@/lib/types";

interface EditExpenseModalProps {
  expense: Expense;
  budgets: Budget[];
  onSave: (expense: Expense) => void;
  onClose: () => void;
}

export function EditExpenseModal({ expense, budgets, onSave, onClose }: EditExpenseModalProps) {
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(String(expense.amount));
  const [budgetId, setBudgetId] = useState(expense.budgetId);
  const [date, setDate] = useState(expense.date);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(expense.name);
    setAmount(String(expense.amount));
    setBudgetId(expense.budgetId);
    setDate(expense.date);
  }, [expense]);

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
    onSave({ ...expense, name: name.trim(), amount: parsed, budgetId, date });
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
          <h2 className="text-lg font-semibold text-ink">Edit Expense</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-faint hover:text-ink text-xl leading-none">
            ×
          </button>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-ink">Expense Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-ink focus:border-brand focus:bg-white"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-ink">Amount</span>
              <div className="mt-1.5 flex items-center rounded-xl border border-border bg-surface px-3.5 focus-within:border-brand focus-within:bg-white">
                <span className="text-ink-faint mr-1">$</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
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

          <button type="submit" className="w-full rounded-xl bg-brand text-white py-3 font-medium hover:bg-brand-dark transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

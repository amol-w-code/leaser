"use client";

import { useEffect, useMemo, useState } from "react";
import { Budget, BudgetWithStats, Expense } from "./types";
import { loadBudgets, saveBudgets, loadExpenses, saveExpenses } from "./storage";

export function useFinanceData() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBudgets(loadBudgets());
    setExpenses(loadExpenses());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveBudgets(budgets);
  }, [budgets, loaded]);

  useEffect(() => {
    if (loaded) saveExpenses(expenses);
  }, [expenses, loaded]);

  const budgetsWithStats: BudgetWithStats[] = useMemo(() => {
    return budgets.map((b) => {
      const items = expenses.filter((e) => e.budgetId === b.id);
      const spent = items.reduce((s, e) => s + e.amount, 0);
      return {
        ...b,
        spent,
        remaining: b.amount - spent,
        itemCount: items.length,
        percentUsed: b.amount > 0 ? (spent / b.amount) * 100 : 0,
      };
    });
  }, [budgets, expenses]);

  function addBudget(b: Omit<Budget, "id" | "createdAt">) {
    setBudgets((prev) => [
      ...prev,
      { ...b, id: crypto.randomUUID(), createdAt: new Date().toISOString().slice(0, 10) },
    ]);
  }

  function deleteBudget(id: string) {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    setExpenses((prev) => prev.filter((e) => e.budgetId !== id));
  }

  function updateBudget(updated: Budget) {
    setBudgets((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }

  function addExpense(e: Omit<Expense, "id">) {
    setExpenses((prev) => [...prev, { ...e, id: crypto.randomUUID() }]);
  }

  function updateExpense(updated: Expense) {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);

  return {
    loaded,
    budgets,
    expenses,
    budgetsWithStats,
    totalBudget,
    totalSpend,
    addBudget,
    deleteBudget,
    updateBudget,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}

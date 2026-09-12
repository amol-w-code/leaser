"use client";

import { useEffect, useMemo, useState } from "react";
import { Budget, BudgetWithStats, Expense } from "./types";
import { useAuth } from "./auth-context";
import {
  subscribeBudgets,
  subscribeExpenses,
  saveBudgetToFirestore,
  deleteBudgetFromFirestore,
  saveExpenseToFirestore,
  deleteExpenseFromFirestore,
  seedFirestoreData,
} from "./firestore-storage";

export function useFinanceData() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Subscribe to Firestore real-time data
  useEffect(() => {
    if (!uid) {
      setBudgets([]);
      setExpenses([]);
      setLoaded(false);
      return;
    }

    let seeded = false;

    const unsub1 = subscribeBudgets(uid, (b) => {
      setBudgets(b);
      // Seed demo data if first time (empty collection)
      if (!seeded && b.length === 0) {
        seeded = true;
        seedFirestoreData(uid);
      }
      setLoaded(true);
    });

    const unsub2 = subscribeExpenses(uid, (e) => {
      setExpenses(e);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [uid]);

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
    if (!uid) return;
    const newBudget: Budget = {
      ...b,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    saveBudgetToFirestore(uid, newBudget);
  }

  function deleteBudget(id: string) {
    if (!uid) return;
    deleteBudgetFromFirestore(uid, id);
  }

  function updateBudget(updated: Budget) {
    if (!uid) return;
    saveBudgetToFirestore(uid, updated);
  }

  function addExpense(e: Omit<Expense, "id">) {
    if (!uid) return;
    const newExpense: Expense = { ...e, id: crypto.randomUUID() };
    saveExpenseToFirestore(uid, newExpense);
  }

  function updateExpense(updated: Expense) {
    if (!uid) return;
    saveExpenseToFirestore(uid, updated);
  }

  function deleteExpense(id: string) {
    if (!uid) return;
    deleteExpenseFromFirestore(uid, id);
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

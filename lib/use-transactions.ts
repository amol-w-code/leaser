"use client";

import { useEffect, useMemo, useState } from "react";
import { Transaction } from "./types";
import { useAuth } from "./auth-context";
import {
  subscribeTransactions,
  saveTransactionToFirestore,
  deleteTransactionFromFirestore,
} from "./firestore-storage";
import { isSameMonth } from "./utils";

export function useTransactions() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [month, setMonth] = useState(() => new Date());

  useEffect(() => {
    if (!uid) {
      setTransactions([]);
      setLoaded(false);
      return;
    }

    const unsub = subscribeTransactions(uid, (txns) => {
      setTransactions(txns);
      setLoaded(true);
    });

    return () => unsub();
  }, [uid]);

  const monthTransactions = useMemo(
    () => transactions.filter((t) => isSameMonth(t.date, month)),
    [transactions, month]
  );

  const income = monthTransactions
    .filter((t) => t.kind === "credit")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = monthTransactions
    .filter((t) => t.kind === "debit")
    .reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of monthTransactions) {
      if (t.kind !== "debit") continue;
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
    return Array.from(map.entries()).map(([category, total]) => ({ category, total }));
  }, [monthTransactions]);

  function addTransaction(t: Omit<Transaction, "id">) {
    if (!uid) return;
    const newTxn: Transaction = { ...t, id: crypto.randomUUID() };
    saveTransactionToFirestore(uid, newTxn);
  }

  function deleteTransaction(id: string) {
    if (!uid) return;
    deleteTransactionFromFirestore(uid, id);
  }

  return {
    loaded,
    transactions,
    monthTransactions,
    month,
    setMonth,
    income,
    expenses,
    balance,
    categoryTotals,
    addTransaction,
    deleteTransaction,
  };
}

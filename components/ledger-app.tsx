"use client";

import { useEffect, useMemo, useState } from "react";
import { Transaction } from "@/lib/types";
import { loadTransactions, saveTransactions } from "@/lib/storage";
import { isSameMonth } from "@/lib/utils";
import { SummaryStrip } from "./summary-strip";
import { TransactionTable } from "./transaction-table";
import { AddEntrySlip } from "./add-entry-slip";
import { CategoryDonut } from "./category-donut";
import { MonthPicker } from "./month-picker";

type Tab = "ledger" | "overview";

export function LedgerApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("ledger");
  const [showAdd, setShowAdd] = useState(false);
  const [month, setMonth] = useState(() => new Date());

  useEffect(() => {
    setTransactions(loadTransactions());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveTransactions(transactions);
  }, [transactions, loaded]);

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

  function handleAdd(t: Omit<Transaction, "id">) {
    setTransactions((prev) => [...prev, { ...t, id: crypto.randomUUID() }]);
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="soft-card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FCF8EE] via-[#F3EBDD] to-[#EDE8D9]" />
          <div className="absolute -right-8 top-0 h-28 w-28 rounded-full bg-[#b98b2e]/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#2f5d50]/12 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#dad1c0] bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                  {month.toLocaleDateString("en", { month: "long", year: "numeric" })}
                </span>
                <span className="rounded-full bg-[#2f5d50]/10 px-3 py-1 text-[11px] font-medium text-[#2f5d50]">
                  Local-only storage
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-ink">
                <span className="ink-underline">Your money, made calm.</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm sm:text-base text-ink-soft">
                Track income, spending and balance in one polished view that feels lighter than a spreadsheet.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <div className="rounded-full border border-[#e4dccb] bg-white/70 px-3 py-1.5 text-sm text-ink-soft">
                  Balance: <span className="ml-1 font-semibold text-ink">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(balance)}</span>
                </div>
                <div className="rounded-full border border-[#e4dccb] bg-white/70 px-3 py-1.5 text-sm text-ink-soft">
                  Income: <span className="ml-1 font-semibold text-[#2f5d50]">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(income)}</span>
                </div>
                <div className="rounded-full border border-[#e4dccb] bg-white/70 px-3 py-1.5 text-sm text-ink-soft">
                  Expenses: <span className="ml-1 font-semibold text-[#a8384a]">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(expenses)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper-card shadow-[0_10px_25px_rgba(30,42,34,0.16)] transition-all hover:-translate-y-0.5 hover:bg-ink-soft"
            >
              + New entry
            </button>
          </div>
        </header>

        <section className="soft-card p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex items-center gap-2 rounded-full border border-[#e6dfcf] bg-white/70 p-1.5">
              {(["ledger", "overview"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all ${
                    tab === t ? "bg-ink text-paper-card shadow-sm" : "text-ink-faint hover:bg-[#f6efe2] hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>
            <div className="sm:ml-auto">
              <MonthPicker current={month} onChange={setMonth} />
            </div>
          </div>
        </section>

        <SummaryStrip balance={balance} income={income} expenses={expenses} />

        {tab === "ledger" ? (
          <TransactionTable
            transactions={monthTransactions}
            startingBalance={0}
            onDelete={handleDelete}
          />
        ) : (
          <div className="soft-card p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">Spending mix</p>
                <h2 className="font-display text-xl text-ink">Where your money went</h2>
              </div>
            </div>
            <CategoryDonut slices={categoryTotals} />
          </div>
        )}

        <footer className="text-center text-xs text-ink-faint">
          Entries are stored in this browser only, on this device.
        </footer>
      </div>

      {showAdd && <AddEntrySlip onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

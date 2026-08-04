"use client";

import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate, categoryColor } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  startingBalance: number;
  onDelete: (id: string) => void;
}

export function TransactionTable({
  transactions,
  startingBalance,
  onDelete,
}: TransactionTableProps) {
  const chronological = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const runningBalances = new Map<string, number>();
  let balance = startingBalance;

  for (const t of chronological) {
    balance += t.kind === "credit" ? t.amount : -t.amount;
    runningBalances.set(t.id, balance);
  }

  const displayOrder = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  if (displayOrder.length === 0) {
    return (
      <div className="soft-card p-12 text-center">
        <p className="font-display text-lg text-ink-soft">The ledger is empty.</p>
        <p className="mt-1 text-sm text-ink-faint">Log your first entry to start the page.</p>
      </div>
    );
  }

  return (
    <div className="soft-card overflow-hidden">
      <div className="hidden grid-cols-[90px_1fr_120px_120px_120px_40px] gap-3 border-b border-[#e6dfcf] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint sm:grid">
        <span>Date</span>
        <span>Description</span>
        <span>Category</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Balance</span>
        <span />
      </div>
      <div className="ledger-rules">
        {displayOrder.map((t) => (
          <div
            key={t.id}
            className="group relative grid gap-3 border-t border-[#f0e9da] bg-white/60 px-4 py-3 transition-colors hover:bg-white/80 sm:grid-cols-[90px_1fr_120px_120px_120px_40px] sm:px-5 sm:py-4"
            style={{ borderLeft: `4px solid ${t.kind === "credit" ? "#2f5d50" : "#a8384a"}` }}
          >
            <span className="text-sm font-mono text-ink-faint">{formatDate(t.date)}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{t.description}</p>
            </div>
            <span>
              <span
                className="stamp inline-block px-2 py-1 text-[10px] uppercase"
                style={{ color: categoryColor(t.category) }}
              >
                {t.category}
              </span>
            </span>
            <span
              className={`text-right font-mono text-sm ${
                t.kind === "credit" ? "text-credit" : "text-debit"
              }`}
            >
              {t.kind === "credit" ? "+" : "−"} {formatCurrency(t.amount)}
            </span>
            <span className="text-right font-mono text-sm text-ink-soft">
              {formatCurrency(runningBalances.get(t.id) ?? 0)}
            </span>
            <button
              onClick={() => onDelete(t.id)}
              aria-label={`Delete ${t.description}`}
              className="justify-self-end text-lg leading-none text-ink-faint opacity-70 transition-opacity hover:text-debit focus-visible:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

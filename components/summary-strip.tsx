"use client";

import { formatCurrency } from "@/lib/utils";

interface SummaryStripProps {
  balance: number;
  income: number;
  expenses: number;
}

function Figure({
  label,
  value,
  tone,
  detail,
}: {
  label: string;
  value: string;
  tone: "ink" | "credit" | "debit";
  detail: string;
}) {
  const toneClass =
    tone === "credit" ? "text-credit" : tone === "debit" ? "text-debit" : "text-ink";
  const accentClass =
    tone === "credit"
      ? "border-[#dce7df] bg-gradient-to-br from-[#f8fcfa] to-[#edf6f0]"
      : tone === "debit"
        ? "border-[#f0dede] bg-gradient-to-br from-[#fffaf8] to-[#f8ecec]"
        : "border-[#e8e0ce] bg-gradient-to-br from-[#fcfaf4] to-[#f5efe0]";

  return (
    <div className={`rounded-[22px] border p-4 shadow-[0_10px_24px_rgba(30,42,34,0.05)] sm:p-5 ${accentClass}`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">{label}</p>
        <div className={`h-2.5 w-2.5 rounded-full ${tone === "credit" ? "bg-[#2f5d50]" : tone === "debit" ? "bg-[#a8384a]" : "bg-[#b98b2e]"}`} />
      </div>
      <p className={`mt-3 font-mono text-2xl font-semibold sm:text-3xl ${toneClass}`}>{value}</p>
      <p className="mt-2 text-sm text-ink-soft">{detail}</p>
    </div>
  );
}

export function SummaryStrip({ balance, income, expenses }: SummaryStripProps) {
  return (
    <div className="rise-in grid gap-3 lg:grid-cols-3">
      <Figure
        label="Net balance"
        value={formatCurrency(balance)}
        tone="ink"
        detail={balance >= 0 ? "You are ahead this month" : "A small reset may help"}
      />
      <Figure
        label="Income"
        value={`+ ${formatCurrency(income)}`}
        tone="credit"
        detail="Money coming in"
      />
      <Figure
        label="Expenses"
        value={`− ${formatCurrency(expenses)}`}
        tone="debit"
        detail="Money going out"
      />
    </div>
  );
}

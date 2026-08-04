"use client";

import { BudgetWithStats } from "@/lib/types";

export function ActivityChart({ budgets }: { budgets: BudgetWithStats[] }) {
  if (budgets.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-ink-faint text-sm">
        Create a budget to see activity here.
      </div>
    );
  }

  const maxValue = Math.max(...budgets.map((b) => Math.max(b.amount, b.spent)), 1);
  const niceMax = Math.ceil(maxValue / 2000) * 2000 || 2000;
  const steps = 4;
  const chartHeight = 260;
  const barWidth = 44;
  const gap = 40;

  return (
    <div>
      <div className="flex gap-6 overflow-x-auto pb-2">
        <div className="flex flex-col justify-between text-xs text-ink-faint py-1" style={{ height: chartHeight }}>
          {Array.from({ length: steps + 1 }).map((_, i) => (
            <span key={i}>{Math.round((niceMax / steps) * (steps - i)).toLocaleString()}</span>
          ))}
        </div>

        <div className="flex items-end gap-10" style={{ height: chartHeight }}>
          {budgets.map((b) => {
            const amountH = (b.amount / niceMax) * chartHeight;
            const spendH = (b.spent / niceMax) * chartHeight;
            return (
              <div key={b.id} className="flex flex-col items-center justify-end h-full">
                <div
                  className="relative rounded-t-md bg-brand-light overflow-hidden"
                  style={{ width: barWidth, height: Math.max(amountH, 2) }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-brand"
                    style={{ height: Math.min(spendH, amountH) }}
                  />
                </div>
                <span className="mt-3 text-xs text-ink-soft whitespace-nowrap">{b.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-5 mt-6 text-xs text-ink-soft">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand" /> totalSpend
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-light" /> amount
        </span>
      </div>
    </div>
  );
}

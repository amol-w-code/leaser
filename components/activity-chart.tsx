"use client";

import { useState } from "react";
import { BudgetWithStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ActivityChart({ budgets }: { budgets: BudgetWithStats[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (budgets.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="mb-3 text-3xl">📈</div>
        <p className="font-display text-lg text-ink-soft">No activity yet</p>
        <p className="mt-1 text-sm text-ink-faint">Create a budget to see your spending activity here.</p>
      </div>
    );
  }

  const maxValue = Math.max(...budgets.map((b) => Math.max(b.amount, b.spent)), 1);
  const niceMax = Math.ceil(maxValue / 2000) * 2000 || 2000;
  const steps = 4;
  const chartHeight = 260;
  const barWidth = 44;

  return (
    <div>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-xs text-ink-faint py-1 font-mono" style={{ height: chartHeight }}>
          {Array.from({ length: steps + 1 }).map((_, i) => (
            <span key={i}>{Math.round((niceMax / steps) * (steps - i)).toLocaleString()}</span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex-1 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ height: chartHeight }}>
            {Array.from({ length: steps + 1 }).map((_, i) => (
              <div key={i} className="border-t border-border/50" />
            ))}
          </div>

          <div className="relative flex items-end gap-10" style={{ height: chartHeight }}>
            {budgets.map((b, i) => {
              const amountH = (b.amount / niceMax) * chartHeight;
              const spendH = (b.spent / niceMax) * chartHeight;
              const isHovered = hoveredIndex === i;

              return (
                <div
                  key={b.id}
                  className="relative flex flex-col items-center justify-end h-full"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 scale-in">
                      <div className="rounded-lg bg-ink text-white px-3 py-2 text-xs shadow-lg whitespace-nowrap">
                        <p className="font-medium">{b.name}</p>
                        <p className="text-white/70 mt-0.5">Budget: {formatCurrency(b.amount)}</p>
                        <p className="text-white/70">Spent: {formatCurrency(b.spent)}</p>
                      </div>
                      <div className="mx-auto h-2 w-2 -mt-1 rotate-45 bg-ink" />
                    </div>
                  )}

                  <div
                    className={`relative rounded-t-lg overflow-hidden bar-grow transition-all duration-200 ${
                      isHovered ? "opacity-100 shadow-sm" : "opacity-90"
                    }`}
                    style={{
                      width: barWidth,
                      height: Math.max(amountH, 4),
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    {/* Budget (light) background */}
                    <div className="absolute inset-0 bg-brand-light" />
                    {/* Spend (solid) fill */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand to-brand/80 rounded-t-sm"
                      style={{ height: Math.min(spendH, amountH) }}
                    />
                  </div>
                  <span className={`mt-3 text-xs whitespace-nowrap transition-colors ${
                    isHovered ? "text-ink font-medium" : "text-ink-soft"
                  }`}>
                    {b.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-6 text-xs text-ink-soft">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand" /> Spent
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-light" /> Budget
        </span>
      </div>
    </div>
  );
}

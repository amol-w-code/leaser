"use client";

import { monthLabel } from "@/lib/utils";

interface MonthPickerProps {
  current: Date;
  onChange: (d: Date) => void;
}

export function MonthPicker({ current, onChange }: MonthPickerProps) {
  function shift(delta: number) {
    const next = new Date(current);
    next.setMonth(next.getMonth() + delta);
    onChange(next);
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#e6dfcf] bg-white/70 p-1.5 shadow-sm">
      <button
        aria-label="Previous month"
        onClick={() => shift(-1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-ink-soft transition-colors hover:bg-[#f6efe2] hover:text-ink"
      >
        ‹
      </button>
      <span className="min-w-[10ch] text-center font-display text-lg text-ink">
        {monthLabel(current)}
      </span>
      <button
        aria-label="Next month"
        onClick={() => shift(1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-ink-soft transition-colors hover:bg-[#f6efe2] hover:text-ink"
      >
        ›
      </button>
    </div>
  );
}

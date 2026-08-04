"use client";

import { formatCurrency, categoryColor } from "@/lib/utils";

interface Slice {
  category: string;
  total: number;
}

export function CategoryDonut({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((s, x) => s + x.total, 0);

  if (total === 0) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center text-ink-faint">
        <p className="font-display text-lg text-ink-soft">No spending logged this month yet.</p>
        <p className="mt-1 text-sm">Add a transaction to see the breakdown.</p>
      </div>
    );
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offsetSoFar = 0;

  const topSlice = [...slices].sort((a, b) => b.total - a.total)[0];

  const arcs = slices.map((slice) => {
    const fraction = slice.total / total;
    const dash = fraction * circumference;
    const arc = (
      <circle
        key={slice.category}
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke={categoryColor(slice.category)}
        strokeWidth="20"
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={-offsetSoFar}
        transform="rotate(-90 90 90)"
        strokeLinecap="butt"
      />
    );
    offsetSoFar += dash;
    return arc;
  });

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center">
      <div className="rounded-[22px] border border-[#e8e0ce] bg-white/70 p-4">
        <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="Spending by category">
          {arcs}
          <circle cx="90" cy="90" r="50" fill="#f8f5eb" />
          <text
            x="90"
            y="86"
            textAnchor="middle"
            className="fill-ink"
            style={{ fontFamily: "var(--font-fraunces)", fontSize: "15px", fontWeight: 600 }}
          >
            {formatCurrency(total)}
          </text>
          <text
            x="90"
            y="104"
            textAnchor="middle"
            className="fill-ink-faint"
            style={{ fontFamily: "var(--font-inter)", fontSize: "10px", letterSpacing: "0.08em" }}
          >
            SPENT
          </text>
        </svg>
      </div>

      <div className="flex-1 w-full space-y-3">
        <div className="rounded-[18px] border border-[#e8e0ce] bg-white/70 p-3 text-sm text-ink-soft">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Top category</p>
          <p className="mt-1 font-medium text-ink">{topSlice?.category ?? "—"}</p>
        </div>
        <ul className="space-y-2">
          {slices
            .slice()
            .sort((a, b) => b.total - a.total)
            .map((slice) => (
              <li key={slice.category} className="flex items-center justify-between rounded-[14px] border border-[#efe8d8] bg-white/70 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 text-ink-soft">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: categoryColor(slice.category) }}
                  />
                  {slice.category}
                </span>
                <span className="font-mono text-ink">{formatCurrency(slice.total)}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

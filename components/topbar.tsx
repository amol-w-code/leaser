"use client";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-ink-soft text-sm mt-1.5">{subtitle}</p>}
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white font-medium">
        G
      </div>
    </div>
  );
}

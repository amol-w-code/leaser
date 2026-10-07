"use client";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-start justify-between mb-8 pb-4 border-b border-border fade-in-up">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-ink-soft text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-ink-faint hover:text-ink transition-colors dark-card">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

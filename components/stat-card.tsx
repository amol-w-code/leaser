"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  icon: React.ReactNode;
  delay?: number;
  trend?: { value: number; label: string };
}

export function StatCard({ label, value, isCurrency = true, icon, delay = 0, trend }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    const end = value;

    let animationFrame: number;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 5);
      setDisplayValue(Math.round(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrame);
    };
  }, [value, delay]);

  return (
    <div
      ref={ref}
      className="fade-in-up group relative overflow-hidden rounded-[20px] border border-border bg-white p-5 sm:p-6 shadow-card transition-all duration-300 hover:shadow-[0_8px_30px_rgba(21,22,30,0.08),0_2px_8px_rgba(91,79,233,0.06)] hover:-translate-y-0.5 dark-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-brand/[0.06] to-purple-500/[0.04] blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink-soft mb-2 tracking-wide uppercase" style={{ fontSize: "0.7rem", letterSpacing: "0.06em" }}>{label}</p>
          <p className="text-2xl sm:text-[1.75rem] font-semibold text-ink font-mono tabular-nums counter-reveal">
            {isCurrency ? formatCurrency(displayValue) : displayValue}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                trend.value >= 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
              }`}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d={trend.value >= 0 ? "M6 2v8M6 2L2.5 5.5M6 2L9.5 5.5" : "M6 10V2M6 10L2.5 6.5M6 10L9.5 6.5"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-[11px] text-ink-faint">{trend.label}</span>
            </div>
          )}
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </span>
      </div>
    </div>
  );
}

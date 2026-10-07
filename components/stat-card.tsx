"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  delay?: number;
}

export function StatCard({ label, value, isCurrency = true, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 600;
    const start = performance.now();
    const end = value;

    let animationFrame: number;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
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
      className="fade-in-up rounded-card border border-border bg-white p-5 shadow-card dark-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-[13px] font-medium text-ink-soft mb-1.5">{label}</p>
      <p className="text-2xl font-semibold text-ink font-mono tabular-nums tracking-tight">
        {isCurrency ? formatCurrency(displayValue) : displayValue}
      </p>
    </div>
  );
}

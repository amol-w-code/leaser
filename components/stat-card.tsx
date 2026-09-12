"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  icon: React.ReactNode;
  delay?: number;
}

export function StatCard({ label, value, isCurrency = true, icon, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const end = value;

    let animationFrame: number;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
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
      className="fade-in-up hover-lift flex items-center justify-between rounded-card border border-border bg-white p-5 shadow-card dark-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div>
        <p className="text-sm text-ink-soft mb-1.5">{label}</p>
        <p className="text-2xl font-semibold text-ink font-mono tabular-nums">
          {isCurrency ? formatCurrency(displayValue) : displayValue}
        </p>
      </div>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow">
        {icon}
      </span>
    </div>
  );
}

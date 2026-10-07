"use client";

import { useEffect, useState, useRef } from "react";
import { AIInsight, BudgetWithStats, Expense, Transaction } from "./types";
import { generateInsights, isGeminiConfigured } from "./gemini";

interface InsightsContext {
  budgets: BudgetWithStats[];
  expenses: Expense[];
  transactions: Transaction[];
  currency: string;
  monthLabel: string;
  totalBudget: number;
  totalSpend: number;
  monthIncome: number;
  monthExpenses: number;
  monthBalance: number;
  categoryTotals: { category: string; total: number }[];
}

export function useAIInsights(ctx: InsightsContext, enabled: boolean) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const configured = isGeminiConfigured();

  useEffect(() => {
    if (!enabled || !configured || fetchedRef.current) return;
    if (ctx.budgets.length === 0 && ctx.transactions.length === 0) return;

    fetchedRef.current = true;
    setLoading(true);

    generateInsights(ctx)
      .then((raw) => {
        try {
          // Strip markdown code fences if present
          let cleaned = raw.trim();
          if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
          }
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed)) {
            const mapped: AIInsight[] = parsed.slice(0, 3).map((item: any, i: number) => ({
              id: `insight-${i}`,
              icon: item.icon || "💡",
              title: item.title || "Insight",
              description: item.description || "",
              type: item.type || "info",
            }));
            setInsights(mapped);
          }
        } catch {
          setError("Failed to parse AI insights");
        }
      })
      .catch((err) => {
        setError(err?.message || "Failed to generate insights");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [enabled, configured, ctx]);

  return { insights, loading, error, configured };
}

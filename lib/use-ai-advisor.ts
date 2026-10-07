"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, BudgetWithStats, Expense, Transaction } from "./types";
import { chatWithAdvisor, isGeminiConfigured } from "./gemini";

interface AdvisorContext {
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

export function useAIAdvisor(ctx: AdvisorContext) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<
    { role: "user" | "model"; parts: { text: string }[] }[]
  >([]);

  const configured = isGeminiConfigured();

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await chatWithAdvisor(
          text.trim(),
          historyRef.current,
          ctx
        );

        // Update history for Gemini context
        historyRef.current.push(
          { role: "user", parts: [{ text: text.trim() }] },
          { role: "model", parts: [{ text: response }] }
        );

        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err: any) {
        setError(err?.message || "Failed to get response from AI");
      } finally {
        setIsLoading(false);
      }
    },
    [ctx, isLoading]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    historyRef.current = [];
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    configured,
    sendMessage,
    clearChat,
  };
}

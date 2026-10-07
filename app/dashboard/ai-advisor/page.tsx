"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { TopBar } from "@/components/topbar";
import { useFinanceData } from "@/lib/use-finance-data";
import { useTransactions } from "@/lib/use-transactions";
import { useProfile } from "@/lib/use-profile";
import { useAIAdvisor } from "@/lib/use-ai-advisor";
import { ChatMessage } from "@/lib/types";
import { isGeminiConfigured } from "@/lib/gemini";

const QUICK_PROMPTS = [
  { emoji: "📊", label: "Spending analysis", prompt: "Give me a detailed analysis of my spending patterns this month. Where am I spending the most?" },
  { emoji: "💡", label: "Savings tips", prompt: "Based on my current spending, what are the top 3 ways I could save more money?" },
  { emoji: "📈", label: "Budget health", prompt: "How healthy are my budgets? Which ones am I close to exceeding?" },
  { emoji: "🔮", label: "Monthly forecast", prompt: "Based on my spending so far, predict how my finances will look by end of month." },
];

export default function AIAdvisorPage() {
  const { loaded, budgetsWithStats, expenses, totalBudget, totalSpend } = useFinanceData();
  const { loaded: txLoaded, transactions, monthTransactions, income, expenses: monthExp, balance, categoryTotals, month } = useTransactions();
  const { profile } = useProfile();

  const ctx = {
    budgets: budgetsWithStats,
    expenses,
    transactions,
    currency: profile.currency || "USD",
    monthLabel: month.toLocaleDateString("en", { month: "long", year: "numeric" }),
    totalBudget,
    totalSpend,
    monthIncome: income,
    monthExpenses: monthExp,
    monthBalance: balance,
    categoryTotals,
  };

  const { messages, isLoading, error, configured, sendMessage, clearChat } = useAIAdvisor(ctx);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  }

  function handleQuickPrompt(prompt: string) {
    sendMessage(prompt);
    inputRef.current?.focus();
  }

  if (!loaded || !txLoaded) return null;

  if (!configured) {
    return (
      <div>
        <TopBar title="AI Advisor" subtitle="Your personal finance intelligence." />
        <div className="fade-in-up rounded-card border border-border bg-white p-8 shadow-card dark-card text-center max-w-lg mx-auto mt-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-purple-500/20">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="font-display text-xl text-ink mb-2">Set Up AI Advisor</h2>
          <p className="text-sm text-ink-soft mb-4">
            Add your Gemini API key to <code className="rounded bg-surface px-1.5 py-0.5 text-xs font-mono">.env.local</code> to enable AI-powered financial advice.
          </p>
          <div className="rounded-xl bg-surface p-3 text-left">
            <code className="text-xs font-mono text-ink-soft">NEXT_PUBLIC_GEMINI_API_KEY=your_key_here</code>
          </div>
          <p className="text-xs text-ink-faint mt-3">
            Get a free key at{" "}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              Google AI Studio
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      <TopBar title="AI Advisor" subtitle="Your personal finance intelligence, powered by Gemini." />

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-card border border-border bg-white shadow-card dark-card overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center fade-in-up">
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow">
                  <SparkleIcon size={36} />
                </div>
                <div className="absolute -inset-3 rounded-3xl bg-brand/10 blur-xl -z-10" />
              </div>
              <h3 className="font-display text-xl text-ink mb-1">Ask me anything about your money</h3>
              <p className="text-sm text-ink-soft mb-8 max-w-md">
                I have access to all your budgets, expenses, and transactions. Try one of the suggestions below!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp.label}
                    onClick={() => handleQuickPrompt(qp.prompt)}
                    className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 text-left text-sm text-ink-soft hover:bg-white hover:text-ink hover:border-brand/30 hover:shadow-sm transition-all hover:-translate-y-0.5 dark-card"
                  >
                    <span className="text-lg">{qp.emoji}</span>
                    <span className="font-medium">{qp.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex gap-3 fade-in-up">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-purple-600 text-white">
                <SparkleIcon size={14} />
              </div>
              <div className="rounded-2xl rounded-tl-md bg-surface px-4 py-3 dark-card">
                <div className="flex gap-1.5">
                  <span className="typing-dot h-2 w-2 rounded-full bg-ink-faint" style={{ animationDelay: "0ms" }} />
                  <span className="typing-dot h-2 w-2 rounded-full bg-ink-faint" style={{ animationDelay: "150ms" }} />
                  <span className="typing-dot h-2 w-2 rounded-full bg-ink-faint" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 fade-in-up dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-border px-4 sm:px-6 py-4 bg-white/50 backdrop-blur-sm dark-card">
          <form onSubmit={handleSubmit} className="flex gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-ink-faint hover:text-ink hover:bg-white transition-colors dark-card"
                title="Clear chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>
            )}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50 focus:ring-2 focus:ring-brand/10 outline-none transition-all disabled:opacity-50 dark-card"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-glow btn-press"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <p className="text-[10px] text-ink-faint text-center mt-2">
            Powered by Gemini AI · Your data stays in your browser
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Message Bubble Component ─────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 fade-in-up ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white ${
          isUser
            ? "bg-ink"
            : "bg-gradient-to-br from-brand to-purple-600"
        }`}
      >
        {isUser ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <SparkleIcon size={14} />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-md bg-brand text-white"
            : "rounded-tl-md bg-surface text-ink dark-card"
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <MarkdownContent content={message.content} />
        )}
      </div>
    </div>
  );
}

// ── Simple Markdown Renderer ─────────────────────

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown to HTML conversion
  const html = content
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`(.*?)`/g, '<code class="rounded bg-brand/10 px-1 py-0.5 text-xs font-mono">$1</code>')
    // Bullet lists
    .replace(/^[•\-\*]\s+(.*)/gm, '<li class="ml-4 list-disc">$1</li>')
    // Numbered lists
    .replace(/^\d+\.\s+(.*)/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Headers
    .replace(/^### (.*)/gm, '<h4 class="font-semibold text-ink mt-3 mb-1">$1</h4>')
    .replace(/^## (.*)/gm, '<h3 class="font-semibold text-ink text-base mt-3 mb-1">$1</h3>')
    // Line breaks
    .replace(/\n\n/g, '<div class="h-2"></div>')
    .replace(/\n/g, "<br />");

  return (
    <div
      className="ai-markdown [&_li]:my-0.5 [&_strong]:font-semibold [&_strong]:text-ink"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── Icons ────────────────────────────────────────

function SparkleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

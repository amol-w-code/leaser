"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { CATEGORIES, Transaction, TransactionKind } from "@/lib/types";
import { suggestCategory, isGeminiConfigured } from "@/lib/gemini";

interface AddEntrySlipProps {
  onAdd: (t: Omit<Transaction, "id">) => void;
  onClose: () => void;
}

export function AddEntrySlip({ onAdd, onClose }: AddEntrySlipProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [kind, setKind] = useState<TransactionKind>("debit");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  // AI suggestion state
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiConfigured = isGeminiConfigured();

  // Debounce AI category suggestion on description change
  useEffect(() => {
    if (!aiConfigured || !description.trim() || description.trim().length < 3) {
      setSuggestedCategory(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const suggestion = await suggestCategory(description.trim(), CATEGORIES);
        if (suggestion && suggestion !== category) {
          setSuggestedCategory(suggestion);
        } else {
          setSuggestedCategory(null);
        }
      } catch {
        setSuggestedCategory(null);
      } finally {
        setSuggestLoading(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [description, aiConfigured]);

  function acceptSuggestion() {
    if (suggestedCategory) {
      setCategory(suggestedCategory);
      setSuggestedCategory(null);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!description.trim()) {
      setError("Give the entry a description.");
      return;
    }
    if (!parsed || parsed <= 0) {
      setError("Amount needs to be a number greater than zero.");
      return;
    }
    onAdd({ description: description.trim(), amount: parsed, category, kind, date });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/45 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="rise-in mt-10 w-full max-w-lg overflow-hidden rounded-[24px] border border-white/70 bg-[rgba(248,245,235,0.97)] shadow-[0_24px_70px_rgba(30,42,34,0.18)] sm:mt-0"
      >
        <div className="flex items-center justify-between border-b border-dashed border-[#e6dfcf] px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">New entry</p>
            <h2 className="font-display text-xl text-ink">Ledger slip</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl leading-none text-ink-faint transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setKind("debit")}
              className={`rounded-2xl border px-3 py-2 text-sm font-medium transition-all ${
                kind === "debit"
                  ? "border-debit bg-debit-soft text-debit"
                  : "border-[#e6dfcf] bg-white/70 text-ink-faint hover:text-ink"
              }`}
            >
              − Expense
            </button>
            <button
              type="button"
              onClick={() => setKind("credit")}
              className={`rounded-2xl border px-3 py-2 text-sm font-medium transition-all ${
                kind === "credit"
                  ? "border-credit bg-credit-soft text-credit"
                  : "border-[#e6dfcf] bg-white/70 text-ink-faint hover:text-ink"
              }`}
            >
              + Income
            </button>
          </div>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Description</span>
            <input
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Farmers market"
              className="mt-1 w-full rounded-2xl border border-[#e6dfcf] bg-white/80 px-3 py-2.5 text-ink placeholder:text-ink-faint focus:border-gold"
            />
            {/* AI category suggestion */}
            {suggestLoading && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink-faint">
                <span className="inline-block h-3 w-3 rounded-full border-2 border-brand/30 border-t-brand spin-slow" />
                Suggesting category...
              </div>
            )}
            {suggestedCategory && !suggestLoading && (
              <button
                type="button"
                onClick={acceptSuggestion}
                className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand/10 to-purple-500/10 border border-brand/20 px-2.5 py-1 text-[11px] font-medium text-brand transition-all hover:from-brand/20 hover:to-purple-500/20 hover:shadow-sm scale-in"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                AI suggests: {suggestedCategory}
                <span className="text-brand/60">· tap to use</span>
              </button>
            )}
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Amount</span>
              <div className="mt-1 flex items-center rounded-2xl border border-[#e6dfcf] bg-white/80 px-3 focus-within:border-gold">
                <span className="mr-1 text-ink-faint">$</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full bg-transparent py-2.5 font-mono text-ink outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-[#e6dfcf] bg-white/80 px-3 py-2.5 font-mono text-ink focus:border-gold"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-[#e6dfcf] bg-white/80 px-3 py-2.5 text-ink focus:border-gold"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm text-debit">{error}</p>}
        </div>

        <div className="border-t border-dashed border-[#e6dfcf] px-6 py-4">
          <button
            type="submit"
            className="w-full rounded-2xl bg-ink py-2.75 font-medium text-paper-card transition-colors hover:bg-ink-soft"
          >
            Record entry
          </button>
        </div>
      </form>
    </div>
  );
}


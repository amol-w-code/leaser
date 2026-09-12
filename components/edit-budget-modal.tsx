"use client";

import { useEffect, useState, FormEvent } from "react";
import dynamic from "next/dynamic";
import { EmojiClickData, Theme } from "emoji-picker-react";
import { Budget } from "@/lib/types";
import { getCurrencySymbol } from "@/lib/utils";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface EditBudgetModalProps {
  budget: Budget;
  onSave: (budget: Budget) => void;
  onClose: () => void;
}

export function EditBudgetModal({ budget, onSave, onClose }: EditBudgetModalProps) {
  const [emoji, setEmoji] = useState(budget.emoji);
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState(budget.name);
  const [amount, setAmount] = useState(String(budget.amount));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmoji(budget.emoji);
    setName(budget.name);
    setAmount(String(budget.amount));
  }, [budget]);

  function handleEmojiClick(data: EmojiClickData) {
    setEmoji(data.emoji);
    setShowPicker(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!name.trim()) {
      setError("Give the budget a name.");
      return;
    }
    if (!parsed || parsed <= 0) {
      setError("Budget amount needs to be greater than zero.");
      return;
    }
    onSave({ ...budget, name: name.trim(), amount: parsed, emoji });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-ink/40 backdrop-blur-[2px] p-4 overflow-y-auto"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="rise-in relative w-full max-w-md bg-white rounded-card shadow-xl mt-16 sm:mt-0 p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-ink">Edit Budget</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-faint hover:text-ink text-xl leading-none">
            ×
          </button>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPicker((v) => !v)}
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface text-2xl hover:bg-brand-light transition-colors"
              aria-label="Choose an emoji"
            >
              {emoji}
            </button>
            {showPicker && (
              <div className="absolute z-10 mt-2">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark" ? Theme.DARK : Theme.LIGHT}
                  width={320}
                  height={360}
                />
              </div>
            )}
          </div>

          <label className="block">
            <span className="text-sm font-medium text-ink">Budget Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-ink focus:border-brand focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Budget Amount</span>
            <div className="mt-1.5 flex items-center rounded-xl border border-border bg-surface px-3.5 focus-within:border-brand focus-within:bg-white">
              <span className="text-ink-faint mr-1">{getCurrencySymbol()}</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="w-full bg-transparent py-2.5 text-ink outline-none"
              />
            </div>
          </label>

          {error && <p className="text-sm text-negative">{error}</p>}

          <button type="submit" className="w-full rounded-xl bg-brand text-white py-3 font-medium hover:bg-brand-dark transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

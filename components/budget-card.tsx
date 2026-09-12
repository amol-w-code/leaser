"use client";

import { useState } from "react";
import Link from "next/link";
import { BudgetWithStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { EditBudgetModal } from "@/components/edit-budget-modal";

export function BudgetCard({ budget, onEdit }: { budget: BudgetWithStats; onEdit: (budget: BudgetWithStats) => void }) {
  const [showEdit, setShowEdit] = useState(false);
  const pct = Math.min(100, Math.round(budget.percentUsed));
  const overBudget = budget.remaining < 0;

  return (
    <>
      <div className="rise-in hover-lift rounded-card border border-border bg-white p-5 shadow-card transition-all dark-card">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3 flex-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-xl transition-transform hover:scale-110">
              {budget.emoji}
            </span>
            <div>
              <p className="font-semibold text-ink">{budget.name}</p>
              <p className="text-xs text-ink-faint">
                {budget.itemCount} {budget.itemCount === 1 ? "Item" : "Items"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowEdit(true); }}
            className="btn-press rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-soft hover:bg-surface hover:border-brand/30 transition-all"
          >
            Edit
          </button>
        </div>

        <Link href={`/dashboard/expenses/${budget.id}`} className="block">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span>{formatCurrency(budget.spent)} Spent</span>
            <span className={overBudget ? "text-negative font-medium" : ""}>
              {overBudget
                ? `${formatCurrency(Math.abs(budget.remaining))} Over`
                : `${formatCurrency(budget.remaining)} Remaining`}
            </span>
          </div>
          <div className={`h-2.5 w-full rounded-pill bg-track overflow-hidden ${overBudget ? "pulse-glow" : ""}`}>
            <div
              className={`h-full rounded-pill progress-fill ${overBudget ? "bg-negative" : "bg-gradient-to-r from-brand to-purple-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-brand font-medium text-center hover:underline transition-colors">
            View Expenses →
          </p>
        </Link>
      </div>

      {showEdit && (
        <EditBudgetModal
          budget={{ ...budget, id: budget.id, name: budget.name, emoji: budget.emoji, amount: budget.amount, createdAt: budget.createdAt }}
          onSave={(updated) => {
            onEdit({ ...budget, ...updated });
            setShowEdit(false);
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}

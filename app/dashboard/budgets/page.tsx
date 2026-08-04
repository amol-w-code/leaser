"use client";

import { useState } from "react";
import { TopBar } from "@/components/topbar";
import { BudgetCard } from "@/components/budget-card";
import { CreateBudgetModal } from "@/components/create-budget-modal";
import { useFinanceData } from "@/lib/use-finance-data";

export default function BudgetsPage() {
  const { loaded, budgetsWithStats, addBudget, updateBudget } = useFinanceData();
  const [showCreate, setShowCreate] = useState(false);

  if (!loaded) return null;

  return (
    <div>
      <TopBar title="My Budgets" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => setShowCreate(true)}
          className="rise-in flex flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-border bg-white p-5 text-ink-soft hover:border-brand hover:text-brand transition-colors min-h-[168px]"
        >
          <span className="text-2xl leading-none">+</span>
          <span className="font-medium text-sm">Create New Budget</span>
        </button>

        {budgetsWithStats.map((b) => (
          <BudgetCard key={b.id} budget={b} onEdit={(updated) => updateBudget({ id: updated.id, name: updated.name, emoji: updated.emoji, amount: updated.amount, createdAt: updated.createdAt })} />
        ))}
      </div>

      {showCreate && <CreateBudgetModal onCreate={addBudget} onClose={() => setShowCreate(false)} />}
    </div>
  );
}

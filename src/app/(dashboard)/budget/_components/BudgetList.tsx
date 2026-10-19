"use client";

import { deleteBudgetAction } from "@/src/lib/actions/budget-actions";
import { useState } from "react";

interface Budget {
  id: number;
  budget_amount: string;
  month: string;
  category_id: number;
  category_name: string;
  category_icon: string;
  spent: string;
}

export default function BudgetList({ budgets }: { budgets: Budget[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Remove this budget?")) return;
    setDeletingId(id);
    await deleteBudgetAction(id);
    setDeletingId(null);
  }

  if (budgets.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-zinc-500 text-sm">No budgets set for this month. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Budget vs Actual</h2>

      {budgets.map((b) => {
        const budget = Number(b.budget_amount);
        const spent = Number(b.spent);
        const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
        const overBudget = spent > budget;
        const remaining = budget - spent;

        return (
          <div key={b.id} className="glass-card p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{b.category_icon}</span>
                <div>
                  <p className="font-medium text-sm">{b.category_name}</p>
                  <p className="text-xs text-zinc-500">
                    ₹{spent.toLocaleString("en-IN", { minimumFractionDigits: 2 })} of ₹
                    {budget.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    overBudget ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {overBudget
                    ? `Over by ₹${Math.abs(remaining).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}`
                    : `₹${remaining.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })} left`}
                </span>
                <button
                  onClick={() => handleDelete(b.id)}
                  disabled={deletingId === b.id}
                  className="btn-danger text-xs"
                >
                  {deletingId === b.id ? "..." : "✕"}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overBudget
                    ? "bg-gradient-to-r from-red-500 to-red-400"
                    : percentage > 75
                    ? "bg-gradient-to-r from-amber-500 to-amber-400"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1.5 text-right">{percentage.toFixed(0)}% used</p>
          </div>
        );
      })}
    </div>
  );
}

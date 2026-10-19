"use client";

import { deleteCategoryAction } from "@/src/lib/actions/category-actions";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
  type: string;
  icon: string;
  created_at: string;
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this category? Transactions using it will become uncategorized.")) return;
    setDeletingId(id);
    await deleteCategoryAction(id);
    setDeletingId(null);
  }

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="space-y-6">
      {/* Income Categories */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
          💰 Income Categories ({incomeCategories.length})
        </h3>
        {incomeCategories.length === 0 ? (
          <p className="text-zinc-500 text-sm">No income categories yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {incomeCategories.map((cat) => (
              <div key={cat.id} className="glass-card p-4 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{cat.name}</p>
                    <p className="text-xs text-emerald-400">Income</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="btn-danger text-xs"
                >
                  {deletingId === cat.id ? "..." : "✕"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expense Categories */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
          💸 Expense Categories ({expenseCategories.length})
        </h3>
        {expenseCategories.length === 0 ? (
          <p className="text-zinc-500 text-sm">No expense categories yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {expenseCategories.map((cat) => (
              <div key={cat.id} className="glass-card p-4 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{cat.name}</p>
                    <p className="text-xs text-red-400">Expense</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="btn-danger text-xs"
                >
                  {deletingId === cat.id ? "..." : "✕"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

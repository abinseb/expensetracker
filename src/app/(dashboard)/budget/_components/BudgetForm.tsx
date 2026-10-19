"use client";

import { useActionState } from "react";
import { setBudgetAction, type BudgetState } from "@/src/lib/actions/budget-actions";

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function BudgetForm({
  categories,
  year,
  month,
}: {
  categories: Category[];
  year: number;
  month: number;
}) {
  const [state, action, pending] = useActionState<BudgetState, FormData>(
    setBudgetAction,
    undefined
  );

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">Set Budget</h2>

      <form action={action} className="space-y-4">
        {state?.message && !state.success && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {state.message}
          </div>
        )}
        {state?.success && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            {state.message}
          </div>
        )}

        <input type="hidden" name="year" value={year} />
        <input type="hidden" name="month" value={month} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Category
            </label>
            <select id="categoryId" name="categoryId" className="form-select" required>
              <option value="">Select expense category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            {state?.errors?.categoryId && (
              <p className="text-red-400 text-xs mt-1">{state.errors.categoryId[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Budget Amount (₹)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="1"
              placeholder="5000.00"
              className="form-input"
              required
            />
            {state?.errors?.amount && (
              <p className="text-red-400 text-xs mt-1">{state.errors.amount[0]}</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving..." : "Set Budget"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { addCategoryAction, type CategoryState } from "@/src/lib/actions/category-actions";

const ICONS = ["📦", "💰", "🏠", "🍔", "🚗", "🎬", "💊", "📚", "👕", "✈️", "🛒", "💡", "📱", "🎮", "🏥", "🎵", "☕", "🧹", "🏋️", "🎁"];

export default function CategoryForm() {
  const [state, action, pending] = useActionState<CategoryState, FormData>(
    addCategoryAction,
    undefined
  );

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">Add Category</h2>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Category Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Groceries"
              className="form-input"
              required
            />
            {state?.errors?.name && (
              <p className="text-red-400 text-xs mt-1">{state.errors.name[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Type
            </label>
            <select id="type" name="type" className="form-select" defaultValue="expense">
              <option value="expense">💸 Expense</option>
              <option value="income">💰 Income</option>
            </select>
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Icon
            </label>
            <select id="icon" name="icon" className="form-select" defaultValue="📦">
              {ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}

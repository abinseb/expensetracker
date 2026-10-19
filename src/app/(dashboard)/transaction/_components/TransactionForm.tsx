"use client";

import { useActionState } from "react";
import { addTransactionAction, type TransactionState } from "@/src/lib/actions/transaction-actions";

interface Category {
  id: number;
  name: string;
  type: string;
  icon: string;
}

export default function TransactionForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState<TransactionState, FormData>(
    addTransactionAction,
    undefined
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Type
            </label>
            <select id="type" name="type" className="form-select" defaultValue="debit">
              <option value="credit">💰 Credit (Income)</option>
              <option value="debit">💸 Debit (Expense)</option>
            </select>
            {state?.errors?.type && (
              <p className="text-red-400 text-xs mt-1">{state.errors.type[0]}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Amount (₹)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className="form-input"
              required
            />
            {state?.errors?.amount && (
              <p className="text-red-400 text-xs mt-1">{state.errors.amount[0]}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Category
            </label>
            <select id="categoryId" name="categoryId" className="form-select" required>
              <option value="">Select category...</option>
              <optgroup label="Income">
                {categories
                  .filter((c) => c.type === "income")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Expense">
                {categories
                  .filter((c) => c.type === "expense")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
              </optgroup>
            </select>
            {state?.errors?.categoryId && (
              <p className="text-red-400 text-xs mt-1">{state.errors.categoryId[0]}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={today}
              className="form-input"
              required
            />
            {state?.errors?.date && (
              <p className="text-red-400 text-xs mt-1">{state.errors.date[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="e.g., Monthly salary, Grocery shopping..."
              className="form-input"
            />
          </div>
        </div>

        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}

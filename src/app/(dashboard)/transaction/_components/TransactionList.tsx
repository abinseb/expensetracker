"use client";

import { deleteTransactionAction } from "@/src/lib/actions/transaction-actions";
import { useState } from "react";

interface Transaction {
  id: number;
  type: string;
  amount: string;
  description: string;
  date: string;
  category_name: string;
  category_icon: string;
}

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this transaction?")) return;
    setDeletingId(id);
    await deleteTransactionAction(id);
    setDeletingId(null);
  }

  // Calculate running balance
  const reversed = [...transactions].reverse();
  let runningBalance = 0;
  const withBalance = reversed.map((tx) => {
    runningBalance += tx.type === "credit" ? Number(tx.amount) : -Number(tx.amount);
    return { ...tx, balance: runningBalance };
  });
  const displayTx = withBalance.reverse();

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">
        Transaction History
        <span className="text-zinc-500 text-sm font-normal ml-2">
          ({transactions.length} records)
        </span>
      </h2>

      {transactions.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-12">
          No transactions found. Add your first transaction above!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displayTx.map((tx) => (
                <tr key={tx.id} className="animate-fade-in">
                  <td className="text-zinc-300 text-sm whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-zinc-300 text-sm max-w-[200px] truncate">
                    {tx.description || "—"}
                  </td>
                  <td className="text-sm">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/50 text-zinc-300">
                      {tx.category_icon} {tx.category_name || "Uncategorized"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                        tx.type === "credit"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {tx.type === "credit" ? "CREDIT" : "DEBIT"}
                    </span>
                  </td>
                  <td
                    className={`text-sm font-medium text-right ${
                      tx.type === "credit" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}₹
                    {Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td
                    className={`text-sm font-medium text-right ${
                      tx.balance >= 0 ? "text-indigo-400" : "text-red-400"
                    }`}
                  >
                    ₹{tx.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={deletingId === tx.id}
                      className="btn-danger text-xs"
                    >
                      {deletingId === tx.id ? "..." : "✕"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

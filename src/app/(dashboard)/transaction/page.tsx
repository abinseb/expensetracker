import { fetchTransactions } from "@/src/lib/actions/transaction-actions";
import { fetchCategories } from "@/src/lib/actions/category-actions";
import TransactionForm from "./_components/TransactionForm";
import TransactionList from "./_components/TransactionList";

export const instant = false;

export default async function TransactionPage() {
  const [transactions, categories] = await Promise.all([
    fetchTransactions(),
    fetchCategories(),
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Record income credits and expense debits
        </p>
      </div>

      <TransactionForm categories={categories} />
      <TransactionList transactions={transactions} />
    </div>
  );
}

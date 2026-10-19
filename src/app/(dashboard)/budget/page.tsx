import { connection } from "next/server";
import { fetchBudgets } from "@/src/lib/actions/budget-actions";
import { fetchCategories } from "@/src/lib/actions/category-actions";
import BudgetForm from "./_components/BudgetForm";
import BudgetList from "./_components/BudgetList";

export const instant = false;

export default async function BudgetPage() {
  await connection();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [budgets, categories] = await Promise.all([
    fetchBudgets(year, month),
    fetchCategories(),
  ]);

  const expenseCategories = categories.filter(
    (c: { type: string }) => c.type === "expense"
  );

  const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Budget</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Set and track monthly budgets — {monthName}
        </p>
      </div>

      <BudgetForm categories={expenseCategories} year={year} month={month} />
      <BudgetList budgets={budgets} />
    </div>
  );
}

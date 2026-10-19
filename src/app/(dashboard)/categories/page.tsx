import { fetchCategories } from "@/src/lib/actions/category-actions";
import CategoryForm from "./_components/CategoryForm";
import CategoryGrid from "./_components/CategoryGrid";

export const instant = false;

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Manage custom categories for income and expenses
        </p>
      </div>

      <CategoryForm />
      <CategoryGrid categories={categories} />
    </div>
  );
}

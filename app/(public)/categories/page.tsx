import type { Metadata } from "next";
import { getCategories } from "@/lib/catalog";
import CategoryCard from "@/components/CategoryCard";

export const metadata: Metadata = {
  title: "Categories | Zayyy",
  description: "Shop the Zayyy by category.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find exactly what you’re looking for.
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          No categories yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
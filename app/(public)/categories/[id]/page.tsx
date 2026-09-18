import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryById, getCategoryProducts } from "@/lib/catalog";
import ProductGrid from "@/components/ProductGrid";

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryById(id);
  return {
    title: category ? `${category.name} | Zayyy` : "Category | Zayyy",
    description: category?.description ?? undefined,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const [category, products] = await Promise.all([
    getCategoryById(id),
    getCategoryProducts(id),
  ]);

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-sm text-gray-500">{category.description}</p>
        )}
        <p className="mt-2 text-xs text-gray-400">
          {category.productCount ?? 0} products
        </p>
      </header>

      <ProductGrid
        products={products}
        emptyTitle="No products in this category"
        emptyDescription="Products will appear here as soon as shops list them."
      />
    </div>
  );
}
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/guards";
import { getCategories } from "@/lib/catalog";
import { getSellerProduct } from "@/lib/seller";
import ProductForm from "@/components/forms/ProductForm";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Product | Zayyy",
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const user = await requireAuth();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getSellerProduct(user.id, id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Edit product</h1>
        <p className="mt-1 text-sm text-gray-500">{product.name}</p>
      </header>

      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock,
          image: product.image,
          status: product.status as "DRAFT" | "ACTIVE",
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}
import type { Metadata } from "next";
import ProductListing from "@/components/ProductListing";

export const metadata: Metadata = {
  title: "Products | Zayyy",
  description: "Browse products from every shop in the Zayyy.",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const clean: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") clean[key] = value;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Every product, from every shop in the Zayyy.
        </p>
      </header>

      <ProductListing path="/products" searchParams={clean} />
    </div>
  );
}
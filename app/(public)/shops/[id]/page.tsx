import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveShop, getActiveShopProducts } from "@/lib/catalog";
import ProductImage from "@/components/ProductImage";
import ProductGrid from "@/components/ProductGrid";
import Badge from "@/components/ui/Badge";

type ShopPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { id } = await params;
  const shop = await getActiveShop(id);
  return {
    title: shop ? `${shop.name} | Zayyy` : "Shop | Zayyy",
    description: shop?.description?.slice(0, 160) ?? undefined,
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { id } = await params;
  const [shop, products] = await Promise.all([
    getActiveShop(id),
    getActiveShopProducts(id),
  ]);

  if (!shop) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProductImage
          src={shop.logoUrl}
          alt={shop.name}
          className="h-20 w-20 shrink-0 rounded-xl"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
            <Badge variant="success">Open</Badge>
          </div>
          <p className="mt-2 text-sm text-gray-500">{shop.description}</p>
          <p className="mt-2 text-xs text-gray-400">
            {shop.productCount ?? 0} products · Owner: {shop.ownerName}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Products</h2>
        <ProductGrid
          products={products}
          emptyTitle="No products listed"
          emptyDescription={`${shop.name} has not listed any products yet.`}
        />
      </section>
    </div>
  );
}
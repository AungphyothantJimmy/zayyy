import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProductById, getRelatedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";
import ProductGrid from "@/components/ProductGrid";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getPublicProductById(id);
  return {
    title: product ? `${product.name} | Zayyy` : "Product | Zayyy",
    description: product?.description?.slice(0, 160) ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getPublicProductById(id);
  if (!product) notFound();

  const related = await getRelatedProducts(id, product.categoryId, 4);

  const inStock = product.stock > 0;

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="aspect-square w-full rounded-2xl"
        />

        <div className="flex flex-col gap-4">
          <div>
            {product.category && (
              <Link
                href={`/categories/${product.category.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
          </div>

          <p className="text-3xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </p>

          <div className="flex items-center gap-2">
            {inStock ? (
              <Badge variant="success">
                In stock{product.stock <= 5 ? ` · only ${product.stock} left` : ""}
              </Badge>
            ) : (
              <Badge variant="danger">Out of stock</Badge>
            )}
          </div>

          {product.shop && (
            <p className="text-sm text-gray-500">
              Sold by{" "}
              <Link
                href={`/shops/${product.shop.id}`}
                className="font-medium text-gray-900 underline-offset-2 hover:underline"
              >
                {product.shop.name}
              </Link>
            </p>
          )}

          <p className="text-sm text-gray-600">{product.description}</p>

          <div className="mt-auto pt-4">
            <Button disabled size="lg" className="w-full sm:w-auto">
              Add to cart — coming soon
            </Button>
            <p className="mt-2 text-xs text-gray-400">
              Cart and checkout arrive in Phase 3.
            </p>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          You might also like
        </h2>
        <ProductGrid
          products={related}
          emptyTitle="No related products"
          emptyDescription="Check back soon for more from this category."
        />
      </section>
    </div>
  );
}
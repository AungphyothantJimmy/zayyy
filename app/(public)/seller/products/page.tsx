import Link from "next/link";
import { requireAuth } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/ProductImage";
import DeleteProductButton from "@/components/DeleteProductButton";

export const metadata = { title: "My Products | Zayyy" };

const statusVariant = {
  ACTIVE: "success",
  DRAFT: "default",
  SUSPENDED: "danger",
} as const;

export default async function SellerProductsPage() {
  const user = await requireAuth();

  const shop = await prisma.shop.findFirst({ where: { ownerId: user.id } });
  const products = shop
    ? await prisma.product.findMany({
        where: { shopId: shop.id },
        orderBy: { createdAt: "desc" },
        include: { category: { select: { name: true } } },
      })
    : [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} product{products.length === 1 ? "" : "s"} listed
            {shop ? ` under ${shop.name}` : ""}.
          </p>
        </div>
        <Link
          href="/seller/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New product
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          {shop ? (
            <>
              <p className="text-sm text-gray-500">
                You haven’t listed any products yet.
              </p>
              <Link
                href="/seller/products/new"
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Add your first product →
              </Link>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              You need a shop before you can list products.{" "}
              <Link
                href="/seller/shop"
                className="text-blue-600 hover:underline"
              >
                Open a shop
              </Link>
              .
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-100">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 p-4"
              >
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="h-14 w-14 shrink-0 rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="block truncate text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[product.status] ?? "default"}>
                      {product.status}
                    </Badge>
                    {product.category && (
                      <span className="text-xs text-gray-400">
                        {product.category.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.price.toString())}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton
                    productId={product.id}
                    productName={product.name}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
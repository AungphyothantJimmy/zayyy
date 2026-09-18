import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { getSellerDashboard } from "@/lib/seller";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ProductImage from "@/components/ProductImage";
import { requireAuth } from "@/lib/guards";

export const metadata = { title: "Dashboard | Zayyy" };

export default async function SellerDashboardPage() {
  const user = await requireAuth();
  const dashboard = await getSellerDashboard(user.id);
  const shop = dashboard.shop;

  const recentProducts = shop
    ? await prisma.product.findMany({
        where: { shopId: shop.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    : [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user.name}.
        </p>
      </header>

      {!shop ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            You don’t have a shop yet.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Open one now to start listing products on the Zayyy.
          </p>
          <Link
            href="/seller/shop"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Open my shop
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-gray-500">Total products</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {dashboard.totalProducts}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Live</p>
              <p className="mt-1 text-3xl font-bold text-green-600">
                {dashboard.activeProducts}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {dashboard.draftProducts}
              </p>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent products</h2>
              <Link
                href="/seller/products"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                No products yet.{" "}
                <Link href="/seller/products/new" className="text-blue-600 hover:underline">
                  Add your first product
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-gray-100">
                {recentProducts.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 py-3"
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 shrink-0 rounded-md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Badge
                          variant={
                            product.status === "ACTIVE"
                              ? "success"
                              : product.status === "DRAFT"
                                ? "default"
                                : "danger"
                          }
                        >
                          {product.status}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.price.toString())}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
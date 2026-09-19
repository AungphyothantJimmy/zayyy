import { getSessionUser } from "@/lib/auth";
import { getSellerOrders } from "@/lib/seller";
import { redirect } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/lib/generated/prisma/client";

const statusVariant: Record<OrderStatus, "success" | "warning" | "danger" | "default" | "info"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "warning",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export const metadata = { title: "Orders | Zayyy" };

export default async function SellerOrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const orders = await getSellerOrders(user.id);
  const orderList = orders ?? [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage orders from your shop.
        </p>
      </header>

      {orderList.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-gray-500">No orders found.</p>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-100">
            {orderList.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/seller/orders/${order.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Order {order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.user.name} · {order.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={statusVariant[order.orderStatus]}>
                        {order.orderStatus}
                      </Badge>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatPrice(String(order.totalAmount))}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { getSessionUser } from "@/lib/auth";
import { getSellerOrderById } from "@/lib/seller";
import { redirect, notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ProductImage from "@/components/ProductImage";
import OrderActions from "@/components/OrderActions";
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

function toStr(val: unknown): string {
  if (typeof val === "string") return val;
  return String(val);
}

export const metadata = { title: "Order Detail | Zayyy" };

export default async function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const order = await getSellerOrderById(user.id, id);
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">
          Order {order.id.slice(0, 8)}
        </h1>
        <Badge variant={statusVariant[order.orderStatus]}>
          {order.orderStatus}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="font-semibold text-gray-900">Order Summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Customer:</span>{" "}
              {order.user.name}
            </p>
            <p>
              <span className="text-gray-500">Date:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="text-gray-500">Total:</span>{" "}
              {formatPrice(toStr(order.totalAmount))}
            </p>
            <p>
              <span className="text-gray-500">Payment:</span>{" "}
              {order.paymentStatus}
            </p>
            <p>
              <span className="text-gray-500">Method:</span> {order.paymentMethod}
            </p>
            <p>
              <span className="text-gray-500">Address:</span>{" "}
              {order.shippingTownship}
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900">Order Status</h3>
          <div className="mt-3 flex items-center gap-1">
            {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map(
              (s, i) => {
                const currentIndex = [
                  "PENDING",
                  "CONFIRMED",
                  "PROCESSING",
                  "SHIPPED",
                  "DELIVERED",
                ].indexOf(order.orderStatus);
                const isActive = i <= currentIndex;
                return (
                  <div key={s} className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isActive ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                    <span
                      className={`ml-1 text-xs ${
                        isActive ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {s}
                    </span>
                    {i < 4 && (
                      <div
                        className={`ml-2 h-0.5 w-8 ${
                          i < currentIndex ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                );
              },
            )}
            {order.orderStatus === "CANCELLED" && (
              <Badge variant="danger" className="ml-2">Cancelled</Badge>
            )}
          </div>

          <div className="mt-4">
            <OrderActions orderId={order.id} currentStatus={order.orderStatus} />
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-gray-900">Order Items</h3>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <ProductImage
                src={item.product.image}
                alt={item.product.name}
                className="h-12 w-12 shrink-0 rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × {formatPrice(toStr(item.unitPrice))}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(toStr(item.subtotal))}
              </p>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-right text-lg font-bold text-gray-900">
              {formatPrice(toStr(order.totalAmount))}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

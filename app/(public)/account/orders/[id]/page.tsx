import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getOrderById } from "@/lib/order";
import { formatPrice } from "@/lib/utils";
import OrderItem from "@/components/OrderItem";
import OrderStatus from "@/components/OrderStatus";
import ShippingForm from "@/components/ShippingForm";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

type OrderDetailProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: OrderDetailProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id.slice(0, 6).toUpperCase()} | Zayyy` };
}

export default async function OrderDetailPage({ params }: OrderDetailProps) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const order = await getOrderById(user.id, id);
  if (!order) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(0, 6).toUpperCase()}
          </h1>
          <OrderStatus status={order.orderStatus} />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Placed on {order.createdAt.slice(0, 10)} ·{" "}
          {order.itemCount} item{order.itemCount !== 1 ? "s" : ""} ·{" "}
          {formatPrice(order.totalAmount)}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              Shipping Information
            </h2>
            <ShippingForm order={order} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              Order Items ({order.itemCount})
            </h2>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </ul>
            <div className="mt-3 flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              Payment
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Method:</span>{" "}
                {order.paymentMethod.replace("_", " ")}
              </p>
              <p>
                <span className="text-gray-500">Status:</span>{" "}
                <Badge
                  variant={
                    order.paymentStatus === "PAID"
                      ? "success"
                      : order.paymentStatus === "FAILED"
                        ? "danger"
                        : "default"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              Order Status
            </h2>
            <OrderStatus status={order.orderStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}

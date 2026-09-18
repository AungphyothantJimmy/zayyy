import Link from "next/link";
import type { OrderDto } from "@/types";
import { formatPrice } from "@/lib/utils";
import OrderStatus from "@/components/OrderStatus";

type OrderCardProps = {
  order: OrderDto;
};

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Order #{order.id.slice(-6).toUpperCase()}
          </p>
          <p className="text-xs text-gray-500">
            {order.createdAt.slice(0, 10)} · {order.itemCount} item
            {order.itemCount !== 1 ? "s" : ""} · {formatPrice(order.totalAmount)}
          </p>
        </div>
        <OrderStatus status={order.orderStatus} />
      </div>
    </Link>
  );
}
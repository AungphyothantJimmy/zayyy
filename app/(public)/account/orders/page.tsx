import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getOrders } from "@/lib/order";
import OrderCard from "@/components/OrderCard";
import EmptyCart from "@/components/EmptyCart";

export const metadata = { title: "My Orders | Zayyy" };

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const orders = await getOrders(user.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed.
        </p>
      </header>

      {orders.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

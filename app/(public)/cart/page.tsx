"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import EmptyCart from "@/components/EmptyCart";
import type { CartDto } from "@/types";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setCart(data.cart);
    } catch {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCart();
  }, [loadCart]);

  async function handleUpdate(id: string, quantity: number) {
    if (quantity === 0) {
      await fetch(`/api/cart/items/${id}`, { method: "DELETE" });
    } else {
      await fetch(`/api/cart/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
    }
    await loadCart();
    await router.refresh();
  }

  async function handleRemove(id: string) {
    await fetch(`/api/cart/items/${id}`, { method: "DELETE" });
    await loadCart();
    await router.refresh();
  }

  async function handleClear() {
    await fetch("/api/cart", { method: "DELETE" });
    await loadCart();
    await router.refresh();
  }

  async function handleCheckout() {
    if (!cart || cart.itemCount === 0) return;
    router.push("/checkout");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Loading cart…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!cart) return null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
        <p className="mt-1 text-sm text-gray-500">
          {cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""} in your cart.
        </p>
      </header>

      {cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <ul className="space-y-0 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </ul>
          <div>
            <CartSummary
              total={cart.total}
              itemCount={cart.itemCount}
              onCheckout={handleCheckout}
              onClearCart={handleClear}
            />
          </div>
        </div>
      )}
    </div>
  );
}

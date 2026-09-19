"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CartItem from "@/components/CartItem";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import type { CartDto } from "@/types";
import { formatPrice } from "@/lib/utils";

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
    loadCart();
  }, [loadCart]);

  async function handleUpdate(id: string, quantity: number) {
    if (quantity < 1) return;
    try {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        loadCart();
      }
    } catch {
      setError("Failed to update cart.");
    }
  }

  async function handleRemove(id: string) {
    try {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadCart();
      }
    } catch {
      setError("Failed to remove item.");
    }
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
        <Card className="p-8 text-center">
          <EmptyState
            title="Your cart is empty"
            description="Browse products and add them to your cart."
          />
          <div className="mt-4">
            <Link
              href="/products"
              className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Cart ({cart.itemCount})</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <ul className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
          </div>
        </div>

        <div>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items ({cart.itemCount})</span>
                <span className="font-medium">{formatPrice(cart.total)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

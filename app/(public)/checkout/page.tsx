"use client";
import Link from "next/link";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import CartItem from "@/components/CartItem";
import type { CartDto } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  async function handleSubmit(data: {
    shippingName: string;
    shippingPhone: string;
    shippingCity: string;
    shippingTownship: string;
    shippingInstructions?: string;
    paymentMethod: string;
  }) {
    if (!cart || cart.itemCount === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const order = await res.json();
        setSuccess(true);
        setTimeout(() => {
          router.push(`/account/orders/${order.order.id}`);
          router.refresh();
        }, 500);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error ?? "Checkout failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Loading cart…
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
          <p className="text-lg font-semibold text-green-700">
            Order placed successfully!
          </p>
          <p className="mt-2 text-sm text-green-600">
            Redirecting to order details…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Items ({cart.itemCount})
            </h2>
            <ul className="mt-3 space-y-2 divide-y divide-gray-100">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold">{cart.total}</span>
            </div>
          </div>
        </div>

        <div>
          <CheckoutForm total={cart.total} onSubmit={handleSubmit} loading={submitting} />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

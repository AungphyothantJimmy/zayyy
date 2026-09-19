"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  inStock: boolean;
};

export default function AddToCartButton({
  productId,
  productName,
  inStock,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleAdd() {
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (res.ok) {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to add to cart.");
    }
    setLoading(false);
  }

  if (!inStock) {
    return (
      <Button disabled size="lg" className="w-full sm:w-auto">
        Out of stock
      </Button>
    );
  }

  return (
    <div>
      <Button
        type="button"
        loading={loading}
        onClick={handleAdd}
        className="w-full sm:w-auto"
      >
        {success ? "Added! ✓" : "Add to Cart"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export default function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;

    setLoading(true);
    setError("");

    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Failed to delete product.");
    setLoading(false);
  }

  return (
    <div>
      <Button
        type="button"
        variant="danger"
        size="sm"
        loading={loading}
        onClick={onDelete}
      >
        Delete
      </Button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
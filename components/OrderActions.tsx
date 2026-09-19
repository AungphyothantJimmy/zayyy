"use client";

import { useState } from "react";
import { OrderStatus } from "@/lib/generated/prisma/client";
import Button from "@/components/ui/Button";

type OrderActionsProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export default function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onUpdateStatus() {
    if (selectedStatus === currentStatus) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        window.location.reload();
      } else {
        setError(data.error ?? "Failed to update status.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const canCancel = currentStatus !== "CANCELLED" && currentStatus !== "DELIVERED";

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Update Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onUpdateStatus}
          loading={loading}
          disabled={selectedStatus === currentStatus || loading}
          className="flex-1"
        >
          Update Status
        </Button>
        {canCancel && (
          <Button
            variant="danger"
            onClick={() => {
              setSelectedStatus("CANCELLED");
              onUpdateStatus();
            }}
            loading={loading}
            disabled={selectedStatus === "CANCELLED" || loading}
          >
            Cancel
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex items-center gap-1 text-xs text-gray-400">
        {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map(
          (s, i) => {
            const currentIndex = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].indexOf(currentStatus);
            const isActive = i <= currentIndex;
            return (
              <div key={s} className="flex items-center">
                <div className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-blue-600" : "bg-gray-300"}`} />
                <span className={`ml-0.5 ${isActive ? "text-gray-600" : "text-gray-300"}`}>{s}</span>
                {i < 4 && <div className={`ml-1 h-0.5 w-4 ${i < currentIndex ? "bg-blue-600" : "bg-gray-300"}`} />}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

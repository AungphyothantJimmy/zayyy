"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { CheckoutInput } from "@/types";

type CheckoutFormProps = {
  total: string;
  onSubmit: (data: CheckoutInput) => void;
  loading: boolean;
};

export default function CheckoutForm({
  total,
  onSubmit,
  loading,
}: CheckoutFormProps) {
  const [form, setForm] = useState<CheckoutInput>({
    shippingName: "",
    shippingPhone: "",
    shippingCity: "",
    shippingTownship: "",
    shippingInstructions: "",
    paymentMethod: "cash_on_delivery",
  });
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const required = [
      "shippingName",
      "shippingPhone",
      "shippingCity",
      "shippingTownship",
      "paymentMethod",
    ];
    for (const f of required) {
      if (!form[f as keyof CheckoutInput] || String(form[f as keyof CheckoutInput]).trim() === "") {
        setError("Please fill in all required fields.");
        return;
      }
    }
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Order Summary — {total}
      </h2>

      <h3 className="text-sm font-semibold text-gray-700">
        Shipping Information
      </h3>
      <Input
        label="Full Name"
        name="shippingName"
        value={form.shippingName}
        onChange={handleChange}
        required
      />
      <Input
        label="Phone"
        name="shippingPhone"
        value={form.shippingPhone}
        onChange={handleChange}
        required
      />
      <Input
        label="Address"
        onChange={handleChange}
        required
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          label="City"
          name="shippingCity"
          value={form.shippingCity}
          onChange={handleChange}
          required
        />
        <Input
          label="Township"
          name="shippingTownship"
          value={form.shippingTownship}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label
          htmlFor="shippingInstructions"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Additional Instructions (optional)
        </label>
        <textarea
          id="shippingInstructions"
          name="shippingInstructions"
          rows={3}
          value={form.shippingInstructions}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-700">
        Payment Method
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="cod"
          name="paymentMethod"
          value="cash_on_delivery"
          checked={form.paymentMethod === "cash_on_delivery"}
          onChange={handleChange}
          className="h-4 w-4 accent-blue-600"
        />
        <label htmlFor="cod" className="text-sm text-gray-700">
          Cash on Delivery
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Place Order
      </Button>
    </form>
  );
}
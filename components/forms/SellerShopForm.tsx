"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Errors = { form?: string } & Record<string, string | undefined>;

export default function SellerShopForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      logoUrl: String(form.get("logoUrl") ?? ""),
    };

    const res = await fetch("/api/shops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      router.push("/seller/dashboard");
      router.refresh();
      return;
    }

    setErrors({ form: data.error, ...(data.errors ?? {}) });
    setLoading(false);
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Shop name"
          name="name"
          placeholder="e.g. Tech World"
          error={errors.name}
          required
        />
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Tell shoppers what you sell…"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <Input
          label="Logo URL (optional)"
          name="logoUrl"
          placeholder="https://… or /images/…"
          error={errors.logoUrl}
        />
        {errors.form && (
          <p className="text-sm text-red-600">{errors.form}</p>
        )}
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          Open my shop
        </Button>
        <p className="text-xs text-gray-400">
          Shops are reviewed by Zayyy admin before they go live.
        </p>
      </form>
    </Card>
  );
}
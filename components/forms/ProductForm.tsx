"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryDto } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type ProductFormProps = {
  categories: CategoryDto[];
  product?: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    stock: number;
    image: string | null;
    status: "DRAFT" | "ACTIVE";
    categoryId: string;
  };
};

type Errors = { form?: string } & Record<string, string | undefined>;

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const isEdit = Boolean(product);
  const productId = product?.id;
  const selectClass =
    "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      price: String(form.get("price") ?? ""),
      stock: String(form.get("stock") ?? ""),
      image: String(form.get("image") ?? ""),
      categoryId: String(form.get("categoryId") ?? ""),
      status: String(form.get("status") ?? ""),
    };

    const res = await fetch(
      isEdit && productId ? `/api/products/${productId}` : "/api/products",
      {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      router.push("/seller/products");
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
          label="Product name"
          name="name"
          defaultValue={product?.name ?? ""}
          placeholder="e.g. Wireless Earbuds"
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
            defaultValue={product?.description ?? ""}
            placeholder="Describe your product…"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price (USD)"
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.price ?? ""}
            placeholder="0.00"
            error={errors.price}
            required
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            min={0}
            step={1}
            defaultValue={product?.stock ?? ""}
            placeholder="0"
            error={errors.stock}
            required
          />
        </div>

        <Input
          label="Image URL (optional)"
          name="image"
          defaultValue={product?.image ?? ""}
          placeholder="https://… or /images/products/…"
          error={errors.image}
        />

        <div>
          <label
            htmlFor="categoryId"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            className={selectClass}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={product?.status ?? "DRAFT"}
            className={selectClass}
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Live</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={loading}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/seller/products")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
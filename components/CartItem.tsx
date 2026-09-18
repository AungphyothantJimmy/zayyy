"use client";

import Link from "next/link";
import type { CartItemDto } from "@/types";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";

type CartItemProps = {
  item: CartItemDto;
  onUpdate?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
};

export default function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  return (
    <li className="flex gap-4 border-b border-gray-100 py-4">
      <ProductImage
        src={item.product.image}
        alt={item.product.name}
        className="h-20 w-20 shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${item.product.id}`}
          className="font-medium text-gray-900 hover:text-blue-600"
        >
          {item.product.name}
        </Link>
        <p className="text-xs text-gray-500">{item.product.shop.name}</p>
        <p className="mt-1 text-sm text-gray-600">{formatPrice(item.product.price)}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdate?.(item.id, item.quantity - 1)}
            className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdate?.(item.id, item.quantity + 1)}
            className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <p className="text-sm font-semibold">{formatPrice(item.subtotal)}</p>
        {item.product.stock < item.quantity && (
          <p className="text-xs text-red-600">
            Only {item.product.stock} available.
          </p>
        )}
        <button
          type="button"
          onClick={() => onRemove?.(item.id)}
          className="text-xs text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
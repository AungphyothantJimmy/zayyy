import type { OrderItemDto } from "@/types";
import { formatPrice } from "@/lib/utils";

type OrderItemProps = {
  item: OrderItemDto;
};

export default function OrderItem({ item }: OrderItemProps) {
  return (
    <li className="flex gap-4 border-b border-gray-100 py-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.872l1.834-8.164M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{item.product.name}</p>
        <p className="text-xs text-gray-500">{item.shop.name}</p>
      </div>
      <div className="shrink-0 text-right text-sm">
        <p className="font-medium">
          {item.quantity} × {formatPrice(item.unitPrice)}
        </p>
        <p className="text-gray-500">{formatPrice(item.subtotal)}</p>
      </div>
    </li>
  );
}
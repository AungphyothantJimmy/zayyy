import Link from "next/link";
import type { ShopDto } from "@/types";
import ProductImage from "@/components/ProductImage";

type ShopCardProps = {
  shop: ShopDto;
};

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link
      href={`/shops/${shop.id}`}
      className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <ProductImage
        src={shop.logoUrl}
        alt={shop.name}
        className="h-14 w-14 shrink-0 rounded-lg"
      />
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-gray-900 hover:text-blue-600 transition-colors">
          {shop.name}
        </h3>
        {shop.description && (
          <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">
            {shop.description}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-400">
          {shop.productCount ?? 0} products
        </p>
      </div>
    </Link>
  );
}
import Link from "next/link";
import type { ProductSummaryDto } from "@/types";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";
import Badge from "@/components/ui/Badge";

type ProductCardProps = {
  product: ProductSummaryDto;
};

export default function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-base font-bold text-blue-600">
          {formatPrice(product.price)}
        </p>

        {product.shop && (
          <p className="text-xs text-gray-500 truncate">
            {product.shop.name}
          </p>
        )}

        <div className="mt-1">
          {inStock ? (
            product.stock <= 5 ? (
              <Badge variant="warning">Only {product.stock} left</Badge>
            ) : (
              <Badge variant="success">In stock</Badge>
            )
          ) : (
            <Badge variant="danger">Out of stock</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
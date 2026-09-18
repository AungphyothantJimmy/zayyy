import type { ProductSummaryDto } from "@/types";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/ui/EmptyState";

type ProductGridProps = {
  products: ProductSummaryDto[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function ProductGrid({
  products,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your search or filters.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
import Link from "next/link";
import type { CategoryDto } from "@/types";

type CategoryCardProps = {
  category: CategoryDto;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div>
        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {category.description}
          </p>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-400">
        {category.productCount ?? 0} products
      </p>
    </Link>
  );
}
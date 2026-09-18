import { getActiveShops, getCategories, getPublicProducts } from "@/lib/catalog";
import ProductGrid from "@/components/ProductGrid";
import ProductFilter from "@/components/ProductFilter";
import Pagination from "@/components/Pagination";

type ProductListingProps = {
  path: string;
  searchParams: Record<string, string | undefined>;
};

export default async function ProductListing({
  path,
  searchParams,
}: ProductListingProps) {
  const query = {
    search: searchParams.q ?? searchParams.search,
    categoryId: searchParams.categoryId,
    shopId: searchParams.shopId,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    inStock: searchParams.inStock === "true",
    page: searchParams.page ? parseInt(searchParams.page, 10) : undefined,
  };

  const [result, categories, shops] = await Promise.all([
    getPublicProducts(query),
    getCategories(),
    getActiveShops(),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside>
        <ProductFilter
          path={path}
          current={searchParams}
          categories={categories}
          shops={shops}
        />
      </aside>

      <div>
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <p>
            {result.total} product{result.total === 1 ? "" : "s"}
          </p>
          {(searchParams.q || searchParams.search) && (
            <p>
              Results for{" "}
              <span className="font-medium text-gray-900">
                “{searchParams.q ?? searchParams.search}”
              </span>
            </p>
          )}
        </div>

        <ProductGrid products={result.products} />

        <Pagination
          currentPage={result.page}
          totalPages={result.totalPages}
          basePath={path}
          preserve={searchParams}
        />
      </div>
    </div>
  );
}
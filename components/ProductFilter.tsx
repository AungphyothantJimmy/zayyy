import type { CategoryDto, ShopDto } from "@/types";
import { cn } from "@/lib/utils";
import Input from "@/components/ui/Input";

type ProductFilterProps = {
  path: string;
  current: Record<string, string | undefined>;
  categories: CategoryDto[];
  shops: ShopDto[];
};

export default function ProductFilter({
  path,
  current,
  categories,
  shops,
}: ProductFilterProps) {
  const hasFilters = Boolean(
    current.q ||
      current.categoryId ||
      current.shopId ||
      current.minPrice ||
      current.maxPrice ||
      current.inStock,
  );

  const selectClass = cn(
    "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
    "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200",
  );

  return (
    <form
      method="get"
      action={path}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        {hasFilters && (
          <a
            href={path}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Clear all
          </a>
        )}
      </div>

      <div>
        <label
          htmlFor="filter-q"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Search
        </label>
        <input
          id="filter-q"
          type="search"
          name="q"
          defaultValue={current.q ?? ""}
          placeholder="Search products…"
          className={selectClass}
        />
      </div>

      <div>
        <label
          htmlFor="filter-category"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="filter-category"
          name="categoryId"
          defaultValue={current.categoryId ?? ""}
          className={selectClass}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="filter-shop"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Shop
        </label>
        <select
          id="filter-shop"
          name="shopId"
          defaultValue={current.shopId ?? ""}
          className={selectClass}
        >
          <option value="">All shops</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Min price"
          name="minPrice"
          type="number"
          min={0}
          step="0.01"
          defaultValue={current.minPrice ?? ""}
          placeholder="0"
        />
        <Input
          label="Max price"
          name="maxPrice"
          type="number"
          min={0}
          step="0.01"
          defaultValue={current.maxPrice ?? ""}
          placeholder="Any"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="inStock"
          value="true"
          defaultChecked={current.inStock === "true"}
          className="h-4 w-4 rounded border-gray-300 accent-blue-600"
        />
        In stock only
      </label>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Apply filters
      </button>
    </form>
  );
}
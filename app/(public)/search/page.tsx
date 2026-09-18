import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import ProductListing from "@/components/ProductListing";

export const metadata: Metadata = {
  title: "Search | Zayyy",
  description: "Search across every product from every shop.",
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const clean: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") clean[key] = value;
  }

  const q = clean.q ?? clean.search ?? "";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Search</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search across every product in the Zayyy.
        </p>
      </header>

      <div className="max-w-xl">
        <SearchBar initialValue={q} />
      </div>

      {q ? (
        <ProductListing path="/search" searchParams={{ ...clean, q }} />
      ) : (
        <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Type a keyword above to search products.
        </p>
      )}
    </div>
  );
}
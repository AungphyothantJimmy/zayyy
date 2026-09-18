import Link from "next/link";
import type { Metadata } from "next";
import { getActiveShops } from "@/lib/catalog";
import ShopCard from "@/components/ShopCard";

export const metadata: Metadata = {
  title: "Shops | Zayyy",
  description: "Explore independent shops on the Zayyy marketplace.",
};

export default async function ShopsPage() {
  const shops = await getActiveShops();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
        <p className="mt-1 text-sm text-gray-500">
          Independent vendors selling across the Zayyy.
        </p>
      </header>

      {shops.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          No shops are open yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        Want to open a shop? <Link href="/sell" className="font-medium text-blue-600 hover:underline">Become a seller</Link>.
      </p>
    </div>
  );
}
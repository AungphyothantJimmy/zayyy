import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-16 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Shop from many vendors, all in one place
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Anyone can start and sell their own products on Zayyy. Browse,
            buy, and track your orders — all in one Zayyy.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="!bg-blue-900 !text-white hover:!bg-blue-800"
              >
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900">Buy</h3>
            <p className="mt-2 text-sm text-gray-500">
              Browse products from any shop in the Zayyy and check out
              with a single cart.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900">Sell</h3>
            <p className="mt-2 text-sm text-gray-500">
              Become a seller, open a shop, and list your products for the
              whole Zayyy to see.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900">Track</h3>
            <p className="mt-2 text-sm text-gray-500">
              Follow every order from confirmed to delivered, on both sides of
              the counter.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
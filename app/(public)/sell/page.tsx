import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Sell on Zayyy | Zayyy",
  description: "Open a shop and reach shoppers across the Zayyy.",
};

export default async function SellPage() {
  const user = await getSessionUser();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Sell on Zayyy</h1>
        <p className="mt-3 text-lg text-gray-500">
          Open a shop, list your products, and reach shoppers across the whole
          marketplace.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900">Open a shop</h3>
          <p className="mt-2 text-sm text-gray-500">
            Give your shop a name and a description to start.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900">List products</h3>
          <p className="mt-2 text-sm text-gray-500">
            Add photos, prices, and stock — go live in minutes.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900">Get approved</h3>
          <p className="mt-2 text-sm text-gray-500">
            A Zayyy admin reviews your shop before it opens to shoppers.
          </p>
        </Card>
      </div>

      <div className="text-center">
        {user ? (
          <Link href="/seller/shop">
            <Button size="lg">Open my shop</Button>
          </Link>
        ) : (
          <Link href="/register">
            <Button size="lg">Create an account to start</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
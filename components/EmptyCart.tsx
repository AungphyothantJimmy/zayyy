import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <p className="text-gray-600">Your cart is empty.</p>
      <Link
        href="/products"
        className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Browse Products
      </Link>
    </div>
  );
}

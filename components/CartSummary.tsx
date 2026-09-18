import { formatPrice } from "@/lib/utils";

type CartSummaryProps = {
  total: string;
  itemCount: number;
  onCheckout: () => void;
  onClearCart: () => void;
};

export default function CartSummary({
  total,
  itemCount,
  onCheckout,
  onClearCart,
}: CartSummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Items ({itemCount})</span>
          <span className="font-medium">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span className="font-medium">Free</span>
        </div>
        <div className="border-t border-gray-100 pt-2">
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={onCheckout}
          disabled={itemCount === 0}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Checkout
        </button>
        <button
          type="button"
          onClick={onClearCart}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
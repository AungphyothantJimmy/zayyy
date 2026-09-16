import { ComingSoonWithBack } from "@/components/ComingSoon";

export const metadata = { title: "Products | MarketHub" };

export default function ProductsPage() {
  return (
    <ComingSoonWithBack
      title="Product catalog is on its way"
      description="Browse products from every shop in the Zayyy."
      phase="Phase 2"
    />
  );
}
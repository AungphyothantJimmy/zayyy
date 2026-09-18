import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/guards";
import { getCategories } from "@/lib/catalog";
import { getSellerShop } from "@/lib/seller";
import ProductForm from "@/components/forms/ProductForm";

export const metadata = { title: "New Product | Zayyy" };

export default async function NewProductPage() {
  const user = await requireAuth();
  const shop = await getSellerShop(user.id);
  if (!shop) redirect("/seller/shop");

  const categories = await getCategories();

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">New product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Products stay drafts until you set them live. Drafts only appear to
          you until your shop is approved.
        </p>
      </header>

      <ProductForm categories={categories} />
    </div>
  );
}
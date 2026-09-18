import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getSellerShop } from "@/lib/seller";
import { redirect } from "next/navigation";
import SellerShopForm from "@/components/forms/SellerShopForm";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ProductImage from "@/components/ProductImage";

export const metadata = { title: "My Shop | Zayyy" };

const statusInfo: Record<
  string,
  { variant: "success" | "warning" | "danger" | "default"; note: string }
> = {
  ACTIVE: {
    variant: "success",
    note: "Your shop is live and visible to shoppers.",
  },
  PENDING: {
    variant: "warning",
    note: "Your shop is under review. You can list draft products while you wait.",
  },
  REJECTED: {
    variant: "danger",
    note: "Your shop has not been approved. Contact Zayyy support for help.",
  },
  SUSPENDED: {
    variant: "danger",
    note: "Your shop has been suspended. Contact Zayyy support for help.",
  },
};

export default async function SellerShopPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const shop = await getSellerShop(user.id);

  if (!shop) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Open your shop</h1>
          <p className="mt-1 text-sm text-gray-500">
            Shops are reviewed by Zayyy admin before going live.
          </p>
        </header>
        <div className="max-w-lg">
          <SellerShopForm />
        </div>
      </div>
    );
  }

  const info = statusInfo[shop.status] ?? {
    variant: "default",
    note: "",
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">My Shop</h1>
      </header>

      <Card>
        <div className="flex items-start gap-4">
          <ProductImage
            src={shop.logoUrl}
            alt={shop.name}
            className="h-16 w-16 shrink-0 rounded-xl"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {shop.name}
              </h2>
              <Badge variant={info.variant}>{shop.status}</Badge>
            </div>
            {shop.description && (
              <p className="mt-1 text-sm text-gray-500">{shop.description}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">{info.note}</p>
          </div>
        </div>

        {shop.status === "ACTIVE" && (
          <p className="mt-4 border-t border-gray-100 pt-4 text-sm">
            <Link
              href={`/shops/${shop.id}`}
              className="font-medium text-blue-600 hover:underline"
            >
              View public shop page →
            </Link>
          </p>
        )}
      </Card>
    </div>
  );
}
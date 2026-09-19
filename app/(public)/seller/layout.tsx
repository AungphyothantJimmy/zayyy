import { getSessionUser } from "@/lib/auth";
import { getSellerShop } from "@/lib/seller";
import { redirect } from "next/navigation";
import Badge from "@/components/ui/Badge";
import SellerNav from "@/components/SellerNav";

const statusVariant = {
  ACTIVE: "success",
  PENDING: "warning",
  REJECTED: "danger",
  SUSPENDED: "danger",
} as const;

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const shop = await getSellerShop(user.id);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Seller console
            </h2>
            {shop && (
              <Badge variant={statusVariant[shop.status] ?? "default"}>
                {shop.status}
              </Badge>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-gray-500">
            {shop ? shop.name : user.name || user.email}
          </p>
        </div>

        <SellerNav />
      </aside>

      <main className="min-w-0">{children}</main>
    </div>
  );
}

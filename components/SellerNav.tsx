"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/seller/dashboard", label: "Dashboard" },
  { href: "/seller/shop", label: "My Shop" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/products/new", label: "New Product" },
  { href: "/seller/orders", label: "Orders" },
];

export default function SellerNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active =
          item.href === "/seller/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
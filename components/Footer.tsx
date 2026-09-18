import Link from "next/link";

const BUY_LINKS = [
  { href: "/products", label: "Browse Products" },
  { href: "/shops", label: "Visit Shops" },
  { href: "/categories", label: "Categories" },
];

const SELL_LINKS = [{ href: "/sell", label: "Become a Seller" }];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Zayyy</h3>
            <p className="mt-2 text-sm text-gray-500">
              Multi-vendor Zayyy for everyone.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Buy</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              {BUY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gray-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Sell</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              {SELL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gray-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Account</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              <li><Link href="/login" className="hover:text-gray-700">Login</Link></li>
              <li><Link href="/register" className="hover:text-gray-700">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Zayyy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
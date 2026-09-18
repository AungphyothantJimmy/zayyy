import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/shops", label: "Shops" },
  { href: "/sell", label: "Sell" },
];

export default async function Header() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 text-xl font-bold text-blue-600">
            Zayyy
          </Link>

          {/* Search */}
          <form
            action="/search"
            method="GET"
            className="hidden sm:flex flex-1 max-w-md"
          >
            <input
              name="q"
              type="text"
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </form>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343
                     1.087.835l.383 1.437M7.5 14.25a3 3 0
                     00-3 3h15.75m-12.75-3h11.218c1.121
                     0 2.09-.773 2.34-1.872l1.834-8.164M7.5
                     14.25L5.106 5.272M6 20.25a.75.75 0
                     11-1.5 0 .75.75 0 011.5 0zm12.75
                     0a.75.75 0 11-1.5 0 .75.75 0
                     011.5 0z"
                />
              </svg>
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "ADMIN" ? (
                  <Link
                    href="/admin/dashboard"
                    className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Hi, {user.name}
                  </Link>
                ) : user.role === "SELLER" ? (
                  <Link
                    href="/seller/dashboard"
                    className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Hi, {user.name}
                  </Link>
                ) : (
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    Hi, {user.name}
                  </span>
                )}
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <form
          action="/search"
          method="GET"
          className="sm:hidden pb-3"
        >
          <input
            name="q"
            type="text"
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </form>
      </div>
    </header>
  );
}
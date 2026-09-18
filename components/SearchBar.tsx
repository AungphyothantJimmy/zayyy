"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  action?: string;
  initialValue?: string;
  className?: string;
};

export default function SearchBar({
  action = "/products",
  initialValue = "",
  className,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `${action}?q=${encodeURIComponent(q)}` : action);
  }

  return (
    <form onSubmit={onSubmit} className={className} role="search">
      <label htmlFor="top-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <input
          id="top-search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-lg rounded-r-none border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center gap-1 bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 rounded-r-lg"
        >
          Search
        </button>
      </div>
    </form>
  );
}
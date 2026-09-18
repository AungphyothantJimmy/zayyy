import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  preserve?: Record<string, string | undefined>;
};

function buildHref(
  page: number,
  basePath: string,
  preserve: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(preserve)) {
    if (value !== undefined && value !== "") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  preserve = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  const window = 1;

  for (let p = 1; p <= totalPages; p++) {
    if (
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - window && p <= currentPage + window)
    ) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Link
        href={buildHref(currentPage - 1, basePath, preserve)}
        aria-disabled={currentPage <= 1}
        className={`rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 ${
          currentPage <= 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Previous
      </Link>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-gray-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p, basePath, preserve)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              p === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={buildHref(currentPage + 1, basePath, preserve)}
        aria-disabled={currentPage >= totalPages}
        className={`rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 ${
          currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
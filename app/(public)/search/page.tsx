import { ComingSoonWithBack } from "@/components/ComingSoon";

export const metadata = { title: "Search | MarketHub" };

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <ComingSoonWithBack
      title={q ? `Results for "${q}" coming soon` : "Search is on its way"}
      description="Search across every product from every shop."
      phase="Phase 2"
    />
  );
}
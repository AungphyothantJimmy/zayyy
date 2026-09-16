import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
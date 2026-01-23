import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeApplicator } from "@/components/ThemeApplicator";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ThemeApplicator />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

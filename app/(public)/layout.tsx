import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingAskAI } from "@/components/floating-ask-ai";
import { PageTransition } from "@/components/motion/page-transition";

/**
 * Public marketing-site chrome.
 *
 * These routes live in the `(public)` route group — a URL-transparent grouping,
 * so `/`, `/about`, `/programs` … keep exactly the same addresses. The group
 * exists so the website chrome (navbar, footer, floating AI counsellor) is
 * scoped to the public site and never leaks into `/admin`, which renders its
 * own console shell from `app/admin/layout.tsx`.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 pb-8 md:pt-24 md:pb-12">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FloatingAskAI />
    </>
  );
}

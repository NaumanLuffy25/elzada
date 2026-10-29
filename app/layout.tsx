import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";

export const metadata: Metadata = {
  title: {
    default: "Elzada Institute of Technology | Premium Engineering Education in Bengaluru",
    template: "%s | Elzada Institute of Technology",
  },
  description:
    "Elzada Institute of Technology, Yelahanka, Bengaluru — NAAC A++ accredited. Explore 28+ programs, admissions 2025, placements, campus life, and chat with our 24×7 AI admission counsellor.",
  keywords: [
    "Elzada",
    "Elzada Institute of Technology",
    "B.Tech admissions",
    "engineering college Bangalore",
    "Yelahanka college",
    "AI counsellor",
    "B.Tech CSE",
    "MBA admissions",
    "M.Tech",
    "placement",
    "NAAC A++",
  ],
  authors: [{ name: "Elzada Institute of Technology" }],
  metadataBase: new URL("https://elzadaIT.vercel.app"),
  openGraph: {
    type: "website",
    title: "Elzada Institute of Technology",
    description:
      "AI-powered admission counselling + premium engineering campus in Yelahanka, Bengaluru. Programs, placements, admissions 2025 now open.",
    siteName: "Elzada Institute of Technology",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Elzada Institute of Technology — Shaping Tomorrow's Engineers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elzada Institute of Technology",
    description:
      "Engineering college in Yelahanka, Bengaluru. NAAC A++. 28+ programs. 24×7 AI admission counsellor.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

/**
 * `viewport` must live in its own export in the App Router — declaring it
 * inside `metadata` is ignored and logs a warning for every route.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

/**
 * Root layout — providers only.
 *
 * Site chrome is deliberately *not* rendered here so the two route groups can
 * own their own shells:
 *  - `app/(public)/layout.tsx` → marketing navbar, footer, floating counsellor
 *  - `app/admin/layout.tsx`    → dedicated operations console shell
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

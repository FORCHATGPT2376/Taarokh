import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/commerce/CartDrawer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "TAAROKH Jaipur | Heritage-Inspired Straps for Analog Watches",
    template: "%s | TAAROKH Jaipur",
  },
  description:
    "Premium watch straps inspired by Jaipur's textile traditions and architecture. Distinctive designs for compatible analog watches, with clear sizing guidance.",
  applicationName: "TAAROKH",
  openGraph: {
    type: "website",
    siteName: "TAAROKH | JAIPUR",
    locale: "en_IN",
    images: [{ url: "/images/editorial/og.jpg", width: 1200, height: 630, alt: "TAAROKH concept strap on an analog watch, on sandstone in patterned window light." }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#F4F0E8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" data-store={site.storeMode} className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <a href="#main" className="sr-only z-[100] bg-ink px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}

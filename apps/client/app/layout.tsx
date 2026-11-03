import { Suspense } from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/helper-components/ThemeProvider";
import NextTopLoader from "nextjs-toploader";
import { CartProvider } from "@/hooks/useCart";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { cn } from "@workspace/ui/lib/utils";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "مطعم إيت ويل | أشهى المشاوي والمأكولات الشرقية",
  description:
    "استمتع بتجربة طعام أصيلة مع أفخم المشاوي على الفحم، والشاورما، والطواجن الفخارية المحضرة بأجود المكونات الطازجة والتوصيل السريع لجميع مناطق القاهرة.",
  keywords: [
    "مطعم شرقي",
    "مشاوي على الفحم",
    "شاورما عربي",
    "طواجن مصرية",
    "توصيل طعام القاهرة",
    "Eat Well Restaurant",
  ],
  openGraph: {
    title: "مطعم إيت ويل | أشهى المشاوي والمأكولات الشرقية",
    description:
      "أشهى الأطباق الشرقية والمشاوي على الفحم بتتبيلات سرية مميزة وتوصيل سريع حتى باب منزلك.",
    type: "website",
    locale: "ar_EG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cn("h-full antialiased", cairo.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <NextTopLoader
              color="#e1701a"
              height={3}
              showSpinner={false}
              shadow="0 0 10px #e1701a,0 0 5px #e1701a"
            />
            <Suspense>
              <Navbar />
            </Suspense>
            <div className="flex-1">{children}</div>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/helper-components/ThemeProvider";
import NextTopLoader from "nextjs-toploader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { cn } from "@workspace/ui/lib/utils";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "لوحة التحكم | مطعم إيت ويل",
  description: "نظام إدارة المطعم والطلبات والمنتجات والتقارير",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cn("h-full antialiased", cairo.variable)}>
      <body className="min-h-full flex bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="#e1701a"
            height={3}
            showSpinner={false}
            shadow="0 0 10px #e1701a,0 0 5px #e1701a"
          />
          <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <AdminHeader />
              <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

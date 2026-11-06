"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ThemeToggle } from "@/components/helper-components/ThemeToggle";
import { UserNav } from "@/components/layout/UserNav";
import { useSession } from "@/requests/useSession";
import { logout } from "@/requests/logout";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import {
  Flame,
  ShoppingBag,
  Clock,
  Menu,
  X,
  PhoneCall,
  Search,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/menu", label: "قائمة الطعام" },
  { href: "/menu?featured=true", label: "العروض المميزة" },
  { href: "/orders/track", label: "تتبع طلبك" },
  { href: "/about", label: "عن المطعم" },
  { href: "/contact", label: "اتصل بنا" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all">
      {/* Top micro banner */}
      {/* <div className="bg-primary text-primary-foreground text-[11px] font-semibold py-1 px-4 text-center hidden sm:flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>توصيل سريع ساخن خلال 30-45 دقيقة في جميع أنحاء القاهرة</span>
        </span>
        <span className="opacity-60">•</span>
        <span className="flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>للطلبات المباشرة: +20 100 000 0000</span>
        </span>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block text-foreground">
                إيت ويل
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("?")[0]!);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/menu"
            className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg border border-border"
          >
            <Search className="w-3.5 h-3.5" />
            <span>بحث في المنيو...</span>
          </Link>

          <ThemeToggle />

          {/* User Authentication Menu */}
          <UserNav />

          {/* Cart Trigger Button */}
          <Button
            onClick={() => setIsCartOpen(true)}
            className="relative gap-2 font-bold shadow-md shadow-primary/20 px-3.5 sm:px-4 cursor-pointer"
            size="sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">السلة</span>
            {totalItems > 0 && (
              <span className="bg-white text-primary text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2 animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border space-y-1">
            {session?.user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground font-semibold rounded-lg hover:bg-muted"
                >
                  <span>الملف الشخصي ({session.user.name})</span>
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground font-semibold rounded-lg hover:bg-muted"
                >
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <span>طلباتي السابقة</span>
                </Link>
                <button
                  onClick={handleMobileLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive font-semibold rounded-lg hover:bg-destructive/10 text-right cursor-pointer"
                >
                  <span>تسجيل الخروج</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold border border-border rounded-xl hover:bg-muted"
                >
                  حساب جديد
                </Link>
              </div>
            )}
            <Link
              href="/orders/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary font-semibold"
            >
              <Clock className="w-4 h-4" />
              <span>تتبع حالة طلبك بالرقم</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

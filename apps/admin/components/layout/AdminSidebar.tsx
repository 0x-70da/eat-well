"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  ExternalLink,
  Flame,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const NAV_ITEMS = [
  {
    label: "نظرة عامة",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "إدارة الطلبات",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    label: "قائمة الوجبات",
    href: "/products",
    icon: UtensilsCrossed,
  },
  {
    label: "التصنيفات",
    href: "/categories",
    icon: Layers,
  },
  {
    label: "العملاء",
    href: "/customers",
    icon: Users,
  },
  {
    label: "الكوبونات والعروض",
    href: "/coupons",
    icon: Tag,
  },
  {
    label: "إعدادات المطعم",
    href: "/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-l border-border bg-card/60 backdrop-blur-md flex flex-col shrink-0 min-h-screen">
      {/* Brand logo */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block">إيت ويل</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
              لوحة الإدارة
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer link to public website */}
      <div className="p-4 border-t border-border">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>عرض موقع المطعم</span>
          </span>
          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
            Live
          </span>
        </a>
      </div>
    </aside>
  );
}

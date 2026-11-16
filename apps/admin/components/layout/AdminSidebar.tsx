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
  type LucideIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { usePermission } from "@/hooks/usePermission";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
} & (
  | { resource: "dashboard"; action: "view" }
  | { resource: "orders"; action: "list" }
  | { resource: "products"; action: "list" }
  | { resource: "categories"; action: "list" }
  | { resource: "customers"; action: "list" }
  | { resource: "coupons"; action: "list" }
  | { resource: "settings"; action: "view" }
);

const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "نظرة عامة",
    href: "/",
    icon: LayoutDashboard,
    resource: "dashboard",
    action: "view",
  },
  {
    label: "إدارة الطلبات",
    href: "/orders",
    icon: ShoppingBag,
    resource: "orders",
    action: "list",
  },
  {
    label: "قائمة الوجبات",
    href: "/products",
    icon: UtensilsCrossed,
    resource: "products",
    action: "list",
  },
  {
    label: "التصنيفات",
    href: "/categories",
    icon: Layers,
    resource: "categories",
    action: "list",
  },
  {
    label: "العملاء",
    href: "/customers",
    icon: Users,
    resource: "customers",
    action: "list",
  },
  {
    label: "الكوبونات والعروض",
    href: "/coupons",
    icon: Tag,
    resource: "coupons",
    action: "list",
  },
  {
    label: "إعدادات المطعم",
    href: "/settings",
    icon: Settings,
    resource: "settings",
    action: "view",
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { can } = usePermission();

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    switch (item.resource) {
      case "dashboard":
        return can("dashboard", item.action);
      case "orders":
        return can("orders", item.action);
      case "products":
        return can("products", item.action);
      case "categories":
        return can("categories", item.action);
      case "customers":
        return can("customers", item.action);
      case "coupons":
        return can("coupons", item.action);
      case "settings":
        return can("settings", item.action);
      default:
        return false;
    }
  });

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-l border-border bg-card/60 backdrop-blur-md">
      {/* Brand logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-base font-bold tracking-tight">إيت ويل</span>
            <span className="block text-[10px] tracking-wider text-muted-foreground uppercase">
              لوحة الإدارة
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer link to public website */}
      <div className="border-t border-border p-4">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>عرض موقع المطعم</span>
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">Live</span>
        </a>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../helper-components/ThemeToggle";
import { ShieldCheck, LogOut, Loader2 } from "lucide-react";
import { useAdminSession } from "@/requests/useAdminSession";
import { logout } from "@/requests/logout";
import { Button } from "@workspace/ui/components/button";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "مدير عام",
  admin: "مدير نظام",
  manager: "مدير فرع",
  order_manager: "مسؤول طلبات",
  staff: "طاقم العمل",
  user: "عميل",
};

export function AdminHeader() {
  const router = useRouter();
  const { session } = useAdminSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.replace("/login");
    router.refresh();
  };

  const userRole = session?.user?.role || "admin";
  const roleLabel = ROLE_LABELS[userRole] || userRole;
  const userName = session?.user?.name || "مدير النظام";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/40 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span>نظام إدارة المطعم متصل</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="mx-1 h-8 w-[1px] bg-border" />

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="hidden text-right sm:block">
            <span className="block text-xs leading-tight font-semibold">{userName}</span>
            <span className="block text-[10px] text-muted-foreground">{roleLabel}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="تسجيل الخروج"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}

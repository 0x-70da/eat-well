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
    <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>نظام إدارة المطعم متصل</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="h-8 w-[1px] bg-border mx-1" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold block leading-tight">{userName}</span>
            <span className="text-[10px] text-muted-foreground block">{roleLabel}</span>
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
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
}

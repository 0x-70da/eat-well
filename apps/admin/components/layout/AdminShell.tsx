"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminSession } from "@/requests/useAdminSession";
import { STAFF_ROLES } from "@/requests/getAdminSession";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { Loader2 } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isPending } = useAdminSession();

  const isLoginPage = pathname === "/login";
  const isStaff = session?.user?.role && (STAFF_ROLES as readonly string[]).includes(session.user.role);

  useEffect(() => {
    if (isPending) return;

    if (!isLoginPage && (!session || !isStaff)) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else if (isLoginPage && session && isStaff) {
      router.replace("/");
    }
  }, [isPending, session, isStaff, isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <main className="min-h-screen w-full bg-background">{children}</main>;
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">جاري التحقق من صلاحيات الإدارة...</p>
        </div>
      </div>
    );
  }

  if (!session || !isStaff) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">جاري التحويل لصفحة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

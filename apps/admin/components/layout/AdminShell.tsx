"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminSession } from "@/requests/useAdminSession";
import { STAFF_ROLES, hasRolePermission } from "@workspace/types";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { Loader2, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

function getRequiredPermissionForPath(pathname: string): {
  resource:
    "dashboard" | "orders" | "products" | "categories" | "customers" | "coupons" | "settings";
  action: "view" | "list";
} | null {
  if (pathname === "/") return { resource: "dashboard", action: "view" };
  if (pathname.startsWith("/orders")) return { resource: "orders", action: "list" };
  if (pathname.startsWith("/products")) return { resource: "products", action: "list" };
  if (pathname.startsWith("/categories")) return { resource: "categories", action: "list" };
  if (pathname.startsWith("/customers")) return { resource: "customers", action: "list" };
  if (pathname.startsWith("/coupons")) return { resource: "coupons", action: "list" };
  if (pathname.startsWith("/settings")) return { resource: "settings", action: "view" };
  return null;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isPending } = useAdminSession();

  const isLoginPage = pathname === "/login";
  const userRole = session?.user?.role;
  const isStaff = userRole && (STAFF_ROLES as readonly string[]).includes(userRole);

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
          <p className="text-sm font-medium text-muted-foreground">
            جاري التحقق من صلاحيات الإدارة...
          </p>
        </div>
      </div>
    );
  }

  if (!session || !isStaff) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            جاري التحويل لصفحة تسجيل الدخول...
          </p>
        </div>
      </div>
    );
  }

  const requiredPermission = getRequiredPermissionForPath(pathname);
  const isAuthorized =
    !requiredPermission ||
    hasRolePermission(userRole, requiredPermission.resource, requiredPermission.action);

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {isAuthorized ? (
            children
          ) : (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive shadow-sm">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold">غير مصرح لك بالوصول</h2>
                <p className="mx-auto max-w-sm text-xs text-muted-foreground">
                  حسابك لا يمتلك الصلاحية المطلوبة لعرض هذه الصفحة. تواصل مع المدير العام في حال كنت
                  بحاجة لهذه الصلاحية.
                </p>
              </div>
              <Button onClick={() => router.push("/")} variant="outline" className="mt-2 gap-2">
                <ArrowRight className="h-4 w-4" />
                <span>العودة للوحة المعلومات</span>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

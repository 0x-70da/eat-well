"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { authClient } from "@/lib/auth-client";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">جاري تحميل بيانات حسابك...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <User className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">
            تسجيل الدخول إلى حسابك
          </h1>
          <p className="text-sm text-muted-foreground">
            سجل دخولك للاطلاع على سجل طلباتك السابقة، عناوين التوصيل، والمكافآت.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className={buttonVariants({
              size: "lg",
              className: "rounded-2xl font-bold px-8 shadow-md",
            })}
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "rounded-2xl font-bold px-8",
            })}
          >
            حساب جديد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-card border border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-black text-2xl flex items-center justify-center shadow-md">
            {session.user.name?.charAt(0) || "U"}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-foreground">
              مرحباً، {session.user.name}
            </h1>
            <p className="text-xs text-muted-foreground font-mono" dir="ltr">
              {session.user.email}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-bold pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>عضو مميز في نادي إيت ويل</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="rounded-xl gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
        </Button>
      </div>

      {/* Account Navigation Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/orders/track"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-primary/40 transition-colors shadow-xs space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base">تتبع الطلبات</h3>
            <p className="text-xs text-muted-foreground mt-1">
              متابعة حالة طلباتك الحالية والسابقة
            </p>
          </div>
        </Link>

        <Link
          href="/cart"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-primary/40 transition-colors shadow-xs space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base">سلة المشتريات</h3>
            <p className="text-xs text-muted-foreground mt-1">
              عرض الأصناف المحفوظة في سلتك
            </p>
          </div>
        </Link>

        <Link
          href="/menu"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-primary/40 transition-colors shadow-xs space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base">اطلب وجبة جديدة</h3>
            <p className="text-xs text-muted-foreground mt-1">
              استكشف أحدث عروض المشاوي والأطباق
            </p>
          </div>
        </Link>
      </div>

      {/* Account Info Details */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-lg font-black text-foreground border-b border-border/40 pb-4">
          بيانات الحساب الشخصي
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
            <span className="text-muted-foreground">الاسم الكامل</span>
            <p className="font-bold text-foreground text-sm">{session.user.name}</p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
            <span className="text-muted-foreground">البريد الإلكتروني</span>
            <p className="font-bold text-foreground text-sm font-mono" dir="ltr">
              {session.user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { useSession } from "@/requests/useSession";
import { logout } from "@/requests/logout";

export function UserNav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    try {
      await logout();
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isPending) {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-xs font-bold text-foreground hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>دخول</span>
        </Link>
        <Link
          href="/register"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className:
              "text-xs font-bold rounded-xl hidden sm:inline-flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary/10",
          })}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>حساب جديد</span>
        </Link>
      </div>
    );
  }

  const userInitial = session.user.name?.charAt(0) || "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl border border-border/80 hover:bg-muted/60 transition-colors cursor-pointer"
        aria-label="قائمة المستخدم"
      >
        <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-xs">
          {userInitial}
        </div>
        <span className="text-xs font-bold hidden sm:inline-block max-w-[100px] truncate">
          {session.user.name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-card border border-border rounded-2xl p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-2 border-b border-border/60">
            <p className="text-xs font-bold text-foreground truncate">
              {session.user.name}
            </p>
            <p
              className="text-[10px] text-muted-foreground font-mono truncate"
              dir="ltr"
            >
              {session.user.email}
            </p>
          </div>

          <div className="py-1 space-y-0.5">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground transition-colors"
            >
              <User className="w-3.5 h-3.5 text-primary" />
              <span>الملف الشخصي</span>
            </Link>

            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              <span>طلباتي السابقة</span>
            </Link>
          </div>

          <div className="pt-1 border-t border-border/60">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-right"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

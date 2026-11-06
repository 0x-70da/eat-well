"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LogOut } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { logout } from "@/requests/logout";
import type { AuthUser } from "@workspace/types";

export interface AccountProfileCardProps {
  user: AuthUser;
}

export function AccountProfileCard({ user }: AccountProfileCardProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-card border border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-black text-2xl flex items-center justify-center shadow-md">
          {user.name?.charAt(0) || "U"}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-foreground">
            مرحباً، {user.name}
          </h1>
          <p className="text-xs text-muted-foreground font-mono" dir="ltr">
            {user.email}
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
        className="rounded-xl gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>{isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
      </Button>
    </div>
  );
}

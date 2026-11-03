"use client";

import { ThemeToggle } from "../helper-components/ThemeToggle";
import { Bell, ShieldCheck } from "lucide-react";

export function AdminHeader() {
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
            <span className="text-xs font-semibold block leading-tight">مدير النظام</span>
            <span className="text-[10px] text-muted-foreground block">مسؤول رئيسي</span>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { usePermission } from "@/hooks/usePermission";
import { StatCard } from "./StatCard";
import { Banknote, ShoppingBag, Clock, CheckCircle2 } from "lucide-react";
import type { DashboardStats } from "@workspace/types";

export interface DashboardMetricsProps {
  stats: DashboardStats;
}

export function DashboardMetrics({ stats }: DashboardMetricsProps) {
  const { can } = usePermission();
  const canViewFinancials = can("reports", "view") || can("payments", "view");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {canViewFinancials ? (
        <StatCard
          title="إجمالي الإيرادات"
          value={`${stats.totalRevenue.toLocaleString()} ج.م`}
          subtitle={`مبيعات اليوم: ${stats.todayRevenue.toLocaleString()} ج.م`}
          icon={Banknote}
          trend="مؤشر مالي تراكمي"
        />
      ) : (
        <StatCard
          title="إجمالي الإيرادات"
          value="غير مصرح"
          subtitle="يتطلب صلاحية التقارير والمدفوعات"
          icon={Banknote}
          className="opacity-70"
        />
      )}
      <StatCard
        title="إجمالي الطلبات"
        value={stats.totalOrders}
        subtitle={
          canViewFinancials ? `متوسط قيمة الطلب: ${stats.averageOrderValue} ج.م` : undefined
        }
        icon={ShoppingBag}
      />
      <StatCard
        title="طلبات قيد المتابعة"
        value={stats.pendingOrders + stats.preparingOrders}
        subtitle={`${stats.pendingOrders} جديد • ${stats.preparingOrders} قيد التحضير`}
        icon={Clock}
        className="border-amber-500/30 dark:border-amber-500/20"
      />
      <StatCard
        title="طلبات مكتملة"
        value={stats.completedOrders}
        subtitle={`${stats.totalCustomers} عميل مسجل`}
        icon={CheckCircle2}
        className="border-emerald-500/30 dark:border-emerald-500/20"
      />
    </div>
  );
}

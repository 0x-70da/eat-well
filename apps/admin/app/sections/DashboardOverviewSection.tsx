import { getDashboardStats } from "../requests/getDashboardStats";
import { StatCard } from "../components/StatCard";
import { RecentOrdersTable } from "../components/RecentOrdersTable";
import { TopSellingProducts } from "../components/TopSellingProducts";
import {
  Banknote,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
} from "lucide-react";

export async function DashboardOverviewSection() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">لوحة المعلومات والإحصائيات</h1>
        <p className="text-sm text-muted-foreground mt-1">
          متابعة فورية للمبيعات، الطلبات الجارية، ومؤشرات الأداء للمطعم.
        </p>
      </div>

      {/* Top 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الإيرادات"
          value={`${stats.totalRevenue.toLocaleString()} ج.م`}
          subtitle={`مبيعات اليوم: ${stats.todayRevenue.toLocaleString()} ج.م`}
          icon={Banknote}
          trend="مؤشر مالي تراكمي"
        />
        <StatCard
          title="إجمالي الطلبات"
          value={stats.totalOrders}
          subtitle={`متوسط قيمة الطلب: ${stats.averageOrderValue} ج.م`}
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

      {/* Bottom Grid: Recent Orders & Best Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={stats.recentOrders} />
        </div>
        <div>
          <TopSellingProducts products={stats.bestSellingProducts} />
        </div>
      </div>
    </div>
  );
}

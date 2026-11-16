import { getDashboardStats } from "../requests/getDashboardStats";
import { DashboardMetrics } from "../components/DashboardMetrics";
import { RecentOrdersTable } from "../components/RecentOrdersTable";
import { TopSellingProducts } from "../components/TopSellingProducts";

export async function DashboardOverviewSection() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">لوحة المعلومات والإحصائيات</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          متابعة فورية للمبيعات، الطلبات الجارية، ومؤشرات الأداء للمطعم.
        </p>
      </div>

      {/* Top 4 Primary Metric Cards */}
      <DashboardMetrics stats={stats} />

      {/* Bottom Grid: Recent Orders & Best Selling Dishes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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

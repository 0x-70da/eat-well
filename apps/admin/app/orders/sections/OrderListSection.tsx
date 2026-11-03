import { getAdminOrders } from "../requests/getOrders";
import { OrderTable } from "../components/OrderTable";

export async function OrderListSection() {
  const data = await getAdminOrders({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إدارة الطلبات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            متابعة جميع طلبات العملاء وتحديث حالاتها وطباعة الفواتير.
          </p>
        </div>
      </div>

      <OrderTable orders={data.items} />
    </div>
  );
}

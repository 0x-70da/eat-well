import { getAdminOrders } from "../requests/getOrders";
import { OrderTable } from "../components/OrderTable";

export async function OrderListSection() {
  const data = await getAdminOrders({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إدارة الطلبات</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            متابعة جميع طلبات العملاء وتحديث حالاتها وطباعة الفواتير.
          </p>
        </div>
      </div>

      <OrderTable orders={data.items} />
    </div>
  );
}

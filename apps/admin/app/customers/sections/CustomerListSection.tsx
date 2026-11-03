import { getAdminCustomers } from "../requests/getCustomers";
import { CustomerTable } from "../components/CustomerTable";

export async function CustomerListSection() {
  const customers = await getAdminCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">إدارة العملاء</h1>
        <p className="text-sm text-muted-foreground mt-1">
          عرض بيانات العملاء المسجلين، وسجل طلباتهم وإجمالي إنفاقهم.
        </p>
      </div>

      <CustomerTable customers={customers} />
    </div>
  );
}

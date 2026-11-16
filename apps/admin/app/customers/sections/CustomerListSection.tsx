import { getAdminCustomers } from "../requests/getCustomers";
import { getUsers } from "../requests/getUsers";
import { CustomerTable } from "../components/CustomerTable";

export async function CustomerListSection() {
  const [customers, usersData] = await Promise.all([getAdminCustomers(), getUsers()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">إدارة المستخدمين والعملاء</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          إدارة صلاحيات طاقم العمل، حظر وتعليق الحسابات، ومتابعة سجلات طلبات العملاء.
        </p>
      </div>

      <CustomerTable
        customers={customers}
        initialUsers={usersData.users}
        totalUsers={usersData.total}
      />
    </div>
  );
}

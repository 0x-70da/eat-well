import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ArrowLeft } from "lucide-react";

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

export interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "destructive" | "info" }> = {
  pending: { label: "قيد الانتظار", variant: "warning" },
  confirmed: { label: "تم التأكيد", variant: "info" },
  preparing: { label: "جاري التجهيز", variant: "info" },
  ready_for_pickup: { label: "جاهز للاستلام", variant: "info" },
  out_for_delivery: { label: "في الطريق", variant: "warning" },
  delivered: { label: "تم التوصيل", variant: "success" },
  cancelled: { label: "ملغي", variant: "destructive" },
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold">أحدث الطلبات</CardTitle>
        <Link
          href="/orders"
          className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>عرض كافة الطلبات</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            لا توجد طلبات مسجلة حتى الآن
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>الإجمالي</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الدفع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => {
                const statusInfo = statusMap[o.status] || {
                  label: o.status,
                  variant: "default",
                };
                return (
                  <TableRow key={o.id}>
                    <TableCell className="font-semibold text-primary">
                      <Link href={`/orders?search=${o.orderNumber}`} className="hover:underline">
                        {o.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium block text-xs">{o.customerName}</span>
                        <span className="text-[11px] text-muted-foreground block">{o.customerPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-xs">{o.totalAmount} ج.م</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium ${
                          o.paymentStatus === "paid"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {o.paymentStatus === "paid" ? "مدفوع" : "معلق"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

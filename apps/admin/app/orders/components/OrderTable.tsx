"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@workspace/types";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Eye, Printer } from "lucide-react";
import { updateOrderStatus } from "../requests/updateOrderStatus";
import { updatePaymentStatus } from "../requests/updatePaymentStatus";

export interface OrderTableProps {
  orders: Order[];
}

const statusMap: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "destructive" | "info" }
> = {
  pending: { label: "قيد الانتظار", variant: "warning" },
  confirmed: { label: "مؤكد", variant: "info" },
  preparing: { label: "قيد التجهيز", variant: "info" },
  ready_for_pickup: { label: "جاهز للاستلام", variant: "info" },
  out_for_delivery: { label: "في الطريق للعميل", variant: "warning" },
  delivered: { label: "تم التوصيل بنجاح", variant: "success" },
  cancelled: { label: "ملغي", variant: "destructive" },
};

export function OrderTable({ orders: initialOrders }: OrderTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, { status: newStatus });
      if (res.success && res.data) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await updatePaymentStatus(orderId, { paymentStatus: "paid" });
      if (res.success && res.data) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: "paid" } : o,
          ),
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, paymentStatus: "paid" } : null,
          );
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePrint = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>فاتورة طلب ${order.orderNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; direction: rtl; text-align: right; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 12px; margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; margin: 6px 0; }
            .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .table th, .table td { border-bottom: 1px solid #ddd; padding: 8px 4px; font-size: 13px; }
            .total { font-size: 16px; font-weight: bold; margin-top: 16px; border-top: 2px solid #000; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>مطعم إيت ويل</h2>
            <p>فاتورة استلام الطلب</p>
            <h3>رقم الطلب: ${order.orderNumber}</h3>
          </div>
          <div class="row"><span>اسم العميل:</span><strong>${order.customerName}</strong></div>
          <div class="row"><span>الهاتف:</span><strong>${order.customerPhone}</strong></div>
          <div class="row"><span>العنوان:</span><span>${order.deliveryAddress}</span></div>
          <div class="row"><span>طريقة الدفع:</span><strong>${order.paymentMethod.toUpperCase()} (${order.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"})</strong></div>

          <table class="table">
            <thead>
              <tr>
                <th>الوجبة</th>
                <th>الكمية</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${(order.items || [])
                .map(
                  (it) => `
                <tr>
                  <td>${it.productNameAr}</td>
                  <td>${it.quantity}</td>
                  <td>${it.totalPrice} ج.م</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="total">
            <div class="row"><span>المجموع الفرعي:</span><span>${order.subtotal} ج.م</span></div>
            <div class="row"><span>الخصم:</span><span>${order.discountAmount} ج.م</span></div>
            <div class="row"><span>رسوم التوصيل:</span><span>${order.deliveryFee} ج.م</span></div>
            <div class="row"><span>المبلغ الإجمالي المستحق:</span><strong>${order.totalAmount} ج.م</strong></div>
          </div>
          <p style="text-align: center; margin-top: 24px; font-size: 12px;">شكراً لاختياركم مطعم إيت ويل - نتمنى لكم وجبة شهية!</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              لا توجد طلبات مسجلة حالياً
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>الإجمالي</TableHead>
                  <TableHead>حالة الطلب</TableHead>
                  <TableHead>الدفع</TableHead>
                  <TableHead className="text-center">إجراءات سريعة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const statusInfo = statusMap[order.status] || {
                    label: order.status,
                    variant: "default",
                  };
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-bold text-primary font-mono text-xs">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-semibold text-xs block">
                            {order.customerName}
                          </span>
                          <span className="text-[11px] text-muted-foreground block">
                            {order.customerPhone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground">
                        {order.deliveryAddress}
                      </TableCell>
                      <TableCell className="font-bold text-xs">
                        {order.totalAmount} ج.م
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {order.paymentStatus === "paid" ? "مدفوع" : "معلق"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => setSelectedOrder(order)}
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => handlePrint(order)}
                            title="طباعة الفاتورة"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold">
                  تفاصيل الطلب: {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-muted-foreground">
                  تاريخ الطلب: {new Date(selectedOrder.createdAt).toLocaleString("ar-EG")}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                إغلاق
              </Button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-muted/40 p-4 rounded-xl">
              <div>
                <span className="text-muted-foreground block">العميل:</span>
                <span className="font-bold">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">الهاتف:</span>
                <span className="font-bold font-mono">{selectedOrder.customerPhone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block">عنوان التوصيل:</span>
                <span className="font-medium">{selectedOrder.deliveryAddress}</span>
              </div>
              {selectedOrder.deliveryInstructions && (
                <div className="col-span-2">
                  <span className="text-muted-foreground block">تعليمات خاصة:</span>
                  <span className="font-medium">{selectedOrder.deliveryInstructions}</span>
                </div>
              )}
            </div>

            {/* Items list */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold">الوجبات المطلوبة:</h4>
              <div className="space-y-2 divide-y divide-border/50">
                {(selectedOrder.items || []).map((it) => (
                  <div key={it.id} className="pt-2 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold block">{it.productNameAr}</span>
                      <span className="text-muted-foreground">
                        الكمية: {it.quantity} × {it.productPrice} ج.م
                      </span>
                    </div>
                    <span className="font-bold text-primary">{it.totalPrice} ج.م</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="border-t border-border pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{selectedOrder.subtotal} ج.م</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>الخصم:</span>
                <span>-{selectedOrder.discountAmount} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <span>{selectedOrder.deliveryFee} ج.م</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                <span>الإجمالي النهائي:</span>
                <span className="text-primary">{selectedOrder.totalAmount} ج.م</span>
              </div>
            </div>

            {/* Action buttons to update status */}
            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground">
                تحديث حالة الطلب:
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="xs"
                  variant={selectedOrder.status === "confirmed" ? "default" : "outline"}
                  disabled={updatingId === selectedOrder.id}
                  onClick={() => handleStatusChange(selectedOrder.id, "confirmed")}
                >
                  تأكيد الطلب
                </Button>
                <Button
                  size="xs"
                  variant={selectedOrder.status === "preparing" ? "default" : "outline"}
                  disabled={updatingId === selectedOrder.id}
                  onClick={() => handleStatusChange(selectedOrder.id, "preparing")}
                >
                  بدء التجهيز
                </Button>
                <Button
                  size="xs"
                  variant={selectedOrder.status === "ready_for_pickup" ? "default" : "outline"}
                  disabled={updatingId === selectedOrder.id}
                  onClick={() => handleStatusChange(selectedOrder.id, "ready_for_pickup")}
                >
                  جاهز للاستلام
                </Button>
                <Button
                  size="xs"
                  variant={selectedOrder.status === "out_for_delivery" ? "default" : "outline"}
                  disabled={updatingId === selectedOrder.id}
                  onClick={() => handleStatusChange(selectedOrder.id, "out_for_delivery")}
                >
                  خرج للتوصيل
                </Button>
                <Button
                  size="xs"
                  variant={selectedOrder.status === "delivered" ? "default" : "outline"}
                  disabled={updatingId === selectedOrder.id}
                  onClick={() => handleStatusChange(selectedOrder.id, "delivered")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  تم التسليم
                </Button>
                <Button
                  size="xs"
                  variant="destructive"
                  disabled={updatingId === selectedOrder.id}
                  onClick={() => handleStatusChange(selectedOrder.id, "cancelled")}
                >
                  إلغاء الطلب
                </Button>

                {selectedOrder.paymentStatus !== "paid" && (
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                    onClick={() => handleMarkPaid(selectedOrder.id)}
                  >
                    تأكيد استلام المبلغ (مدفوع)
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import type { Order } from "@workspace/types";
import { Badge } from "@workspace/ui/components/badge";
import {
  Clock,
  MapPin,
  ChevronLeft,
  ShoppingBag,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";

export interface OrderCardProps {
  order: Order;
}

const statusMap: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "destructive" | "info" }
> = {
  pending: { label: "قيد الانتظار", variant: "warning" },
  confirmed: { label: "تم التأكيد", variant: "info" },
  preparing: { label: "جاري التحضير", variant: "info" },
  ready_for_pickup: { label: "جاهز للاستلام", variant: "info" },
  out_for_delivery: { label: "في الطريق إليك", variant: "warning" },
  delivered: { label: "تم التوصيل", variant: "success" },
  cancelled: { label: "ملغي", variant: "destructive" },
};

export function OrderCard({ order }: OrderCardProps) {
  const statusInfo = statusMap[order.status] || {
    label: order.status,
    variant: "default",
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-5 shadow-xs hover:border-primary/40 transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-foreground font-mono">
                {order.orderNumber}
              </span>
              <Badge variant={statusInfo.variant} className="text-[10px] font-bold">
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </p>
          </div>
        </div>

        <Link
          href={`/orders/track/${encodeURIComponent(order.orderNumber)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline self-end sm:self-center"
        >
          <span>تتبع مسار الطلب</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Items Preview */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-muted-foreground block">
          الأصناف ({order.items?.length || 0}):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-5 h-5 rounded-md bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                  {item.quantity}×
                </span>
                <span className="font-semibold text-foreground truncate">
                  {item.productNameAr}
                </span>
              </div>
              <span className="font-bold text-primary shrink-0">
                {item.totalPrice} ج.م
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery & Payment details footer */}
      <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground truncate max-w-md">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{order.deliveryAddress}</span>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {order.paymentMethod === "cod" ? (
              <Banknote className="w-3.5 h-3.5" />
            ) : (
              <CreditCard className="w-3.5 h-3.5" />
            )}
            <span>
              {order.paymentMethod === "cod" ? "الدفع عند الاستلام" : "بطاقة دفع"}
            </span>
            <Badge
              variant={order.paymentStatus === "paid" ? "success" : "warning"}
              className="text-[9px] px-1.5 py-0"
            >
              {order.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"}
            </Badge>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-muted-foreground block">الإجمالي:</span>
            <span className="text-sm font-black text-foreground">
              {order.totalAmount} ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

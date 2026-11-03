import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Truck,
  RotateCcw,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { OrderStatusStepper } from "./OrderStatusStepper";
import { OrderTrackSearch } from "./OrderTrackSearch";
import type { Order } from "@workspace/types";

export interface OrderTrackViewProps {
  order: Order;
}

export function OrderTrackView({ order }: OrderTrackViewProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "في انتظار التأكيد من المطعم";
      case "confirmed":
        return "تم تأكيد طلبك وجاري إرساله للمطبخ";
      case "preparing":
        return "يقوم الشيف الآن بتحضير طلبك الطازج";
      case "ready_for_pickup":
        return "طلبك جاهز تماماً للاستلام من الفرع";
      case "out_for_delivery":
        return "مندوب التوصيل في طريقه إليك الآن";
      case "delivered":
        return "تم تسليم الطلب بنجاح، بالهناء والشفاء!";
      case "cancelled":
        return "تم إلغاء هذا الطلب";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Bar for another order */}
      <OrderTrackSearch initialValue={order.orderNumber} />

      {/* Main Tracking Card */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/40 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">رقم الطلب:</span>
              <span className="font-mono font-black text-lg text-primary">
                {order.orderNumber}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mt-1">
              {getStatusText(order.status)}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Badge
              variant={
                order.paymentStatus === "paid"
                  ? "default"
                  : order.paymentStatus === "failed"
                    ? "destructive"
                    : "outline"
              }
              className="text-xs font-bold px-3 py-1"
            >
              {order.paymentStatus === "paid"
                ? "مدفوع بالكامل"
                : order.paymentStatus === "failed"
                  ? "فشل السداد"
                  : "الدفع عند الاستلام"}
            </Badge>
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <OrderStatusStepper status={order.status} orderType={order.orderType} />

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/40 text-xs">
          <div className="space-y-1 p-4 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>الوقت المقدر</span>
            </span>
            <p className="font-black text-foreground text-sm">
              {order.status === "delivered"
                ? "تم التسليم"
                : `${order.estimatedDeliveryMinutes || 35} دقيقة`}
            </p>
          </div>

          <div className="space-y-1 p-4 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>عنوان التوصيل</span>
            </span>
            <p className="font-bold text-foreground truncate" title={order.deliveryAddress}>
              {order.deliveryAddress}
            </p>
          </div>

          <div className="space-y-1 p-4 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>اسم المستلم</span>
            </span>
            <p className="font-bold text-foreground">{order.customerName}</p>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="pt-6 border-t border-border/40 space-y-3">
            <h3 className="font-black text-foreground text-sm">
              أصناف الطلب ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {item.quantity}×
                    </span>
                    <div>
                      <p className="font-bold text-foreground">
                        {item.productNameAr || item.productName}
                      </p>
                      {item.selectedSize && (
                        <p className="text-[11px] text-muted-foreground">
                          الحجم:{" "}
                          {(() => {
                            try {
                              const parsed = JSON.parse(String(item.selectedSize));
                              return parsed.nameAr || parsed.name;
                            } catch {
                              return String(item.selectedSize);
                            }
                          })()}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-foreground">
                    {item.totalPrice} ج.م
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-between text-sm font-black">
              <span>المجموع الكلي:</span>
              <span className="text-primary font-mono text-lg">
                {order.totalAmount} ج.م
              </span>
            </div>
          </div>
        )}

        {/* Timeline History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="pt-6 border-t border-border/40 space-y-3">
            <h3 className="font-black text-foreground text-sm">سجل حركة الطلب</h3>
            <div className="space-y-2 text-xs">
              {order.statusHistory.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 text-muted-foreground"
                >
                  <span className="font-semibold text-foreground">
                    {getStatusText(h.toStatus)}
                  </span>
                  <span className="font-mono text-[11px]">
                    {new Date(h.createdAt).toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Need Help CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl bg-primary/5 border border-primary/20 gap-4">
        <div>
          <h4 className="font-bold text-foreground text-sm">
            هل تحتاج إلى مساعدة بشأن طلبك؟
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            فريق خدمة عملاء إيت ويل متاح على مدار الساعة لمساعدتك
          </p>
        </div>
        <Link
          href="/contact"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "font-bold rounded-xl gap-2",
          })}
        >
          <Phone className="w-4 h-4" />
          <span>تواصل مع الدعم</span>
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { CheckCircle2, Clock, MapPin, Receipt, ArrowLeft, Home } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import type { Order } from "@workspace/types";

export interface OrderConfirmationViewProps {
  order: Order;
}

export function OrderConfirmationView({ order }: OrderConfirmationViewProps) {
  const isPaid = order.paymentStatus === "paid";

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          تم استلام طلبك بنجاح!
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          شكراً لطلبك من مطعم إيت ويل. بدأ فريق المطبخ بتجهيز وجبتك الطازجة بكل حب
          وعناية.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/40 gap-3">
          <div>
            <span className="text-xs text-muted-foreground block">رقم الطلب</span>
            <span className="font-mono font-black text-xl text-primary">
              {order.orderNumber}
            </span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-muted-foreground block">
              الوقت المقدر للتوصيل
            </span>
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              {order.estimatedDeliveryMinutes || 35} دقيقة تقريباً
            </span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 p-3 rounded-xl bg-muted/40">
            <span className="text-muted-foreground">اسم العميل:</span>
            <p className="font-bold text-foreground">{order.customerName}</p>
          </div>
          <div className="space-y-1 p-3 rounded-xl bg-muted/40">
            <span className="text-muted-foreground">رقم الهاتف:</span>
            <p className="font-bold text-foreground font-mono" dir="ltr">
              {order.customerPhone}
            </p>
          </div>
          <div className="space-y-1 p-3 rounded-xl bg-muted/40 sm:col-span-2">
            <span className="text-muted-foreground">عنوان التوصيل:</span>
            <p className="font-bold text-foreground">{order.deliveryAddress}</p>
          </div>
          <div className="space-y-1 p-3 rounded-xl bg-muted/40">
            <span className="text-muted-foreground">طريقة الدفع:</span>
            <p className="font-bold text-foreground">
              {order.paymentMethod === "cod"
                ? "الدفع عند الاستلام"
                : order.paymentMethod === "paymob"
                  ? "باي موب (Paymob)"
                  : "بطاقة ائتمان (Stripe)"}
            </p>
          </div>
          <div className="space-y-1 p-3 rounded-xl bg-muted/40">
            <span className="text-muted-foreground">حالة السداد:</span>
            <p
              className={`font-bold ${
                isPaid
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {isPaid ? "تم الدفع بنجاح" : "في انتظار التحصيل"}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <span className="font-bold text-foreground text-sm">
            المبلغ الإجمالي للطلب
          </span>
          <span className="font-mono font-black text-2xl text-primary">
            {order.totalAmount} ج.م
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href={`/orders/track/${order.orderNumber}`}
          className={buttonVariants({
            size: "lg",
            className: "w-full sm:flex-1 rounded-2xl font-black gap-2 shadow-lg shadow-primary/25 cursor-pointer",
          })}
        >
          <span>متابعة حالة الطلب والمسار</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "w-full sm:w-auto rounded-2xl font-bold gap-2 cursor-pointer",
          })}
        >
          <Home className="w-4 h-4" />
          <span>الرئيسية</span>
        </Link>
      </div>
    </div>
  );
}

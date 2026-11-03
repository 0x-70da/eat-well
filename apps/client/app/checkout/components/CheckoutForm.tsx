"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "../requests/createOrder";
import { createPaymentIntent } from "../requests/createPaymentIntent";
import type { RestaurantSettings } from "@workspace/types";

export interface CheckoutFormProps {
  settings: RestaurantSettings;
}

export function CheckoutForm({ settings }: CheckoutFormProps) {
  const router = useRouter();
  const {
    items,
    subtotal,
    appliedCoupon,
    discountAmount,
    deliveryFee,
    totalAmount,
    clearCart,
  } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe" | "paymob">("cod");
  const [paymobMethod, setPaymobMethod] = useState<"vodafone_cash" | "instapay" | "card">(
    "vodafone_cash",
  );
  const [walletMobileNumber, setWalletMobileNumber] = useState("");

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          لا توجد وجبات في السلة لإتمام الطلب
        </h2>
        <p className="text-sm text-muted-foreground">
          يرجى اختيار الوجبات أولاً قبل التوجه إلى صفحة الدفع.
        </p>
        <Link href="/menu" className={buttonVariants({ className: "rounded-xl" })}>
          تصفح قائمة الطعام
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage("يرجى كتابة اسم العميل بالكامل");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMessage("يرجى إدخال رقم هاتف صحيح (10 أرقام على الأقل)");
      return;
    }
    if (orderType === "delivery" && (!deliveryAddress.trim() || deliveryAddress.length < 5)) {
      setErrorMessage("يرجى كتابة عنوان التوصيل بالتفصيل (المنطقة، الشارع، رقم العقار)");
      return;
    }
    if (
      paymentMethod === "paymob" &&
      paymobMethod === "vodafone_cash" &&
      !walletMobileNumber.trim()
    ) {
      setErrorMessage("يرجى إدخال رقم المحفظة الإلكترونية (فودافون كاش / اتصالات / أورنج / وي)");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on server (server will recalculate all prices, fees, discounts)
      const order = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        orderType,
        deliveryAddress:
          orderType === "delivery"
            ? deliveryAddress.trim()
            : `استلام من فرع المطعم (${settings.addressAr})`,
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        paymentMethod,
        paymobMethod: paymentMethod === "paymob" ? paymobMethod : undefined,
        couponCode: appliedCoupon?.code || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize
            ? {
                sizeId: item.selectedSize.sizeId,
                name: item.selectedSize.name,
                nameAr: item.selectedSize.nameAr,
                priceAdjustment: item.selectedSize.priceAdjustment,
              }
            : undefined,
          selectedAddons: item.selectedAddons?.map((a) => ({
            groupId: a.groupId,
            groupName: a.groupName,
            itemId: a.itemId,
            name: a.name,
            nameAr: a.nameAr,
            price: a.price,
          })),
          specialInstructions: item.specialInstructions || undefined,
        })),
      });

      // 2. Handle payment initiation based on method
      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/orders/confirmation?orderNumber=${order.orderNumber}`);
        return;
      }

      if (paymentMethod === "stripe") {
        const paymentRes = await createPaymentIntent({
          orderId: order.id,
          provider: "stripe",
        });
        clearCart();
        router.push(
          `/orders/confirmation?orderNumber=${order.orderNumber}&paymentStatus=paid&provider=stripe`,
        );
        return;
      }

      if (paymentMethod === "paymob") {
        const paymobRes = await createPaymentIntent({
          orderId: order.id,
          provider: "paymob",
          paymobMethod,
          walletMobileNumber: walletMobileNumber.trim() || undefined,
        });

        clearCart();

        if (paymobRes.redirectUrl) {
          window.location.href = paymobRes.redirectUrl;
          return;
        }

        router.push(
          `/orders/confirmation?orderNumber=${order.orderNumber}&paymentStatus=pending&provider=paymob`,
        );
        return;
      }
    } catch (err: unknown) {
      setErrorMessage(
        (err as Error).message ||
          "حدث خطأ أثناء معالجة الطلب، يرجى التأكد من البيانات والمحاولة مجدداً.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitOrder} className="space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-start gap-3 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Customer Contact Info */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                1
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground">
                  معلومات التواصل والعميل
                </h2>
                <p className="text-xs text-muted-foreground">
                  سنقوم بالتواصل معك لتأكيد وصول الطلب
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>الاسم بالكامل *</span>
                </label>
                <Input
                  required
                  placeholder="مثال: أحمد محمد"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>رقم الهاتف المحمول *</span>
                </label>
                <Input
                  required
                  type="tel"
                  placeholder="010XXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="rounded-xl font-mono"
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>البريد الإلكتروني (اختياري لاستلام الفاتورة الإلكترونية)</span>
                </label>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="rounded-xl font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Order Type & Delivery Details */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                2
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground">
                  طريقة الاستلام وعنوان التوصيل
                </h2>
                <p className="text-xs text-muted-foreground">
                  حدد ما إذا كنت ترغب بالتوصيل السريع إلى بابك أو الاستلام من الفرع
                </p>
              </div>
            </div>

            {/* Toggle Delivery / Pickup */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType("delivery")}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  orderType === "delivery"
                    ? "border-primary bg-primary/5 text-primary font-black shadow-xs"
                    : "border-border text-muted-foreground hover:border-border/80"
                }`}
              >
                <MapPin className="w-5 h-5 mx-auto mb-1.5" />
                <span className="text-sm block">توصيل إلى منزلك</span>
                <span className="text-xs font-normal opacity-75">
                  رسوم التوصيل {settings.deliveryFee} ج.م
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType("pickup")}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  orderType === "pickup"
                    ? "border-primary bg-primary/5 text-primary font-black shadow-xs"
                    : "border-border text-muted-foreground hover:border-border/80"
                }`}
              >
                <ShoppingBag className="w-5 h-5 mx-auto mb-1.5" />
                <span className="text-sm block">استلام من المطعم</span>
                <span className="text-xs font-normal opacity-75">بدون رسوم توصيل</span>
              </button>
            </div>

            {orderType === "delivery" ? (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>عنوان التوصيل بالتفصيل *</span>
                  </label>
                  <Input
                    required
                    placeholder="المدينة، الحي / المنطقة، الشارع، رقم العمارة، رقم الشقة والدور"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>تعليمات خاصة للسائق (اختياري)</span>
                  </label>
                  <Textarea
                    placeholder="علامة مميزة، الاتصال عند الوصول، ترك الطلب عند الباب..."
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="rounded-xl text-sm"
                    rows={2}
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-sm space-y-1">
                <p className="font-bold text-foreground">عنوان فرع الاستلام:</p>
                <p className="text-muted-foreground">{settings.addressAr}</p>
                <p className="text-xs text-primary font-medium pt-1">
                  سيكون طلبك جاهزاً للاستلام خلال{" "}
                  {settings.estimatedPrepTimeMinutes || 25} دقيقة
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Payment Options */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                3
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground">طريقة الدفع</h2>
                <p className="text-xs text-muted-foreground">
                  اختر وسيلة الدفع الآمنة والأنسب لك
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border hover:border-border/80"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      الدفع نقداً عند الاستلام (COD)
                    </span>
                    <Badge variant="outline" className="text-xs">
                      الأكثر استخداماً
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ادفع نقداً لمندوب التوصيل فور استلام وجبتك طازجة وساخنة
                  </p>
                </div>
              </label>

              {/* Option 2: Paymob Egyptian Methods */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "paymob"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border hover:border-border/80"
                }`}
              >
                <label className="flex items-start gap-3.5 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "paymob"}
                    onChange={() => setPaymentMethod("paymob")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-primary" />
                        باي موب - مصر (Paymob)
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Badge className="bg-red-600/10 text-red-600 border-red-600/20 text-[10px]">
                          فودافون كاش
                        </Badge>
                        <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 text-[10px]">
                          انستاباي
                        </Badge>
                        <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20 text-[10px]">
                          ميزة
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ادفع فوراً عبر المحافظ الإلكترونية المصرية أو تطبيق انستاباي أو
                      بطاقة ميزة
                    </p>
                  </div>
                </label>

                {/* Paymob Sub-methods */}
                {paymentMethod === "paymob" && (
                  <div className="mt-4 pt-4 border-t border-border/40 space-y-3 pr-7">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymobMethod("vodafone_cash")}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          paymobMethod === "vodafone_cash"
                            ? "border-red-500 bg-red-500/10 text-red-600"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        محافظ المحمول
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymobMethod("instapay")}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          paymobMethod === "instapay"
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        انستاباي (InstaPay)
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymobMethod("card")}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          paymobMethod === "card"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        بطاقة فيزا / ميزة
                      </button>
                    </div>

                    {paymobMethod === "vodafone_cash" && (
                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-bold text-foreground">
                          رقم محفظة المحمول المسجلة (فودافون كاش / أورنج / اتصالات / وي) *
                        </label>
                        <Input
                          type="tel"
                          placeholder="010XXXXXXXX"
                          value={walletMobileNumber}
                          onChange={(e) => setWalletMobileNumber(e.target.value)}
                          className="rounded-xl font-mono text-left"
                          dir="ltr"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          سيتم إرسال طلب تأكيد ودفع فوري إلى محفظتك الإلكترونية
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Option 3: Stripe Online Payments */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "stripe"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border hover:border-border/80"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      الدفع الإلكتروني الدولي (Stripe)
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Visa / Mastercard
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    دفع إلكتروني آمن ومشفر 100% يدعم البطاقات البنكية الدولية والمحلية
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Placement */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-black text-foreground border-b border-border/40 pb-3 flex items-center justify-between">
              <span>ملخص الوجبات</span>
              <span className="text-xs font-bold text-muted-foreground">
                ({items.length} أصناف)
              </span>
            </h3>

            {/* Items mini list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-sm">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.image}
                        alt={item.nameAr}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-foreground truncate">
                        {item.nameAr}
                      </p>
                      <p className="text-muted-foreground">
                        {item.quantity} × {item.unitPrice} ج.م
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-foreground shrink-0">
                    {item.totalPrice} ج.م
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-border/40 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>المجموع الفرعي</span>
                <span className="font-mono font-bold text-foreground">
                  {subtotal} ج.م
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span>خصم الكوبون ({appliedCoupon?.code})</span>
                  <span className="font-mono font-bold">-{discountAmount} ج.م</span>
                </div>
              )}

              <div className="flex items-center justify-between text-muted-foreground">
                <span>
                  رسوم التوصيل {orderType === "pickup" && "(استلام من الفرع)"}
                </span>
                <span className="font-mono font-bold text-foreground">
                  {orderType === "pickup" ? "مجاناً" : `${deliveryFee} ج.م`}
                </span>
              </div>

              <div className="border-t border-border pt-3 flex items-center justify-between text-base font-black">
                <span className="text-foreground">الإجمالي النهائي</span>
                <div className="text-primary text-xl font-mono">
                  <span>
                    {orderType === "pickup"
                      ? Math.max(0, subtotal - discountAmount)
                      : totalAmount}
                  </span>
                  <span className="text-xs mr-1 text-muted-foreground">ج.م</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl font-black text-base py-6 shadow-lg shadow-primary/25 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري تسجيل الطلب...
                </span>
              ) : (
                <span>تأكيد وإتمام الطلب الآن</span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>بياناتك ومعلومات الدفع مشفرة ومحمية بالكامل</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

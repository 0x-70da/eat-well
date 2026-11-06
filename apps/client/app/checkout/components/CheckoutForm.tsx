"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createOrderSchema,
  type CreateOrderInput,
  type CreateOrderRawInput,
} from "@workspace/validation";
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
  Clock,
  ShoppingBag,
  LogIn,
  CheckCircle2,
  Bookmark,
} from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { useCart } from "@/hooks/useCart";
import { useSession } from "@/requests/useSession";
import { getAddresses } from "@/requests/getAddresses";
import { createOrder } from "../requests/createOrder";
import { createStripeCheckout } from "../requests/createStripeCheckout";
import { createPaymobCheckout } from "../requests/createPaymobCheckout";
import { getPaymentAvailability } from "../requests/getPaymentAvailability";
import { SavedAddressesSelector } from "./SavedAddressesSelector";
import { StripeEmbeddedCheckout } from "./StripeEmbeddedCheckout";
import { PaymobEmbeddedCheckout } from "./PaymobEmbeddedCheckout";
import type {
  RestaurantSettings,
  DeliveryAddress,
  PaymentAvailability,
} from "@workspace/types";

export interface CheckoutFormProps {
  settings: RestaurantSettings;
}

type ActivePaymentState =
  | {
      provider: "stripe";
      clientSecret: string;
      orderNumber: string;
      amount: number;
      expiresAt: number;
    }
  | {
      provider: "paymob";
      iframeUrl: string;
      redirectUrl?: string;
      orderNumber: string;
      amount: number;
      expiresAt: number;
    }
  | null;

export function CheckoutForm({ settings }: CheckoutFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    subtotal,
    appliedCoupon,
    discountAmount,
    deliveryFee,
    clearCart,
  } = useCart();

  // Saved Addresses state
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isNewAddressSelected, setIsNewAddressSelected] = useState(false);

  // Payment availability state
  const [availability, setAvailability] = useState<PaymentAvailability>({
    cod: true,
    stripe: false,
    paymob: false,
  });

  // Active embedded payment state
  const [activePayment, setActivePayment] = useState<ActivePaymentState>(null);

  // Paymob specific options
  const [paymobMethod, setPaymobMethod] = useState<
    "vodafone_cash" | "instapay" | "card"
  >("card");
  const [walletMobileNumber, setWalletMobileNumber] = useState("");

  const form = useForm<CreateOrderRawInput, unknown, CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      orderType: "delivery",
      deliveryAddress: "",
      deliveryInstructions: "",
      paymentMethod: "cod",
      couponCode: null,
      saveAddress: false,
      addressTitle: "",
      savedAddressId: undefined,
      items: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const currentOrderType = watch("orderType");
  const currentPaymentMethod = watch("paymentMethod");
  const willSaveAddress = watch("saveAddress");

  // Load payment availability
  useEffect(() => {
    getPaymentAvailability().then((avail) => {
      setAvailability(avail);
    });
  }, []);

  // Fetch saved addresses if user is authenticated
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setValue("customerName", session.user.name);
      if (session.user.email) setValue("customerEmail", session.user.email);

      getAddresses().then((addrs) => {
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setValue("savedAddressId", defaultAddr.id);
            const fullAddress = `${defaultAddr.city} - ${defaultAddr.area} - ${defaultAddr.street} - مبنى ${defaultAddr.building}${defaultAddr.floor ? ` - طابق ${defaultAddr.floor}` : ""}${defaultAddr.apartment ? ` - شقة ${defaultAddr.apartment}` : ""}`;
            setValue("deliveryAddress", fullAddress);
            if (defaultAddr.customerPhone) {
              setValue("customerPhone", defaultAddr.customerPhone);
            }
          }
        } else {
          setIsNewAddressSelected(true);
        }
      });
    }
  }, [session, setValue]);

  // Keep cart items synchronized in form state
  useEffect(() => {
    const formattedItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      selectedSize: item.selectedSize
        ? {
            sizeId: item.selectedSize.sizeId,
            name: item.selectedSize.name,
            nameAr: item.selectedSize.nameAr,
            priceAdjustment: item.selectedSize.priceAdjustment,
          }
        : null,
      selectedAddons: item.selectedAddons?.map((a) => ({
        groupId: a.groupId,
        groupName: a.groupName,
        itemId: a.itemId,
        name: a.name,
        nameAr: a.nameAr,
        price: a.price,
      })),
      specialInstructions: item.specialInstructions || undefined,
    }));
    setValue("items", formattedItems);
    if (appliedCoupon?.code) {
      setValue("couponCode", appliedCoupon.code);
    }
  }, [items, appliedCoupon, setValue]);

  // Address selection handler
  const handleSelectSavedAddress = (addr: DeliveryAddress) => {
    setIsNewAddressSelected(false);
    setSelectedAddressId(addr.id);
    setValue("savedAddressId", addr.id);
    setValue("saveAddress", false);
    const fullAddress = `${addr.city} - ${addr.area} - ${addr.street} - مبنى ${addr.building}${addr.floor ? ` - طابق ${addr.floor}` : ""}${addr.apartment ? ` - شقة ${addr.apartment}` : ""}`;
    setValue("deliveryAddress", fullAddress);
    if (addr.customerName) setValue("customerName", addr.customerName);
    if (addr.customerPhone) setValue("customerPhone", addr.customerPhone);
  };

  const handleUseNewAddress = () => {
    setIsNewAddressSelected(true);
    setSelectedAddressId(null);
    setValue("savedAddressId", undefined);
    setValue("deliveryAddress", "");
  };

  // If currently completing payment embedded experience
  if (activePayment?.provider === "stripe") {
    return (
      <StripeEmbeddedCheckout
        clientSecret={activePayment.clientSecret}
        publishableKey={availability.publishableKey?.stripe}
        orderNumber={activePayment.orderNumber}
        amount={activePayment.amount}
        expiresAt={activePayment.expiresAt}
        onCancel={() => setActivePayment(null)}
      />
    );
  }

  if (activePayment?.provider === "paymob") {
    return (
      <PaymobEmbeddedCheckout
        iframeUrl={activePayment.iframeUrl}
        redirectUrl={activePayment.redirectUrl}
        orderNumber={activePayment.orderNumber}
        amount={activePayment.amount}
        expiresAt={activePayment.expiresAt}
        onCancel={() => setActivePayment(null)}
      />
    );
  }

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
        <Link
          href="/menu"
          className={buttonVariants({ className: "rounded-xl" })}
        >
          تصفح قائمة الطعام
        </Link>
      </div>
    );
  }

  const onSubmit = async (values: CreateOrderInput) => {
    if (
      values.paymentMethod === "paymob" &&
      paymobMethod === "vodafone_cash" &&
      !walletMobileNumber.trim()
    ) {
      setError("root", {
        message:
          "يرجى إدخال رقم المحفظة الإلكترونية (فودافون كاش / اتصالات / أورنج / وي)",
      });
      return;
    }

    try {
      const finalAddress =
        values.orderType === "delivery"
          ? values.deliveryAddress
          : `استلام من فرع المطعم (${settings.addressAr})`;

      const orderPayload: CreateOrderInput = {
        ...values,
        deliveryAddress: finalAddress,
        paymobMethod:
          values.paymentMethod === "paymob" ? paymobMethod : undefined,
        savedAddressId: isNewAddressSelected
          ? undefined
          : values.savedAddressId,
      };

      // 1. Create order on backend (unpaid/pending status)
      const order = await createOrder(orderPayload);

      // 2. Cash on Delivery (COD) flow
      if (values.paymentMethod === "cod") {
        clearCart();
        router.push(`/orders/confirmation?orderNumber=${order.orderNumber}`);
        return;
      }

      // 3. Real Stripe Embedded Checkout flow
      if (values.paymentMethod === "stripe") {
        const stripeRes = await createStripeCheckout({
          orderId: order.id,
        });

        clearCart();
        setActivePayment({
          provider: "stripe",
          clientSecret: stripeRes.clientSecret,
          orderNumber: order.orderNumber,
          amount: stripeRes.amount,
          expiresAt: stripeRes.expiresAt,
        });
        return;
      }

      // 4. Real Paymob Embedded / Wallet Checkout flow
      if (values.paymentMethod === "paymob") {
        const paymobRes = await createPaymobCheckout({
          orderId: order.id,
          paymobMethod,
          walletMobileNumber: walletMobileNumber.trim() || undefined,
        });

        clearCart();

        if (paymobRes.redirectUrl && paymobMethod === "vodafone_cash") {
          window.location.href = paymobRes.redirectUrl;
          return;
        }

        setActivePayment({
          provider: "paymob",
          iframeUrl: paymobRes.iframeUrl,
          redirectUrl: paymobRes.redirectUrl,
          orderNumber: order.orderNumber,
          amount: paymobRes.amount,
          expiresAt: paymobRes.expiresAt,
        });
        return;
      }
    } catch (err: unknown) {
      setError("root", {
        message:
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مجدداً.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {errors.root && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}

      {/* Customer Status Banner */}
      {session?.user ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block">
                مرحباً {session.user.name} - طلب مسجل بحسابك
              </span>
              <span className="text-muted-foreground text-[11px]">
                سيتم حفظ هذا الطلب في سجل طلباتك تلقائياً
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            عميل مسجل
          </span>
        </div>
      ) : (
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-foreground block">
              الطلب كزائر (بدون تسجيل حساب)
            </span>
            <span className="text-muted-foreground text-[11px]">
              يمكنك إتمام الطلب كزائر الآن، أو تسجيل الدخول لاستخدام عناوينك
              المحفوظة
            </span>
          </div>
          <Link
            href="/login?callbackUrl=/checkout"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول لحسابك</span>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Delivery & Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Type Toggle */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>طريقة استلام الطلب</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("orderType", "delivery")}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  currentOrderType === "delivery"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <div className="font-bold text-sm">توصيل للعنوان</div>
                <div className="text-[11px] opacity-80 mt-1">
                  خلال 30-45 دقيقة
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue("orderType", "pickup")}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  currentOrderType === "pickup"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <div className="font-bold text-sm">استلام من المطعم</div>
                <div className="text-[11px] opacity-80 mt-1">
                  خلال 20-25 دقيقة
                </div>
              </button>
            </div>
          </div>

          {/* Delivery Address Section (if delivery) */}
          {currentOrderType === "delivery" && (
            <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>عنوان التوصيل</span>
              </h2>

              {/* Saved addresses selector for authenticated customers */}
              {session?.user && savedAddresses.length > 0 && (
                <SavedAddressesSelector
                  addresses={savedAddresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={handleSelectSavedAddress}
                  onNewAddressClick={handleUseNewAddress}
                  isNewAddressSelected={isNewAddressSelected}
                />
              )}

              {/* Address Manual Input (if new address or guest) */}
              {(isNewAddressSelected ||
                !session?.user ||
                savedAddresses.length === 0) && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      العنوان بالتفصيل (المنطقة، الشارع، رقم العمارة، الشقة) *
                    </label>
                    <Input
                      placeholder="مثال: المعادي الجديدة، شارع النصر، عمارة 15، الدور 3، شقة 5"
                      {...register("deliveryAddress")}
                      className="rounded-xl"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-[11px] text-destructive font-medium">
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Save address option for authenticated users entering a new address */}
                  {session?.user && (
                    <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                        <input
                          type="checkbox"
                          {...register("saveAddress")}
                          className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                        />
                        <Bookmark className="w-3.5 h-3.5 text-primary" />
                        <span>
                          حفظ هذا العنوان في قائمة عناويني لسرعة الطلب لاحقاً
                        </span>
                      </label>

                      {willSaveAddress && (
                        <div className="pt-2 border-t border-border/40">
                          <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                            تسمية العنوان (اختياري)
                          </label>
                          <Input
                            placeholder="مثال: المنزل، المكتب، بيت العائلة"
                            {...register("addressTitle")}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Notes */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>ملاحظات التوصيل للطيار (علامة مميزة، رن الجرس...)</span>
                </label>
                <Textarea
                  placeholder="بجوار سوبرماركت الخير، لا ترن الجرس بعد 10 مساءً"
                  {...register("deliveryInstructions")}
                  className="rounded-xl resize-none h-20"
                />
              </div>
            </div>
          )}

          {/* Customer Contact Details */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>بيانات العميل والتواصل</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>الاسم بالكامل *</span>
                </label>
                <Input
                  placeholder="مثال: أحمد محمود"
                  {...register("customerName")}
                  className="rounded-xl"
                />
                {errors.customerName && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>رقم الهاتف (للتواصل والتوصيل) *</span>
                </label>
                <Input
                  placeholder="01012345678"
                  {...register("customerPhone")}
                  className="rounded-xl font-mono text-left"
                  dir="ltr"
                />
                {errors.customerPhone && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span>البريد الإلكتروني (اختياري لاستلام الفاتورة)</span>
              </label>
              <Input
                type="email"
                placeholder="example@mail.com"
                {...register("customerEmail")}
                className="rounded-xl font-mono text-left"
                dir="ltr"
              />
              {errors.customerEmail && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.customerEmail.message}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>طريقة الدفع</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* COD */}
              <button
                type="button"
                onClick={() => setValue("paymentMethod", "cod")}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                  currentPaymentMethod === "cod"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <Banknote className="w-6 h-6" />
                <div>
                  <span className="block text-xs font-bold">
                    الدفع عند الاستلام
                  </span>
                  <span className="text-[10px] opacity-75">
                    كاش عند الاستلام
                  </span>
                </div>
              </button>

              {/* Stripe */}
              <button
                type="button"
                onClick={() => setValue("paymentMethod", "stripe")}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                  currentPaymentMethod === "stripe"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <div>
                  <span className="block text-xs font-bold">
                    بطاقة بنكية (Stripe)
                  </span>
                  <span className="text-[10px] opacity-75">دفع مدمج آمن</span>
                </div>
              </button>

              {/* Paymob */}
              <button
                type="button"
                onClick={() => setValue("paymentMethod", "paymob")}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                  currentPaymentMethod === "paymob"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <Smartphone className="w-6 h-6" />
                <div>
                  <span className="block text-xs font-bold">Paymob ومحافظ</span>
                  <span className="text-[10px] opacity-75">
                    كاش وميزة وإنستاباي
                  </span>
                </div>
              </button>
            </div>

            {/* Paymob Sub-options */}
            {currentPaymentMethod === "paymob" && (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                <span className="text-xs font-bold block text-foreground">
                  اختر وسيلة الدفع الإلكتروني عبر Paymob:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymobMethod("card")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymobMethod === "card"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    بطاقة ميزة / بنك
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymobMethod("vodafone_cash")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymobMethod === "vodafone_cash"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    محفظة إلكترونية
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymobMethod("instapay")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymobMethod === "instapay"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    إنستاباي
                  </button>
                </div>

                {paymobMethod === "vodafone_cash" && (
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-foreground">
                      رقم المحفظة الإلكترونية (فودافون كاش / اتصالات / أورنج /
                      وي) *
                    </label>
                    <Input
                      placeholder="010XXXXXXXX"
                      value={walletMobileNumber}
                      onChange={(e) => setWalletMobileNumber(e.target.value)}
                      className="rounded-xl font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="space-y-6">
          <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-5 shadow-xs sticky top-24">
            <h2 className="text-base font-bold text-foreground flex items-center justify-between">
              <span>ملخص الطلب</span>
              <Badge variant="outline" className="font-mono text-xs">
                {items.length} أصناف
              </Badge>
            </h2>

            {/* Items scroll */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-border/40 pl-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="pt-2 first:pt-0 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-foreground">
                      {item.quantity}× {item.nameAr}
                    </div>
                    {item.selectedSize && (
                      <div className="text-[10px] text-muted-foreground">
                        الحجم: {item.selectedSize.nameAr}
                      </div>
                    )}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="text-[10px] text-muted-foreground">
                        إضافات:{" "}
                        {item.selectedAddons.map((a) => a.nameAr).join("، ")}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-primary shrink-0">
                    {item.totalPrice} ج.م
                  </span>
                </div>
              ))}
            </div>

            {/* Financial breakdown */}
            <div className="space-y-2 pt-4 border-t border-border/60 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>المجموع الفرعي</span>
                <span className="font-mono">{subtotal.toFixed(2)} ج.م</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>الخصم المطبق</span>
                  <span className="font-mono">
                    - {discountAmount.toFixed(2)} ج.م
                  </span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>رسوم التوصيل</span>
                <span className="font-mono">
                  {currentOrderType === "delivery"
                    ? `${deliveryFee.toFixed(2)} ج.م`
                    : "مجاني (استلام)"}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-foreground pt-2 border-t border-border/40">
                <span>المجموع الكلي</span>
                <span className="text-base text-primary font-mono">
                  {(
                    subtotal -
                    discountAmount +
                    (currentOrderType === "delivery" ? deliveryFee : 0)
                  ).toFixed(2)}{" "}
                  ج.م
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl font-bold py-6 text-base shadow-lg shadow-primary/25 cursor-pointer"
            >
              {isSubmitting
                ? "جاري تجهيز وبدء الدفع..."
                : currentPaymentMethod === "cod"
                  ? "تأكيد الطلب الآن"
                  : "متابعة إلى الدفع الإلكتروني"}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>طلبك مؤمن ومعتمد من مطعم إيت ويل</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

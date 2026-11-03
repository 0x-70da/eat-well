import { Suspense } from "react";
import { CheckoutSection } from "./sections/CheckoutSection";
import { CheckoutSkeleton } from "./components/CheckoutSkeleton";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          إتمام الطلب والدفع
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          أدخل بيانات التوصيل واختر طريقة الدفع المناسبة لإكمال طلبك
        </p>
      </div>

      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutSection />
      </Suspense>
    </div>
  );
}

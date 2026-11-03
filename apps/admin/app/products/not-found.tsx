import { BackButton } from "@/components/helper-components/BackButton";

export default function ProductsNotFound() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
      <h2 className="text-lg font-bold">الوجبة غير موجودة</h2>
      <p className="text-xs text-muted-foreground">
        لم نتمكن من العثور على الوجبة المطلوبة.
      </p>
      <BackButton label="العودة لقائمة الوجبات" />
    </div>
  );
}

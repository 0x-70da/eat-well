import { BackButton } from "@/components/helper-components/BackButton";

export default function ProductsNotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-3 p-6 text-center">
      <h2 className="text-lg font-bold">الوجبة غير موجودة</h2>
      <p className="text-xs text-muted-foreground">لم نتمكن من العثور على الوجبة المطلوبة.</p>
      <BackButton label="العودة لقائمة الوجبات" />
    </div>
  );
}

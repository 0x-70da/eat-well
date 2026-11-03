import { BackButton } from "@/components/helper-components/BackButton";

export default function CategoriesNotFound() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
      <h2 className="text-lg font-bold">التصنيف غير موجود</h2>
      <p className="text-xs text-muted-foreground">
        لم يتم العثور على التصنيف المطلوب.
      </p>
      <BackButton label="العودة لقائمة التصنيفات" />
    </div>
  );
}

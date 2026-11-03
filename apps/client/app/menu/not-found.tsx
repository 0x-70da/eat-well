import { BackButton } from "@/components/helper-components/BackButton";

export default function MenuNotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
      <h2 className="text-lg font-bold">الوجبة أو القسم غير موجود</h2>
      <p className="text-xs text-muted-foreground">
        لم نتمكن من العثور على ما تبحث عنه في القائمة.
      </p>
      <BackButton label="العودة للمنيو" />
    </div>
  );
}

import { BackButton } from "@/components/helper-components/BackButton";
import { FileQuestion } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-14 h-14 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
        <FileQuestion className="w-7 h-7" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h2 className="text-xl font-bold">الصفحة المطلوبة غير موجودة</h2>
        <p className="text-sm text-muted-foreground">
          لم نتمكن من العثور على الصفحة أو المورد الذي تبحث عنه في لوحة التحكم.
        </p>
      </div>
      <BackButton label="العودة للصفحة السابقة" />
    </div>
  );
}

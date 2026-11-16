import { BackButton } from "@/components/helper-components/BackButton";
import { FileQuestion } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestion className="h-7 w-7" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h2 className="text-xl font-bold">الصفحة المطلوبة غير موجودة</h2>
        <p className="text-sm text-muted-foreground">
          لم نتمكن من العثور على الصفحة أو المورد الذي تبحث عنه في لوحة التحكم.
        </p>
      </div>
      <BackButton label="العودة للصفحة السابقة" />
    </div>
  );
}

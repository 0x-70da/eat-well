import { BackButton } from "@/components/helper-components/BackButton";
import { HelpCircle } from "lucide-react";

export default function RegisterNotFound() {
  return (
    <div className="container mx-auto max-w-md space-y-4 px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-foreground">الصفحة غير موجودة</h2>
      <p className="text-xs text-muted-foreground">لم يتم العثور على المسار المطلوب.</p>
      <BackButton />
    </div>
  );
}

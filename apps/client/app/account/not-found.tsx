import { BackButton } from "@/components/helper-components/BackButton";
import { HelpCircle } from "lucide-react";

export default function AccountNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-4">
      <div className="w-16 h-16 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-foreground">الحساب غير موجود</h2>
      <p className="text-xs text-muted-foreground">
        لم يتم العثور على البيانات المطلوبة.
      </p>
      <BackButton />
    </div>
  );
}

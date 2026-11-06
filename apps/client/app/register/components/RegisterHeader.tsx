import { UserPlus } from "lucide-react";

export function RegisterHeader() {
  return (
    <div className="text-center space-y-2">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
        <UserPlus className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-black text-foreground">إنشاء حساب جديد</h1>
      <p className="text-xs text-muted-foreground">
        انضم إلينا للاستمتاع بعروض حصرية وتجربة طلب سريعة ومميزة
      </p>
    </div>
  );
}

import { UserPlus } from "lucide-react";

export function RegisterHeader() {
  return (
    <div className="space-y-2 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
        <UserPlus className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-black text-foreground">إنشاء حساب جديد</h1>
      <p className="text-xs text-muted-foreground">
        انضم إلينا للاستمتاع بعروض حصرية وتجربة طلب سريعة ومميزة
      </p>
    </div>
  );
}

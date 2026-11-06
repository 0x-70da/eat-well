import { ShieldLock } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center space-y-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
        <ShieldLock className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          لوحة تحكم إيت ويل
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          يرجى تسجيل الدخول بحساب موظف معتمد للوصول إلى لوحة الإدارة
        </p>
      </div>
    </div>
  );
}

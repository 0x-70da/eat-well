import { LogIn } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="text-center space-y-2">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
        <LogIn className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-black text-foreground">تسجيل الدخول</h1>
      <p className="text-xs text-muted-foreground">
        أهلاً بك مجدداً في مطعم إيت ويل. سجل دخولك لمتابعة طلباتك وعناوينك
      </p>
    </div>
  );
}

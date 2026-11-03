"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setIsLoading(false);
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || "فشل تسجيل الدخول");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-card border border-border/80 rounded-3xl p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-foreground">تسجيل الدخول</h1>
          <p className="text-xs text-muted-foreground">
            أهلاً بك مجدداً في مطعم إيت ويل. سجل دخولك لمتابعة طلباتك وعناوينك
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>البريد الإلكتروني</span>
            </label>
            <Input
              type="email"
              required
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl font-mono text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>كلمة المرور</span>
              </label>
            </div>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl font-mono"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl font-bold py-5 shadow-md shadow-primary/25 cursor-pointer mt-2"
          >
            {isLoading ? "جاري تسجيل الدخول..." : "دخول"}
          </Button>
        </form>

        <div className="pt-4 border-t border-border/40 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            ليس لديك حساب بعد؟{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>إنشاء حساب جديد</span>
              <ArrowLeft className="w-3 h-3" />
            </Link>
          </p>
          <div>
            <Link
              href="/menu"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              متابعة الطلب كزائر دون تسجيل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

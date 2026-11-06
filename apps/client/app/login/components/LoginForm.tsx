"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@workspace/validation";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { loginWithEmail } from "../requests/loginWithEmail";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      await loginWithEmail(values);
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      setError("root", {
        message: (err as Error).message || "فشل تسجيل الدخول",
      });
    }
  };

  return (
    <div className="space-y-6">
      {errors.root && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            <span>البريد الإلكتروني</span>
          </label>
          <Input
            type="email"
            placeholder="example@mail.com"
            {...register("email")}
            className="rounded-xl font-mono text-left"
            dir="ltr"
          />
          {errors.email && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.email.message}
            </p>
          )}
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
            placeholder="••••••••"
            {...register("password")}
            className="rounded-xl font-mono"
          />
          {errors.password && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl font-bold py-5 shadow-md shadow-primary/25 cursor-pointer mt-2"
        >
          {isSubmitting ? "جاري تسجيل الدخول..." : "دخول"}
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
  );
}

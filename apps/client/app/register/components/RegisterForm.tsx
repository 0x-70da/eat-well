"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@workspace/validation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { signUpWithEmail } from "../requests/signUpWithEmail";

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    try {
      await signUpWithEmail(values);
      router.push("/account");
      router.refresh();
    } catch (err: unknown) {
      setError("root", {
        message: (err as Error).message || "فشل تسجيل الحساب",
      });
    }
  };

  return (
    <div className="space-y-6">
      {errors.root && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span>الاسم بالكامل</span>
          </label>
          <Input placeholder="مثال: أحمد محمد" {...register("name")} className="rounded-xl" />
          {errors.name && (
            <p className="text-[11px] font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <span>البريد الإلكتروني</span>
          </label>
          <Input
            type="email"
            placeholder="example@mail.com"
            {...register("email")}
            className="rounded-xl text-left font-mono"
            dir="ltr"
          />
          {errors.email && (
            <p className="text-[11px] font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>كلمة المرور (6 أحرف على الأقل)</span>
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="rounded-xl font-mono"
          />
          {errors.password && (
            <p className="text-[11px] font-medium text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>تأكيد كلمة المرور</span>
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="rounded-xl font-mono"
          />
          {errors.confirmPassword && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full cursor-pointer rounded-2xl py-5 font-bold shadow-md shadow-primary/25"
        >
          {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب الآن"}
        </Button>
      </form>

      <div className="border-t border-border/40 pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
          >
            <span>تسجيل الدخول</span>
            <ArrowLeft className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}

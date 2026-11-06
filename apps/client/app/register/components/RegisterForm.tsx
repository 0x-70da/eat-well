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
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            <span>الاسم بالكامل</span>
          </label>
          <Input
            placeholder="مثال: أحمد محمد"
            {...register("name")}
            className="rounded-xl"
          />
          {errors.name && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

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
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <span>كلمة المرور (6 أحرف على الأقل)</span>
          </label>
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

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <span>تأكيد كلمة المرور</span>
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="rounded-xl font-mono"
          />
          {errors.confirmPassword && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl font-bold py-5 shadow-md shadow-primary/25 cursor-pointer mt-2"
        >
          {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب الآن"}
        </Button>
      </form>

      <div className="pt-4 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>تسجيل الدخول</span>
            <ArrowLeft className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}

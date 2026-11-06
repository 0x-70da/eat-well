import { authClient } from "@/lib/auth-client";
import type { LoginInput } from "@workspace/validation";

export async function loginWithEmail(values: LoginInput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const result = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      };
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: (err as Error).message || "حدث خطأ غير متوقع أثناء تسجيل الدخول",
    };
  }
}

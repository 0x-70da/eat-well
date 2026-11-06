import { authClient } from "@/lib/auth-client";

export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await authClient.signOut();
    if (result.error) {
      return { success: false, error: result.error.message || "فشل تسجيل الخروج" };
    }
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: (err as Error).message || "حدث خطأ غير متوقع أثناء تسجيل الخروج",
    };
  }
}

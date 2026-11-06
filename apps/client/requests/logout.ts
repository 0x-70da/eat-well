import { authClient } from "@/lib/auth-client";

export async function logout(): Promise<void> {
  const { error } = await authClient.signOut();
  if (error) {
    throw new Error(error.message ?? "فشل تسجيل الخروج");
  }
}

import { authClient } from "@/lib/auth-client";
import type { RegisterInput } from "@workspace/validation";

export async function signUpWithEmail(input: RegisterInput): Promise<void> {
  const { error } = await authClient.signUp.email({
    name: input.name,
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message ?? "حدث خطأ أثناء إنشاء الحساب");
  }
}

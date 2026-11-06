import { authClient } from "@/lib/auth-client";
import type { LoginInput } from "@workspace/validation";

export async function loginWithEmail(input: LoginInput): Promise<void> {
  const { error } = await authClient.signIn.email({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message ?? "البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }
}

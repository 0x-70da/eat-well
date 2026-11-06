import { authClient } from "@/lib/auth-client";
import type { AuthSession } from "@workspace/types";

export async function getSession(): Promise<AuthSession | null> {
  if (typeof window === "undefined") {
    const { headers } = await import("next/headers");
    const cookie = (await headers()).get("cookie");

    if (!cookie) return null;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: { cookie },
      cache: "no-store",
    });

    if (!response.ok) return null;

    return (await response.json()) as AuthSession | null;
  }

  const result = await authClient.getSession();

  if (result.error || !result.data) return null;

  return result.data as unknown as AuthSession;
}

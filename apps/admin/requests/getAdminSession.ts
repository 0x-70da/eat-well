import { authClient } from "@/lib/auth-client";
import type { AuthSession } from "@workspace/types";

export const STAFF_ROLES = ["admin", "super_admin", "manager", "order_manager", "staff"] as const;

export async function getAdminSession(): Promise<AuthSession | null> {
  if (typeof window === "undefined") {
    try {
      const { headers } = await import("next/headers");
      const h = await headers();
      const cookie = h.get("cookie");
      if (!cookie) return null;

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/get-session`, {
        headers: { cookie },
        cache: "no-store",
      });

      if (!res.ok) return null;
      const data = (await res.json()) as AuthSession | null;
      return data;
    } catch {
      return null;
    }
  }

  const result = await authClient.getSession();
  if (result.error || !result.data) {
    return null;
  }
  return result.data as unknown as AuthSession;
}

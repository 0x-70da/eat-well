"use client";

import { authClient } from "@/lib/auth-client";
import type { AuthSession } from "@workspace/types";

export function useAdminSession() {
  const session = authClient.useSession();
  return {
    session: session.data as unknown as AuthSession | null,
    isPending: session.isPending,
    error: session.error,
  };
}

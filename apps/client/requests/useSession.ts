import { authClient } from "@/lib/auth-client";
import type { AuthSession } from "@workspace/types";

export function useSession() {
  const result = authClient.useSession();
  return {
    data: (result.data ? (result.data as unknown as AuthSession) : null),
    isPending: result.isPending,
    error: result.error,
  };
}

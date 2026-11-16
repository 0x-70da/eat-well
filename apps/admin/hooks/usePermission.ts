"use client";

import { useAdminSession } from "@/requests/useAdminSession";
import {
  hasRolePermission,
  type PermissionAction,
  type PermissionResource,
  type RoleName,
} from "@workspace/types";

export function usePermission() {
  const { session, isPending } = useAdminSession();
  const userRole = (session?.user?.role as RoleName) || undefined;

  const can = <R extends PermissionResource>(resource: R, action: PermissionAction<R>): boolean => {
    if (isPending || !userRole) return false;
    return hasRolePermission(userRole, resource, action);
  };

  const hasRole = (role: RoleName): boolean => {
    if (isPending || !userRole) return false;
    return userRole === role;
  };

  return {
    can,
    hasRole,
    role: userRole,
    isPending,
    isAuthenticated: Boolean(session?.user),
  };
}

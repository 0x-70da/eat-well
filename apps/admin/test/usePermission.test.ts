import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePermission } from "@/hooks/usePermission";
import * as adminSessionModule from "@/requests/useAdminSession";

describe("usePermission Hook", () => {
  it("returns false for all permissions while session is pending", () => {
    vi.spyOn(adminSessionModule, "useAdminSession").mockReturnValue({
      session: null,
      isPending: true,
      error: null,
    });

    const { result } = renderHook(() => usePermission());

    expect(result.current.isPending).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.can("dashboard", "view")).toBe(false);
    expect(result.current.can("orders", "update-status")).toBe(false);
    expect(result.current.hasRole("super_admin")).toBe(false);
  });

  it("returns false for all permissions when user is not authenticated", () => {
    vi.spyOn(adminSessionModule, "useAdminSession").mockReturnValue({
      session: null,
      isPending: false,
      error: null,
    });

    const { result } = renderHook(() => usePermission());

    expect(result.current.isPending).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.can("dashboard", "view")).toBe(false);
  });

  it("evaluates role-based permissions correctly for order_manager", () => {
    vi.spyOn(adminSessionModule, "useAdminSession").mockReturnValue({
      session: {
        session: { id: "s1", userId: "u1" },
        user: {
          id: "u1",
          name: "Order Admin",
          email: "order@example.com",
          role: "order_manager",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      } as unknown as never,
      isPending: false,
      error: null,
    });

    const { result } = renderHook(() => usePermission());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.role).toBe("order_manager");
    expect(result.current.hasRole("order_manager")).toBe(true);
    expect(result.current.hasRole("super_admin")).toBe(false);

    // Allowed operations for order_manager
    expect(result.current.can("orders", "list")).toBe(true);
    expect(result.current.can("orders", "view")).toBe(true);
    expect(result.current.can("orders", "update-status")).toBe(true);
    expect(result.current.can("orders", "cancel")).toBe(true);

    // Prohibited operations for order_manager
    expect(result.current.can("payments", "refund")).toBe(false);
    expect(result.current.can("products", "create")).toBe(false);
    expect(result.current.can("products", "delete")).toBe(false);
    expect(result.current.can("roles", "assign")).toBe(false);
    expect(result.current.can("settings", "update")).toBe(false);
  });

  it("evaluates role-based permissions correctly for product_manager", () => {
    vi.spyOn(adminSessionModule, "useAdminSession").mockReturnValue({
      session: {
        session: { id: "s2", userId: "u2" },
        user: {
          id: "u2",
          name: "Menu Admin",
          email: "menu@example.com",
          role: "product_manager",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      } as unknown as never,
      isPending: false,
      error: null,
    });

    const { result } = renderHook(() => usePermission());

    expect(result.current.can("products", "create")).toBe(true);
    expect(result.current.can("products", "update")).toBe(true);
    expect(result.current.can("products", "delete")).toBe(true);
    expect(result.current.can("categories", "create")).toBe(true);

    // Cannot modify orders or manage users
    expect(result.current.can("orders", "update-status")).toBe(false);
    expect(result.current.can("users", "ban")).toBe(false);
  });

  it("evaluates role-based permissions correctly for super_admin", () => {
    vi.spyOn(adminSessionModule, "useAdminSession").mockReturnValue({
      session: {
        session: { id: "s3", userId: "u3" },
        user: {
          id: "u3",
          name: "Super Boss",
          email: "boss@example.com",
          role: "super_admin",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      } as unknown as never,
      isPending: false,
      error: null,
    });

    const { result } = renderHook(() => usePermission());

    expect(result.current.hasRole("super_admin")).toBe(true);
    expect(result.current.can("dashboard", "view")).toBe(true);
    expect(result.current.can("orders", "update-status")).toBe(true);
    expect(result.current.can("payments", "refund")).toBe(true);
    expect(result.current.can("roles", "assign")).toBe(true);
    expect(result.current.can("settings", "update")).toBe(true);
  });
});

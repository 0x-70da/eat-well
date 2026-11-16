import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { auth } from "../../lib/auth.js";
import { AppError } from "../../lib/errors.js";
import { hasRolePermission } from "@workspace/types";

describe("RBAC Role Permissions Definition", () => {
  it("grants super_admin access to all resources and sensitive actions", () => {
    expect(hasRolePermission("super_admin", "dashboard", "view")).toBe(true);
    expect(hasRolePermission("super_admin", "orders", "update-status")).toBe(true);
    expect(hasRolePermission("super_admin", "payments", "refund")).toBe(true);
    expect(hasRolePermission("super_admin", "roles", "assign")).toBe(true);
    expect(hasRolePermission("super_admin", "settings", "update")).toBe(true);
  });

  it("grants order_manager access to orders but denies payment overrides and catalog changes", () => {
    expect(hasRolePermission("order_manager", "orders", "list")).toBe(true);
    expect(hasRolePermission("order_manager", "orders", "view")).toBe(true);
    expect(hasRolePermission("order_manager", "orders", "update-status")).toBe(true);
    expect(hasRolePermission("order_manager", "orders", "cancel")).toBe(true);

    // Forbidden operations
    expect(hasRolePermission("order_manager", "payments", "refund")).toBe(false);
    expect(hasRolePermission("order_manager", "products", "create")).toBe(false);
    expect(hasRolePermission("order_manager", "categories", "delete")).toBe(false);
    expect(hasRolePermission("order_manager", "roles", "assign")).toBe(false);
    expect(hasRolePermission("order_manager", "settings", "update")).toBe(false);
  });

  it("grants product_manager access to products and categories but denies orders", () => {
    expect(hasRolePermission("product_manager", "products", "create")).toBe(true);
    expect(hasRolePermission("product_manager", "products", "update")).toBe(true);
    expect(hasRolePermission("product_manager", "categories", "create")).toBe(true);

    // Forbidden operations
    expect(hasRolePermission("product_manager", "orders", "update-status")).toBe(false);
    expect(hasRolePermission("product_manager", "payments", "refund")).toBe(false);
    expect(hasRolePermission("product_manager", "users", "ban")).toBe(false);
  });

  it("grants inventory_manager stock update permissions only", () => {
    expect(hasRolePermission("inventory_manager", "inventory", "view")).toBe(true);
    expect(hasRolePermission("inventory_manager", "inventory", "update")).toBe(true);

    // Forbidden operations
    expect(hasRolePermission("inventory_manager", "products", "delete")).toBe(false);
    expect(hasRolePermission("inventory_manager", "orders", "cancel")).toBe(false);
  });

  it("grants customer_support view permissions and denies destructive actions", () => {
    expect(hasRolePermission("customer_support", "customers", "view")).toBe(true);
    expect(hasRolePermission("customer_support", "orders", "view")).toBe(true);

    // Forbidden operations
    expect(hasRolePermission("customer_support", "payments", "refund")).toBe(false);
    expect(hasRolePermission("customer_support", "users", "ban")).toBe(false);
    expect(hasRolePermission("customer_support", "products", "create")).toBe(false);
  });

  it("denies regular user access to admin resources", () => {
    expect(hasRolePermission("user", "dashboard", "view")).toBe(false);
    expect(hasRolePermission("user", "orders", "list")).toBe(false);
    expect(hasRolePermission("user", "products", "create")).toBe(false);
  });
});

describe("requirePermission Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      locals: {},
    };
    mockNext = vi.fn();
    vi.restoreAllMocks();
  });

  it("rejects unauthenticated requests with Unauthorized 401", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue(null as unknown as never);

    const middleware = requirePermission("orders", "list");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = vi.mocked(mockNext).mock.calls[0]?.[0] as unknown as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
  });

  it("rejects banned users with Forbidden 403", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue({
      session: { id: "sess_1", userId: "usr_1" },
      user: {
        id: "usr_1",
        name: "Test User",
        email: "test@example.com",
        role: "order_manager",
        banned: true,
        banReason: "مخالفة الشروط",
      },
    } as unknown as never);

    const middleware = requirePermission("orders", "list");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = vi.mocked(mockNext).mock.calls[0]?.[0] as unknown as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(403);
    expect(err.message).toContain("banned");
  });

  it("rejects authenticated users lacking the required permission with Forbidden 403", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue({
      session: { id: "sess_1", userId: "usr_1" },
      user: {
        id: "usr_1",
        name: "Test User",
        email: "test@example.com",
        role: "order_manager",
        banned: false,
      },
    } as unknown as never);

    // order_manager cannot refund payments
    const middleware = requirePermission("payments", "refund");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = vi.mocked(mockNext).mock.calls[0]?.[0] as unknown as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(403);
  });

  it("allows authenticated users who possess the required permission and attaches session", async () => {
    const mockUser = {
      id: "usr_1",
      name: "Order Staff",
      email: "staff@example.com",
      role: "order_manager",
      banned: false,
    };
    const mockSession = { id: "sess_1", userId: "usr_1" };
    const mockPayload = { session: mockSession, user: mockUser };

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockPayload as unknown as never);

    const middleware = requirePermission("orders", "update-status");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockRes.locals?.session).toEqual(mockPayload);
  });
});

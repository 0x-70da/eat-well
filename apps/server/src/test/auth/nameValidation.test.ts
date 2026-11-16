import { describe, it, expect } from "vitest";
import { registerSchema } from "@workspace/validation";
import { auth } from "../../lib/auth.js";

describe("Registration Name Validation (Schema Level)", () => {
  it("rejects empty name", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "test@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only name", () => {
    const result = registerSchema.safeParse({
      name: "     ",
      email: "test@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name with less than 2 non-whitespace characters", () => {
    const result = registerSchema.safeParse({
      name: " a ",
      email: "test@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding 100 characters", () => {
    const longName = "a".repeat(101);
    const result = registerSchema.safeParse({
      name: longName,
      email: "test@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid Arabic/English names and automatically trims them", () => {
    const result = registerSchema.safeParse({
      name: "  أحمد محمد  ",
      email: "ahmed@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("أحمد محمد");
    }
  });
});

describe("Better Auth Server-side validateUserInfo Hook", () => {
  const validateUserInfo = auth.options.user?.validateUserInfo;

  it("is defined on Better Auth configuration", () => {
    expect(typeof validateUserInfo).toBe("function");
  });

  it("rejects empty name for email-password registration", () => {
    const res = validateUserInfo?.({
      user: { name: "", email: "user@example.com" },
      source: { action: "create-user", method: "email-password" },
    });
    expect(res).toBeDefined();
    expect(res?.error).toBe("INVALID_NAME");
    expect(res?.errorDescription).toContain("cannot be empty");
  });

  it("rejects whitespace-only name for email-password registration", () => {
    const res = validateUserInfo?.({
      user: { name: "    ", email: "user@example.com" },
      source: { action: "create-user", method: "email-password" },
    });
    expect(res).toBeDefined();
    expect(res?.error).toBe("INVALID_NAME");
  });

  it("rejects name shorter than 2 characters for email-password registration", () => {
    const res = validateUserInfo?.({
      user: { name: " x ", email: "user@example.com" },
      source: { action: "create-user", method: "email-password" },
    });
    expect(res).toBeDefined();
    expect(res?.error).toBe("INVALID_NAME");
    expect(res?.errorDescription).toContain("at least 2 characters");
  });

  it("accepts valid name for email-password registration", () => {
    const res = validateUserInfo?.({
      user: { name: "Mahmoud Hassan", email: "user@example.com" },
      source: { action: "create-user", method: "email-password" },
    });
    expect(res).toBeUndefined();
  });

  it("is OAuth compatible: does not fail if name is missing from OAuth provider profile", () => {
    const res = validateUserInfo?.({
      user: { email: "oauth@example.com" } as never,
      source: { action: "create-user", method: "oauth" },
    });
    expect(res).toBeUndefined();
  });

  it("rejects whitespace name if provided during OAuth registration", () => {
    const res = validateUserInfo?.({
      user: { name: "   ", email: "oauth@example.com" },
      source: { action: "create-user", method: "oauth" },
    });
    expect(res).toBeDefined();
    expect(res?.error).toBe("INVALID_NAME");
  });
});

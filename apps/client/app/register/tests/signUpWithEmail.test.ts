import { describe, expect, it, vi, beforeEach } from "vitest";
import { signUpWithEmail } from "../requests/signUpWithEmail";
import { authClient } from "@/lib/auth-client";

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signUp: {
      email: vi.fn(),
    },
  },
}));

describe("signUpWithEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("trims name and normalizes email before calling authClient", async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: {},
      error: null,
    } as never);

    await signUpWithEmail({
      name: "  Sarah Connor  ",
      email: "  Sarah@Example.COM ",
      password: "SecretPassword123!",
      confirmPassword: "SecretPassword123!",
    });

    expect(authClient.signUp.email).toHaveBeenCalledWith({
      name: "Sarah Connor",
      email: "sarah@example.com",
      password: "SecretPassword123!",
    });
  });

  it("throws error if authClient returns an error", async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: null,
      error: { message: "البريد الإلكتروني مسجل بالفعل" },
    } as never);

    await expect(
      signUpWithEmail({
        name: "Sarah Connor",
        email: "sarah@example.com",
        password: "SecretPassword123!",
        confirmPassword: "SecretPassword123!",
      }),
    ).rejects.toThrow("البريد الإلكتروني مسجل بالفعل");
  });
});

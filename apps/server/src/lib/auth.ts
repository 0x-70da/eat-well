import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { ac, roles, STAFF_ROLES } from "@workspace/types";
import { db } from "../db/index.js";
import { account, session, user, verification } from "../db/auth-schema.js";

export const auth = betterAuth({
  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
    process.env.ADMIN_URL || "http://localhost:3001",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    validateUserInfo: (data) => {
      if (data.source.action === "create-user") {
        const rawName = data.user.name;
        if (data.source.method === "email-password") {
          if (typeof rawName !== "string" || rawName.trim().length === 0) {
            return {
              error: "INVALID_NAME",
              errorDescription: "Name is required and cannot be empty or whitespace only",
            };
          }
          if (rawName.trim().length < 2) {
            return {
              error: "INVALID_NAME",
              errorDescription: "Name must be at least 2 characters",
            };
          }
          if (rawName.trim().length > 100) {
            return {
              error: "INVALID_NAME",
              errorDescription: "Name cannot exceed 100 characters",
            };
          }
        } else if (rawName !== undefined && rawName !== null) {
          if (typeof rawName === "string" && rawName.length > 0 && rawName.trim().length === 0) {
            return {
              error: "INVALID_NAME",
              errorDescription: "Name cannot be whitespace only",
            };
          }
        }
      }
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          if (typeof userData.name === "string") {
            const trimmed = userData.name.trim();
            if (trimmed.length === 0) {
              throw new APIError("BAD_REQUEST", {
                message: "Name is required and cannot be empty or whitespace only",
              });
            }
            return {
              data: {
                ...userData,
                name: trimmed,
              },
            };
          }
          return { data: userData };
        },
      },
    },
  },
  plugins: [
    admin({
      ac,
      roles,
      adminRoles: [...STAFF_ROLES],
      defaultRole: "user",
    }),
  ],
});

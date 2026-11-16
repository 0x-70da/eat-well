import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, roles } from "@workspace/types";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.BETTER_AUTH_URL
      : "http://localhost:5000/api/auth",
  plugins: [
    adminClient({
      ac,
      roles,
    }),
  ],
});

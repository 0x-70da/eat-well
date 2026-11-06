export type UserRole =
  "super_admin" | "admin" | "manager" | "order_manager" | "staff" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: UserRole | string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date | string;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole | string;
  banned: boolean;
  banReason?: string | null;
  banExpires?: string | null;
  ordersCount?: number;
  totalSpent?: number;
  lastOrderDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

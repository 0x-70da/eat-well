import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

export const permissionsStatement = {
  ...defaultStatements,
  dashboard: ["view"],
  orders: ["list", "view", "update-status", "cancel", "refund"],
  products: ["list", "view", "create", "update", "delete"],
  categories: ["list", "view", "create", "update", "delete"],
  inventory: ["view", "update", "adjust"],
  customers: ["list", "view", "update", "ban"],
  users: ["list", "view", "create", "update", "ban", "delete"],
  roles: ["list", "assign", "manage"],
  coupons: ["list", "view", "create", "update", "delete"],
  reviews: ["list", "view", "moderate", "delete"],
  payments: ["list", "view", "refund"],
  reports: ["view", "export"],
  settings: ["view", "update"],
} as const;

export type PermissionsStatement = typeof permissionsStatement;
export type PermissionResource = keyof PermissionsStatement;
export type PermissionAction<R extends PermissionResource> = PermissionsStatement[R][number];

export const ac = createAccessControl(permissionsStatement);

export const superAdminRole = ac.newRole({
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "impersonate-admins",
    "delete",
    "set-password",
    "set-email",
    "get",
    "update",
  ],
  session: ["list", "revoke", "delete"],
  dashboard: ["view"],
  orders: ["list", "view", "update-status", "cancel", "refund"],
  products: ["list", "view", "create", "update", "delete"],
  categories: ["list", "view", "create", "update", "delete"],
  inventory: ["view", "update", "adjust"],
  customers: ["list", "view", "update", "ban"],
  users: ["list", "view", "create", "update", "ban", "delete"],
  roles: ["list", "assign", "manage"],
  coupons: ["list", "view", "create", "update", "delete"],
  reviews: ["list", "view", "moderate", "delete"],
  payments: ["list", "view", "refund"],
  reports: ["view", "export"],
  settings: ["view", "update"],
});

export const adminRole = ac.newRole({
  user: ["create", "list", "ban", "set-password", "set-email", "get", "update"],
  session: ["list", "revoke"],
  dashboard: ["view"],
  orders: ["list", "view", "update-status", "cancel"],
  products: ["list", "view", "create", "update", "delete"],
  categories: ["list", "view", "create", "update", "delete"],
  inventory: ["view", "update", "adjust"],
  customers: ["list", "view", "update", "ban"],
  users: ["list", "view", "create", "update", "ban"],
  roles: ["list", "assign"],
  coupons: ["list", "view", "create", "update", "delete"],
  reviews: ["list", "view", "moderate", "delete"],
  payments: ["list", "view"],
  reports: ["view", "export"],
  settings: ["view", "update"],
});

export const managerRole = ac.newRole({
  user: ["list", "get"],
  session: ["list"],
  dashboard: ["view"],
  orders: ["list", "view", "update-status", "cancel"],
  products: ["list", "view", "create", "update"],
  categories: ["list", "view"],
  inventory: ["view", "update"],
  customers: ["list", "view"],
  users: ["list", "view"],
  roles: ["list"],
  coupons: ["list", "view"],
  reviews: ["list", "view"],
  payments: ["list", "view"],
  reports: ["view"],
  settings: ["view"],
});

export const orderManagerRole = ac.newRole({
  dashboard: ["view"],
  orders: ["list", "view", "update-status", "cancel"],
  customers: ["list", "view"],
  payments: ["list", "view"],
});

export const productManagerRole = ac.newRole({
  dashboard: ["view"],
  products: ["list", "view", "create", "update", "delete"],
  categories: ["list", "view", "create", "update", "delete"],
  inventory: ["view", "update"],
});

export const inventoryManagerRole = ac.newRole({
  dashboard: ["view"],
  products: ["list", "view"],
  inventory: ["view", "update", "adjust"],
});

export const customerSupportRole = ac.newRole({
  dashboard: ["view"],
  customers: ["list", "view", "update"],
  orders: ["list", "view"],
  payments: ["list", "view"],
});

export const marketingManagerRole = ac.newRole({
  dashboard: ["view"],
  products: ["list", "view"],
  categories: ["list", "view"],
  coupons: ["list", "view", "create", "update", "delete"],
  reviews: ["list", "view", "moderate", "delete"],
  reports: ["view"],
});

export const staffRole = ac.newRole({
  dashboard: ["view"],
  orders: ["list", "view"],
  products: ["list", "view"],
  categories: ["list", "view"],
});

export const userRole = ac.newRole({
  user: [],
  session: [],
});

export const roles = {
  super_admin: superAdminRole,
  admin: adminRole,
  manager: managerRole,
  order_manager: orderManagerRole,
  product_manager: productManagerRole,
  inventory_manager: inventoryManagerRole,
  customer_support: customerSupportRole,
  marketing_manager: marketingManagerRole,
  staff: staffRole,
  user: userRole,
};

export type AppRoles = typeof roles;
export type RoleName = keyof AppRoles;

export const STAFF_ROLES = [
  "super_admin",
  "admin",
  "manager",
  "order_manager",
  "product_manager",
  "inventory_manager",
  "customer_support",
  "marketing_manager",
  "staff",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export function hasRolePermission<R extends PermissionResource>(
  role: string | null | undefined,
  resource: R,
  action: PermissionAction<R>,
): boolean {
  if (!role) return false;
  const roleRecord = roles as Record<
    string,
    { authorize: (request: Record<string, string[]>) => { success: boolean } } | undefined
  >;
  const roleInstance = roleRecord[role];
  if (!roleInstance) return false;
  const result = roleInstance.authorize({ [resource]: [action] });
  return Boolean(result.success);
}

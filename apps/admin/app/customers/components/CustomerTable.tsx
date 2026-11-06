"use client";

import { useState } from "react";
import type { CustomerSummary, ManagedUser, UserRole } from "@workspace/types";
import { useAdminSession } from "@/requests/useAdminSession";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateUserRoleSchema,
  banUserSchema,
  type UpdateUserRoleInput,
  type BanUserInput,
  type BanUserRawInput,
} from "@workspace/validation";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  UserCheck,
  Shield,
  Ban,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";
import { updateUserRole } from "../requests/updateUserRole";
import { banUser } from "../requests/banUser";
import { getUsers } from "../requests/getUsers";

export interface CustomerTableProps {
  customers: CustomerSummary[];
  initialUsers: ManagedUser[];
  totalUsers: number;
}

const ROLE_LABELS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive" | "success";
  }
> = {
  super_admin: { label: "مدير عام", variant: "destructive" },
  admin: { label: "مدير نظام", variant: "default" },
  manager: { label: "مدير فرع", variant: "secondary" },
  order_manager: { label: "مسؤول طلبات", variant: "outline" },
  staff: { label: "موظف", variant: "outline" },
  user: { label: "عميل", variant: "outline" },
};

export function CustomerTable({ customers, initialUsers }: CustomerTableProps) {
  const { session } = useAdminSession();
  const currentUserId = session?.user?.id;

  const [activeTab, setActiveTab] = useState<"users" | "customers">("users");
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);

  // Modals state
  const [roleModalUser, setRoleModalUser] = useState<ManagedUser | null>(null);
  const [banModalUser, setBanModalUser] = useState<ManagedUser | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role Form
  const {
    register: registerRole,
    handleSubmit: handleRoleSubmit,
    formState: { errors: roleErrors },
  } = useForm<UpdateUserRoleInput>({
    resolver: zodResolver(updateUserRoleSchema),
    defaultValues: {
      role: "user",
    },
  });

  // Ban Form
  const {
    register: registerBan,
    handleSubmit: handleBanSubmit,
    reset: resetBan,
    formState: { errors: banErrors },
  } = useForm<BanUserRawInput, unknown, BanUserInput>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      userId: "",
      banned: true,
      banReason: "",
      banExpiresInDays: 7,
    },
  });

  const handleApplyFilter = async () => {
    setIsFiltering(true);
    try {
      const res = await getUsers({
        search: search || undefined,
        role: roleFilter,
        status: statusFilter as "all" | "active" | "banned",
      });
      setUsers(res.users);
    } finally {
      setIsFiltering(false);
    }
  };

  const openRoleModal = (u: ManagedUser) => {
    setActionError(null);
    setRoleModalUser(u);
  };

  const onRoleSubmit = async (data: UpdateUserRoleInput) => {
    if (!roleModalUser) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const res = await updateUserRole(roleModalUser.id, data);
      if (!res.success) {
        setActionError(res.message || "فشل تحديث الصلاحية");
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === roleModalUser.id ? { ...u, role: data.role } : u,
        ),
      );
      setRoleModalUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBanModal = (u: ManagedUser) => {
    setActionError(null);
    setBanModalUser(u);
    resetBan({
      userId: u.id,
      banned: !u.banned,
      banReason: u.banned ? "" : "مخالفة شروط الاستخدام",
      banExpiresInDays: 7,
    });
  };

  const onBanSubmit = async (data: BanUserInput) => {
    if (!banModalUser) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const res = await banUser(banModalUser.id, data);
      if (!res.success) {
        setActionError(res.message || "فشل تنفيذ العملية");
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === banModalUser.id
            ? {
                ...u,
                banned: data.banned,
                banReason: data.banReason || undefined,
              }
            : u,
        ),
      );
      setBanModalUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          دليل المستخدمين والصلاحيات ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "customers"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          ملخص إنفاق العملاء ({customers.length})
        </button>
      </div>

      {activeTab === "users" ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-border">
            <div className="flex-1 min-w-[200px] relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyFilter()}
                placeholder="بحث بالاسم أو البريد..."
                className="w-full h-9 rounded-md border border-input bg-background pr-8 pl-3 text-xs"
              />
              <Search className="w-4 h-4 absolute right-2.5 top-2.5 text-muted-foreground" />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs"
            >
              <option value="all">جميع الصلاحيات</option>
              <option value="super_admin">مدير عام</option>
              <option value="admin">مدير نظام</option>
              <option value="manager">مدير فرع</option>
              <option value="order_manager">مسؤول طلبات</option>
              <option value="staff">موظف</option>
              <option value="user">عميل</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="banned">محظور</option>
            </select>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleApplyFilter}
              disabled={isFiltering}
              className="gap-1.5"
            >
              {isFiltering ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              <span>تطبيق الفلتر</span>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الصلاحية</TableHead>
                    <TableHead>حالة الحساب</TableHead>
                    <TableHead>تاريخ الانضمام</TableHead>
                    <TableHead className="text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const isSelf = u.id === currentUserId;
                    const roleInfo = ROLE_LABELS[u.role] || {
                      label: u.role,
                      variant: "outline",
                    };

                    return (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-semibold text-xs block">
                                {u.name} {isSelf ? "(أنت)" : ""}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {u.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={roleInfo.variant}
                            className="text-[11px]"
                          >
                            {roleInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {u.banned ? (
                            <div className="flex flex-col">
                              <Badge
                                variant="destructive"
                                className="gap-1 w-fit"
                              >
                                <Ban className="w-3 h-3" />
                                <span>محظور</span>
                              </Badge>
                              {u.banReason && (
                                <span className="text-[10px] text-muted-foreground mt-0.5">
                                  {u.banReason}
                                </span>
                              )}
                            </div>
                          ) : (
                            <Badge variant="success" className="gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              <span>نشط</span>
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              variant="outline"
                              size="xs"
                              disabled={isSelf}
                              onClick={() => openRoleModal(u)}
                              title={
                                isSelf
                                  ? "لا يمكنك تعديل صلاحياتك"
                                  : "تعديل الصلاحية"
                              }
                              className="gap-1"
                            >
                              <Shield className="w-3 h-3" />
                              <span className="text-[11px]">الصلاحية</span>
                            </Button>
                            <Button
                              variant={u.banned ? "outline" : "destructive"}
                              size="xs"
                              disabled={isSelf}
                              onClick={() => openBanModal(u)}
                              title={
                                isSelf
                                  ? "لا يمكنك حظر نفسك"
                                  : u.banned
                                    ? "إلغاء الحظر"
                                    : "حظر الحساب"
                              }
                              className="gap-1"
                            >
                              <Ban className="w-3 h-3" />
                              <span className="text-[11px]">
                                {u.banned ? "إلغاء الحظر" : "حظر"}
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {customers.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                لا يوجد عملاء مسجلين حالياً
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العميل</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>عدد الطلبات</TableHead>
                    <TableHead>إجمالي الإنفاق</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-xs">
                            {c.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {c.email}
                      </TableCell>
                      <TableCell className="font-semibold text-xs">
                        {c.ordersCount} طلب
                      </TableCell>
                      <TableCell className="font-bold text-xs text-primary">
                        {c.totalSpent} ج.م
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString("ar-EG")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Role Management Modal */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRoleSubmit(onRoleSubmit)}
            className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold">
                تعديل صلاحية: {roleModalUser.name}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRoleModalUser(null)}
              >
                إلغاء
              </Button>
            </div>

            {actionError && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <label className="font-semibold block">
                اختر الصلاحية الجديدة:
              </label>
              <select
                {...registerRole("role")}
                defaultValue={roleModalUser.role}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="user">عميل (مستخدم عادي)</option>
                <option value="staff">موظف (Staff)</option>
                <option value="order_manager">
                  مسؤول طلبات (Order Manager)
                </option>
                <option value="manager">مدير فرع (Manager)</option>
                <option value="admin">مدير نظام (Admin)</option>
                <option value="super_admin">
                  مدير عام رئيسي (Super Admin)
                </option>
              </select>
              {roleErrors.role && (
                <p className="text-destructive text-xs">
                  {roleErrors.role.message}
                </p>
              )}
            </div>

            <div className="border-t border-border pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRoleModalUser(null)}
              >
                إلغاء
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  "تأكيد الصلاحية"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Ban Management Modal */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleBanSubmit(onBanSubmit)}
            className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold">
                {banModalUser.banned
                  ? "إلغاء حظر الحساب"
                  : "حظر أو تعليق الحساب"}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setBanModalUser(null)}
              >
                إلغاء
              </Button>
            </div>

            {actionError && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <p className="text-muted-foreground">
                المستخدم المستهدف:{" "}
                <span className="font-semibold text-foreground">
                  {banModalUser.name}
                </span>{" "}
                ({banModalUser.email})
              </p>

              {!banModalUser.banned ? (
                <>
                  <div>
                    <label className="font-semibold block mb-1">
                      سبب الحظر / التعليق *
                    </label>
                    <input
                      type="text"
                      {...registerBan("banReason")}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                      placeholder="مثال: سلوك غير لائق أو مخالفة شروط الخدمة"
                    />
                    {banErrors.banReason && (
                      <p className="text-destructive text-xs mt-1">
                        {banErrors.banReason.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">
                      مدة الحظر (بالأيام - اتركه فارغاً للحظر الدائم)
                    </label>
                    <input
                      type="number"
                      {...registerBan("banExpiresInDays")}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                      placeholder="مثال: 7"
                    />
                  </div>
                </>
              ) : (
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                  هل أنت متأكد من رغبتك في إلغاء الحظر وإعادة تفعيل هذا الحساب؟
                </p>
              )}
            </div>

            <div className="border-t border-border pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setBanModalUser(null)}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                size="sm"
                variant={banModalUser.banned ? "default" : "destructive"}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                    جاري التنفيذ...
                  </>
                ) : banModalUser.banned ? (
                  "تأكيد إلغاء الحظر"
                ) : (
                  "تأكيد حظر الحساب"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

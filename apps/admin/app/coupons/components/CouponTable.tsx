"use client";

import { useState } from "react";
import type { Coupon } from "@workspace/types";
import { usePermission } from "@/hooks/usePermission";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCouponSchema,
  type CreateCouponInput,
  type CreateCouponRawInput,
} from "@workspace/validation";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Plus, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { createCoupon, updateCoupon, deleteCoupon } from "../requests/getCoupons";

export interface CouponTableProps {
  coupons: Coupon[];
}

export function CouponTable({ coupons: initialCoupons }: CouponTableProps) {
  const { can } = usePermission();
  const canCreate = can("coupons", "create");
  const canUpdate = can("coupons", "update");
  const canDelete = can("coupons", "delete");

  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCouponRawInput, unknown, CreateCouponInput>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: "",
      descriptionAr: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 100,
      maxDiscountAmount: 50,
      usageLimit: 500,
      isActive: true,
    },
  });

  const openCreateModal = () => {
    reset({
      code: "",
      descriptionAr: "",
      discountType: "percentage",
      discountValue: 15,
      minOrderAmount: 100,
      maxDiscountAmount: 50,
      usageLimit: 500,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (c: Coupon) => {
    const updated = !c.isActive;
    const res = await updateCoupon(c.id, { isActive: updated });
    if (res.success) {
      setCoupons((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, isActive: updated } : item)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return;
    const res = await deleteCoupon(id);
    if (res.success) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const onFormSubmit = async (data: CreateCouponInput) => {
    setIsSubmitting(true);
    try {
      const res = await createCoupon(data);
      if (res.success && res.data) {
        setCoupons((prev) => [res.data as Coupon, ...prev]);
        setIsModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">إجمالي الكوبونات: {coupons.length}</span>
        {canCreate && (
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>إنشاء كوبون خصم جديد</span>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {coupons.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              لا توجد كوبونات مسجلة حالياً
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>كود الخصم</TableHead>
                  <TableHead>قيمة الخصم</TableHead>
                  <TableHead>الحد الأدنى للطلب</TableHead>
                  <TableHead>الحد الأقصى للخصم</TableHead>
                  <TableHead>مرات الاستخدام</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-center">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {c.code}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}%`
                        : `${c.discountValue} ج.م`}
                    </TableCell>
                    <TableCell className="text-xs">{c.minOrderAmount} ج.م</TableCell>
                    <TableCell className="text-xs">
                      {c.maxDiscountAmount ? `${c.maxDiscountAmount} ج.م` : "غير محدد"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : ""}
                    </TableCell>
                    <TableCell>
                      {canUpdate ? (
                        <button onClick={() => handleToggleActive(c)} className="cursor-pointer">
                          {c.isActive ? (
                            <Badge variant="success" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>مفعل</span>
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              <span>معطل</span>
                            </Badge>
                          )}
                        </button>
                      ) : c.isActive ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>مفعل</span>
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          <span>معطل</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {canDelete ? (
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => handleDelete(c.id)}
                            title="حذف"
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
            noValidate
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">إنشاء كوبون خصم جديد</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold">كود الخصم (Promo Code) *</label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("code", {
                    setValueAs: (v: string) => v?.toUpperCase(),
                  })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 font-mono uppercase"
                  placeholder="مثال: SUMMER25"
                />
                {errors.code && (
                  <p className="mt-1 text-xs text-destructive">{errors.code.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">نوع الخصم *</label>
                  <select
                    {...register("discountType")}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ج.م)</option>
                  </select>
                  {errors.discountType && (
                    <p className="mt-1 text-xs text-destructive">{errors.discountType.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block font-semibold">قيمة الخصم *</label>
                  <input
                    type="number"
                    step="0.5"
                    {...register("discountValue")}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                    placeholder="15"
                  />
                  {errors.discountValue && (
                    <p className="mt-1 text-xs text-destructive">{errors.discountValue.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">الحد الأدنى للطلب (ج.م)</label>
                  <input
                    type="number"
                    {...register("minOrderAmount")}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  />
                  {errors.minOrderAmount && (
                    <p className="mt-1 text-xs text-destructive">{errors.minOrderAmount.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block font-semibold">الحد الأقصى للخصم (ج.م)</label>
                  <input
                    type="number"
                    {...register("maxDiscountAmount")}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                    placeholder="اتركه فارغاً إذا كان بدون حد"
                  />
                  {errors.maxDiscountAmount && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.maxDiscountAmount.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold">الحد الأقصى لعدد مرات الاستخدام</label>
                <input
                  type="number"
                  {...register("usageLimit")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  placeholder="مثال: 500"
                />
                {errors.usageLimit && (
                  <p className="mt-1 text-xs text-destructive">{errors.usageLimit.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-semibold">الوصف بالعربية</label>
                <input
                  type="text"
                  {...register("descriptionAr")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  placeholder="خصم خاص بمناسبة الافتتاح..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء الكوبون"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

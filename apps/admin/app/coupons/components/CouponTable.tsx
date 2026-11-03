"use client";

import { useState } from "react";
import type { Coupon } from "@workspace/types";
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
import { Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { createCoupon, updateCoupon, deleteCoupon } from "../requests/getCoupons";

export interface CouponTableProps {
  coupons: Coupon[];
}

export function CouponTable({ coupons: initialCoupons }: CouponTableProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderAmount, setMinOrderAmount] = useState("100");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("50");
  const [usageLimit, setUsageLimit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setCode("");
    setDescriptionAr("");
    setDiscountType("percentage");
    setDiscountValue("15");
    setMinOrderAmount("100");
    setMaxDiscountAmount("50");
    setUsageLimit("500");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createCoupon({
        code,
        descriptionAr,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        isActive: true,
      });
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
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          إجمالي الكوبونات: {coupons.length}
        </span>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>إنشاء كوبون خصم جديد</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {coupons.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
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
                    <TableCell className="font-mono font-bold text-xs text-primary">
                      {c.code}
                    </TableCell>
                    <TableCell className="font-semibold text-xs">
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
                      <button
                        onClick={() => handleToggleActive(c)}
                        className="cursor-pointer"
                      >
                        {c.isActive ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>مفعل</span>
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="w-3 h-3" />
                            <span>معطل</span>
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => handleDelete(c.id)}
                          title="حذف"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl"
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
                <label className="font-semibold block mb-1">كود الخصم (Promo Code) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 font-mono uppercase"
                  placeholder="مثال: SUMMER25"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">نوع الخصم *</label>
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as "percentage" | "fixed")
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ج.م)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">قيمة الخصم *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">الحد الأدنى للطلب (ج.م)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">الحد الأقصى للخصم (ج.م)</label>
                  <input
                    type="number"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                    placeholder="اتركه فارغاً إذا كان بدون حد"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">الحد الأقصى لعدد مرات الاستخدام</label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="مثال: 500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">الوصف بالعربية</label>
                <input
                  type="text"
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="خصم خاص بمناسبة الافتتاح..."
                />
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإنشاء..." : "إنشاء الكوبون"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

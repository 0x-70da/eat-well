"use client";

import { useState } from "react";
import type { RestaurantSettings } from "@workspace/types";
import { usePermission } from "@/hooks/usePermission";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateSettingsSchema,
  type UpdateSettingsInput,
  type UpdateSettingsRawInput,
} from "@workspace/validation";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { updateAdminSettings } from "../requests/getSettings";
import { Check, Save, Loader2 } from "lucide-react";

export interface SettingsFormProps {
  settings: RestaurantSettings;
}

export function SettingsForm({ settings: initialSettings }: SettingsFormProps) {
  const { can } = usePermission();
  const canUpdate = can("settings", "update");

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSettingsRawInput, unknown, UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      restaurantNameAr: initialSettings.restaurantNameAr,
      restaurantName: initialSettings.restaurantName,
      sloganAr: initialSettings.sloganAr || "",
      descriptionAr: initialSettings.descriptionAr || "",
      phone: initialSettings.phone,
      secondaryPhone: initialSettings.secondaryPhone || "",
      email: initialSettings.email || "",
      addressAr: initialSettings.addressAr,
      openingHour: initialSettings.openingHour,
      closingHour: initialSettings.closingHour,
      deliveryFee: Number(initialSettings.deliveryFee),
      minOrderAmount: Number(initialSettings.minOrderAmount),
      estimatedPrepTimeMinutes: initialSettings.estimatedPrepTimeMinutes,
      taxRate: Number(initialSettings.taxRate),
      isDeliveryOpen: initialSettings.isDeliveryOpen,
      whatsappNumber: initialSettings.whatsappNumber || "",
    },
  });

  const onFormSubmit = async (data: UpdateSettingsInput) => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      const res = await updateAdminSettings(data);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-4xl space-y-6" noValidate>
      {!canUpdate && (
        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          وضع العرض فقط: لا تملك صلاحية تعديل إعدادات المطعم.
        </div>
      )}
      <fieldset disabled={!canUpdate} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">الهوية والبيانات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold">اسم المطعم بالعربية *</label>
                <input
                  type="text"
                  {...register("restaurantNameAr")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.restaurantNameAr && (
                  <p className="mt-1 text-xs text-destructive">{errors.restaurantNameAr.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block font-semibold">اسم المطعم بالإنجليزية *</label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("restaurantName")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.restaurantName && (
                  <p className="mt-1 text-xs text-destructive">{errors.restaurantName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block font-semibold">الشعار اللفظي (Slogan)</label>
              <input
                type="text"
                {...register("sloganAr")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold">
                نبذة عن المطعم (تظهر في الموقع الرئيسي)
              </label>
              <textarea
                rows={3}
                {...register("descriptionAr")}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">معلومات التواصل والموقع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-semibold">رقم الهاتف الرئيسي *</label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("phone")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 font-mono"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block font-semibold">رقم الهاتف الثانوي</label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("secondaryPhone")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 font-mono"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">رقم الواتساب للطلبات</label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("whatsappNumber")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold">البريد الإلكتروني الرسمي</label>
                <input
                  type="email"
                  dir="ltr"
                  {...register("email")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block font-semibold">عنوان المطعم بالعربية *</label>
                <input
                  type="text"
                  {...register("addressAr")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.addressAr && (
                  <p className="mt-1 text-xs text-destructive">{errors.addressAr.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">مواعيد العمل والتوصيل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold">ساعة الفتح</label>
                <input
                  type="text"
                  {...register("openingHour")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  placeholder="11:00 AM"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">ساعة الإغلاق</label>
                <input
                  type="text"
                  {...register("closingHour")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  placeholder="02:00 AM"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-semibold">رسوم التوصيل الافتراضية (ج.م) *</label>
                <input
                  type="number"
                  step="1"
                  {...register("deliveryFee")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.deliveryFee && (
                  <p className="mt-1 text-xs text-destructive">{errors.deliveryFee.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block font-semibold">الحد الأدنى للطلب (ج.م) *</label>
                <input
                  type="number"
                  step="1"
                  {...register("minOrderAmount")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.minOrderAmount && (
                  <p className="mt-1 text-xs text-destructive">{errors.minOrderAmount.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block font-semibold">متوسط وقت التحضير (دقيقة)</label>
                <input
                  type="number"
                  {...register("estimatedPrepTimeMinutes")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.estimatedPrepTimeMinutes && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.estimatedPrepTimeMinutes.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="deliveryOpen"
                {...register("isDeliveryOpen")}
                className="h-4 w-4 cursor-pointer rounded border-input text-primary"
              />
              <label htmlFor="deliveryOpen" className="cursor-pointer font-semibold">
                خدمة التوصيل مفعلة ومتاحة للطلبات الآن
              </label>
            </div>
          </CardContent>
        </Card>
      </fieldset>

      {canUpdate && (
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSaving} className="gap-2">
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>تم حفظ الإعدادات بنجاح</span>
              </>
            ) : (
              <>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  );
}

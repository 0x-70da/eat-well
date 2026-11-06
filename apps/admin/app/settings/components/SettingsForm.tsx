"use client";

import { useState } from "react";
import type { RestaurantSettings } from "@workspace/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateSettingsSchema,
  type UpdateSettingsInput,
  type UpdateSettingsRawInput,
} from "@workspace/validation";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { updateAdminSettings } from "../requests/getSettings";
import { Check, Save, Loader2 } from "lucide-react";

export interface SettingsFormProps {
  settings: RestaurantSettings;
}

export function SettingsForm({ settings: initialSettings }: SettingsFormProps) {
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
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6 max-w-4xl"
      noValidate
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            الهوية والبيانات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">
                اسم المطعم بالعربية *
              </label>
              <input
                type="text"
                {...register("restaurantNameAr")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
              {errors.restaurantNameAr && (
                <p className="text-xs text-destructive mt-1">
                  {errors.restaurantNameAr.message}
                </p>
              )}
            </div>
            <div>
              <label className="font-semibold block mb-1">
                اسم المطعم بالإنجليزية *
              </label>
              <input
                type="text"
                dir="ltr"
                {...register("restaurantName")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
              {errors.restaurantName && (
                <p className="text-xs text-destructive mt-1">
                  {errors.restaurantName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">
              الشعار اللفظي (Slogan)
            </label>
            <input
              type="text"
              {...register("sloganAr")}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">
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
          <CardTitle className="text-base font-bold">
            معلومات التواصل والموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold block mb-1">
                رقم الهاتف الرئيسي *
              </label>
              <input
                type="text"
                dir="ltr"
                {...register("phone")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 font-mono"
              />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label className="font-semibold block mb-1">
                رقم الهاتف الثانوي
              </label>
              <input
                type="text"
                dir="ltr"
                {...register("secondaryPhone")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">
                رقم الواتساب للطلبات
              </label>
              <input
                type="text"
                dir="ltr"
                {...register("whatsappNumber")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">
                البريد الإلكتروني الرسمي
              </label>
              <input
                type="email"
                dir="ltr"
                {...register("email")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="font-semibold block mb-1">
                عنوان المطعم بالعربية *
              </label>
              <input
                type="text"
                {...register("addressAr")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
              {errors.addressAr && (
                <p className="text-xs text-destructive mt-1">
                  {errors.addressAr.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            مواعيد العمل والتوصيل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">ساعة الفتح</label>
              <input
                type="text"
                {...register("openingHour")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                placeholder="11:00 AM"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">ساعة الإغلاق</label>
              <input
                type="text"
                {...register("closingHour")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                placeholder="02:00 AM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold block mb-1">
                رسوم التوصيل الافتراضية (ج.م) *
              </label>
              <input
                type="number"
                step="1"
                {...register("deliveryFee")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
              {errors.deliveryFee && (
                <p className="text-xs text-destructive mt-1">
                  {errors.deliveryFee.message}
                </p>
              )}
            </div>
            <div>
              <label className="font-semibold block mb-1">
                الحد الأدنى للطلب (ج.م) *
              </label>
              <input
                type="number"
                step="1"
                {...register("minOrderAmount")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
              {errors.minOrderAmount && (
                <p className="text-xs text-destructive mt-1">
                  {errors.minOrderAmount.message}
                </p>
              )}
            </div>
            <div>
              <label className="font-semibold block mb-1">
                متوسط وقت التحضير (دقيقة)
              </label>
              <input
                type="number"
                {...register("estimatedPrepTimeMinutes")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
              {errors.estimatedPrepTimeMinutes && (
                <p className="text-xs text-destructive mt-1">
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
              className="w-4 h-4 rounded text-primary border-input cursor-pointer"
            />
            <label
              htmlFor="deliveryOpen"
              className="font-semibold cursor-pointer"
            >
              خدمة التوصيل مفعلة ومتاحة للطلبات الآن
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSaving} className="gap-2">
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>تم حفظ الإعدادات بنجاح</span>
            </>
          ) : (
            <>
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

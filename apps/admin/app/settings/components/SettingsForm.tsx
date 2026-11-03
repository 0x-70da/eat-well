"use client";

import { useState } from "react";
import type { RestaurantSettings } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { updateAdminSettings } from "../requests/getSettings";
import { Check, Save } from "lucide-react";

export interface SettingsFormProps {
  settings: RestaurantSettings;
}

export function SettingsForm({ settings: initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<RestaurantSettings>(initialSettings);
  const [restaurantNameAr, setRestaurantNameAr] = useState(settings.restaurantNameAr);
  const [restaurantName, setRestaurantName] = useState(settings.restaurantName);
  const [sloganAr, setSloganAr] = useState(settings.sloganAr || "");
  const [descriptionAr, setDescriptionAr] = useState(settings.descriptionAr || "");
  const [phone, setPhone] = useState(settings.phone);
  const [secondaryPhone, setSecondaryPhone] = useState(settings.secondaryPhone || "");
  const [email, setEmail] = useState(settings.email || "");
  const [addressAr, setAddressAr] = useState(settings.addressAr);
  const [openingHour, setOpeningHour] = useState(settings.openingHour);
  const [closingHour, setClosingHour] = useState(settings.closingHour);
  const [deliveryFee, setDeliveryFee] = useState(settings.deliveryFee.toString());
  const [minOrderAmount, setMinOrderAmount] = useState(settings.minOrderAmount.toString());
  const [estimatedPrepTimeMinutes, setEstimatedPrepTimeMinutes] = useState(
    settings.estimatedPrepTimeMinutes.toString(),
  );
  const [taxRate, setTaxRate] = useState(settings.taxRate.toString());
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(settings.isDeliveryOpen);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || "");

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      const res = await updateAdminSettings({
        restaurantNameAr,
        restaurantName,
        sloganAr,
        descriptionAr,
        phone,
        secondaryPhone,
        email,
        addressAr,
        openingHour,
        closingHour,
        deliveryFee: Number(deliveryFee),
        minOrderAmount: Number(minOrderAmount),
        estimatedPrepTimeMinutes: Number(estimatedPrepTimeMinutes),
        taxRate: Number(taxRate),
        isDeliveryOpen,
        whatsappNumber,
      });
      if (res.success && res.data) {
        setSettings(res.data);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">الهوية والبيانات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">اسم المطعم بالعربية *</label>
              <input
                type="text"
                required
                value={restaurantNameAr}
                onChange={(e) => setRestaurantNameAr(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">اسم المطعم بالإنجليزية *</label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">الشعار اللفظي (Slogan)</label>
            <input
              type="text"
              value={sloganAr}
              onChange={(e) => setSloganAr(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">نبذة عن المطعم (تظهر في الموقع الرئيسي)</label>
            <textarea
              rows={3}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold block mb-1">رقم الهاتف الرئيسي *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">رقم الهاتف الثانوي</label>
              <input
                type="text"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">رقم الواتساب للطلبات</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">البريد الإلكتروني الرسمي</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">عنوان المطعم بالعربية *</label>
              <input
                type="text"
                required
                value={addressAr}
                onChange={(e) => setAddressAr(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">مواعيد العمل والتوصيل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">ساعة الفتح</label>
              <input
                type="text"
                value={openingHour}
                onChange={(e) => setOpeningHour(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                placeholder="11:00 AM"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">ساعة الإغلاق</label>
              <input
                type="text"
                value={closingHour}
                onChange={(e) => setClosingHour(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                placeholder="02:00 AM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold block mb-1">رسوم التوصيل الافتراضية (ج.م) *</label>
              <input
                type="number"
                step="1"
                required
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">الحد الأدنى للطلب (ج.م) *</label>
              <input
                type="number"
                step="1"
                required
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">متوسط وقت التحضير (دقيقة)</label>
              <input
                type="number"
                value={estimatedPrepTimeMinutes}
                onChange={(e) => setEstimatedPrepTimeMinutes(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="deliveryOpen"
              checked={isDeliveryOpen}
              onChange={(e) => setIsDeliveryOpen(e.target.checked)}
              className="w-4 h-4 rounded text-primary border-input cursor-pointer"
            />
            <label htmlFor="deliveryOpen" className="font-semibold cursor-pointer">
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
              <Save className="w-4 h-4" />
              <span>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

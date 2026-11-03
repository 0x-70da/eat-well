import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import type { RestaurantSettings } from "@workspace/types";

export interface ContactInfoCardProps {
  settings: RestaurantSettings;
}

export function ContactInfoCard({ settings }: ContactInfoCardProps) {
  return (
    <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="border-b border-border/40 pb-4">
        <h3 className="text-lg font-black text-foreground">بيانات الاتصال السريع</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          تواصل معنا مباشرة عبر القنوات المتاحة أدناه
        </p>
      </div>

      <div className="space-y-4">
        <a
          href={`tel:${settings.phone}`}
          className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40 hover:border-primary/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">
              الخط الساخن والطلبات
            </span>
            <span className="font-bold text-foreground font-mono text-sm" dir="ltr">
              {settings.phone}
            </span>
          </div>
        </a>

        {settings.whatsappNumber && (
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 block font-semibold">
                واتساب خدمة العملاء
              </span>
              <span className="font-bold text-foreground font-mono text-sm" dir="ltr">
                {settings.whatsappNumber}
              </span>
            </div>
          </a>
        )}

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">
              البريد الإلكتروني للإدارة
            </span>
            <span className="font-bold text-foreground font-mono text-sm" dir="ltr">
              {settings.email || "support@eatwell-eg.com"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">
              مواعيد العمل واستقبال الطلبات
            </span>
            <span className="font-bold text-foreground text-sm">
              يومياً من {settings.openingHour} حتى {settings.closingHour}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">
              الفرع الرئيسي
            </span>
            <span className="font-bold text-foreground text-sm">
              {settings.addressAr}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

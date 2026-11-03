import { MapPin, Phone, Clock } from "lucide-react";

export function BranchesList() {
  const branches = [
    {
      city: "القاهرة - المعادي",
      address: "شارع النصر الرئيسي، بجوار ميدان الجزائر، المعادي الجديدة",
      phone: "+20 100 123 4567",
      hours: "11:00 ص - 02:00 ص",
      features: "صالة طعام عائلية + تيك أواي + توصيل",
    },
    {
      city: "القاهرة - التجمع الخامس",
      address: "مجمع البنوك، شارع التسعين الجنوبي، التجمع الخامس",
      phone: "+20 100 234 5678",
      hours: "11:00 ص - 03:00 ص",
      features: "تراس خارجي + درايف ثرو + توصيل سريع",
    },
    {
      city: "الجيزة - الشيخ زايد",
      address: "وصلة دهشور، أمام مول العرب، مدخل زايد 4",
      phone: "+20 100 345 6789",
      hours: "12:00 م - 02:00 ص",
      features: "منطقة ألعاب أطفال + صالة كبار الزوار + توصيل",
    },
    {
      city: "الإسكندرية - سموحة",
      address: "شارع فوزي معاذ، أمام نادي سموحة، الإسكندرية",
      phone: "+20 100 456 7890",
      hours: "11:00 ص - 01:00 ص",
      features: "خدمة الولائم والمناسبات + صالة مكيفة + توصيل",
    },
  ];

  return (
    <div className="py-12 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">
          فروعنا المفتوحة لخدمتكم
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          نسعد باستقبالكم في أي من فروعنا لتناول وجباتكم المفضلة في أجواء عائلية مريحة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 hover:border-primary/40 transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-foreground text-lg">{b.city}</h3>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {b.features}
              </span>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{b.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="font-mono" dir="ltr">
                  {b.phone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>{b.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

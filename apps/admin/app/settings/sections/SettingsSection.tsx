import { getAdminSettings } from "../requests/getSettings";
import { SettingsForm } from "../components/SettingsForm";

export async function SettingsSection() {
  const settings = await getAdminSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">إعدادات المطعم العامة</h1>
        <p className="text-sm text-muted-foreground mt-1">
          تعديل تفاصيل المطعم، أوقات العمل، رسوم التوصيل، ومعلومات الاتصال.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}

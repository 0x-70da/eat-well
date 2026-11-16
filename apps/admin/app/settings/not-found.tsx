import { BackButton } from "@/components/helper-components/BackButton";

export default function SettingsNotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-3 p-6 text-center">
      <h2 className="text-lg font-bold">الإعداد المطلوب غير موجود</h2>
      <BackButton label="العودة للإعدادات" />
    </div>
  );
}

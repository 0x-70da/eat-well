import { BackButton } from "@/components/helper-components/BackButton";

export default function SettingsNotFound() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
      <h2 className="text-lg font-bold">الإعداد المطلوب غير موجود</h2>
      <BackButton label="العودة للإعدادات" />
    </div>
  );
}

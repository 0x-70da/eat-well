import { Suspense } from "react";
import { SettingsSection } from "./sections/SettingsSection";
import { SettingsSkeleton } from "./components/SettingsSkeleton";

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsSection />
    </Suspense>
  );
}

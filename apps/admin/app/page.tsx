import { Suspense } from "react";
import { DashboardOverviewSection } from "./sections/DashboardOverviewSection";
import { DashboardOverviewSkeleton } from "./components/DashboardOverviewSkeleton";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardOverviewSkeleton />}>
      <DashboardOverviewSection />
    </Suspense>
  );
}

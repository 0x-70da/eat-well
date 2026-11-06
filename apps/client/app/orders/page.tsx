import { Suspense } from "react";
import { MyOrdersSection } from "./sections/MyOrdersSection";
import { MyOrdersSkeleton } from "./components/MyOrdersSkeleton";

export const metadata = {
  title: "طلباتي السابقة | مطعم إيت ويل",
  description: "عرض سجل ومتابعة طلباتك السابقة من مطعم إيت ويل",
};

export default function MyOrdersPage() {
  return (
    <main>
      <Suspense fallback={<MyOrdersSkeleton />}>
        <MyOrdersSection />
      </Suspense>
    </main>
  );
}

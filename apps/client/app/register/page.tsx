import { Suspense } from "react";
import { RegisterSection } from "./sections/RegisterSection";
import { RegisterSkeleton } from "./components/RegisterSkeleton";

export default function RegisterPage() {
  return (
    <main>
      <Suspense fallback={<RegisterSkeleton />}>
        <RegisterSection />
      </Suspense>
    </main>
  );
}

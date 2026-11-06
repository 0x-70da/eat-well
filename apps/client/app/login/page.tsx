import { Suspense } from "react";
import { LoginSection } from "./sections/LoginSection";
import { LoginSkeleton } from "./components/LoginSkeleton";

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={<LoginSkeleton />}>
        <LoginSection />
      </Suspense>
    </main>
  );
}

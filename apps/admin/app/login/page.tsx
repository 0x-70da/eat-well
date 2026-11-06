import { Suspense } from "react";
import { LoginSection } from "./sections/LoginSection";
import { LoginSkeleton } from "./components/LoginSkeleton";

export const metadata = {
  title: "تسجيل دخول الإدارة | إيت ويل",
  description: "تسجيل الدخول إلى لوحة إدارة مطعم إيت ويل",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginSection />
    </Suspense>
  );
}

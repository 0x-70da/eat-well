import { Suspense } from "react";
import { AccountSection } from "./sections/AccountSection";
import { AccountSkeleton } from "./components/AccountSkeleton";

export default function AccountPage() {
  return (
    <main>
      <Suspense fallback={<AccountSkeleton />}>
        <AccountSection />
      </Suspense>
    </main>
  );
}

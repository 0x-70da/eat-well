import { Suspense } from "react";
import { CustomerListSection } from "./sections/CustomerListSection";
import { CustomerListSkeleton } from "./components/CustomerListSkeleton";

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<CustomerListSkeleton />}>
      <CustomerListSection />
    </Suspense>
  );
}

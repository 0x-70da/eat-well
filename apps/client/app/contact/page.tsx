import { Suspense } from "react";
import { ContactSection } from "./sections/ContactSection";
import { Skeleton } from "@workspace/ui/components/skeleton";

function ContactSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-16 w-80 mx-auto" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-7 h-96 rounded-3xl" />
        <Skeleton className="lg:col-span-5 h-96 rounded-3xl" />
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <Suspense fallback={<ContactSkeleton />}>
        <ContactSection />
      </Suspense>
    </div>
  );
}

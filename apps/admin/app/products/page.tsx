import { Suspense } from "react";
import { ProductListSection } from "./sections/ProductListSection";
import { ProductListSkeleton } from "./components/ProductListSkeleton";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductListSection />
    </Suspense>
  );
}

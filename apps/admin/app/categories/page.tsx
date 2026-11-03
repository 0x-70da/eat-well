import { Suspense } from "react";
import { CategoryListSection } from "./sections/CategoryListSection";
import { CategoryListSkeleton } from "./components/CategoryListSkeleton";

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<CategoryListSkeleton />}>
      <CategoryListSection />
    </Suspense>
  );
}

import { Suspense } from "react";
import { MenuListSection } from "./sections/MenuListSection";
import { MenuListSkeleton } from "./components/MenuListSkeleton";

export interface MenuPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
    featured?: "true" | "false";
  }>;
}

export default function MenuPage({ searchParams }: MenuPageProps) {
  return (
    <Suspense fallback={<MenuListSkeleton />}>
      <MenuListSection searchParams={searchParams} />
    </Suspense>
  );
}

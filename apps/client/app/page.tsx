import { Suspense } from "react";
import { HeroSection } from "./sections/HeroSection";
import { CategorySliderSection } from "./sections/CategorySliderSection";
import { CategorySliderSkeleton } from "./components/CategorySliderSkeleton";
import { FeaturedDishesSection } from "./sections/FeaturedDishesSection";
import { FeaturedDishesSkeleton } from "./components/FeaturedDishesSkeleton";
import { SpecialOffersSection } from "./sections/SpecialOffersSection";
import { PopularMealsSection } from "./sections/PopularMealsSection";
import { RestaurantStorySection } from "./sections/RestaurantStorySection";
import { TestimonialsSection } from "./sections/TestimonialsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <Suspense fallback={<CategorySliderSkeleton />}>
        <CategorySliderSection />
      </Suspense>

      <Suspense fallback={<FeaturedDishesSkeleton />}>
        <FeaturedDishesSection />
      </Suspense>

      <SpecialOffersSection />

      <Suspense fallback={<FeaturedDishesSkeleton />}>
        <PopularMealsSection />
      </Suspense>

      <RestaurantStorySection />

      <TestimonialsSection />
    </main>
  );
}

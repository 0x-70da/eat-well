import { Suspense } from "react";
import { ProductDetailsSection } from "./sections/ProductDetailsSection";
import { ProductDetailsSkeleton } from "./components/ProductDetailsSkeleton";

export interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetailsSection params={params} />
      </Suspense>
    </div>
  );
}

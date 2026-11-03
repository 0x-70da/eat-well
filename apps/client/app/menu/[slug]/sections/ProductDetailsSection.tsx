import { notFound } from "next/navigation";
import { getProductDetails } from "../requests/getProductDetails";
import { ProductDetailsView } from "../components/ProductDetailsView";

export interface ProductDetailsSectionProps {
  params?: Promise<{ slug: string }>;
  slug?: string;
}

export async function ProductDetailsSection({
  params,
  slug: propSlug,
}: ProductDetailsSectionProps) {
  const resolvedParams = params ? await params : { slug: "" };
  const slug = propSlug || resolvedParams.slug;

  if (!slug) {
    notFound();
  }

  const product = await getProductDetails(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsView product={product} />;
}

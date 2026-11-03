import { getMenuProducts } from "../requests/getMenuProducts";
import { getCategories } from "@/requests/getCategories";
import { MenuFilterBar } from "../components/MenuFilterBar";
import { ProductCard } from "@/components/products/ProductCard";
import { Utensils } from "lucide-react";

export interface MenuListSectionProps {
  searchParams?: Promise<{
    category?: string;
    search?: string;
    sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
    featured?: "true" | "false";
  }>;
  categoryId?: string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
  isFeatured?: "true" | "false";
}

export async function MenuListSection({
  searchParams,
  categoryId: propCategoryId,
  search: propSearch,
  sortBy: propSortBy,
  isFeatured: propIsFeatured,
}: MenuListSectionProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const categoryId = propCategoryId ?? resolvedParams.category;
  const search = propSearch ?? resolvedParams.search;
  const sortBy = propSortBy ?? resolvedParams.sortBy;
  const isFeatured = propIsFeatured ?? resolvedParams.featured;
  const [categories, productsData] = await Promise.all([
    getCategories(),
    getMenuProducts({
      categoryId,
      search,
      sortBy,
      isFeatured,
      limit: 60,
    }),
  ]);

  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          {activeCategory ? activeCategory.nameAr : "قائمة الطعام الكاملة"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {activeCategory?.descriptionAr ||
            "اختر وجبتك المفضلة من تشكيلتنا الواسعة من المشاوي الشرقية والشاورما والطواجن والمقبلات."}
        </p>
      </div>

      {/* Filter and search bar */}
      <MenuFilterBar
        categories={categories}
        selectedCategory={categoryId}
        currentSort={sortBy}
        initialSearch={search}
      />

      {/* Results grid */}
      {productsData.items.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-muted/20 rounded-3xl border border-dashed border-border">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base">لا توجد وجبات مطابقة للبحث</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً من القائمة أعلاه.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

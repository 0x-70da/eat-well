import { getAdminProducts } from "../requests/getProducts";
import { getAdminCategories } from "@/app/categories/requests/getCategories";
import { ProductTable } from "../components/ProductTable";

export async function ProductListSection() {
  const [productsData, categoriesData] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">قائمة الوجبات والأطباق</h1>
        <p className="text-sm text-muted-foreground mt-1">
          إدارة الوجبات والأسعار، وتحديث التوفر وإضافة وجبات جديدة للمطعم.
        </p>
      </div>

      <ProductTable
        products={productsData.items}
        categories={categoriesData.map((c) => ({ id: c.id, nameAr: c.nameAr }))}
      />
    </div>
  );
}

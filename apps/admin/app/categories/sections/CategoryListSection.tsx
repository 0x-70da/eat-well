import { getAdminCategories } from "../requests/getCategories";
import { CategoryTable } from "../components/CategoryTable";

export async function CategoryListSection() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">إدارة تصنيفات الطعام</h1>
        <p className="text-sm text-muted-foreground mt-1">
          إضافة وتعديل أقسام المنيو وتحديد ترتيب ظهورها للعملاء.
        </p>
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}

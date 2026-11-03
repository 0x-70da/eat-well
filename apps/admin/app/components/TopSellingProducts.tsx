import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

export interface TopProduct {
  productId: string;
  productName: string;
  productNameAr: string;
  image: string;
  orderCount: number;
  totalRevenue: number;
}

export interface TopSellingProductsProps {
  products: TopProduct[];
}

export function TopSellingProducts({ products }: TopSellingProductsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">الوجبات الأكثر مبيعاً</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            لا توجد إحصائيات كافية بعد
          </div>
        ) : (
          products.map((p, idx) => (
            <div key={p.productId || idx} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg overflow-hidden relative shrink-0 bg-muted">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.productNameAr}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-xs block truncate">
                  {p.productNameAr}
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  {p.orderCount} طلب
                </span>
              </div>
              <div className="text-left shrink-0">
                <span className="font-bold text-xs block text-primary">
                  {p.totalRevenue} ج.م
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

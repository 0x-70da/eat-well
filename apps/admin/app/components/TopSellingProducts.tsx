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
          <div className="py-8 text-center text-sm text-muted-foreground">
            لا توجد إحصائيات كافية بعد
          </div>
        ) : (
          products.map((p, idx) => (
            <div key={p.productId || idx} className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
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
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">{p.productNameAr}</span>
                <span className="block text-[11px] text-muted-foreground">{p.orderCount} طلب</span>
              </div>
              <div className="shrink-0 text-left">
                <span className="block text-xs font-bold text-primary">{p.totalRevenue} ج.م</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

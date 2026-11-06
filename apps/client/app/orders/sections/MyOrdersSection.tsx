import Link from "next/link";
import { ShoppingBag, UtensilsCrossed, LogIn, Search } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import { getSession } from "@/requests/getSession";
import { getMyOrders } from "../requests/getMyOrders";
import { OrderCard } from "../components/OrderCard";

export async function MyOrdersSection() {
  const session = await getSession();

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <LogIn className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">
            تسجيل الدخول لعرض طلباتك
          </h1>
          <p className="text-sm text-muted-foreground">
            يرجى تسجيل الدخول إلى حسابك لعرض ومتابعة جميع طلباتك السابقة تلقائياً.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login?callbackUrl=/orders"
            className={buttonVariants({
              size: "lg",
              className: "rounded-2xl font-bold px-8 shadow-md",
            })}
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/orders/track"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "rounded-2xl font-bold px-8",
            })}
          >
            تتبع برقم الطلب للزوار
          </Link>
        </div>
      </div>
    );
  }

  const orders = await getMyOrders();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            طلباتي السابقة
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            سجل جميع طلباتك التي قمت بطلبها من مطعم إيت ويل
          </p>
        </div>

        <Link
          href="/orders/track"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors self-start sm:self-center"
        >
          <Search className="w-3.5 h-3.5" />
          <span>البحث برقم طلب زائر</span>
        </Link>
      </div>

      {/* Orders List or Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">لا توجد طلبات سابقة</h2>
          <p className="text-sm text-muted-foreground">
            لم تقم بطلب أي وجبات حتى الآن. تصفح قائمتنا واستمتع بأشهى المشاوي والأطباق الشرقية.
          </p>
          <Link
            href="/menu"
            className={buttonVariants({
              size: "lg",
              className: "rounded-2xl font-bold px-8 shadow-md gap-2",
            })}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>تصفح قائمة الطعام</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

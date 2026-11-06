import Link from "next/link";
import { User } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import { getSession } from "@/requests/getSession";
import { AccountProfileCard } from "../components/AccountProfileCard";
import { AccountNavTiles } from "../components/AccountNavTiles";

export async function AccountSection() {
  const session = await getSession();
  console.log("session", session);

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <User className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">
            تسجيل الدخول إلى حسابك
          </h1>
          <p className="text-sm text-muted-foreground">
            سجل دخولك للاطلاع على سجل طلباتك السابقة، عناوين التوصيل، والمكافآت.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login?callbackUrl=/account"
            className={buttonVariants({
              size: "lg",
              className: "rounded-2xl font-bold px-8 shadow-md",
            })}
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "rounded-2xl font-bold px-8",
            })}
          >
            حساب جديد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <AccountProfileCard user={session.user} />
      <AccountNavTiles />
    </div>
  );
}

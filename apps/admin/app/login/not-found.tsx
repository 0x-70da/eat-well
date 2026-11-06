import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export default function LoginNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-bold">الصفحة غير موجودة</h2>
      <Link href="/login">
        <Button>العودة لتسجيل الدخول</Button>
      </Link>
    </div>
  );
}

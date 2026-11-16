import { LoginHeader } from "../components/LoginHeader";
import { LoginForm } from "../components/LoginForm";

export function LoginSection() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/40 bg-card p-6 shadow-sm sm:p-8">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}

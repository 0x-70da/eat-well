import { LoginHeader } from "../components/LoginHeader";
import { LoginForm } from "../components/LoginForm";

export function LoginSection() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-card border border-border/80 rounded-3xl p-8 space-y-6 shadow-xs">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}

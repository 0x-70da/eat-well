import { RegisterHeader } from "../components/RegisterHeader";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterSection() {
  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="space-y-6 rounded-3xl border border-border/80 bg-card p-8 shadow-xs">
        <RegisterHeader />
        <RegisterForm />
      </div>
    </div>
  );
}

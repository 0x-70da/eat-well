import {
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  PackageCheck,
  XCircle,
} from "lucide-react";

export interface OrderStatusStepperProps {
  status: string;
  orderType: string;
}

interface Step {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function OrderStatusStepper({ status, orderType }: OrderStatusStepperProps) {
  if (status === "cancelled") {
    return (
      <div className="p-6 rounded-3xl bg-destructive/10 border border-destructive/20 text-center space-y-2">
        <XCircle className="w-10 h-10 text-destructive mx-auto" />
        <h3 className="font-black text-lg text-destructive">تم إلغاء هذا الطلب</h3>
        <p className="text-xs text-muted-foreground">
          إذا كانت لديك أي استفسارات أو ترغب في استرداد المبلغ، يرجى التواصل مع إدارة
          المطعم.
        </p>
      </div>
    );
  }

  const steps: Step[] = [
    { key: "pending", label: "تم الاستلام", icon: Clock },
    { key: "confirmed", label: "مؤكد", icon: CheckCircle },
    { key: "preparing", label: "في المطبخ", icon: ChefHat },
    {
      key: orderType === "pickup" ? "ready_for_pickup" : "out_for_delivery",
      label: orderType === "pickup" ? "جاهز للاستلام" : "في الطريق",
      icon: Truck,
    },
    { key: "delivered", label: "تم التسليم", icon: PackageCheck },
  ];

  const getStepIndex = (st: string) => {
    switch (st) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "preparing":
        return 2;
      case "ready_for_pickup":
      case "out_for_delivery":
        return 3;
      case "delivered":
        return 4;
      default:
        return 0;
    }
  };

  const currentIdx = getStepIndex(status);

  return (
    <div className="py-6">
      <div className="grid grid-cols-5 relative">
        {/* Track Line behind steps */}
        <div className="absolute top-5 left-10 right-10 h-1 bg-muted -z-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center text-center z-10 space-y-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-md"
                    : isDone
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground border-2 border-background"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold leading-tight ${
                  isCurrent
                    ? "text-primary font-black"
                    : isDone
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

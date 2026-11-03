import { FaqAccordion } from "./components/FaqAccordion";

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">
          الأسئلة الشائعة والمعلومات
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          إليك إجابات وافية على أكثر الاستفسارات تداولاً حول خدماتنا، جودة اللحوم،
          والتوصيل وطرق الدفع.
        </p>
      </div>

      <FaqAccordion />
    </div>
  );
}

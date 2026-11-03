"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export function FaqAccordion() {
  const faqs: FaqItem[] = [
    {
      category: "الطلبات والتوصيل",
      question: "ما هي مناطق التوصيل المتاحة وكم يستغرق وصول الطلب؟",
      answer:
        "نقوم بالتوصيل إلى معظم أحياء القاهرة الكبرى والجيزة والإسكندرية. يستغرق التوصيل عادةً بين 30 إلى 45 دقيقة حسب المسافة وحجم الطلب، ونستخدم حافظات حرارية لضمان وصول وجبتك ساخنة وطازجة.",
    },
    {
      category: "الطلبات والتوصيل",
      question: "هل يمكنني تتبع طلبي بعد إتمامه؟",
      answer:
        "نعم بالتأكيد! فور إتمام طلبك، ستحصل على رقم طلب فريد يمكنك من خلاله تتبع حالة الوجبة خطوة بخطوة من شاشة 'تتبع الطلب'، بدءاً من استلام الطلب وتجهيزه في المطبخ وحتى خروج المندوب والتسليم.",
    },
    {
      category: "اللحوم وجودة الطعام",
      question: "هل جميع اللحوم والدواجن المستخدمة بلدية وحلال 100%؟",
      answer:
        "نعم، نلتزم التزاماً تاماً باستخدام لحوم كندوز وضاني طازجة بلدية من مزارع معتمدة، ويتم الذبح والتحضير وفق الشريعة الإسلامية وتحت إشراف بيطري صارم يومياً دون استخدام أي لحوم مجمدة.",
    },
    {
      category: "طرق الدفع",
      question: "ما هي وسائل الدفع المدعومة على الموقع؟",
      answer:
        "نوفر خيارات دفع متعددة تناسب الجميع: الدفع نقداً عند الاستلام (COD)، الدفع بالبطاقات البنكية الدولية عبر Stripe، وباي موب (Paymob) الذي يدعم المحافظ الإلكترونية مثل فودافون كاش، انستاباي (InstaPay)، وبطاقات ميزة الوطنية.",
    },
    {
      category: "الطلبات والتوصيل",
      question: "هل أحتاج لإنشاء حساب حتى أتمكن من الطلب؟",
      answer:
        "لا، يمكنك إتمام طلبك بسهولة كضيف (Guest) دون الحاجة لتسجيل حساب. ولكن إنشاء حساب يتيح لك حفظ عناوين التوصيل، متابعة سجل طلباتك السابقة، والاستفادة من نقاط المكافآت والعروض الحصرية.",
    },
    {
      category: "تعديل الوجبات",
      question: "هل يمكنني تعديل مكونات الوجبة أو إضافة ملاحظات خاصة؟",
      answer:
        "نعم، تتيح لك شاشة تخصيص الوجبة اختيار حجم الوجبة، الإضافات المرغوبة (مثل الطحينة، الثومية، الخضار المشوي)، وكتابة أي تعليمات خاصة للشيف (مثل تقليل الملح أو زيادة التسوية).",
    },
    {
      category: "الحفلات والولائم",
      question: "هل يوفر المطعم خدمة تجهيز الولائم والمناسبات الكبرى؟",
      answer:
        "نعم، لدينا قسم متخصص لتجهيز صواني العزومات والولائم والخراف المشوية للمناسبات العائلية وحفلات الشركات. يمكنك التواصل معنا مسبقاً عبر الهاتف أو الواتساب لتنسيق الموعد والكميات المطلوبة.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  const categories = ["الكل", "الطلبات والتوصيل", "اللحوم وجودة الطعام", "طرق الدفع", "تعديل الوجبات", "الحفلات والولائم"];

  const filteredFaqs =
    selectedCategory === "الكل"
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion Items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-foreground text-sm cursor-pointer select-none"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>{faq.question}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

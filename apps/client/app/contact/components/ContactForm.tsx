"use client";

import { useState } from "react";
import { Send, CheckCircle2, MessageSquare, User, Mail, Phone } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="bg-card border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          تم استلام رسالتك بنجاح!
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          شكراً لتواصلك معنا. سيقوم فريق خدمة العملاء بالرد على استفسارك في أقرب وقت
          ممكن.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSuccess(false)}
          className="rounded-xl mt-4"
        >
          إرسال رسالة أخرى
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs"
    >
      <div className="border-b border-border/40 pb-4">
        <h3 className="text-lg font-black text-foreground">أرسل لنا رسالة مباشرة</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          سواء كان لديك استفسار، اقتراح، أو حجز مناسبة خاصة، نحن هنا لمساعدتك
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            <span>الاسم الكريم *</span>
          </label>
          <Input
            required
            placeholder="اسمك بالكامل"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
            <span>رقم الهاتف *</span>
          </label>
          <Input
            required
            type="tel"
            placeholder="010XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl font-mono"
            dir="ltr"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            <span>البريد الإلكتروني</span>
          </label>
          <Input
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl font-mono text-left"
            dir="ltr"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            موضوع الرسالة *
          </label>
          <Input
            required
            placeholder="مثال: استفسار عن حجز وليمة، ملاحظة على طلب..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
            <span>نص الرسالة أو الاستفسار *</span>
          </label>
          <Textarea
            required
            placeholder="اكتب تفاصيل استفسارك هنا..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-xl"
            rows={4}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl font-bold py-6 gap-2 shadow-lg shadow-primary/25 cursor-pointer"
      >
        <Send className="w-4 h-4" />
        <span>{isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة الآن"}</span>
      </Button>
    </form>
  );
}

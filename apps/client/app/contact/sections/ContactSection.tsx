import { getSettings } from "@/requests/getSettings";
import { ContactForm } from "../components/ContactForm";
import { ContactInfoCard } from "../components/ContactInfoCard";
import { BranchesList } from "../components/BranchesList";

export async function ContactSection() {
  const settings = await getSettings();

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">
          اتصل بنا وتواصل معنا
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          يسعدنا الاستماع لآرائكم واستفساراتكم وتلقي مقترحاتكم لتقديم أفضل تجربة طعام
          تليق بكم دائماً.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <div className="lg:col-span-5">
          <ContactInfoCard settings={settings} />
        </div>
      </div>

      <BranchesList />
    </div>
  );
}

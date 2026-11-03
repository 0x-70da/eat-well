import { getSettings } from "@/requests/getSettings";
import { CheckoutForm } from "../components/CheckoutForm";

export async function CheckoutSection() {
  const settings = await getSettings();

  return <CheckoutForm settings={settings} />;
}

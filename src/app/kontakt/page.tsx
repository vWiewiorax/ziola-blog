import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Napisz do redakcji bloga Zielnik Zdrowia.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl text-emerald-950">Kontakt</h1>
      <p className="mt-3 text-emerald-900/75">
        Masz pytanie o zioło, którego jeszcze nie opisaliśmy? Albo znalazłeś błąd w artykule?
        Napisz — czytamy każdą wiadomość.
      </p>
      <ContactForm />
    </div>
  );
}

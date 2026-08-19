import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import PageBanner from "@/components/page-banner";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Napisz do redakcji Herbalum.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Kontakt" breadcrumb={[{ label: "Kontakt" }]} />
      <div className="mx-auto max-w-6xl gap-10 px-4 py-10 lg:grid lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-neutral-600">
            Masz pytanie o zioło, którego jeszcze nie opisaliśmy? Albo znalazłeś błąd w artykule?
            Napisz — czytamy każdą wiadomość.
          </p>
          <ContactForm />
        </div>
        <div className="mt-12 lg:mt-0">
          <Sidebar />
        </div>
      </div>
    </>
  );
}

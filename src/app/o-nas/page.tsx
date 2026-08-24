import type { Metadata } from "next";
import PageBanner from "@/components/page-banner";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "O nas",
  description: "Kim jesteśmy i jak powstają treści w Herbalum.",
  alternates: { canonical: "/o-nas" },
};

export default function AboutPage() {
  return (
    <>
      <PageBanner title="O nas" breadcrumb={[{ label: "O nas" }]} />
      <div className="mx-auto max-w-6xl gap-10 px-4 py-10 lg:grid lg:grid-cols-[1fr_320px]">
        <div className="prose prose-lg max-w-none prose-headings:font-[family-name:var(--font-montserrat)] prose-headings:text-black prose-p:text-ink prose-li:text-ink prose-a:text-brand">
          <p>
            <strong>Herbalum</strong> powstał z prostej potrzeby: chcieliśmy mieć jedno
            miejsce, w którym wiedza o ziołach jest podana konkretnie, bez magicznego języka
            i bez sprzedawania kolejnych suplementów.
          </p>
          <h2>Jak piszemy artykuły</h2>
          <ul>
            <li>Zaczynamy od tradycyjnych zastosowań, ale sprawdzamy współczesne opracowania.</li>
            <li>Zawsze podajemy sposób przygotowania, proporcje, temperaturę i czas parzenia.</li>
            <li>Nigdy nie pomijamy przeciwwskazań i interakcji z lekami.</li>
            <li>Nie obiecujemy, że zioło wyleczy chorobę. Zioła wspierają, nie zastępują leczenia.</li>
          </ul>
          <h2>Czego tu nie znajdziesz</h2>
          <p>
            Nie prowadzimy sklepu, nie polecamy „jedynego skutecznego” preparatu i nie doradzamy
            odstawiania leków. Jeśli chorujesz przewlekle, jesteś w ciąży lub karmisz piersią ,
            każdą zmianę omów z lekarzem.
          </p>
        </div>
        <div className="mt-12 lg:mt-0">
          <Sidebar />
        </div>
      </div>
    </>
  );
}

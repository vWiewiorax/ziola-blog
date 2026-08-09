import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nas",
  description: "Kim jesteśmy i jak powstają treści na blogu Zielnik Zdrowia.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl text-emerald-950">O nas</h1>
      <div className="prose prose-emerald mt-6 max-w-none prose-headings:font-serif prose-headings:text-emerald-950">
        <p>
          <strong>Zielnik Zdrowia</strong> powstał z prostej potrzeby: chcieliśmy mieć jedno miejsce,
          w którym wiedza o ziołach jest podana konkretnie — bez magicznego języka i bez sprzedawania
          kolejnych suplementów.
        </p>
        <h2>Jak piszemy artykuły</h2>
        <ul>
          <li>Zaczynamy od tradycyjnych zastosowań, ale sprawdzamy, co mówią współczesne opracowania.</li>
          <li>Zawsze podajemy sposób przygotowania — proporcje, temperaturę i czas parzenia.</li>
          <li>Nigdy nie pomijamy przeciwwskazań i interakcji z lekami.</li>
          <li>Nie obiecujemy, że zioło wyleczy chorobę. Zioła wspierają — nie zastępują leczenia.</li>
        </ul>
        <h2>Czego tu nie znajdziesz</h2>
        <p>
          Nie prowadzimy sklepu, nie polecamy „jedynego skutecznego” preparatu i nie doradzamy
          odstawiania leków. Jeśli chorujesz przewlekle, jesteś w ciąży lub karmisz piersią —
          każdą zmianę omów z lekarzem.
        </p>
      </div>
    </div>
  );
}

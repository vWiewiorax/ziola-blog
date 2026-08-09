import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-montserrat)] text-lg font-semibold text-white">
            🌿 Portal Zielarski
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Rzetelne poradniki o ziołach, naparach i naturalnych sposobach na zdrowie.
          </p>
        </div>
        <div>
          <p className="font-[family-name:var(--font-montserrat)] font-semibold text-white">
            Serwis
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/blog" className="hover:text-brand">
                Artykuły
              </Link>
            </li>
            <li>
              <Link href="/o-nas" className="hover:text-brand">
                O nas
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="hover:text-brand">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-[family-name:var(--font-montserrat)] font-semibold text-white">
            Zastrzeżenie
          </p>
          <p className="mt-3 text-xs leading-relaxed text-neutral-400">
            Treści mają charakter informacyjny i nie zastępują porady lekarskiej. W razie choroby,
            ciąży, karmienia piersią lub przyjmowania leków skonsultuj stosowanie ziół z lekarzem
            lub farmaceutą.
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Portal Zielarski. Wszystkie prawa zastrzeżone.
      </div>
    </footer>
  );
}

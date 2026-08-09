import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-emerald-900/10 bg-emerald-900/[0.03]">
      <div className="mx-auto max-w-5xl px-5 py-10 text-sm text-emerald-900/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-serif text-base text-emerald-900">🌿 Zielnik Zdrowia</p>
          <nav className="flex gap-4">
            <Link href="/blog" className="hover:underline">
              Artykuły
            </Link>
            <Link href="/o-nas" className="hover:underline">
              O nas
            </Link>
            <Link href="/kontakt" className="hover:underline">
              Kontakt
            </Link>
          </nav>
        </div>
        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-emerald-900/60">
          Treści na tej stronie mają charakter informacyjny i nie zastępują porady lekarskiej.
          W razie choroby, ciąży, karmienia piersią lub przyjmowania leków skonsultuj stosowanie
          ziół z lekarzem lub farmaceutą.
        </p>
        <p className="mt-4 text-xs text-emerald-900/50">
          © {new Date().getFullYear()} Zielnik Zdrowia. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Suspense } from "react";
import SearchBox from "./search-box";

const topLinks = [
  { href: "/kontakt", label: "Kontakt" },
  { href: "/o-nas", label: "O nas" },
  { href: "/kontakt", label: "Współpraca" },
];

const mainLinks = [
  { href: "/", label: "Strona główna" },
  { href: "/blog", label: "Artykuły" },
  { href: "/blog?kategoria=Poradniki", label: "Poradniki" },
  { href: "/blog?kategoria=Odporność", label: "Odporność" },
  { href: "/blog?kategoria=Adaptogeny", label: "Adaptogeny" },
  { href: "/o-nas", label: "O nas" },
];

export default function SiteHeader() {
  return (
    <header>
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-2.5 text-[13px]">
          <nav className="flex gap-5">
            {topLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-brand">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto w-full max-w-sm">
            <Suspense fallback={null}>
              <SearchBox variant="dark" />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="text-4xl leading-none" aria-hidden>
            🌿
          </span>
          <span>
            <span className="block font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-tight text-black">
              Portal <span className="text-brand">Zielarski</span>
            </span>
            <span className="block text-xs uppercase tracking-[0.25em] text-neutral-500">
              Zioła i zdrowie naturalne
            </span>
          </span>
        </Link>
      </div>

      <nav className="border-y border-neutral-200">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-7 gap-y-2 px-4 py-3.5 text-[15px]">
          {mainLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-[family-name:var(--font-montserrat)] font-medium text-black hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

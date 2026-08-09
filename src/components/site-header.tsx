import Link from "next/link";

const links = [
  { href: "/", label: "Start" },
  { href: "/blog", label: "Artykuły" },
  { href: "/o-nas", label: "O nas" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-900/10 bg-[#fbfaf5]/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🌿
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-emerald-900">
            Zielnik Zdrowia
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-emerald-900/80 transition hover:bg-emerald-900/5 hover:text-emerald-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

export default function PageBanner({
  title,
  breadcrumb,
}: {
  title: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <div className="border-b border-neutral-200 bg-neutral-100">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-3 px-4 py-9">
        <h1 className="font-[family-name:var(--font-montserrat)] text-[40px] leading-tight">
          {title}
        </h1>
        <nav aria-label="Okruszki" className="text-sm text-neutral-600">
          <Link href="/" className="text-brand hover:underline">
            Strona główna
          </Link>
          {breadcrumb?.map((item) => (
            <span key={item.label}>
              {" » "}
              {item.href ? (
                <Link href={item.href} className="text-brand hover:underline">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}

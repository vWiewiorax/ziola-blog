"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminSession } from "./use-admin-session";

const links = [
  { href: "/admin", label: "Artykuły" },
  { href: "/admin/wiadomosci", label: "Wiadomości" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { logout } = useAdminSession();

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-neutral-200 pb-4 text-sm">
      <div className="flex gap-5">
        {links.map((link) => {
          const active =
            link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "font-medium text-brand" : "text-neutral-600 hover:text-brand"}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <button onClick={() => void logout()} className="ml-auto text-brand hover:underline">
        Wyloguj
      </button>
    </nav>
  );
}

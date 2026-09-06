"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBox({ variant = "light" }: { variant?: "light" | "dark" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  const dark = variant === "dark";

  return (
    <form
      role="search"
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        router.push(trimmed ? `/blog?q=${encodeURIComponent(trimmed)}` : "/blog");
      }}
    >
      <label htmlFor={`search-${variant}`} className="sr-only">
        Szukaj w serwisie
      </label>
      <input
        id={`search-${variant}`}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Szukaj w serwisie..."
        maxLength={80}
        className={
          dark
            ? "w-full border-b border-neutral-600 bg-transparent px-7 py-1 text-sm text-white placeholder:text-neutral-400 focus:border-brand focus:outline-none"
            : "w-full rounded border border-neutral-300 bg-white px-9 py-2.5 text-sm text-ink placeholder:text-neutral-500 focus:border-brand focus:outline-none"
        }
      />
      <span
        aria-hidden
        className={`absolute top-1/2 -translate-y-1/2 ${dark ? "left-0 text-neutral-300" : "left-3 text-neutral-500"}`}
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="6.75" cy="6.75" r="4.75" stroke="currentColor" strokeWidth="1.5" />
          <path d="m10.25 10.25 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
      </span>
    </form>
  );
}

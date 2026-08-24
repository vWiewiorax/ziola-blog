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
            ? "w-full border-b border-neutral-600 bg-transparent px-1 py-1 text-base text-white placeholder:text-neutral-400 focus:border-brand focus:outline-none"
            : "w-full rounded border border-neutral-300 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-500 focus:border-brand focus:outline-none"
        }
      />
    </form>
  );
}

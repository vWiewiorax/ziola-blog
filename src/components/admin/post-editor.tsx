"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import { POSTS_COLLECTION, imageForCategory } from "@/lib/post-utils";
import { revalidatePublicPages } from "./revalidate";

export function slugify(value: string): string {
  const map: Record<string, string> = {
    ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
  };
  return value
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => map[char] ?? char)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  category: "Poradniki",
  image: "",
  date: new Date().toISOString().slice(0, 10),
  content: "",
  published: true,
};

function saveErrorMessage(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code === "permission-denied") {
    return "Firestore odrzucił zapis. Sprawdź, czy w firestore.rules jest Twój UID i czy reguły są wgrane, oraz czy wszystkie pola są wypełnione.";
  }
  if (code === "unavailable") return "Brak połączenia z Firestore, spróbuj ponownie.";
  return `Zapis nie powiódł się${code ? ` (${code})` : ""}.`;
}

export default function PostEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "saving">(id ? "loading" : "idle");
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const snapshot = await getDoc(doc(getDb(), POSTS_COLLECTION, id));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({
          title: String(data.title ?? ""),
          slug: String(data.slug ?? snapshot.id),
          excerpt: String(data.excerpt ?? ""),
          category: String(data.category ?? "Poradniki"),
          image: String(data.image ?? ""),
          date: String(data.date ?? "").slice(0, 10),
          content: String(data.content ?? ""),
          published: Boolean(data.published),
        });
      }
      setStatus("idle");
    })();
  }, [id]);

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const slug = form.slug.trim() || slugify(form.title);
    if (!slug) {
      setError("Podaj tytuł lub adres (slug) artykułu.");
      return;
    }
    setStatus("saving");
    setError("");
    try {
      await setDoc(
        doc(getDb(), POSTS_COLLECTION, slug),
        {
          ...form,
          slug,
          image: form.image.trim() || imageForCategory(form.category),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      await revalidatePublicPages(slug);
      router.push("/admin");
      router.refresh();
    } catch (caught) {
      setError(saveErrorMessage(caught));
      setStatus("idle");
    }
  }

  if (status === "loading") return <p className="text-sm text-neutral-600">Wczytywanie...</p>;

  const field = "mt-1.5 w-full rounded border border-neutral-300 px-4 py-2.5 focus:border-brand focus:outline-none";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{id ? "Edytuj artykuł" : "Nowy artykuł"}</h1>
        <Link href="/admin" className="text-sm text-brand hover:underline">
          « Wróć do listy
        </Link>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-black">
          Tytuł
        </label>
        <input
          id="title"
          required
          value={form.title}
          onChange={(event) => {
            update("title", event.target.value);
            if (!id && !slugEdited) update("slug", slugify(event.target.value));
          }}
          className={field}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-black">
            Adres (slug)
          </label>
          <input
            id="slug"
            value={form.slug}
            onChange={(event) => {
              setSlugEdited(true);
              update("slug", slugify(event.target.value));
            }}
            disabled={Boolean(id)}
            className={`${field} disabled:bg-neutral-100`}
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-black">
            Data publikacji
          </label>
          <input
            id="date"
            type="date"
            required
            value={form.date}
            onChange={(event) => update("date", event.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-black">
            Kategoria
          </label>
          <input
            id="category"
            required
            value={form.category}
            onChange={(event) => update("category", event.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-black">
            Obrazek (ścieżka lub URL)
          </label>
          <input
            id="image"
            value={form.image}
            placeholder={`/posts/${form.slug || "nazwa"}.jpg`}
            onChange={(event) => update("image", event.target.value)}
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-black">
          Zajawka
        </label>
        <textarea
          id="excerpt"
          rows={2}
          required
          maxLength={300}
          value={form.excerpt}
          onChange={(event) => update("excerpt", event.target.value)}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-black">
          Treść (Markdown)
        </label>
        <textarea
          id="content"
          rows={18}
          required
          value={form.content}
          onChange={(event) => update("content", event.target.value)}
          className={`${field} font-mono text-sm`}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(event) => update("published", event.target.checked)}
        />
        Opublikowany (widoczny na blogu)
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-brand px-6 py-3 text-sm text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "saving" ? "Zapisywanie..." : "Zapisz artykuł"}
      </button>
    </form>
  );
}

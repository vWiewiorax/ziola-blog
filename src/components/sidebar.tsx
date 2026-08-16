import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBox from "./search-box";
import { formatDate } from "@/lib/post-utils";
import { getAllPosts, getCategories } from "@/lib/posts";

export default async function Sidebar() {
  const [categories, posts] = await Promise.all([getCategories(), getAllPosts()]);
  const latest = posts.slice(0, 4);

  return (
    <aside className="space-y-8">
      <Suspense fallback={null}>
        <SearchBox />
      </Suspense>

      <section>
        <h2 className="text-[24px]">Kategorie wpisów</h2>
        <ul className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200 text-[16px]">
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={`/blog?kategoria=${encodeURIComponent(category)}`}
                className="flex items-center justify-between py-2.5 text-ink hover:text-brand"
              >
                {category}
                <span className="text-sm text-neutral-400">
                  {posts.filter((post) => post.category === category).length}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-neutral-200">
        <div className="bg-neutral-50 p-5">
          <p className="font-[family-name:var(--font-montserrat)] text-xl font-semibold text-black">
            Zielnik na własnym parapecie
          </p>
          <p className="mt-2 text-[15px] text-neutral-600">
            Mięta, melisa i tymianek rosną w doniczce przez cały rok. Sprawdź, jak je uprawiać
            i suszyć.
          </p>
        </div>
        <Link
          href="/blog/jak-suszyc-ziola"
          className="block bg-brand py-3 text-center text-white hover:bg-brand-dark"
        >
          Przejdź do poradnika
        </Link>
      </section>

      <section>
        <h2 className="text-[24px]">Aktualności</h2>
        <ul className="mt-4 space-y-4">
          {latest.map((post) => (
            <li key={post.slug} className="flex gap-3">
              <Link href={`/blog/${post.slug}`} className="shrink-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={80}
                  height={60}
                  className="h-[60px] w-[80px] rounded object-cover"
                />
              </Link>
              <div className="text-[15px]">
                <Link href={`/blog/${post.slug}`} className="font-medium text-black hover:text-brand">
                  {post.title}
                </Link>
                <p className="mt-0.5 text-sm text-neutral-500">{formatDate(post.date)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

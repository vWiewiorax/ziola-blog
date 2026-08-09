import Link from "next/link";
import PostCard from "@/components/post-card";
import { getAllPosts, getCategories } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const [featured, ...rest] = posts;

  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-emerald-900 px-8 py-14 text-emerald-50 sm:px-12">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
          Zioła · Napary · Zdrowie naturalne
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
          Natura ma swoją aptekę. Warto wiedzieć, jak z niej korzystać.
        </h1>
        <p className="mt-5 max-w-xl text-emerald-100/85">
          Rzetelne, konkretne poradniki o ziołach: co na co działa, jak to zaparzyć i kiedy lepiej
          odpuścić. Bez cudownych obietnic i bez sprzedawania suplementów.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-full bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-900 transition hover:bg-white"
          >
            Przeglądaj artykuły
          </Link>
          <Link
            href="/o-nas"
            className="rounded-full border border-emerald-200/40 px-5 py-2.5 text-sm font-medium text-emerald-50 transition hover:bg-emerald-800"
          >
            Poznaj nas
          </Link>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-emerald-900/15 px-3 py-1 text-sm text-emerald-900/75"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      {featured ? (
        <section>
          <h2 className="font-serif text-2xl text-emerald-950">Polecany artykuł</h2>
          <div className="relative mt-5 grid gap-8 rounded-3xl border border-emerald-900/10 bg-white p-8 sm:grid-cols-[auto_1fr]">
            <div className="text-6xl" aria-hidden>
              {featured.emoji}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-700">
                {featured.category}
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-snug text-emerald-950">
                <Link href={`/blog/${featured.slug}`} className="hover:underline">
                  {featured.title}
                </Link>
              </h3>
              <p className="mt-3 text-emerald-900/75">{featured.excerpt}</p>
              <Link
                href={`/blog/${featured.slug}`}
                className="mt-5 inline-block text-sm font-medium text-emerald-700 hover:underline"
              >
                Czytaj artykuł →
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-emerald-950">Najnowsze wpisy</h2>
          <Link href="/blog" className="text-sm text-emerald-700 hover:underline">
            Zobacz wszystkie
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {rest.slice(0, 4).map((post) => (
            <div key={post.slug} className="relative">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

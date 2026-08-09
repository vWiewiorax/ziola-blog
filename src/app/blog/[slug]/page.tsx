import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllPosts, getPost, getPostSlugs } from "@/lib/posts";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) return {};
  const post = await getPost(slug);
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) notFound();

  const post = await getPost(slug);
  const related = getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/blog" className="text-sm text-emerald-700 hover:underline">
        ← Wróć do artykułów
      </Link>
      <p className="mt-8 text-xs uppercase tracking-widest text-emerald-700">{post.category}</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-emerald-950">
        <span aria-hidden className="mr-2">
          {post.emoji}
        </span>
        {post.title}
      </h1>
      <p className="mt-4 text-sm text-emerald-900/60">
        {formatDate(post.date)} · {post.readingTime} min czytania
      </p>

      <div
        className="prose prose-emerald mt-10 max-w-none prose-headings:font-serif prose-headings:text-emerald-950 prose-a:text-emerald-700 prose-blockquote:border-emerald-400 prose-blockquote:bg-emerald-50/60 prose-blockquote:py-1 prose-blockquote:not-italic prose-th:text-emerald-950"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <aside className="mt-12 rounded-2xl border border-amber-300/60 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
        <strong>Pamiętaj:</strong> artykuł ma charakter informacyjny. Zioła bywają aktywne
        farmakologicznie i mogą wchodzić w interakcje z lekami — w razie wątpliwości skonsultuj się
        z lekarzem lub farmaceutą.
      </aside>

      <section className="mt-14">
        <h2 className="font-serif text-2xl text-emerald-950">Przeczytaj także</h2>
        <ul className="mt-4 space-y-3">
          {related.map((item) => (
            <li key={item.slug}>
              <Link href={`/blog/${item.slug}`} className="text-emerald-800 hover:underline">
                {item.emoji} {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

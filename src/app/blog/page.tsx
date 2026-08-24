import type { Metadata } from "next";
import PageBanner from "@/components/page-banner";
import PostListItem from "@/components/post-list-item";
import Sidebar from "@/components/sidebar";
import { pluralizePosts } from "@/lib/post-utils";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 300;

type SearchParams = Promise<{ q?: string; kategoria?: string }>;

// Wyniki wyszukiwania i filtry kategorii to duplikaty listy, nie trafiają do indeksu.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q, kategoria } = await searchParams;
  if (q) {
    return { title: `Wyniki wyszukiwania: ${q}`, robots: { index: false, follow: true } };
  }
  if (kategoria) {
    return {
      title: kategoria,
      description: `Artykuły z kategorii ${kategoria}, zioła i zdrowie naturalne.`,
      alternates: { canonical: `/blog?kategoria=${encodeURIComponent(kategoria)}` },
    };
  }
  return {
    title: "Artykuły",
    description: "Wszystkie artykuły o ziołach, naparach i naturalnych sposobach na zdrowie.",
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, kategoria } = await searchParams;
  const all = await getAllPosts();
  const needle = q?.trim().toLowerCase() ?? "";

  const posts = all.filter((post) => {
    const matchesCategory = kategoria ? post.category === kategoria : true;
    const matchesQuery = needle
      ? `${post.title} ${post.excerpt} ${post.content}`.toLowerCase().includes(needle)
      : true;
    return matchesCategory && matchesQuery;
  });

  const title = kategoria ?? (q ? `Wyniki wyszukiwania: ${q}` : "Artykuły");

  return (
    <>
      <PageBanner title={title} breadcrumb={[{ label: title }]} />
      <div className="mx-auto max-w-6xl gap-10 px-4 py-10 lg:grid lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-[16px] text-neutral-600">
            Znaleziono {posts.length} {pluralizePosts(posts.length)}.
          </p>
          <div className="mt-6 space-y-7">
            {posts.map((post) => (
              <PostListItem key={post.slug} post={post} />
            ))}
          </div>
          {posts.length === 0 ? (
            <p className="mt-6 text-neutral-600">
              Nic nie znaleźliśmy. Spróbuj innego słowa kluczowego.
            </p>
          ) : null}
        </div>
        <div className="mt-12 lg:mt-0">
          <Sidebar />
        </div>
      </div>
    </>
  );
}

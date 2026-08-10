import type { Metadata } from "next";
import PageBanner from "@/components/page-banner";
import PostListItem from "@/components/post-list-item";
import Sidebar from "@/components/sidebar";
import { pluralizePosts } from "@/lib/post-utils";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Artykuły",
  description: "Wszystkie artykuły o ziołach, naparach i naturalnych sposobach na zdrowie.",
};

type SearchParams = Promise<{ q?: string; kategoria?: string }>;

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
          <p className="text-sm text-neutral-600">
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

import Image from "next/image";
import Link from "next/link";
import PostListItem from "@/components/post-list-item";
import Sidebar from "@/components/sidebar";
import { formatDate } from "@/lib/post-utils";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-6xl gap-10 px-4 py-10 lg:grid lg:grid-cols-[1fr_320px]">
      <div>
        {featured ? (
          <section className="border-b border-neutral-200 pb-8">
            <Link href={`/blog/${featured.slug}`}>
              <Image
                src={featured.image}
                alt={featured.title}
                width={860}
                height={420}
                priority
                className="h-[320px] w-full rounded object-cover"
              />
            </Link>
            <p className="mt-4 text-sm uppercase tracking-widest text-brand">{featured.category}</p>
            <h2 className="mt-2 text-[32px] leading-tight">
              <Link href={`/blog/${featured.slug}`} className="hover:text-brand">
                {featured.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-black">{formatDate(featured.date)}</p>
            <p className="mt-3 text-[17px] leading-relaxed text-neutral-600">{featured.excerpt}</p>
            <Link
              href={`/blog/${featured.slug}`}
              className="mt-3 inline-block text-[16px] text-brand hover:underline"
            >
              Czytaj dalej
            </Link>
          </section>
        ) : (
          <p className="text-neutral-600">Brak opublikowanych artykułów.</p>
        )}

        <section className="mt-10">
          <h2 className="text-[26px]">Najnowsze artykuły</h2>
          <div className="mt-6 space-y-7">
            {rest.map((post) => (
              <PostListItem key={post.slug} post={post} />
            ))}
          </div>
          <Link
            href="/blog"
            className="mt-8 inline-block bg-brand px-6 py-3 text-[16px] text-white hover:bg-brand-dark"
          >
            Zobacz wszystkie artykuły
          </Link>
        </section>
      </div>

      <div className="mt-12 lg:mt-0">
        <Sidebar />
      </div>
    </div>
  );
}

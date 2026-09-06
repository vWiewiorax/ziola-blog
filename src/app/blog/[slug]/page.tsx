import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/json-ld";
import PageBanner from "@/components/page-banner";
import Sidebar from "@/components/sidebar";
import { formatDate } from "@/lib/post-utils";
import { getAllPosts, getPost } from "@/lib/posts";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: "pl_PL",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      section: post.category,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = (await getAllPosts()).filter((item) => item.slug !== post.slug).slice(0, 3);
  const base = getSiteUrl();
  const postUrl = `${base}/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: post.title,
              description: post.excerpt,
              image: post.image.startsWith("http") ? post.image : `${base}${post.image}`,
              datePublished: post.date,
              dateModified: post.date,
              articleSection: post.category,
              inLanguage: "pl-PL",
              mainEntityOfPage: postUrl,
              author: { "@type": "Organization", name: SITE_NAME, url: base },
              publisher: { "@type": "Organization", name: SITE_NAME, url: base },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Strona główna", item: base },
                { "@type": "ListItem", position: 2, name: "Artykuły", item: `${base}/blog` },
                { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
              ],
            },
          ],
        }}
      />
      <PageBanner
        title={post.category}
        breadcrumb={[{ label: "Artykuły", href: "/blog" }, { label: post.title }]}
      />
      <div className="mx-auto max-w-6xl gap-10 px-4 py-10 lg:grid lg:grid-cols-[1fr_320px]">
        <article>
          <h1 className="text-[38px] leading-tight">{post.title}</h1>
          <p className="mt-2 text-sm text-black">
            {formatDate(post.date)} · {post.readingTime} min czytania
          </p>
          <Image
            src={post.image}
            alt={post.title}
            width={860}
            height={420}
            priority
            className="mt-6 h-[340px] w-full rounded object-cover"
          />

          <div
            className="prose prose-lg mt-8 max-w-none prose-headings:font-[family-name:var(--font-montserrat)] prose-headings:text-black prose-p:text-ink prose-a:text-brand prose-li:text-ink prose-strong:text-black prose-blockquote:border-brand prose-blockquote:bg-neutral-50 prose-blockquote:py-1 prose-blockquote:not-italic prose-th:text-black"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <aside className="mt-10 border-l-4 border-brand bg-neutral-50 p-5 text-[15px] leading-relaxed text-neutral-700">
            <strong className="text-black">Pamiętaj:</strong> artykuł ma charakter informacyjny.
            Zioła bywają aktywne farmakologicznie i mogą wchodzić w interakcje z lekami, w razie
            wątpliwości skonsultuj się z lekarzem lub farmaceutą.
          </aside>

          <section className="mt-12">
            <h2 className="text-[24px]">Przeczytaj także</h2>
            <ul className="mt-4 space-y-2 text-[16px]">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/blog/${item.slug}`} className="text-brand hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <div className="mt-12 lg:mt-0">
          <Sidebar />
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3 text-xs text-emerald-900/60">
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-800">
          {post.category}
        </span>
        <span>{formatDate(post.date)}</span>
        <span>· {post.readingTime} min czytania</span>
      </div>
      <h2 className="mt-4 font-serif text-xl leading-snug text-emerald-950">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          <span aria-hidden className="mr-1.5">
            {post.emoji}
          </span>
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-emerald-900/75">{post.excerpt}</p>
      <span className="mt-5 text-sm font-medium text-emerald-700 group-hover:underline">
        Czytaj dalej →
      </span>
    </article>
  );
}

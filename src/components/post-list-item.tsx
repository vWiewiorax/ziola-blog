import Image from "next/image";
import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/post-utils";

export default function PostListItem({ post }: { post: PostMeta }) {
  return (
    <article className="flex flex-col gap-5 border-b border-neutral-200 pb-7 sm:flex-row">
      <Link href={`/blog/${post.slug}`} className="shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          width={200}
          height={140}
          className="h-[140px] w-full rounded object-cover sm:w-[200px]"
        />
      </Link>
      <div>
        <h2 className="text-[21px] leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand">
            {post.title}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-black">{formatDate(post.date)}</p>
        <p className="mt-3 text-[16px] leading-[1.6] text-neutral-500">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-3 inline-block text-[16px] text-brand hover:underline"
        >
          Czytaj dalej
        </Link>
      </div>
    </article>
  );
}

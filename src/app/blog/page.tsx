import type { Metadata } from "next";
import PostCard from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Artykuły",
  description: "Wszystkie artykuły o ziołach, naparach i naturalnych sposobach na zdrowie.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald-950">Wszystkie artykuły</h1>
      <p className="mt-3 max-w-2xl text-emerald-900/75">
        {posts.length} poradników o ziołach — od klasycznych naparów po adaptogeny.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <div key={post.slug} className="relative">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}

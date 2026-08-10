import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const posts = await getAllPosts();

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/o-nas`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/kontakt`, changeFrequency: "yearly", priority: 0.4 },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: number;
  emoji: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

function readPostFile(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return matter(fileContents);
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? "Zioła"),
    emoji: String(data.emoji ?? "🌿"),
    readingTime: Math.max(1, Math.round(words / 200)),
  };
}

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const { data, content } = readPostFile(slug);
      return toMeta(slug, data, content);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post> {
  const { data, content } = readPostFile(slug);
  const processed = await remark().use(gfm).use(html).process(content);
  return { ...toMeta(slug, data, content), contentHtml: processed.toString() };
}

export function getCategories(): string[] {
  return Array.from(new Set(getAllPosts().map((post) => post.category))).sort();
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

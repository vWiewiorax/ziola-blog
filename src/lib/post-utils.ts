export const POSTS_COLLECTION = "posts";

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: number;
  image: string;
};

export type Post = PostMeta & {
  content: string;
  contentHtml: string;
};

export function readingTimeOf(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function toPost(slug: string, data: Record<string, unknown>, content: string): Post {
  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? "Zioła"),
    image: String(data.image ?? `/posts/${slug}.jpg`),
    readingTime: readingTimeOf(content),
    content,
    contentHtml: "",
  };
}

export function pluralizePosts(count: number): string {
  const rest10 = count % 10;
  const rest100 = count % 100;
  if (count === 1) return "artykuł";
  if (rest10 >= 2 && rest10 <= 4 && (rest100 < 12 || rest100 > 14)) return "artykuły";
  return "artykułów";
}

export function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

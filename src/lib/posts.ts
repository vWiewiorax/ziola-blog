import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import { POSTS_COLLECTION, toPost, type Post } from "./post-utils";

const postsDirectory = path.join(process.cwd(), "content", "posts");

function getLocalPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const slug = name.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(postsDirectory, name), "utf8"));
      return toPost(slug, data, content);
    });
}

async function getFirestorePosts(): Promise<Post[]> {
  const snapshot = await getDocs(
    query(
      collection(getDb(), POSTS_COLLECTION),
      where("published", "==", true),
      orderBy("date", "desc"),
    ),
  );
  return snapshot.docs.map((document) => {
    const data = document.data();
    return toPost(String(data.slug ?? document.id), data, String(data.content ?? ""));
  });
}

/**
 * Artykuły pochodzą z Firestore. Gdy Firebase nie jest skonfigurowany
 * (np. lokalny podgląd bez .env.local), używane są pliki Markdown z content/posts.
 */
export async function getAllPosts(): Promise<Post[]> {
  const posts = isFirebaseConfigured() ? await getFirestorePostsSafely() : getLocalPosts();
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

async function getFirestorePostsSafely(): Promise<Post[]> {
  try {
    const posts = await getFirestorePosts();
    return posts.length ? posts : getLocalPosts();
  } catch (error) {
    console.error("Nie udało się pobrać artykułów z Firestore:", error);
    return getLocalPosts();
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  const post = (await getAllPosts()).find((item) => item.slug === slug);
  if (!post) return null;
  // sanitize: treść przechodzi przez filtr, więc nawet wpis z panelu nie wstrzyknie skryptu
  const processed = await remark().use(gfm).use(html, { sanitize: true }).process(post.content);
  return { ...post, contentHtml: processed.toString() };
}

export async function getCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.map((post) => post.category))).sort();
}

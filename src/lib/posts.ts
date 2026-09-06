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
 * Artykuły to suma plików Markdown z content/posts i wpisów z Firestore (panel admina).
 * Przy tym samym slugu wpis z Firestore ma pierwszeństwo przed plikiem.
 */
export async function getAllPosts(): Promise<Post[]> {
  const bySlug = new Map(getLocalPosts().map((post) => [post.slug, post]));
  if (isFirebaseConfigured()) {
    for (const post of await getFirestorePostsSafely()) bySlug.set(post.slug, post);
  }
  return Array.from(bySlug.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
}

const FIRESTORE_TIMEOUT_MS = 3000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Firestore nie odpowiedział w ${ms} ms`)), ms);
    promise.then(resolve, reject).finally(() => clearTimeout(timer));
  });
}

async function getFirestorePostsSafely(): Promise<Post[]> {
  try {
    return await withTimeout(getFirestorePosts(), FIRESTORE_TIMEOUT_MS);
  } catch (error) {
    console.error("Nie udało się pobrać artykułów z Firestore:", error);
    return [];
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

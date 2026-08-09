/**
 * Wgrywa artykuły z content/posts/*.md do Firestore.
 * Uruchomienie: node --env-file=.env.local scripts/seed-posts.mjs
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Ustaw SEED_ADMIN_EMAIL i SEED_ADMIN_PASSWORD w .env.local");
  process.exit(1);
}

const credential = await signInWithEmailAndPassword(getAuth(app), email, password);
console.log("Zalogowano jako", credential.user.uid);

const db = getFirestore(app);
const directory = path.join(process.cwd(), "content", "posts");

for (const file of fs.readdirSync(directory).filter((name) => name.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(directory, file), "utf8"));

  await setDoc(doc(db, "posts", slug), {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    category: data.category ?? "Poradniki",
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    image: data.image ?? `/posts/${slug}.jpg`,
    content,
    published: true,
  });
  console.log("Zapisano", slug);
}

console.log("Gotowe.");
process.exit(0);

"use client";

import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AdminGuard from "@/components/admin/admin-guard";
import { useAdminSession } from "@/components/admin/use-admin-session";
import { getDb } from "@/lib/firebase";
import { formatDate, POSTS_COLLECTION } from "@/lib/post-utils";

type AdminPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  published: boolean;
};

function PostsTable() {
  const { logout } = useAdminSession();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(
        query(collection(getDb(), POSTS_COLLECTION), orderBy("date", "desc")),
      );
      setPosts(
        snapshot.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            title: String(data.title ?? item.id),
            date: String(data.date ?? ""),
            category: String(data.category ?? ""),
            published: Boolean(data.published),
          };
        }),
      );
      setError("");
    } catch {
      setError("Nie udało się pobrać listy artykułów.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!window.confirm("Usunąć ten artykuł na stałe?")) return;
    await deleteDoc(doc(getDb(), POSTS_COLLECTION, id));
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl">Twoje artykuły</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/admin/edytor" className="bg-brand px-4 py-2 text-white hover:bg-brand-dark">
            + Nowy artykuł
          </Link>
          <button onClick={logout} className="text-brand hover:underline">
            Wyloguj
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="mt-6 text-sm text-neutral-600">Ładowanie...</p> : null}

      <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        {posts.map((post) => (
          <li key={post.id} className="flex flex-wrap items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-black">{post.title}</p>
              <p className="text-xs text-neutral-500">
                {formatDate(post.date)} · {post.category} ·{" "}
                {post.published ? "opublikowany" : "szkic"}
              </p>
            </div>
            <Link
              href={`/admin/edytor?id=${encodeURIComponent(post.id)}`}
              className="text-sm text-brand hover:underline"
            >
              Edytuj
            </Link>
            <button
              onClick={() => handleDelete(post.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>

      {!loading && posts.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-600">Brak artykułów — dodaj pierwszy.</p>
      ) : null}
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <AdminGuard>
      <PostsTable />
    </AdminGuard>
  );
}

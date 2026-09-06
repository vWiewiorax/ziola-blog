"use client";

import { collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/admin/admin-nav";
import { getDb } from "@/lib/firebase";

type AdminMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date | null;
};

function MessagesList() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(
        query(collection(getDb(), "messages"), orderBy("createdAt", "desc")),
      );
      setMessages(
        snapshot.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            name: String(data.name ?? ""),
            email: String(data.email ?? ""),
            message: String(data.message ?? ""),
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
          };
        }),
      );
      setError("");
    } catch {
      setError("Nie udało się pobrać wiadomości, sprawdź uprawnienia.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!window.confirm("Usunąć tę wiadomość na stałe?")) return;
    try {
      await deleteDoc(doc(getDb(), "messages", id));
      await load();
    } catch {
      setError("Nie udało się usunąć wiadomości, sprawdź uprawnienia.");
    }
  }

  return (
    <div>
      <AdminNav />
      <h1 className="text-2xl">Wiadomości</h1>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="mt-6 text-sm text-neutral-600">Ładowanie...</p> : null}

      {!loading && messages.length === 0 && !error ? (
        <p className="mt-6 text-sm text-neutral-600">Brak wiadomości.</p>
      ) : null}

      <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        {messages.map((message) => (
          <li key={message.id} className="py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-black">{message.name || "Bez imienia"}</p>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm text-brand hover:underline"
                >
                  {message.email || "Brak adresu e-mail"}
                </a>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <time dateTime={message.createdAt?.toISOString()}>
                  {message.createdAt?.toLocaleString("pl-PL") ?? "Brak daty"}
                </time>
                <button
                  onClick={() => void handleDelete(message.id)}
                  className="text-red-600 hover:underline"
                >
                  Usuń
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
              {message.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <AdminGuard>
      <MessagesList />
    </AdminGuard>
  );
}

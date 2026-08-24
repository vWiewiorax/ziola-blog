"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAdminSession } from "@/components/admin/use-admin-session";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, configured } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user && isAdmin) router.replace("/admin");
  }, [user, isAdmin, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      router.replace("/admin");
    } catch {
      setError("Nieprawidłowy e-mail lub hasło.");
    } finally {
      setBusy(false);
    }
  }

  if (!configured) {
    return (
      <p className="border-l-4 border-red-500 bg-red-50 p-4 text-sm">
        Firebase nie jest skonfigurowany, uzupełnij zmienne NEXT_PUBLIC_FIREBASE_* w .env.local.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl">Panel redakcyjny</h1>
      <p className="mt-2 text-sm text-neutral-600">Logowanie tylko dla właściciela bloga.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded border border-neutral-300 px-4 py-2.5 focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black">
            Hasło
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded border border-neutral-300 px-4 py-2.5 focus:border-brand focus:outline-none"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {user && !isAdmin ? (
          <p className="text-sm text-red-600">
            To konto nie ma uprawnień administratora (UID: {user.uid}).
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-brand px-6 py-3 text-sm text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>
    </div>
  );
}

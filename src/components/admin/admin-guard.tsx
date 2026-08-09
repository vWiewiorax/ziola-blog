"use client";

import Link from "next/link";
import { useAdminSession } from "./use-admin-session";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { loading, user, isAdmin, configured, logout } = useAdminSession();

  if (!configured) {
    return (
      <p className="border-l-4 border-red-500 bg-red-50 p-4 text-sm">
        Firebase nie jest skonfigurowany — uzupełnij zmienne NEXT_PUBLIC_FIREBASE_* w .env.local.
      </p>
    );
  }

  if (loading) return <p className="text-sm text-neutral-600">Ładowanie...</p>;

  if (!user) {
    return (
      <p className="text-sm">
        Musisz się zalogować.{" "}
        <Link href="/admin/login" className="text-brand hover:underline">
          Przejdź do logowania »
        </Link>
      </p>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4 text-sm">
        <p className="border-l-4 border-red-500 bg-red-50 p-4">
          To konto nie ma uprawnień administratora. Twój UID: <code>{user.uid}</code>
        </p>
        <button onClick={logout} className="text-brand hover:underline">
          Wyloguj się
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

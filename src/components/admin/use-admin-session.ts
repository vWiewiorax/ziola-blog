"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseAuth, isAdminUid, isFirebaseConfigured } from "@/lib/firebase";

export type AdminSession = {
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  configured: boolean;
  logout: () => Promise<void>;
};

export function useAdminSession(): AdminSession {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, [configured]);

  return {
    loading,
    user,
    configured,
    isAdmin: isAdminUid(user?.uid),
    logout: async () => {
      await signOut(getFirebaseAuth());
    },
  };
}

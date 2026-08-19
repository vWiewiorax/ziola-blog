import { getFirebaseAuth } from "@/lib/firebase";

/** Prosi serwer o odświeżenie stron publicznych; błąd nie może przerwać zapisu artykułu. */
export async function revalidatePublicPages(slug?: string): Promise<void> {
  try {
    const token = await getFirebaseAuth().currentUser?.getIdToken();
    if (!token) return;
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ slug }),
    });
  } catch (error) {
    console.error("Nie udało się odświeżyć stron publicznych:", error);
  }
}

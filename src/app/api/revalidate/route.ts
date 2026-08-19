import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Odświeża cache stron publicznych po zapisie w panelu — bez tego nowy artykuł
 * pojawiłby się dopiero po wygaśnięciu `revalidate`.
 *
 * Token właściciela jest weryfikowany w Firebase (accounts:lookup), więc nie da się
 * wywołać tego endpointu z zewnątrz bez zalogowania.
 */
export async function POST(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;
  if (!apiKey || !adminUid) {
    return NextResponse.json({ error: "Brak konfiguracji Firebase" }, { status: 500 });
  }

  const idToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!idToken) return NextResponse.json({ error: "Brak tokenu" }, { status: 401 });

  // Przy włączonych emulatorach tokeny podpisuje emulator Auth, nie produkcyjne API.
  const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST;
  const identityToolkit = emulatorHost
    ? `http://${emulatorHost}:9099/identitytoolkit.googleapis.com`
    : "https://identitytoolkit.googleapis.com";

  const lookup = await fetch(`${identityToolkit}/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!lookup.ok) return NextResponse.json({ error: "Token odrzucony" }, { status: 401 });

  const data: { users?: { localId?: string }[] } = await lookup.json();
  if (data.users?.[0]?.localId !== adminUid) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const { slug }: { slug?: string } = await request.json().catch(() => ({}));
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);

  return NextResponse.json({ revalidated: true });
}

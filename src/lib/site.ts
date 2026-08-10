/**
 * Adres kanoniczny strony. Na Vercelu w podglądach (preview) nie ma własnej domeny,
 * więc używany jest VERCEL_URL; produkcja korzysta z NEXT_PUBLIC_SITE_URL.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}

/**
 * Dane strukturalne schema.org. JSON jest serializowany z ucieczką "<",
 * więc treść z bazy nie zamknie tagu <script>.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

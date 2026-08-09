# Portal Zielarski 🌿

Blog o ziołach i zdrowiu naturalnym: Next.js 15 (App Router), TypeScript, Tailwind CSS 4 i Firebase
(Firestore + Authentication). Artykuły dodajesz z panelu `/admin` — dostęp ma wyłącznie konto
właściciela.

## Uruchomienie lokalne

```bash
npm install
cp .env.example .env.local   # uzupełnij danymi z konsoli Firebase
npm run dev
```

Bez `.env.local` strona działa w trybie podglądu i czyta artykuły z `content/posts/*.md`.

## Konfiguracja Firebase

1. Utwórz projekt w [konsoli Firebase](https://console.firebase.google.com/).
2. **Build → Firestore Database** → utwórz bazę (tryb produkcyjny).
3. **Build → Authentication** → włącz metodę *E-mail/hasło* i dodaj swoje konto (Users → Add user).
4. Skopiuj UID tego konta do `NEXT_PUBLIC_ADMIN_UID` oraz do `firestore.rules`
   (`WSTAW_TUTAJ_SWOJE_UID`).
5. **Ustawienia projektu → Twoje aplikacje → Web** → skopiuj config do `.env.local`.
6. Wgraj reguły i indeksy:

```bash
npx firebase-tools login
npx firebase-tools use <ID-PROJEKTU>
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

7. (Opcjonalnie) przenieś startowe artykuły z Markdown do Firestore:

```bash
node --env-file=.env.local scripts/seed-posts.mjs
```

## Bezpieczeństwo

- Zapis do kolekcji `posts` i odczyt `messages` ma **tylko** UID właściciela (`firestore.rules`);
  publicznie widoczne są jedynie artykuły z `published == true`.
- Formularz kontaktowy pozwala wyłącznie tworzyć wiadomości, z limitami długości pól.
- Treść artykułów renderowana jest przez `remark-html` z włączonym `sanitize`, więc znaczniki HTML
  i skrypty z treści nie trafiają na stronę.
- Nagłówki bezpieczeństwa (CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, Permissions-Policy)
  ustawione w `next.config.ts`; `poweredByHeader` wyłączony.
- Panel `/admin` jest oznaczony `noindex` i chroniony logowaniem Firebase Auth.
- Klucze `NEXT_PUBLIC_FIREBASE_*` są publiczne z założenia — realną ochronę dają reguły Firestore.

## Publikacja (Firebase App Hosting)

```bash
npx firebase-tools apphosting:backends:create --project <ID-PROJEKTU>
```

Zmienne środowiskowe uzupełnij w `apphosting.yaml` lub w konsoli App Hosting.

## Struktura

- `src/app` — strony: start, `/blog`, `/blog/[slug]`, `/o-nas`, `/kontakt`, `/admin`
- `src/lib/posts.ts` — pobieranie artykułów (Firestore, fallback: Markdown)
- `src/lib/firebase.ts` — inicjalizacja Firebase i sprawdzanie UID administratora
- `content/posts/*.md` — startowe artykuły
- `public/posts/*.jpg` — zdjęcia do artykułów
- `firestore.rules` — reguły bezpieczeństwa

## Skrypty

- `npm run dev` — serwer deweloperski
- `npm run build` / `npm run start` — build i serwer produkcyjny
- `npm run lint` — ESLint

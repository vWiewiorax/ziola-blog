# Publikacja na Vercelu + własna domena

Blog to zwykła aplikacja Next.js, więc na Vercelu nie trzeba nic budować ręcznie — Firebase zostaje
tylko jako baza artykułów i logowanie do `/admin`.

## 1. Import repozytorium

1. Wejdź na [vercel.com/new](https://vercel.com/new) i zaloguj się kontem GitHub.
2. Wybierz repozytorium `vWiewiorax/ziola-blog` → **Import**.
3. Framework Preset: **Next.js** (wykrywa się sam), Build Command i Output Directory zostaw domyślne.
4. Zanim klikniesz **Deploy**, rozwiń **Environment Variables** i dodaj zmienne z punktu 2.

## 2. Zmienne środowiskowe

Ustaw dla wszystkich środowisk (Production, Preview, Development):

| Zmienna | Wartość |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyC88b5Mn6PDPhg5fm_PLFVWu1enq9y2n9Y` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `ziolablog.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `ziolablog` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `ziolablog.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `545631318515` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:545631318515:web:26d87bc4e8a0044ce52286` |
| `NEXT_PUBLIC_ADMIN_UID` | `W1VpatvhZKaG9ONkoTVNMF8F2DV2` |
| `NEXT_PUBLIC_SITE_URL` | `https://twoja-domena.pl` (tylko Production) |

Te wartości są publiczne z założenia — dostęp do danych ogranicza `firestore.rules`. Nie dodawaj tu
`SEED_ADMIN_*` ani żadnych haseł.

> Zmienne `NEXT_PUBLIC_*` są wkompilowywane w build, więc po każdej zmianie zrób **Redeploy**.

## 3. Podpięcie domeny

1. Projekt na Vercelu → **Settings → Domains → Add** → wpisz np. `twoja-domena.pl`.
2. Vercel pokaże rekordy DNS. W panelu rejestratora domeny ustaw:
   - `A` dla `@` → `76.76.21.21`
   - `CNAME` dla `www` → `cname.vercel-dns.com`
   (jeśli Vercel poda inne wartości, użyj tych z panelu — one są wiążące)
3. Poczekaj na propagację DNS (zwykle kilkanaście minut). Certyfikat HTTPS Vercel wystawi sam.
4. Ustaw preferowaną wersję (`twoja-domena.pl` albo `www.twoja-domena.pl`) jako **Primary**, druga
   będzie się przekierowywać.
5. Zaktualizuj `NEXT_PUBLIC_SITE_URL` na finalny adres i zrób **Redeploy**.

## 4. Firebase po podpięciu domeny

W konsoli Firebase: **Authentication → Settings → Authorized domains → Add domain** i dodaj
`twoja-domena.pl` oraz `<projekt>.vercel.app`. Bez tego logowanie do `/admin` z nowej domeny zostanie
odrzucone.

Reguły Firestore i indeksy są już wgrane — nic więcej po stronie Firebase nie trzeba robić.

## 5. Sprawdzenie po wdrożeniu

- `https://twoja-domena.pl/` — lista artykułów z Firestore
- `https://twoja-domena.pl/sitemap.xml` — adresy wszystkich artykułów
- `https://twoja-domena.pl/robots.txt` — `/admin` wykluczony z indeksowania
- `https://twoja-domena.pl/admin/login` — logowanie e-mailem właściciela, potem dodanie testowego wpisu

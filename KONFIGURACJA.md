# Jak uruchomić panel — konfiguracja Firebase krok po kroku

Panel `/admin` i zapisywanie artykułów działają dopiero wtedy, gdy blog ma podpięty Twój projekt
Firebase. Poniżej cała droga od zera. Zajmuje ok. 15 minut.

---

## 1. Utwórz projekt Firebase

1. Wejdź na https://console.firebase.google.com/ i zaloguj się kontem Google.
2. Kliknij **Utwórz projekt** (Create a project).
3. Nazwa: np. `portal-zielarski`. Google Analytics możesz wyłączyć.
4. Poczekaj, aż projekt się utworzy, i wejdź do niego.

## 2. Włącz logowanie e-mailem i utwórz swoje konto

1. Menu po lewej: **Build → Authentication → Get started**.
2. Zakładka **Sign-in method** → wybierz **Email/Password** → przestaw suwak **Enable** → **Save**.
3. Zakładka **Users** → **Add user** → wpisz swój e-mail i hasło (to będzie login do panelu) → **Add
   user**.
4. Na liście użytkowników pojawi się kolumna **User UID** — skopiuj tę wartość. To Twoje UID
   właściciela, np. `Xk3p9QwErTyU1a2Bc3De4Fg5Hi6J`. Będzie potrzebne dwa razy.

## 3. Utwórz bazę Firestore

1. Menu: **Build → Firestore Database → Create database**.
2. Wybierz lokalizację `eur3 (europe-west)` (blisko Polski).
3. Wybierz **Start in production mode** — reguły dostępu i tak wgramy własne w kroku 6.

## 4. Skopiuj dane konfiguracyjne aplikacji

1. Kliknij ikonę koła zębatego przy nazwie projektu → **Ustawienia projektu** (Project settings).
2. Zjedź do sekcji **Twoje aplikacje** (Your apps) → kliknij ikonę **`</>`** (Web).
3. Nazwa aplikacji: np. `blog` → **Zarejestruj aplikację** (bez Firebase Hosting).
4. Zobaczysz blok `const firebaseConfig = { ... }`. Zostaw tę stronę otwartą — przepiszesz z niej
   wartości w następnym kroku.

## 5. Wpisz dane do projektu

W katalogu projektu skopiuj `.env.example` do `.env.local`:

```bash
cp .env.example .env.local
```

i uzupełnij wartościami z kroku 4 oraz UID z kroku 2:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...            # apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=portal-zielarski.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=portal-zielarski
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=portal-zielarski.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
NEXT_PUBLIC_ADMIN_UID=Xk3p9QwErTyU1a2Bc3De4Fg5Hi6J   # UID z Authentication → Users
```

Plik `.env.local` jest w `.gitignore` — nie trafi do repozytorium i tak ma zostać.

Następnie otwórz `firestore.rules` i w linii 9 podmień placeholder na to samo UID:

```
&& request.auth.uid == 'Xk3p9QwErTyU1a2Bc3De4Fg5Hi6J';
```

> To najważniejszy krok dla bezpieczeństwa: zmienna `NEXT_PUBLIC_ADMIN_UID` tylko ukrywa panel
> w przeglądarce, a dopiero reguła w `firestore.rules` fizycznie blokuje zapis komukolwiek innemu.

## 6. Wgraj reguły bezpieczeństwa do Firebase

```bash
npx firebase-tools login
npx firebase-tools use portal-zielarski        # ID Twojego projektu
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

Bez tego kroku baza zostaje z domyślnymi regułami i panel nie zapisze artykułu.

## 7. Przenieś startowe artykuły do bazy (opcjonalnie)

Siedem gotowych artykułów leży w `content/posts/*.md`. Żeby wylądowały w Firestore, dopisz na końcu
`.env.local` swoje dane logowania i uruchom skrypt:

```env
SEED_ADMIN_EMAIL=twoj@email.pl
SEED_ADMIN_PASSWORD=twoje-haslo
```

```bash
node --env-file=.env.local scripts/seed-posts.mjs
```

Po wgraniu możesz te dwie linijki z `.env.local` usunąć.

## 8. Sprawdź, że działa

```bash
npm install
npm run dev
```

- http://localhost:3000 — blog,
- http://localhost:3000/admin/login — zaloguj się e-mailem i hasłem z kroku 2,
- **+ Nowy artykuł** → wypełnij, zaznacz *Opublikowany* → **Zapisz artykuł**,
- wróć na `/blog` — nowy wpis powinien być na liście.

Jeśli zapis kończy się błędem „Zapis nie powiódł się", to prawie zawsze znaczy, że UID w
`firestore.rules` nie zgadza się z zalogowanym kontem albo reguły nie zostały wgrane (krok 6).

---

## Publikacja w internecie (Firebase App Hosting)

```bash
npx firebase-tools apphosting:backends:create --project portal-zielarski
```

Podczas konfiguracji podłączysz repozytorium GitHub `vWiewiorax/ziola-blog` i gałąź `main` — od tej
pory każdy push automatycznie zbuduje i wypuści stronę. Zmienne `NEXT_PUBLIC_*` z kroku 5 wpisz
w `apphosting.yaml` (są tam już przygotowane puste pola) albo w konsoli App Hosting.

Wartości `NEXT_PUBLIC_FIREBASE_*` są publiczne z założenia — Google tak projektuje klienta webowego.
Bezpieczeństwo daje wyłącznie `firestore.rules`, dlatego krok 5 i 6 są obowiązkowe.

---

## Gdyby coś nie zadziałało

| Objaw | Przyczyna |
| --- | --- |
| „Firebase nie jest skonfigurowany" | brak `.env.local` lub trzeba zrestartować `npm run dev` |
| „Nieprawidłowy e-mail lub hasło" | konto nie istnieje w Authentication → Users |
| „To konto nie ma uprawnień" | `NEXT_PUBLIC_ADMIN_UID` ≠ UID zalogowanego konta |
| „Zapis nie powiódł się" | UID w `firestore.rules` się nie zgadza lub reguły nie wgrane |
| artykuły się nie pokazują | posty mają `published: false` albo brak indeksu (krok 6) |

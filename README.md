# Zielnik Zdrowia 🌿

Blog o ziołach i zdrowiu naturalnym zbudowany w Next.js 15 (App Router), TypeScript i Tailwind CSS 4.

## Uruchomienie

```bash
npm install
npm run dev
```

Strona działa pod http://localhost:3000

## Struktura

- `content/posts/*.md` — artykuły w Markdown z metadanymi (front matter: `title`, `excerpt`, `date`, `category`, `emoji`)
- `src/lib/posts.ts` — wczytywanie i renderowanie artykułów
- `src/app` — strony: start, `/blog`, `/blog/[slug]`, `/o-nas`, `/kontakt`

## Dodanie nowego artykułu

Utwórz plik `content/posts/nazwa-artykulu.md`:

```markdown
---
title: "Tytuł artykułu"
excerpt: "Krótki opis widoczny na liście."
date: "2026-08-09"
category: "Poradniki"
emoji: "🌿"
---

Treść artykułu w Markdown.
```

Artykuł pojawi się automatycznie na liście i pod adresem `/blog/nazwa-artykulu`.

## Skrypty

- `npm run dev` — serwer deweloperski
- `npm run build` — build produkcyjny
- `npm run lint` — ESLint

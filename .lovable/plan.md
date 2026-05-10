# Multilingual Onboarding & i18n System

Note: project is Vite/React Router (not Next.js) — implementation will follow the actual stack.

## 1. Database (migration)

Add to `profiles` table:
- `preferred_language text` (nullable — `null` = not yet chosen, triggers onboarding)
- `country text` (nullable)
- `updated_at` already exists

Update `handle_new_user()` trigger to leave `preferred_language` null on signup so the language gate fires once.

## 2. i18n stack

- Install `i18next`, `react-i18next`, `i18next-browser-languagedetector`.
- `src/i18n/index.ts` — initialize with all 10 namespaces, fallback `en`, detect from `navigator.language`.
- `src/i18n/locales/{en,kn,ur,ta,ml,hi,te,ar,mr,bn}/common.json` — hand-written translation files.
- Strings grouped: `nav`, `auth`, `home`, `explore`, `recipe`, `filters`, `settings`, `language`, `common`.
- RTL handling: `ar` and `ur` set `<html dir="rtl">` via effect in `LanguageProvider`.

## 3. Language metadata

`src/i18n/languages.ts` — single source of truth:

```text
{ code, nativeName, englishName, flag (emoji), rtl, region[] }
en 🇬🇧, kn 🇮🇳, ur 🇵🇰, ta 🇮🇳, ml 🇮🇳, hi 🇮🇳, te 🇮🇳, ar 🇸🇦, mr 🇮🇳, bn 🇧🇩
```

Primary 5 (en, kn, ur, ta, ml) marked `featured: true` and rendered first.

## 4. Auth + onboarding flow

- Extend `AuthProvider` to expose `profile.preferred_language` and a `setLanguage(code)` method that updates the row and `i18n.changeLanguage`.
- New route `/select-language` (protected).
- Gate logic in `ProtectedRoute` (and post-login redirect in `Auth.tsx`):
  - If signed in and `preferred_language` is null → redirect to `/select-language`.
  - On `/select-language`, if already set → redirect to intended page.
- After save → redirect to `state.from` or `/`.

```text
signup/login ──► profile loaded
                       │
        preferred_language null? ──yes──► /select-language ──save──► /
                       │ no
                       └──► requested route
```

## 5. New pages & components

- `src/pages/SelectLanguage.tsx` — onboarding screen:
  - FlavorAI logo, "Welcome" + "Choose your language" (shown in 5 primary languages, rotating).
  - Search input filters by native + english name.
  - Auto-detected language pre-selected with "Suggested for you" badge (uses `navigator.language` and a small region map: IN-KA→kn, SA/AE→ar, PK→ur, etc.).
  - Grid of `LanguageCard`s (2 cols mobile, 3 desktop).
  - Sticky "Continue" button + "Skip (use English)" link.
- `src/components/language/LanguageCard.tsx` — rounded glass card, flag, native name, english name, animated selected glow ring.
- `src/components/language/LanguageSelector.tsx` — reusable selector list (used in settings).
- `src/pages/Settings.tsx` — new `/settings` route with sections; first section is **Language** using `LanguageSelector`. Linked from `ProfileMenu`.
- `src/hooks/useLanguage.ts` — wraps `useTranslation` + `useAuth`, returns `{ lang, setLang, t, isRTL, languages }`.

## 6. Translate existing UI

Replace hard-coded strings with `t('...')` in:
`Header.tsx`, `Auth.tsx`, `Index.tsx`, `Explore.tsx`, `RecipeDetail.tsx`, `AIGenerator.tsx`, `FilterBar.tsx`, `RecipeCard.tsx`, `IngredientList`, `InstructionSteps`, `NutritionCard`, `ProfileMenu.tsx`, `NotFound.tsx`.

Recipe data (titles, ingredients, instructions, nutrition) stays in English — only UI chrome is translated.

## 7. Design

- Glassmorphism cards: `bg-card/60 backdrop-blur-xl border border-border/50`.
- Selected state: gradient ring `ring-2 ring-primary` + soft `shadow-[0_0_30px_hsl(var(--primary)/0.35)]`.
- Framer-motion stagger entrance on cards.
- Fully responsive at 393px viewport (current preview), dark mode tested.
- All colors via existing semantic tokens — no hard-coded hex.

## 8. Out of scope

- Translating AI-generated recipe content (recipes stay English by your choice).
- Per-language SEO routes.
- Crowd translation tooling.

## Build order

1. Migration (add `preferred_language`, `country`).
2. Install i18n deps + scaffold provider + 10 locale files.
3. `SelectLanguage` page + `LanguageCard` + auto-detect.
4. Auth gate redirect logic.
5. `Settings` page + nav link in `ProfileMenu`.
6. Replace strings across existing components.
7. RTL polish + dark mode QA.

# FlavorAI — AI Cooking Companion upgrade

This brief is large, so the work is split into 5 phases. Each phase gets built, then tested in the browser before the next one starts. The current brand (FlavorAI, Warm Ember colours, Instrument Serif + Work Sans, dark mode) and all working features stay as they are.

## What the app has today
- A top navigation bar with a mobile slide-out menu. There's no sidebar yet.
- Translation is already set up, with 10 language dictionaries in one file. Language choice is saved to the profile and on the device.
- Most of the homepage (hero, feature grid, FAQ, footer, hero section) is hard-coded English. That's why picking a language seems to do nothing: the dropdown changes, but most of the text doesn't.
- Sign-in uses email/password, magic link and Google. A profiles table, a roles table with a server-side admin check, and favourites already exist.
- AI recipe generation, search and recommendation features exist. Recent security changes to them were never deployed.

## Phase 1 — Language and account (P0, first)
- Split translations into one file per language (en, hi, kn, ur, ar plus the existing extras), so adding a language means adding one file.
- Move every hard-coded line on every page (home, recipe, auth, footer, legal headings, menus, toasts) onto translation keys. A check script will flag missing keys.
- Add a language switcher in the header that's always visible. Switching changes the text right away, sets right-to-left layout for Arabic and Urdu (left-to-right for the rest), and is saved on the device and, when signed in, to the profile. The saved language comes back after logging in again.
- Fix right-to-left layout across the app: logical spacing, flipped direction icons, the drawer opening from the correct side.
- New `/account` page: profile (avatar upload, name, email), preferences (language, cuisines, diet), saved recipes, AI-created recipes, shopping list summary, security (change password), and a Danger Zone (delete account through a secure server function).
- Password reset: "Forgot password" plus a `/reset-password` page.
- Turn on Apple sign-in alongside Google.
- Rate-limit login, signup and password-reset attempts.

## Phase 2 — Navigation, AI Hub, Voice Assistant
- Replace the top nav with a sidebar in the same style: Home, Recipes, AI Assistant, Voice Assistant, Favorites, Shopping List, Account, Settings, plus Admin for admins only. On mobile it becomes a hamburger menu with a slide-over drawer that works in right-to-left layouts too.
- `/ai` hub with cards for What Can I Cook?, Rescue My Ingredients, Create With Flora, Ingredient Substitution, and Voice Assistant.
- `/voice`: tap-to-talk microphone (it asks permission only when you tap), a live "Listening" indicator, transcript, AI answer, Stop, Retry, Mute, and spoken replies. Voice features load only when this page opens.
- One secure AI server function handles all assistant tasks. It checks input, limits request size, rate-limits per user, checks what the AI sends back, and shows friendly error messages. Recipe suggestions link only to real recipes in the database.

## Phase 3 — Cooking features
- Cooking Mode (`/recipe/:id/cook`): one step at a time, progress bar, ingredients drawer, timers, and an "Ask Flora" voice button. Voice commands: next, previous, repeat, how much, set or stop a timer, what ingredients, substitute, exit.
- What Can I Cook? and Leftover Rescue: you enter ingredients, time, servings, cuisine, diet and difficulty, and get real recipe cards back.
- Ingredient substitution on recipe pages, with a note that swaps can change taste or texture.
- Create With Flora: the AI writes a recipe draft, clearly labelled "AI-generated". You can edit it, save it to your own list, regenerate it, or open it in Cooking Mode.
- Personalize Recipe: change servings, time, diet or available ingredients. Changed versions are labelled as AI-modified.
- Shopping list: add ingredients from any recipe, merge duplicates, tick items off, remove items, or clear the list. Saved per user.
- "Recommended For You", based only on data the app actually collects (favourites, views, chosen cuisines).
- Natural-language search ("easy vegetarian dinner under 30 minutes"): the AI turns the request into filters, then runs the existing search.

## Phase 4 — Admin and SEO
- `/admin` is guarded in the browser and on the server, and recipe changes are blocked in the database for non-admins: recipe list, editor, publish/unpublish, categories.
- Recipe pages get readable web addresses (`/recipes/:slug`, with old links still working) and proper page titles, descriptions and recipe info for search engines.

## Phase 5 — QA pass
- Browser testing on mobile, tablet and desktop in every language, including right-to-left: sign up, log in, log out, profile save, language persisting after refresh and after logging back in, favourites, shopping list, AI features, Cooking Mode, voice (as far as a test browser allows), and confirming normal users are blocked from admin pages and admin server calls.
- Security scan and database checks, accessibility checks (labels, focus, contrast, reduced motion), then a final PASS/FIXED/NEEDS INPUT checklist.

## Limits to know about
- Apple sign-in will be switched on, but it needs your Apple developer details before it works on the live site.
- Voice input needs speech recognition support in the browser (Chrome, Edge, Safari). Browsers without it get a typed-input fallback. Voice recordings are never saved.
- AI features use AI credits. Your workspace ran out of credits before, so AI testing in Phases 2–3 needs available credits.
- P2 tickets (achievements, daily recipe, cuisine explorer, share cards) are not in this plan. They can follow later.

## Technical details
- Translations: `src/i18n/locales/*.json`, using i18next with direction set on `<html>` and Tailwind logical properties (`ms-`/`me-`/`ps-`/`pe-`, `rtl:` variants).
- New tables (all with GRANTs, RLS and an `auth.uid()` owner check): `shopping_list_items`, `ai_generated_recipes`, `user_preferences`, `categories`, `recipe_categories`. Favourites already exist.
- Storage: an `avatars` bucket with per-user folders, image types only, max 2 MB.
- Server functions: `flora-ai` (tasks: suggest, rescue, substitute, create, personalize, parse_search, voice_chat), using `openai/gpt-6-astra` through the Lovable AI Gateway with streaming; `delete-account`; an `admin-recipes` function that checks `has_role`. All use the shared validation and rate-limit helpers.
- Voice: Web Speech API for speech-to-text and text-to-speech, loaded only on the voice and cooking pages.

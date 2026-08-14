# Hero Redesign Plan

## Goal
Redesign the FlavorAI homepage hero so it instantly communicates "AI Meal Coach for Personalized Recipes & Meal Plans" with premium, conversion-focused design.

## Locked Design Choices (from your picks)

- **Palette:** Warm Ember — deep charcoal/black background (`#0F0F0F`, `#1A1A1A`) with vibrant orange/amber accent (`#F97316`, `#FBBF24`) and warm off-white text (`#FAFAF9`).
- **Typography:** Editorial Serif — `Instrument Serif` for headlines, `Work Sans` for body/UI text, replacing the current all-Outfit treatment on the hero.
- **Layout:** Centered Command — headline, subhead, and CTAs stacked above the ingredient search input, keeping the page's conversion focus.

## What I will do

1. Generate three distinct hero design directions that all use the locked palette, type pair, and layout, but vary in:
   - composition density and hierarchy,
   - motion/animation register,
   - decorative treatment (glows, food imagery, AI chips, stats).
2. Present the three directions as clickable prototypes for you to choose from.
3. Implement the chosen direction into `src/components/LandingHero.tsx` and update `src/pages/Index.tsx` if needed.
4. Keep existing functionality intact: "Start Free" CTA links to `/auth`, "See Demo" scrolls to the ingredient search panel, the ingredient input remains immediately usable below the hero.
5. Ensure responsive behavior across mobile (360px) and desktop, maintain semantic HTML and accessible contrast, and preserve the current dark theme system.

## Technical details

- Add `Instrument Serif` and `Work Sans` font imports only if not already present; keep Outfit for the rest of the app.
- Update Tailwind/design tokens only within the hero scope (no global hardcoded colors).
- Use Framer Motion for subtle entrance animations, consistent with the current stack.
- No backend or database changes required.

## Out of scope

- Changing app routes, auth, or recipe data flow.
- Redesigning cards, detail pages, or other sections unless requested after hero approval.

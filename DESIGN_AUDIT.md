# ANON INDIA — UI/UX & Design-System Audit
**Goal:** an aesthetic, luxury, premium, cinematic real-estate website with *consistent* type, colour, and layout across every page.
**Verdict:** The foundations are genuinely strong (Fraunces serif + Inter, charcoal/gold/cream palette, tokenised Tailwind config, a clean `PageHero`). The problem is **execution drift** — the system is defined in `tailwind.config.ts` / `globals.css` but only *partially* applied, so pages diverge. This is a consistency-tightening job, not a redesign.

Scoring (1–10):

| Dimension | Score | One-line |
|---|---|---|
| Colour system | 7 | Excellent token set, but two "blacks" compete and muted-text greys are used at random. |
| Typography | 5 | Premium serif defined, but ~30% of headings silently fall back to sans bold. |
| Layout / rhythm | 6 | Good 7xl container discipline; section vertical spacing is ad-hoc (py-8→28). |
| Components | 7 | Cards/nav/footer are solid; heading + radius + shadow conventions vary. |
| Animation | 4 | Nice primitives exist but 11 of 15 pages are fully static — not "cinematic". |
| Shadow / depth | 5 | Generic cool Tailwind shadows clash with the warm palette. |
| **Overall** | **6** | A 6 that can become a 9 with disciplined token enforcement. |

---

## 1. COLOUR — Audit

**What's right:** `brand` (charcoal), `gold` (antique gold), warm `gray` ramp, `cream`, and semantic `success/warning/danger` are all tokenised. No raw hex leaks into components. Branded `::selection`. This is above-average discipline.

**Issues found (with evidence):**

1. **Two competing near-blacks for headings.** `text-brand-900` (`#0a0b0d`) is used 88×, but `text-gray-900` (`#1a1714`) is used 31× — *also on headings* (about, contact, gallery, careers, blog). Side by side these read as a slightly-off, muddy inconsistency. **Pick one heading colour: `brand-900`.**
2. **Muted body text is a coin-flip.** `text-gray-500` (83×) vs `text-gray-600` (44×) vs `text-gray-700` (15×) with no rule for which means what. Result: paragraph greys subtly shift page to page.
3. **Gold hover inverts to white text** (`.btn-primary`: `hover:bg-gold-600 hover:text-white`). On a luxury button, gold→white-text on a darker-gold fill can read slightly "web-template". Consider keeping the charcoal text and only deepening the gold, or moving to a charcoal-fill hover.
4. **Raw `black/white` opacity gradients** (`from-black/80`, `via-black/20`) appear in city cards while `PageHero` correctly uses `brand-900/*`. Two different dark-overlay recipes for the same job.

## 1b. COLOUR — Fix

- **Heading colour:** standardise every heading to `text-brand-900`. Replace `text-gray-900` on headings.
- **Define semantic text roles** (and use only these):
  - `text-brand-900` → headings & primary
  - `text-gray-600` → body copy (default paragraph)
  - `text-gray-500` → secondary / meta / captions
  - `text-gray-400` → disabled / faint only
- **Overlays:** always use `brand-900/*` for image scrims (warm), never `black/*`.
- **One gold for text-on-light:** keep `gold-700` for gold *text*, `gold-500` for fills (already the rule — just enforce it).

---

## 2. TYPOGRAPHY — Audit

**What's right:** Fraunces (display, with italic) + Inter (body) loaded via `next/font` with `display:swap`. Editorial type scale tokens (`display`, `heading`, `title`, `lead`) with proper `clamp()` and negative tracking. `tabular-nums-pro` for prices. `h1–h3` default to serif in `globals.css`.

**Issues found (this is the biggest brand problem):**

1. **The serif system silently breaks.** Many headings are hand-rolled as `font-bold text-3xl text-gray-900` with **no `font-serif`**, so they render in Inter, not Fraunces. Examples:
   - `about/page.tsx:29,62,84,109` — "From a Vision…", "What We Stand For" → **sans bold**
   - `contact/page.tsx:74`, `gallery/page.tsx:34`, `careers/page.tsx:92,112`, `blog/[slug]/page.tsx:82`
   - Note `globals.css` only auto-serifs `h1,h2,h3` — but these use `text-gray-900` AND many are `h2`/`h3`… *and the `@apply font-serif` is overridden by nothing, yet the bold weight + gray colour still make them look like a different system.* (`h4` gets no serif at all, e.g. `Nav.tsx:188`, `BlogCard.tsx:34`.)
2. **Weight inconsistency.** `section-heading` = serif **semibold**; cards/pages = **bold**. Counts: `font-semibold` 87×, `font-bold` 50×. Headings flip between the two with no rule.
3. **Type-scale tokens under-used.** `text-title` (1.5rem token) is used **0×**; `display`/`heading` appear almost only inside `.section-heading`. Everywhere else uses raw `text-3xl / text-2xl / text-lg / text-xl`, so heading sizes don't snap to the scale (e.g. `about` uses `text-3xl`, project detail uses `text-3xl md:text-4xl`, cards use `text-lg`).
4. **Eyebrow/kicker drift.** `.eyebrow` class used 27×, but raw `uppercase tracking-wide` appears 11× and `tracking-widest` once — three different kicker treatments.

## 2b. TYPOGRAPHY — Fix

- **One heading recipe.** Use `.section-heading` (or a new `.h-section`, `.h-card`) everywhere. No hand-rolled `font-bold text-3xl`. Headings = **Fraunces, `font-semibold`, `brand-900`**. Retire `font-bold` on headings.
- **Add card/sub-heading classes** to `globals.css` so cards stop improvising:
  ```css
  .h-card { @apply font-serif text-title font-semibold text-brand-900; }   /* card titles */
  .h-block{ @apply font-serif text-xl font-semibold text-brand-900; }      /* sidebar/section blocks */
  ```
- **Make `h4`/`h5` serif too** (extend the `h1,h2,h3` rule to `h4`) so nav/blog card titles join the system.
- **Use the scale:** map all headings to `display / heading / title` tokens; kill stray `text-3xl/2xl/4xl`.
- **Always use `.eyebrow`** for kickers; remove raw `uppercase tracking-*` kickers.

---

## 3. LAYOUT & SPACING — Audit

**What's right:** Every page uses the same `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` container — excellent horizontal consistency. `PageHero` is shared across **all 14** interior pages (great) with a `default`/`tall` size system.

**Issues:**
1. **Vertical rhythm is ad-hoc.** Section padding spread: `py-16` (12×), `py-12` (12×), `py-8` (5×), `py-20` (3×), `py-28` (3×), `py-10` (3×), `py-14` (2×). Adjacent sections breathe differently and the page "pulses" unevenly.
2. **Alternating-surface rhythm is informal.** Home alternates white / `cream` nicely, but there's no documented rule, so interior pages don't reuse it — they read flatter.
3. **Homepage hero (`HeroSearch`) duplicates `PageHero`'s scrim/zoom logic** separately, so the two heroes can drift.

## 3b. LAYOUT — Fix

- **Standardise section spacing to a 3-step scale:** `py-16 md:py-24` (standard), `py-12` (compact), `py-24 md:py-32` (hero-adjacent feature). Add a `.section` utility.
- **Codify the surface rhythm:** white → `cream` → white alternation as a rule; give every major section an `eyebrow + section-heading + section-sub` header (home already models this — port it to interior pages).
- **Consistent max-width for prose** (blog/legal): cap text blocks at `max-w-3xl` / `prose` for readability.

---

## 4. COMPONENTS, BORDERS & RADIUS — Audit

- **Radius:** `rounded-xl` (69×) + `rounded-2xl` (49×) dominate, with `rounded-lg` (23×), `rounded-3xl` (2×). Mostly coherent but mixed at the same hierarchy level (buttons xl, inputs xl/lg, cards 2xl, some panels 3xl).
- **Borders:** `border-gray-100` everywhere — clean but generic; nothing signals "premium" on hover.
- **Cards** (`.card`) have a lovely motion curve (`cubic-bezier(0.16,1,0.3,1)`, lift + shadow). Good.

**Fix:**
- **Radius scale:** controls (buttons/inputs/badges) = `rounded-xl`; containers (cards/panels/media) = `rounded-2xl`; retire `rounded-3xl`/`rounded-lg` mismatches.
- **Premium hover detail:** on cards, add a hairline gold border on hover (`hover:border-gold-200`) or a gold top-rule — a small luxury signature.

---

## 5. SHADOW & DEPTH — Audit

Generic Tailwind shadows used: `shadow-lg` (9×), `shadow-xl` (6×), `shadow-sm` (4×), `shadow-md` (1×). These are **cool-grey, hard** shadows that fight the warm cream/gold palette and read flat rather than cinematic.

**Fix — warm, soft, tokenised elevation.** Add to `tailwind.config.ts`:
```ts
boxShadow: {
  'soft':   '0 2px 8px -2px rgb(26 23 20 / 0.08)',
  'card':   '0 8px 30px -8px rgb(26 23 20 / 0.12)',
  'lift':   '0 20px 50px -12px rgb(26 23 20 / 0.22)',
  'gold':   '0 10px 30px -10px rgb(196 154 58 / 0.35)',
}
```
Use `shadow-soft` at rest, `shadow-lift` on hover, `shadow-gold` for the primary CTA. Warm-tinted, low-opacity, large-blur = expensive.

---

## 6. ANIMATION & MOTION — Audit

**What's right:** Good primitives — `fade-up`, `fade-in`, `slow-zoom` (ken-burns), a `Reveal` component, `motion-safe:` guards, and a premium easing curve. `PageHero` orchestrates a staggered entrance (eyebrow→title→rule→subtitle).

**Issue — coverage is thin.** Only **4 of 15** pages use any motion (`home`, `about`, `blog`, `projects`). **11 interior pages are 100% static** (awards, careers, contact, csr, developers, events, gallery, privacy, terms, testimonials, vision). A cinematic site reveals content as you scroll *everywhere*.

**Fix:**
- **Wrap every major section in `Reveal`** (scroll-triggered fade-up) across all pages — instant cinematic upgrade, near-zero risk.
- **Stagger grids** (cards/stats/logos) with incremental `animationDelay` (60–80ms steps).
- **Add subtle parallax** on hero images and a scroll-progress cue.
- Keep honoring `prefers-reduced-motion` (already done).

---

## 7. PRIORITISED ACTION PLAN

**P0 — Consistency (highest impact, low risk):**
1. Replace all heading `text-gray-900` → `text-brand-900` (one black).
2. Replace every hand-rolled `font-bold text-3xl…` heading with `.section-heading` / new `.h-card` / `.h-block`; headings become serif **semibold**.
3. Extend serif auto-rule to `h4`; enforce `.eyebrow` for all kickers.
4. Lock body-text greys to the 600/500/400 role map.

**P1 — Rhythm & depth:**
5. Standardise section padding (`.section` = `py-16 md:py-24`) + codify white/cream alternation.
6. Add warm `boxShadow` tokens; swap generic shadows → `soft/card/lift/gold`.
7. Normalise radius (controls `xl`, containers `2xl`).

**P2 — Cinematic polish:**
8. Wrap all 11 static pages' sections in `Reveal`; stagger grids.
9. Card hover hairline-gold border; CTA `shadow-gold`.
10. Hero parallax + unify `HeroSearch` with `PageHero` primitives.

**Net effect:** same content, same palette, same fonts — but applied with discipline. That alone moves the site from "nice template" to "considered, premium, editorial".

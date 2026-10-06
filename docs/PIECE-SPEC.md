# Design Lounge — Piece specification

A **piece** is one design entry in the Lounge. Every piece is exactly two files:

```
src/demos/<slug>.html           the live demo (self-contained HTML)
src/content/pieces/<slug>.md    the brief (frontmatter + agent-ready markdown)
```

`<slug>` is lowercase kebab-case, unique, descriptive. Examples: `collapsing-sidebar-rail`, `ios-glass-tab-bar`, `skeleton-to-content-swap`.

A new piece also takes the next free public number: add `"<slug>": <n>` to the end of `src/data/numbers.json`. Never change or reuse an existing number. `pnpm build` fails and names the number to add if you forget.

---

## 1. The demo (`src/demos/<slug>.html`)

The demo is rendered inside a sandboxed iframe (`sandbox="allow-scripts"`) at the native size of its platform, then scaled to fit. It must be a **complete, self-contained document**.

### Hard rules

1. **One file, zero dependencies.** Inline all CSS and JS. No `<script src>`, no CDN, no images, no fetches. The only external resource allowed is a Google Fonts `<link>` (max two families).
2. **Fill the viewport.** `html, body { height: 100%; margin: 0 }`. The piece must look finished at its platform's frame size (below) and remain acceptable ±20 % of that size.
3. **Real content.** No lorem ipsum, no "Lorem", no "Heading 1", no placeholder boxes with an "X". Use plausible product copy: real-sounding names, numbers, labels, prices, dates. Keep it fictional (no real brands).
4. **No emoji.** Icons are inline SVG (24px grid, 1.5–2px stroke, `currentColor`). Keep SVG paths short.
5. **Motion is intentional.** Every animation has a purpose (feedback, hierarchy, continuity, delight at one moment). Honour `@media (prefers-reduced-motion: reduce)` by removing or shortening motion. Animations that loop must be calm enough to sit in a grid of twelve other pieces.
6. **Interactive where it makes sense.** Buttons toggle, tabs switch, sidebars collapse, cards flip. If the piece is a one-shot animation (loader, transition), expose a way to replay it: clicking anywhere or a small "Replay" control in a corner.
7. **Start in the hero state.** The first frame should already be the piece's best look. Don't make the viewer do something to see the point.
8. **Accessible by default.** Semantic elements, visible focus rings, `aria-*` where state changes, contrast ≥ 4.5:1 for body text, hit targets ≥ 40px on mobile pieces.
9. **Size.** Aim for 8–28 KB. Hard ceiling 40 KB.
10. **No `alert`, no `console.log`, no `document.write`, no timers faster than 16ms, no infinite JS loops.** Use CSS animation where possible.
11. **Do not read or write `localStorage`/cookies** (sandbox blocks it and it throws).
12. First line of the file: `<!-- Design Lounge piece: <slug> · platform: <platform> · <W>x<H> -->`

### Frame sizes by platform

| platform     | frame size | chrome drawn by the Lounge          | your `<meta viewport>`            |
|--------------|-----------:|-------------------------------------|-----------------------------------|
| `web`        | 1280 × 800 | browser window (tabs, URL bar)      | `width=device-width`              |
| `mobile-web` |  390 × 844 | phone + browser URL bar at bottom   | `width=device-width, initial-scale=1` |
| `mobile-app` |  390 × 844 | phone only, status bar overlay      | same                              |
| `pwa`        |  390 × 844 | phone, standalone, "installed" pill | same                              |
| `tablet`     | 1180 × 820 | tablet (landscape)                  | same                              |

The Lounge draws the device chrome. **Do not draw status bars, notches, or browser bars yourself.** For phone-sized pieces leave `env(safe-area-inset-top, 54px)` of breathing room at the top and `34px` at the bottom (home indicator) if you place fixed elements there; use `padding-top: 54px` on the top-most fixed element as the fallback.

### Style checklist (what "not AI slop" means here)

- No purple-to-blue gradients, no glowing blobs, no "glassmorphism on everything", no rainbow gradient text, no floating emoji, no rounded-everything.
- Pick **one** idea and execute it fully. A piece about a sidebar should be a great sidebar, not a sidebar plus a dashboard plus charts.
- Typography carries the design. Choose a real pairing (serif + grotesk, mono + humanist, a single variable family used at two optical sizes). Set line-height, letter-spacing, and measure deliberately.
- Spacing on a scale (4/8 base or a modular scale). Hairline rules (1px, low-contrast) rather than drop shadows to separate regions, unless shadows are the point.
- Colour: one accent, used sparingly, plus neutrals with a warm or cool bias. Pure `#000`/`#fff` only when the piece is about that.
- Easing: `cubic-bezier(0.2, 0.7, 0.2, 1)` (standard), `cubic-bezier(0.32, 0.72, 0, 1)` (iOS sheet), `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) — not `ease` and not `linear` for UI moves. Durations: 120–200ms for micro, 240–400ms for layout, 500–800ms for hero reveals.
- Native-feel platforms: for `mobile-app` pieces choose either an iOS 26-ish language (Liquid-glass toolbars, SF-like type, 12–20px radii, spring-ish motion) or a Material 3 Expressive language (bold shapes, tonal surfaces, big pill buttons, emphasized easing). Say which in the brief.

---

## 2. The brief (`src/content/pieces/<slug>.md`)

The brief is the product. A visitor copies it, pastes it into their coding agent, and gets this piece rebuilt in their stack. It must be complete enough that an agent with **no access to the demo** can reproduce the piece faithfully.

### Frontmatter (all fields required unless noted)

```yaml
---
title: "Collapsing sidebar rail"          # ≤ 40 chars, sentence case, no trailing period
summary: "A 240px sidebar that collapses to a 64px icon rail with tooltips and a spring-ish width transition."   # one sentence, ≤ 160 chars
platform: web                             # web | mobile-web | mobile-app | pwa | tablet
type: component                           # screen | section | component | animation | layout | pattern | style
category: navigation                      # one value from the fixed category list below
tags: [navigation, sidebar, dashboard]    # 2–6 lowercase, plain-word tags
styles: [minimal, dark]                   # 1–3 from the fixed list below
motion: subtle                            # none | subtle | rich
difficulty: 2                             # 1 = under an hour for an agent, 2 = a session, 3 = multi-step
featured: false                           # the curator may flip this
published: 2026-09-29
palette: ["#0F0F0F", "#F5F5F0", "#E0A34B"]   # 2–5 hex colours that define the piece, background first
fonts: ["Inter", "JetBrains Mono"]        # families used (Google Fonts names)
related: []                               # optional: other slugs
---
```

Fixed `styles` list: `editorial`, `swiss`, `brutalist`, `glass`, `material`, `minimal`, `playful`, `retro`, `terminal`, `paper`, `luxe`, `dark`, `soft`, `industrial`, `kinetic`, `bauhaus`, `y2k`, `cyber`, `organic`, `riso`, `deco`, `pixel`, `clay`.

`type: section` is for one block of a website (a hero, a footer, a pricing table, a contact block) shown on its own. `type: screen` is a whole page or app screen.

Fixed `category` list (the single source of truth is `src/content.config.ts`):

- Website sections: `hero`, `navbar`, `footer`, `features`, `pricing`, `testimonials`, `faq`, `cta`, `contact`, `logos`, `stats`, `team`, `newsletter`, `blog`, `gallery`
- Pages & screens: `portfolio`, `landing`, `auth`, `ecommerce`, `dashboard`, `onboarding`, `settings`, `profile`, `messaging`, `media`, `reading`, `error`, `utility`
- Components: `navigation`, `buttons`, `inputs`, `cards`, `overlays`, `feedback`, `data`, `pickers`, `charts`, `widgets`, `social`, `mockups`
- Motion: `text-motion`, `scroll`, `cursor`, `transitions`, `loaders`, `micro`, `backgrounds`
- Kits: `design-language`

Attribution is added by the Lounge at serve time (a credit comment, `<meta name="author">`, and a small signature when the demo is opened full size). Do not add your own watermark to demos.

### Body — exact section order

Write it as instructions to a capable coding agent. Use imperative voice. Be numeric: pixels, milliseconds, hex, font weights. Never say "modern", "clean", "sleek", "beautiful", "stunning", "seamless".

```markdown
# <Title>

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is
Two to four sentences. What the piece is, where it lives in a product, what feeling it should give, and the one detail that makes it worth copying.

## Reference behaviour
Numbered list of what the user sees and does, in order. Include initial state, each interaction, and each state transition. This is the spec an agent tests against.

## Structure
An ASCII wireframe of the layout at the platform's frame size, with region names and key dimensions. Then a bullet list mapping each region to semantic elements.

## Tokens
A fenced `css` block declaring every design token as custom properties on `:root`: colours (with a role name, not just a hex), font families, a type scale, spacing scale, radii, shadows, motion durations and easings. Everything in the piece references these.

## Typography
Table or list: role → family, size, weight, line-height, letter-spacing, case.

## Motion
For every animated thing: trigger, property, from → to, duration, easing, delay/stagger, and the reduced-motion fallback. Use a table if there are more than three.

## States
Hover, focus-visible, active, disabled, selected/active-route, loading, empty, error — whichever apply. Say what changes visually.

## Accessibility
Roles, labels, keyboard behaviour (which keys do what), focus order, live regions, contrast notes, hit-target sizes.

## Responsive rules
What happens at other sizes. For web: ≥1280, 1024, 768, <640. For phone pieces: how it behaves at 360 wide and at tablet width if it's ever shown there.

## Acceptance checklist
- [ ] Eight to fifteen checkable items an agent can verify (measurements, behaviours, a11y).

Split the list into **Always** (structure, count, states, hit targets) and **This demo** (the quoted names and numbers). An agent adapting the piece keeps Always and replaces This demo with the product's own nouns.

## Implementation notes
The two or three trickiest parts, with short code fragments (CSS or JS, ≤ 25 lines each) an agent can lift directly. Point out common mistakes.
```

Length target: 250–500 lines of markdown. Longer is fine if it's all specific; shorter is not.

---

## 3. Quality bar

Before you consider a piece done:

- Open the demo at its frame size. Does the first frame look like something you'd screenshot?
- Read the brief without looking at the demo. Could you rebuild it? If a number is missing, add it.
- Tab through the demo. Is focus visible everywhere?
- Toggle reduced-motion in devtools. Is it still complete?
- Grep the demo for `lorem`, `emoji`, `TODO`, `Heading`, `http` (other than fonts.googleapis / fonts.gstatic). All should be zero.

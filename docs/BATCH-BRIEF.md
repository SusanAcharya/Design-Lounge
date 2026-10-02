# Instructions for piece authors (batch agents)

You are writing pieces for **Design Lounge**, Susan Acharya's live library of interface design: web and mobile pieces that designers browse for inspiration and that coding agents rebuild from a brief. Every piece is a public argument that Susan has great taste and can ship. Project root: `/Users/postgres/Documents/projects/designs`.

## Read first, in this order

1. `docs/PIECE-SPEC.md`: the contract. Every rule is enforced by `scripts/check-pieces.mjs`.
2. `src/demos/collapsing-sidebar-rail.html` and `src/content/pieces/collapsing-sidebar-rail.md`: the exemplar for density, realism and precision. Your pieces must be at least this good, and more visually ambitious.
3. Skim two or three other demos in `src/demos/` so you know what already exists and don't repeat it.

## Your job

For each slug you are assigned, create exactly two files:

- `src/demos/<slug>.html`
- `src/content/pieces/<slug>.md`

Work one piece at a time: write the demo, then write the brief from the demo, then move on. After every 3 pieces, and at the end, run:

```
node scripts/check-pieces.mjs 2>&1 | grep -E "<your-slug-prefixes>|pieces ·"
```

and fix anything it reports for **your** slugs (ignore everyone else's, other agents are writing in parallel). Zero errors for your slugs is the definition of done.

Then render each of your demos once and look at it (this is required, not optional):

```
node scripts/shot.mjs /demo/<slug>.html /tmp/dl/<slug>.png <W> <H>
```

The dev server is already running; use `BASE=http://localhost:4324` (check `curl -s -o /dev/null -w "%{http_code}" http://localhost:4324/` first; if it's not up, open the file directly with `file://` via a tiny Playwright script). Open the PNG with the Read tool. If the first frame isn't something a senior designer would screenshot and post, fix it before moving on. Check for text overflow, clipped elements, collisions, and empty areas.

## Frontmatter for this batch

- `published: 2026-10-02`
- `category:` one value from the list in the spec (your assignment tells you which).
- `type:` as assigned. Use `section` for a single website block (hero, footer, pricing, contact, testimonials, FAQ, CTA, features, logos, stats, team, newsletter).
- `featured: false`.

## Taste rules (in addition to the spec)

- **Distinct, every time.** Each piece has its own palette, type pairing and mood. Vary light and dark. Never reuse the amber-on-black of the exemplar or the site's own paper-and-Fraunces look.
- **Go further than safe.** This library should make people stop scrolling. Strong typographic scale contrast (a 120–200px display line next to 13px labels), confident colour, real compositional ideas (asymmetric grids, overlap, rotated labels, giant numerals, hairline systems). Restraint is still a virtue; blandness is not.
- **No raster images, no external assets.** Make imagery with CSS and SVG: duotone geometric compositions, gradient "photographs" (layered radial and conic gradients that read as light and landscape), generative SVG patterns, initials avatars on tinted discs, product mockups built from divs. Imagery should look intentional, art-directed, not like grey placeholder boxes.
- **Google Fonts with intent**, max two families per piece. Draw from (never repeat inside your batch): Fraunces, Instrument Serif, Instrument Sans, Playfair Display, Inter, Space Grotesk, IBM Plex Mono, IBM Plex Sans, DM Serif Display, DM Sans, DM Mono, Newsreader, Bricolage Grotesque, Syne, Manrope, Libre Caslon Text, Work Sans, Archivo, Archivo Black, Cormorant Garamond, Karla, Chivo, Chivo Mono, Familjen Grotesk, Sora, Public Sans, Schibsted Grotesk, Gabarito, Onest, Hanken Grotesk, Unbounded, Rubik, Anybody, Epilogue, Young Serif, Lora, Literata, Space Mono, JetBrains Mono, Geist, Geist Mono, Outfit, Plus Jakarta Sans, Figtree, Red Hat Display, Big Shoulders Display, Bebas Neue, Anton, Oswald, Barlow Condensed, Italiana, Poiret One, Limelight, Marcellus, Cinzel, Bodoni Moda, Gloock, Silkscreen, Press Start 2P, VT323, Pixelify Sans, Chakra Petch, Share Tech Mono, Major Mono Display, Rubik Mono One, Bungee, Monoton, Bagel Fat One, Fredoka, Baloo 2, Nunito, Caveat, Gochi Hand, Zilla Slab, Roboto Slab, Spectral, Crimson Pro, EB Garamond, Tenor Sans, Josefin Sans, Righteous, Krona One, Michroma, Lexend, Mona Sans, Hubot Sans.
- **Copy is fictional and product-like.** Invent names (each piece its own; never real brands). Write copy a real product team would ship, with real-sounding numbers, dates, prices and places. Where a person is the subject (portfolios, about sections), invent a fictional designer, not Susan.
- **Sizes.** Web pieces 1280×800. Tablet 1180×820 landscape. Phone pieces (`mobile-web`, `mobile-app`, `pwa`) 390×844; the Lounge draws the phone frame and status bar, so leave 54px at the top and 34px at the bottom clear of fixed controls.
- **Sections and full pages may scroll** inside the frame (landing pages, portfolios, long footers shown with the end of a page above them). The first 800px must be the best frame. A hero section piece should include a minimal nav so it reads as the top of a real site; a footer piece should show the last bit of page content above it.
- **Interactive or replayable.** Hover states, toggles, tabs, sliders, inputs that respond. If something animates once, clicking it (or a small Replay control) replays it.
- **JS** under ~120 lines, defensive, no console errors. Prefer CSS for motion.
- **No emoji anywhere.** Icons are inline SVG.
- **Size**: aim for 10–28 KB per demo; the hard ceiling is 40 KB.

## Brief rules reminder

- Exact section order from the spec, all eleven sections present.
- Numbers everywhere: px, ms, hex, weights, easing curves.
- `Tokens` is a `css` fenced block of `:root` custom properties covering every colour, font, size, radius, shadow and motion value.
- Acceptance checklist has 8–15 `- [ ]` items.
- Implementation notes include 2–3 short code fragments.
- Aim for 170–400 lines. Never pad; always be specific.

## Reporting

When done, reply with: the list of slugs you completed, the validator output for your slugs, and anything you deliberately deviated from (and why). Do not touch files outside your assigned slugs.

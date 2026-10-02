# Instructions for piece authors (batch agents)

You are writing pieces for **Design Lounge**, a gallery of live web/mobile design pieces where every piece ships with a brief a coding agent can rebuild it from. Project root: `/Users/postgres/Documents/projects/designs`.

## Read first, in this order

1. `docs/PIECE-SPEC.md` — the contract. Every rule is enforced.
2. `src/demos/collapsing-sidebar-rail.html` and `src/content/pieces/collapsing-sidebar-rail.md` — the exemplar. Match its density, realism and precision. Your pieces should be *at least* this good.

## Your job

For each slug you are assigned, create exactly two files:

- `src/demos/<slug>.html`
- `src/content/pieces/<slug>.md`

Work one piece at a time: write the demo, then write the brief from the demo, then move on. After every 3 pieces, and at the end, run:

```
node scripts/check-pieces.mjs
```

and fix anything it reports for **your** slugs (ignore other people's). Zero errors for your slugs is the definition of done.

## Taste rules (in addition to the spec)

- Each piece must look **different** from the others in your batch: different palette, different type pairing, different mood. Vary light/dark. Don't reuse the exemplar's amber-on-black in more than one piece.
- Use Google Fonts with intent. Good pairings to draw from (pick per piece, don't use the same twice): Fraunces / Instrument Sans; Playfair Display / Inter; Space Grotesk / IBM Plex Mono; DM Serif Display / DM Sans; Newsreader / Geist (use "Inter" if Geist is not on Google Fonts); Bricolage Grotesque; Syne / Manrope; Libre Caslon Text / Work Sans; Archivo Black / Archivo; Cormorant Garamond / Karla; Chivo / Chivo Mono; Familjen Grotesk; Sora; Public Sans; Instrument Serif; Schibsted Grotesk; Gabarito; Onest; Hanken Grotesk; Unbounded; Rubik; Anybody; Epilogue; Young Serif; Lora; Literata.
- Copy is fictional and product-like. Invent product names (e.g., "Orbital", "Halden", "Tessel", "Mira", "Fjord Bank", "Nord Post", "Marrow", "Loam") — but each piece its own; never real brands.
- Phone pieces (`mobile-web`, `mobile-app`, `pwa`) are 390×844. The Lounge draws the phone frame and the status bar; leave 54px at the top and 34px at the bottom clear of *fixed* controls.
- Tablet pieces are 1180×820 landscape.
- Web pieces are 1280×800.
- Every piece must be interactive or replayable. If it animates once, clicking the piece replays it.
- Where you write JS, keep it under ~80 lines and defensive (no errors in console).
- No emoji anywhere. Icons are inline SVG.

## Brief rules reminder

- Exact section order from the spec, all eleven sections present.
- Numbers everywhere: px, ms, hex, weights, easing curves.
- The `Tokens` section is a `css` fenced block of `:root` custom properties that covers every colour, font, size, radius, shadow and motion value in the piece.
- The Acceptance checklist has 8–15 `- [ ]` items.
- Implementation notes include 2–3 short code fragments.
- Aim for 250–500 lines. Never pad; always be specific.

## Reporting

When done, reply with: the list of slugs you completed, the validator output for your slugs, and anything you deliberately deviated from the spec (and why). Do not touch files outside your assigned slugs.

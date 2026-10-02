# Design Lounge

Interfaces worth sitting with. A catalogue of live web and mobile design pieces, each one a single self-contained HTML file, each one shipped with a markdown brief a coding agent can rebuild it from.

```
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static site in dist/
pnpm preview
pnpm check:pieces # validate every piece against docs/PIECE-SPEC.md
```

## Layout

```
src/demos/<slug>.html          live demo, one file, no dependencies
src/content/pieces/<slug>.md   frontmatter + agent brief
src/data/collections.ts        curated shelves
src/lib/pieces.ts              catalogue helpers, platform / room / style metadata
src/components/DeviceFrame     scales a demo inside browser / phone / tablet chrome
src/components/Catalog         client-side filters with shareable URLs
src/components/Palette         ⌘K search over /search.json
src/pages/p/[slug].astro       piece page: stage, brief, source, related
src/pages/p/[slug].md.ts       raw brief endpoint
src/pages/demo/[slug].html.ts  raw demo endpoint (what the iframes load)
docs/PIECE-SPEC.md             the contract every piece follows
scripts/check-pieces.mjs       validator
scripts/shot.mjs               screenshot helper (Playwright)
```

## Adding a piece

1. Read `docs/PIECE-SPEC.md`.
2. Create `src/demos/<slug>.html` and `src/content/pieces/<slug>.md`.
3. Run `pnpm check:pieces` until it reports zero errors for your slug.
4. Optionally add the slug to a shelf in `src/data/collections.ts`.

Pieces are numbered by publish date, then title. The number is stable once a piece is published; don't backdate.

## Keyboard

| Key       | Does                         |
|-----------|------------------------------|
| `⌘K` `/`  | search                       |
| `r`       | random piece                 |
| `t`       | toggle day / night           |
| `[` `]`   | previous / next piece        |
| `c`       | copy the brief (piece page)  |

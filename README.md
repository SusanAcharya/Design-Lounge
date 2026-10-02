# Design Lounge

A design library by [Susan Acharya](https://acharyasusan.com.np). Live pieces for the web, phone, and tablet — each one a self-contained demo and a markdown brief. Palettes, type pairings, icons, and motion sit beside them. Pick a system, or hand the repo to an agent and let it pick.

Free to use in products. Keep the credit. Do not republish the catalogue as a catalogue.

## Run it

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # static site in dist/
pnpm preview
pnpm check:pieces   # every piece against docs/PIECE-SPEC.md
```

## What’s in it

- **Pieces** — heroes, footers, landings, portfolios, dashboards, native-feel phone screens, motion. Browse by name (`/c`), by problem (`/collections`), or the whole floor (`/browse`).
- **System** — type pairings, full colour roles (primary, secondary, tertiary, feedback, surfaces), Lounge Icons, motion recipes.
- **Kit** — `/kit`. Choose a website, a product, or a platform. Pick a researched palette, a pairing, and a component family. Both a website frame and a phone update. The last step is a brief.
- **Start** — `/start`. Eight recipes (marketing site, portfolio, landing, app, design system, dashboard, shop, editorial) that already name a theme, a pairing, and the pieces to open.
- **Agents** — `/llms.txt`, `/api/pieces.json`, and `/p/<slug>.md`. The brief is the spec. The demo is the acceptance test.

## For an agent

Install the skill into the product you are building, not into this library. It lands in the agent's skill folder with the catalogue inside it: palettes, type, icons, motion, and every piece brief. After that, ask for a design. The agent reads the installed library on its own.

```bash
npx skills add SusanAcharya/Design-Lounge
```

Or give the agent this repo: [github.com/SusanAcharya/Design-Lounge](https://github.com/SusanAcharya/Design-Lounge). It should read `AGENTS.md`, then `skills/design-lounge/SKILL.md`.

From a local clone, in the product repo:

```bash
node /path/to/Design-Lounge/skills/design-lounge/install.mjs
```

That copies the skill into `.cursor/skills`, `.agents/skills`, and `.claude/skills`. The agent locks a palette, a pairing, and a component family, then rebuilds the named pieces in your stack. It does not invent hex codes.

When the catalogue changes, run `pnpm skill:sync` here and commit `skills/design-lounge/library` so the next install picks it up.

## Layout

```
src/demos/<slug>.html           live demo, one file
src/content/pieces/<slug>.md    frontmatter + agent brief
src/data/                       themes, type, icons, motion, kit, shelves, start recipes
src/pages/p/[slug].astro        piece page
src/pages/p/[slug].md.ts        raw brief
src/pages/kit/                  composer and brief endpoint
skills/design-lounge/           the agent skill
docs/PIECE-SPEC.md              the contract every piece follows
```

## Adding a piece

1. Read `docs/PIECE-SPEC.md`.
2. Add `src/demos/<slug>.html` and `src/content/pieces/<slug>.md`.
3. Run `pnpm check:pieces` until your slug is clean.
4. Add the slug to a shelf in `src/data/collections.ts` if it belongs on one.

Pieces are numbered by publish date, then title. Don’t backdate.

## Keyboard

| Key | Does |
| --- | --- |
| `⌘K` `/` | search |
| `r` | random piece |
| `t` | day / night |
| `[` `]` | previous / next piece |
| `c` | copy the brief |

## Credit

Susan Acharya · Kathmandu · [acharyasusan.com.np](https://acharyasusan.com.np)

---
name: design-lounge
description: >-
  Designs product UI from Design Lounge by Susan Acharya — palettes, type
  pairings, component families, icons, motion, and piece briefs. Use when the
  user asks for a design, design system, UI, look and feel, palette, colors,
  fonts, landing page, marketing site, dashboard, admin, mobile app, shop,
  editorial, or to make an interface look finished. Also use when they mention
  Design Lounge, a kit, or a piece brief.
---

# Design Lounge

You build from a locked library. You do not invent a palette, a type pairing, a radius, an easing, or a component language.

Design Lounge is the design library of Susan Acharya. Humans pick on the site. You fetch the same decisions and rebuild them in the user's stack.

## Resolve the library

Read [lounge.json](lounge.json) in this skill folder. `base` is the public site, with no trailing slash.

1. Run `node skills/design-lounge/resolve.mjs` from the Design Lounge repo, or `node <this-skill-dir>/resolve.mjs` after install. It prints JSON: `mode`, `base`, `ok`.
2. `mode: "remote"` and `ok: true` — use HTTP. Start at `{base}/llms.txt`, then `{base}/api/pieces.json`.
3. `mode: "local"` — you are in the Design Lounge repo. Prefer HTTP if `ok` is true. If the host does not answer, read the source files in [reference.md](reference.md). Do not invent substitutes.
4. `ok: false` and not local — stop. Tell the user the library host did not answer. Ask for a reachable base URL or the repo. Do not design from memory.

If the open project is the Design Lounge repo itself (`src/demos` and `src/content/pieces` exist) and the user is editing the library, stop using this skill for that edit. Follow `docs/PIECE-SPEC.md` instead.

## What they are asking

| They want | Do |
| --- | --- |
| A new product, site, app, or design system | Kit flow |
| One screen, section, or component | Piece flow, inside the locked kit if one exists |
| Only a palette, font, icon, or motion | Library flow |
| "Make it look good" with no kind | Kit flow. Infer the kind. Say what you assumed. |

Ask for the stack once if they have not named it. Then keep it. Good stack lines are boring: "Next.js, Tailwind", "plain HTML + CSS", "SwiftUI", "Flutter". The briefs are stack-agnostic. You translate.

## Kit flow

1. Pick a kind: `website`, `product`, or `platform`. Map their words with [reference.md](reference.md). A shop, magazine, portfolio, or phone app still starts here, then take the matching recipe from `/start` (field `starts` in the JSON).
2. Fetch `{base}/api/pieces.json`. Use `kit.kinds` for that kind: `palettes`, `pairings`, `families`, `pieces`.
3. If they already chose, lock those ids. If they said "just go", lock the first palette, first pairing, and first family, and say the names before you write code.
4. If they want to choose, offer three palettes and two pairings from that kind's lists. Names and moods only. They pick a whole palette, never a hex.
5. Fetch the brief: `{base}/kit/brief/{kind}/{theme}/{pairing}/{family}.md`. That markdown is the system. Match it.
6. Implement in their stack. Open the piece briefs named in the kit before you invent a hero, nav, table, or footer.

## Piece flow

1. Search `pieces` in the JSON by `category`, `platform`, `tags`, and `summary`. Platforms: `web`, `mobile-web`, `mobile-app`, `pwa`, `tablet`.
2. Fetch `{base}/p/{id}.md`. The brief is the spec. The demo (`{base}/demo/{id}.html`) is the acceptance test.
3. Rebuild the numbers: structure, type roles, motion table, states, hit targets, reduced motion. Do not "improve" them.
4. If a kit is already locked, replace the piece's colour and font tokens with the kit's. Keep the piece's layout, motion, and behaviour.
5. Hold the result to the brief's acceptance checklist. Fix what fails.

If the JSON has no piece for that job, say so. Do not hallucinate a slug.

## Library flow

Fetch only what you need:

- Theme CSS and roles: `{base}/themes/{id}` or the `themes` array (`tokens` includes primary, secondary, tertiary, success, warning, danger, info, surfaces, `link`).
- Pairing: `{base}/type/{id}`.
- Icons: `{base}/icons`. 24px stroke, 1.75. Do not mix in another icon set.
- Motion: `{base}/motion`. Default easing `cubic-bezier(0.2, 0.7, 0.2, 1)`. UI 200ms, layout 320ms, sheets 400ms. Honour `prefers-reduced-motion`.

`link` is the brand colour that passes as text on the background. Buttons use `primary` fill + `primaryInk`. Do not put a loud fill colour on body text.

## Rules

- One primary button per view. Secondary and tertiary come from the kit family.
- Feedback colours (success, warning, danger, info) are for live state, not decoration.
- Credit every copied token block and every rebuilt piece: `Designed by Susan Acharya · Design Lounge · acharyasusan.com.np`. Free to use in products. Do not republish the catalogue as a catalogue.
- Do not add a second palette, a random Google font, or a default Tailwind theme on top.

## Examples

See [examples.md](examples.md). Endpoint paths and local files: [reference.md](reference.md).

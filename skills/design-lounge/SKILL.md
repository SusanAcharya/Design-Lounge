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

The library is already in this skill folder. Read it. Do not invent a palette, a type pairing, a radius, an easing, or a component language, and do not wait for a website.

Design Lounge is the design library of Susan Acharya. Humans can browse it at https://designlounge.vercel.app.

## Their words win

This skill is a set of defaults. When the person asks for something a default forbids, such as more motion, a second effect, a dark mode with no pair, or skipping a step, do what they asked. Write one line in `DESIGN.md` saying which default you set aside and why. Do not argue, and do not quietly ignore them.

## Read the library

Everything you need is next to this file. Read only what the job needs.

1. `library/index.json` — kinds, recipes (`starts`), palettes (full CSS), pairings (full CSS), families, motion, and the piece index.
2. `library/briefs/<id>.md` — the spec for one piece. Open only the pieces you will build.
3. `library/icons.json` — Lounge Icons, only when the screen needs icons.
4. [components.md](components.md) — the controls, and which piece to use for which job.
5. [practice.md](practice.md) — the method. Its first lines say which sections each job needs. Do not read all of it for one component.

Do not run scripts from this skill. If `library/index.json` is missing, the install is broken. Say so. Do not design from memory.

If the open project is the Design Lounge repo itself (`src/demos` and `src/content/pieces` exist) and the user is editing the library, stop using this skill for that edit. Follow `docs/PIECE-SPEC.md` instead.

## What they are asking

| They want | Do |
| --- | --- |
| The project already has a design system, DESIGN.md, tokens, or styled screens | Adopt flow |
| A new product, site, app, or design system | Kit flow |
| One screen, section, or component | Piece flow, inside the locked kit if one exists |
| Only a palette, font, icon, or motion | Library flow |
| "Make it look good" with no kind | Kit flow. Infer the kind, the job, and the register. Say what you assumed. |

If they have not named a stack, use what the project already uses. In an empty folder, ask once, or default to plain HTML + CSS + a little JS when they said to just build. The briefs are stack-agnostic. You translate.

## Say the pick, then build

Choose, say it, and build in the same turn. Put this at the top of the reply, using `site` from `library/index.json`:

- Theme: name, one-line mood, `{site}/themes/<id>`
- Pairing: name, `{site}/type/<id>`
- Family: name, and the radius it locks
- Pieces: title and `demo` link for each screen or effect

Write the same links into `DESIGN.md` as Sources, so a later message can say "change the table" and you know which demo it came from.

Ask before building only when:

- two recipes fit and would lock different worlds, such as a staff dashboard versus a personal ledger. Ask which one, in one question, then stop.
- they asked to see options or to choose. Then name three palettes and two pairings with links, names and moods only.

If they ask for a change after, edit that one Source line and rebuild that screen on the same sheet. Do not open a second palette.

## Kit flow

1. Pick a kind (`website`, `product`, `platform`, `personal`) with the kind map in [reference.md](reference.md). Then take the matching recipe from `starts` and one of its `directions` (Pick a direction in [practice.md](practice.md)). The same sentence from two people must not give the same site. Do not lock the first palette, pairing, or family because it is first.
2. For a website, read Stand out in [practice.md](practice.md) first: name the default look you are avoiding, write the Idea in one picture sentence, show the work as pictures, never invent clients.
3. Write the four lines from Decide the screen: who it is for, the one decision, the first thing they see, and the next action.
4. The locked system is the theme's `css`, the pairing's `css`, and the family's `rules`, `radius`, `button`, and `density`. Match those numbers.
5. If the pairing has a `caution`, say it before you write. Body text uses `--font-text`. Amounts use `.num`. If the pairing has a mono, `.num` and code use it. If `numbers` is `display`, `.num` uses the display face. If the pairing has no mono, `.num` is the text face with even-width digits, code uses the system mono, and you do not add a Google mono font.
6. A theme is one mode. If the product needs both and `pair` is set, use that theme as the second mode. If `pair` is null, stay in one mode and say so, unless they asked for both. Then build the second mode from the same theme's tokens and say so. The theme CSS includes a sample radius and shadow. Ignore them. The family sets radius and shadow.
7. Build the shell first, then the primary screen, then the rest of Minimum screens in [practice.md](practice.md). Open each brief before you invent a hero, nav, table, or footer.
8. Open the screens and run Look and One correction in [practice.md](practice.md). Fix every fail.

An internal tool, admin, ops screen, or dashboard is kind `platform`, then the `dashboard` recipe. A chart, a metric, an empty list, and a failed load come from pieces, not a chart library's defaults.

## Adopt flow

Use this when a design system is already in the project.

1. Keep their colours, type, radius, and shadow. Do not lock a second Lounge palette on top.
2. Take structure, states, motion, and hit targets from the piece briefs. Name the demos you take structure from.
3. Restyle onto a Lounge kit only when they asked for a new look. A refine that asks for scroll, hover, or a cursor keeps their colours and adds effect pieces from Register in [practice.md](practice.md).

## Piece flow

1. Search `pieces` in the index by `category`, `platform`, `tags`, and `summary`, or use the routes in [components.md](components.md). Platforms: `web`, `mobile-web`, `mobile-app`, `pwa`, `tablet`.
2. Read `library/briefs/<id>.md`. The brief is the spec for structure, counts, sizes, motion timing, states, and hit targets. `demo` is the HTML acceptance file, if you need to see the motion.
3. The brief's colours, fonts, and light or dark mode belong to its demo. Translate them by role onto the locked theme and pairing. Follow Adapting a brief in [practice.md](practice.md). A dusk-blue parallax on a light theme becomes a daylight parallax with the same layers and speeds.
4. Hold the result to the brief's acceptance checklist, skipping lines that only hold for the demo's copy. Fix what fails.

If the index has no piece for that job, say so. Do not invent a slug.

## Library flow

- Theme: `themes[]`. `tokens` includes primary, secondary, tertiary, success, warning, danger, info, surfaces, `link`. Copy `css`.
- Pairing: `pairings[]`. Copy `css`.
- Icons: `library/icons.json`. 24px stroke, 1.75. Do not mix in another icon set.
- Motion: `motion`. Default easing `cubic-bezier(0.2, 0.7, 0.2, 1)`. UI 200ms, layout 320ms, sheets 400ms. Honour `prefers-reduced-motion`.

## When numbers disagree

This order wins, after their own words.

1. An existing design system they asked you to keep.
2. The locked family, for radius, shadow, button style, and density.
3. The locked theme, for every colour. The locked pairing, for fonts.
4. The piece brief, for structure, regions, motion, interactions, states, and hit targets.

Map the brief's paint onto tokens. Do not mix a new hex for hover or selected.

| Brief role | Token |
| --- | --- |
| Page | `--bg` |
| Card or row | `--surface` |
| Hover | `--surface-2` |
| Pressed or selected | `--primary-soft` |
| Selected and hovered | `--surface-3` |
| Hairline | `--line` |
| Strong border | `--line-strong` |
| Body text | `--ink` |
| Secondary text | `--ink-2` |
| Muted text | `--ink-3` |
| Text button or link | `--link` |
| Primary button | `--primary` fill, `--primary-ink` label |
| Glow, gradient stop, highlight | `--primary-soft`, or `--primary` for the one bright stop |
| Text on a feedback wash | `--success-on-soft` / `--warning-on-soft` / `--danger-on-soft` / `--info-on-soft` on the matching `-soft` |

## Rules

- One primary button per view. If a brief draws it twice, one becomes outline.
- Feedback colours are for live state, not decoration.
- If the product already has a brand colour, keep the theme's surfaces and set `--primary` to the brand. `--primary-ink` is `#141210` or `#fffdf8`, whichever contrasts at least 4.5.
- No second palette, random Google font, or default Tailwind theme on top.
- Credit every copied token block and rebuilt piece: `Designed by Susan Acharya · Design Lounge · acharyasusan.com.np`. Free to use in products. Do not republish the catalogue as a catalogue.

## The reply

Keep it short. The pick with links at the top. Then what you built, the look notes from opening the screens, anything in Say so in [practice.md](practice.md), and only the checks that failed and how you fixed them. Do not paste a checklist of passes.

## Examples

See [examples.md](examples.md). Paths and the kind map: [reference.md](reference.md).

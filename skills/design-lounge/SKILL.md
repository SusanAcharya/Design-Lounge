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

Design Lounge is the design library of Susan Acharya. This skill shipped with the catalogue when it was installed. Humans can browse the same library at https://designlounge.vercel.app.

## Read the library

Everything you need is next to this file.

1. `library/index.json` — kinds, palettes (full CSS), pairings (full CSS), families, motion, and the piece index.
2. `library/briefs/<id>.md` — the spec for one piece. Open only the pieces you will build.
3. `library/icons.json` — Lounge Icons, only when the screen needs icons.

Read those files. Do not run scripts from this skill. If `library/index.json` is missing, the install is broken. Say so. Do not design from memory.

If the open project is the Design Lounge repo itself (`src/demos` and `src/content/pieces` exist) and the user is editing the library, stop using this skill for that edit. Follow `docs/PIECE-SPEC.md` instead.

## What they are asking

| They want | Do |
| --- | --- |
| The project already has a design system, DESIGN.md, tokens, or styled screens | Adopt flow |
| A new product, site, app, or design system | Kit flow |
| One screen, section, or component | Piece flow, inside the locked kit if one exists |
| Only a palette, font, icon, or motion | Library flow |
| "Make it look good" with no kind | Kit flow. Infer the kind, the job, and the register from their sentence. Say what you assumed. |

Ask for the stack once if they have not named it. Then keep it. Good stack lines are boring: "Next.js, Tailwind", "plain HTML + CSS", "SwiftUI", "Flutter". The briefs are stack-agnostic. You translate.

## Before you write UI

Read [practice.md](practice.md) and follow it. Do not skip ahead to code.

Pick one theme, one pairing, one family, and the pieces for this pass. For a public site, also pick one source in `library/sources.json` and stay with it. Do not copy that site's palette, and do not blend two sources. From their sentence, name the type, the job, and the scope, then match the world in [practice.md](practice.md), including the register. A portfolio or a product page they described with scroll, hover, or a cursor keeps that one effect. Do not lock the first palette because it is first. Before you choose a layout, write the four lines in Decide the screen in [practice.md](practice.md): who it is for, the one decision, the first thing they see, and the next action. The first thing is the largest type on the view. A region that does not serve those four lines does not go on the screen. The next action names the screen it opens. Follow After the action in [practice.md](practice.md). Show the pick before you paint, unless they already told you to build. Then open the screens, run Look and One correction, and run the finish checklist. Report each line as pass or fail.

## Show the pick, then ask once

People go back and forth. Do not paint a first draft of their product so they can see the look. The library already has the look. Choose it, link it, and ask.

Use `site` from `library/index.json`.

- Theme: name, one-line mood, `{site}/themes/<id>`
- Pairing: name, `{site}/type/<id>`
- Family: name, and the radius it locks
- Each screen: piece title, whether it supplies layout, motion, or a component, and that piece's `demo` field

One question, then stop: "Build this, or swap the palette or one of these screens?"

Do not offer a menu of palettes unless they asked to see options. You choose. They correct.

Skip the question and build when their message already says just go, you pick, build it, or don't ask, or when they already named the theme or the piece. Still put the same links in the reply, and write them into `DESIGN.md` as Sources, so a later message can say "change the table" and you know which demo it came from.

If they ask for a change, edit that one source line and rebuild that screen on the same sheet. Do not open a second palette.

Every button, field, card, row, badge, and nav item comes from [components.md](components.md). Piece briefs do not get a private control style. If the product already has a brand colour, keep the theme's surfaces and feedback, and set `--primary` to that brand colour. Choose `--primary-ink` as `#141210` or `#fffdf8`, whichever contrasts at least 4.5 with the brand. Do not build a second palette around the brand.

You keep one system consistent across the product. You do not become a second designer with a second palette halfway through. If the index has no piece, say so and build from the sheet. Do not claim the interface is finished only because the code runs. Open the screens and judge them with Look in [practice.md](practice.md). Write what you saw. Fix every fail. The person using the product can still disagree. You do not skip the look.

An internal tool, admin, ops screen, or dashboard is kind `platform`, then the `dashboard` recipe in `starts`. Search `dashboard`, `data`, `charts`, `navigation`, `settings`, `overlays`, `feedback`, `inputs`, `pickers`, `team`, `utility`, and `error`. Do not decide the library is only marketing because most pieces are. A chart, a single metric, an empty list, and a failed load come from those pieces. A line is one stroke. A metric is one number at display size. Do not style a chart library, do not lay four equal numbers in a row, and do not write "No data" into a blank card. On a phone, use the phone empty and the phone failed load.

A pass is more than the first screen. Follow Minimum screens in [practice.md](practice.md). Write the shell before the first screen: sidebar, panel, and the one nav list. After the screens, the Match block checks those widths again, including the rail closed and the phone. A website includes nav, a hero, one proof block, and a footer. An app includes the shell, a list, one detail, an empty state, and account or settings. A platform includes the shell, a table or board, one record, and the account menu. Add people and billing when the product has staff or a plan.

## Adopt flow

Use this when a design system is already in the project.

1. Keep their colours, type, radius, and shadow. Do not lock a second Lounge palette on top.
2. Take structure, states, motion, and hit targets from the piece brief.
3. Show the piece demos you will take structure from, with their colours named as the ones you are keeping. Ask once, unless they already said to build. Do not ask how far to go.
4. Restyle onto a Lounge kit only when they asked for a new look. Then follow Kit flow. A refine that asks for scroll, hover, or a cursor keeps their colours and adds one effect piece from Register in [practice.md](practice.md). It is not a new kit.

## Kit flow

1. Pick a kind: `website`, `product`, `platform`, or `personal`. Map their words with [reference.md](reference.md). A shop, a SaaS page, a portfolio, or a phone app still starts here, then take the matching recipe from `starts`. Those recipes are the website kinds and the app kinds. One person's money is `personal`, not `platform`. A SaaS page is `saas`, not the fashion landing.
2. Use `kit.kinds` for that kind: `palettes`, `pairings`, `families`, `pieces`.
3. If they already chose, lock those ids. If they said just go, you pick, build it, or don't ask, lock the match from Match the world: the recipe that fits, or the theme whose `bestFor` names this product. Say which theme you rejected. If they described scroll, hover, or a cursor, the register is that one piece. Do not drop it because the recipe's theme is calm. Do not lock the first palette, the first pairing, or the first family because they are first.
4. Otherwise show the pick (Show the pick, then ask once) and stop. Do not write UI in that turn.
5. If they ask to see options, name three palettes and two pairings from that kind's lists, each with its page link. Names and moods only. They pick a whole palette, never a hex.
6. The locked system is the theme's `css`, the pairing's `css`, and the family's `rules`, `radius`, `button`, and `density` in the index. Match those numbers. Do not fetch a kit URL.
7. If the pairing has a `caution`, say it before you write. Body text uses `--font-text`. When `numbers` is `mono` or unset, `.num` uses `--font-mono`. When `numbers` is `display`, `.num` uses `--font-display` and mono is only for `code`. Do not put an amount on the mono face if the CSS kept it off `.num`.
8. A theme is one mode (`light` or `dark`). If the product needs both and `pair` is set, use that other theme as the second mode. Same pairing, same family. If `pair` is null, stay in the one mode and say so. Do not borrow an unpaired palette. Night Desk pairs with Paper & Ink. Harbour Ledger pairs with Harbour Night. Lokta pairs with Lokta Night. The theme CSS also includes a sample radius and shadow. Ignore them. The family sets radius and shadow.
9. Implement in their stack. Open `library/briefs/<id>.md` for the pieces named on the kind and the family before you invent a hero, nav, table, or footer. Write each piece into Sources in `DESIGN.md` with its demo link.

## Piece flow

1. Search `pieces` in the index by `category`, `platform`, `tags`, and `summary`. Platforms: `web`, `mobile-web`, `mobile-app`, `pwa`, `tablet`.
2. Read `library/briefs/<id>.md`. The brief is the spec. `demo` on the piece is the HTML acceptance file on GitHub, if you need to see the motion.
3. Rebuild the numbers: structure, type roles, motion table, states, hit targets, reduced motion. Do not "improve" them.
4. When a kit or an existing system is locked, follow the precedence below. Do not copy hex values out of the brief.
5. Hold the result to the brief's acceptance checklist. Fix what fails.

If the index has no piece for that job, say so. Do not hallucinate a slug.

## Library flow

Read only the part of the index you need:

- Theme: `themes[]`. `tokens` includes primary, secondary, tertiary, success, warning, danger, info, surfaces, `link`. Copy `css`.
- Pairing: `pairings[]`. Copy `css`.
- Icons: `library/icons.json`. 24px stroke, 1.75. Do not mix in another icon set.
- Motion: `motion`. Default easing `cubic-bezier(0.2, 0.7, 0.2, 1)`. UI 200ms, layout 320ms, sheets 400ms. Honour `prefers-reduced-motion`.

`link` is the brand colour that passes as text on the background. Buttons use `primary` fill + `primaryInk`. Do not put a loud fill colour on body text.

## When numbers disagree

This order wins. Do not pick a middle.

1. An existing design system they asked you to keep.
2. The locked family, for radius, shadow, button style, and density. A table brief that asks for 8px corners loses to Industrial's 2px and no shadow.
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
| Text on a success wash | `--success-on-soft` on `--success-soft` |
| Text on a warning wash | `--warning-on-soft` on `--warning-soft` |
| Text on a danger wash | `--danger-on-soft` on `--danger-soft` |
| Text on an info wash | `--info-on-soft` on `--info-soft` |

## Rules

- One primary button per view. If a brief draws that button twice, one of them becomes outline. Secondary and tertiary come from the kit family.
- Feedback colours (success, warning, danger, info) are for live state, not decoration. Text on a wash uses the matching `on-soft` token. Do not invent a hex because the solid fill fails on the wash. A list where every row is warning has no warning.
- Credit every copied token block and every rebuilt piece: `Designed by Susan Acharya · Design Lounge · acharyasusan.com.np`. Free to use in products. Do not republish the catalogue as a catalogue.
- Do not add a second palette, a random Google font, or a default Tailwind theme on top. A second mode is the theme's `pair` only.

## Examples

See [examples.md](examples.md). Paths and the kind map: [reference.md](reference.md). The working method: [practice.md](practice.md). The controls: [components.md](components.md).

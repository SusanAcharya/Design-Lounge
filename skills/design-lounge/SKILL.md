---
name: design-lounge
description: >-
  Designs product UI from Design Lounge by Susan Acharya — palettes, type
  pairings, component families, icons, motion, and piece briefs. Use when the
  user asks for a design, design system, UI, look and feel, palette, colors,
  fonts, landing page, marketing site, web app, dashboard, admin, desktop
  app, mobile app, shop, editorial, React Native, Flutter, SwiftUI, Compose,
  or PWA apps, or to
  make an interface look finished. Also covers what the
  taste-skill pack does: anti-slop pages, minimal, brutalist and high-end
  looks, redesigns, image-first mockups, logos and brand kits. Also use when
  they mention Design Lounge, a kit, or a piece brief.
---

# Design Lounge

The library is already in this skill folder. Read it. For products and tools, do not invent a palette, a type pairing, a radius, an easing, or a component language, and do not wait for a website.

The library is the floor and the vocabulary, not the ceiling. When they ask for spectacle, the page is built around one thing made for this subject, in colour and type you choose for its world, and the library holds the craft. That is Show mode, Free, in [show.md](show.md). The rule above about not inventing a palette is for products and tools.

Every new build starts with a brief: their sentence, rewritten as the prompt a strong designer would want. See Write the brief first, below.

Design Lounge is the design library of Susan Acharya. Humans can browse it at https://www.designlounge.live.

## Their words win

This skill is a set of defaults. When the person asks for something a default forbids, such as more motion, a second effect, a dark mode with no pair, or skipping a step, do what they asked. Write one line in `DESIGN.md` saying which default you set aside and why. Do not argue, and do not quietly ignore them.

## Write the brief first

For every new website or app, before you read the recipes, turn their request into a brief with [brief.md](brief.md): their words in quotes, the product and its facts, who it is for, the world, the one thing, the ambition, the mode, the stack, what is missing, the hard limits, and what done means. Put it at the top of `DESIGN.md` and build to it. If you hand work to a subagent, send the whole brief. Any question that When to ask allows comes before the brief, and the brief records the answer.

A short request ("make a cool scrolling space website") and a good brief give very different sites. The brief adds no facts. It names what their words already imply, and sets the bar.

## Read the library

Everything you need is next to this file. Read only what the job needs.

1. `library/map.json` — read this first. Kinds, families, the recipe list, every theme and pairing by mood, and the motion tokens. About 39 KB. Each recipe's directions are in its own file (step 2).
2. Then open only what you lock: `library/starts/<id>.json` for the recipe and its directions, `library/themes/<id>.css`, `library/pairings/<id>.css`.
3. `library/pieces.txt` — one line per piece. Search it (grep for a category, platform, or tag). Do not read it top to bottom.
4. `library/briefs/<id>.md` — the spec for one piece. Open only the pieces you will build.
5. `library/icons.json` — Lounge Icons, only when the screen needs icons.
6. [components.md](components.md) — the controls, icons (including what to do when one is missing), the logo and favicon, and which piece to use for which job.
7. [practice.md](practice.md) — the method every build shares. Its first lines say which other file your job adds: [website.md](website.md), [app.md](app.md), [native.md](native.md), or [locale.md](locale.md). Read only those.
8. [brief.md](brief.md) — how to turn their request into the build brief. Every new website or app.
9. [show.md](show.md) — Show mode: the centrepiece, Free colour and type, and the rendering bar. Only when the brief says `Mode: Show`.
10. [flows.md](flows.md) — the app short path, Adopt flow, and Brand flow. Only when What they are asking sends you there.
11. [taste.md](taste.md) — the taste-skill pack folded in: named looks (minimal, brutalist, high-end), page shape, craft details, image-first mockups, and brand boards. You do not need those skills installed separately.
12. [styles.md](styles.md) — the style routing table: every named style, its synonyms, and where it goes. Only when they named a style.

Do not run scripts from this skill. If `library/map.json` is missing, the install is broken. Say so. Do not design from memory.

If the open project is the Design Lounge repo itself (`src/demos` and `src/content/pieces` exist) and the user is editing the library, stop using this skill for that edit. Follow `docs/PIECE-SPEC.md` instead.

## What they are asking

| They want | Do |
| --- | --- |
| *Rows are in order. Use the first row that matches.* | |
| The project already has a design system, DESIGN.md, tokens, or styled screens | Adopt flow |
| A redesign of a site that already exists | Adopt flow, then Redesign (the audit) in [practice.md](practice.md) |
| "Make it look like Stripe" (or Linear, Apple, Notion, any named brand) | Brand flow |
| A style by name (any row in [styles.md](styles.md), including -ism forms and misspellings) | Read [styles.md](styles.md) and set the Named aesthetic line from its row, then keep reading rows for the flow: the next row that matches decides it (Kit flow for a new product, the app short path for an app, Show mode for spectacle) |
| A new product, site, app, or design system | Kit flow |
| Spectacle: an ambition word ("go wild", "Awwwards", "site of the day", "unforgettable", "award-level", "make it an experience"), or a verb that makes the page the experience ("let people play with it", "you scroll and you travel") | Kit flow, then Show mode in [show.md](show.md). Free colour and type, unless they named a theme, colour, or brand. Without one of these, it is Kit mode, even for a show, a launch, or a world you could draw |
| Two looks for one product, or "show me options" built out | Kit flow twice, on two directions that differ in theme, pairing, and hero. When the subject has a world, one is Show mode, Free, and the other is locked to the library |
| A game site, a web game, a lobby, a scoreboard | Kit flow, recipe `game`, then Games and Three.js in [taste.md](taste.md) |
| They name Three.js, a 3D scene, or an orbit, and the job is not a show, a launch, or a venue | Kit flow, recipe `game`, direction Orbit. The Lounge demo is raw WebGL. Build the product in Three.js from the brief. |
| A handwritten or hand-lettered site | Kit flow, recipe `notebook` |
| A brand kit, identity, logo system, or brand board | Kit flow, then Brand board in [taste.md](taste.md) |
| The product people use in a browser, logged in | Kit flow, then the app short path, recipe `web-app`. The public homepage is `saas`, a separate pass |
| Staff admin, ops, a dashboard | Kit flow, then the app short path, recipe `dashboard` |
| A phone app, and they named no world | Kit flow, then the app short path, recipe `mobile-app` |
| A PWA | The recipe for the job (a shop, a news app, a web app), then PWAs in [native.md](native.md). Not automatically `mobile-app` |
| React Native, Expo, Flutter, SwiftUI, or Compose | Kit flow, then the app short path and [native.md](native.md) |
| A desktop app, Electron, Tauri, a Mac window | The app short path. `web-app`, or `dashboard` when it is staff ops. No phone tab bar |
| "Show me first", a concept, or mockup images, and you can make images | Kit flow, then Image first in [taste.md](taste.md) before code |
| One screen, section, or component | Piece flow, inside the locked kit if one exists |
| Only a palette, font, icon, or motion | Library flow |
| "Make it look good" with no kind | Kit flow. Infer the kind, the job, and the register. Say what you assumed. |

If they have not named a stack, use what the project already uses. In an empty folder, follow When to ask, below. The briefs are stack-agnostic. You translate.

## Say the pick, then build

Choose, say it, and build in the same turn. Put this at the top of the reply, using `site` from `library/map.json`:

- Theme: name, one-line mood, `{site}/themes/<id>`. In Free: `Free`, then the colours and the light they come from
- Pairing: name, `{site}/type/<id>`. In Free: `Free`, then the faces and why
- Family: name, and the radius it locks
- Pieces: title and `demo` link for each screen or effect

Write the same links into `DESIGN.md` as Sources, so a later message can say "change the table" and you know which demo it came from.

### When to ask

This is the only rule about asking before a build. Every other file, brief, and template follows it. Asking before you install a tool (Opening the page in [reference.md](reference.md)) is separate.

If they said "just build it", "go", "decide", or "don't ask", never ask. Use the project's stack, or plain HTML + CSS + a little JS in an empty folder. Settle the recipe with When recipes overlap in [practice.md](practice.md). On a redesign, keep the brand. Then build.

Otherwise, ask before building only when one of these is true, all in one message, once, then stop:

- The folder is empty and they named no stack. Ask which stack, and say you will use plain HTML + CSS + a little JS if they have no preference.
- Two recipes are still left after When recipes overlap in [practice.md](practice.md), and they would lock different themes, such as a staff dashboard versus a personal ledger. Ask which one.
- They asked to see options or to choose. Name three palettes and two pairings with links, names and moods only.
- It is a redesign and you cannot tell whether to keep the brand (Adopt flow in [flows.md](flows.md)).
- It is a portfolio and they gave no work (Real content only in [website.md](website.md)).

Everything else, decide and say what you assumed.

If they ask for a change after, edit that one Source line and rebuild that screen on the same sheet. Do not open a second palette.

## A website, the short path

The full method is long. For a website, these are the steps that matter, in order. Open the named section only when you reach its step.

0. Write the brief ([brief.md](brief.md)). Its Ambition and Mode lines decide whether step 3 switches to Show mode, and whether it is Free.
1. Read `~/.design-lounge/history.jsonl` (Recent picks in [practice.md](practice.md)). Then write three words for the subject's world: its materials, tools, and place, not "beginner" or "friendly" (Pick a direction in [practice.md](practice.md), rules 2 to 4).
2. If they named a style, write the Named aesthetic line from [styles.md](styles.md) before you lock. Lock the recipe and the direction whose mood names that world, and that is not in the recent history for this recipe. The name number only breaks a tie. The direction names the hero, the work, and the footer. Use those. Append a claim line to the history now (Recent picks), so an agent running beside you does not take the same direction.
3. Write the Idea and the Signature (Write the idea in [website.md](website.md)). Name the default look you are avoiding, including the studio template. If they asked for spectacle, switch to Show mode in [show.md](show.md) here: the Idea becomes the centrepiece, and the direction's hero, work, and footer become candidates. In Free, its theme and pairing do too: choose colour and type with Free colour and type.
4. Pick about and contact by what content they have (Sections, one by one in [website.md](website.md)). Work and footer stay on the direction. Then the uniqueness check in Recent picks: if two of the hero, the work, and the footer match a recent site of this recipe or its related group, take the next direction. Write the Unlike line on the sheet. Then append the history line, with `work` and `footer` filled in.
5. Open the brief of every piece you build, including the menu and any copy button. Read each down to "Optional below this line".
6. Build with their facts only. The brief's names, prices, and quotes stay in the brief. A sentence that is still true after you swap in another product's name gets rewritten. A button names the action on this screen. Links go where they say. Drawn data says "Example".
7. Screenshot web and phone, then scroll through each effect (Opening the page in [reference.md](reference.md)). Fix what you see. Make one correction.
8. End with the closing block in The reply.

The rules are the floor, not the design. Passing all of them makes a page correct. The Idea and the Signature make it theirs.

## An app, the short path

In [flows.md](flows.md). Open it when the table above sends you there.

## Kit flow

0. Write the brief with [brief.md](brief.md), unless `DESIGN.md` already has one.
1. Pick a kind (`website`, `product`, `platform`, `personal`) with the kind map in [reference.md](reference.md). Then take the matching recipe from `starts` in `library/map.json`, open `library/starts/<id>.json`, and lock one of its `directions` (Pick a direction in [practice.md](practice.md)), after checking Recent picks there. The same sentence from two people must not give the same site, and two subjects in one recipe must not either. Do not lock the first palette, pairing, or family because it is first.
2. For a website, read Stand out in [website.md](website.md) first: name the default look you are avoiding, write the Idea in one picture sentence, show the work as pictures, never invent clients. For an app, read The one screen in [app.md](app.md) and follow An app, the short path.
3. Write the four lines from Decide the screen: who it is for, the one decision, the first thing they see, and the next action.
4. The locked system is `library/themes/<id>.css`, `library/pairings/<id>.css`, and the family's `rules`, `radius`, `button`, and `density`. Match those numbers.
5. If the pairing has a `caution`, say it before you write. Body text uses `--font-text`. Amounts use `.num`. If the pairing has a mono, `.num` and code use it. If `numbers` is `display`, `.num` uses the display face. If the pairing has no mono, `.num` is the text face with even-width digits, code uses the system mono, and you do not add a Google mono font.
6. A theme is one mode, and every theme has a `pair` for the other. A phone app uses both and follows the system setting. A website uses both when they asked for day and night, or when the product is the kind people leave open. The theme CSS includes a sample radius and shadow. Ignore them. The family sets radius and shadow.
7. Build the shell first, then the primary screen, then the rest of Minimum screens in [app.md](app.md). Open each brief before you invent a hero, nav, table, or footer. On a website, the hero, the work, and the footer go through the uniqueness check in Recent picks, and the history line is written after that check, with `work` and `footer` filled in.
8. Open the screens and run Look and One correction in [practice.md](practice.md). Fix every fail.

An internal tool, admin, ops screen, or dashboard is kind `platform`, then the `dashboard` recipe. A chart, a metric, an empty list, and a failed load come from pieces, not a chart library's defaults.

## Adopt flow and Brand flow

In [flows.md](flows.md), with redesigns. Open it when the table above sends you there.

## Piece flow

1. Search `library/pieces.txt` by category, platform, title, styles, and tags, or use the routes in [components.md](components.md). Platforms: `web`, `mobile-web`, `mobile-app`, `pwa`, `tablet`.
2. Read `library/briefs/<id>.md`. The brief is the spec for structure, counts, sizes, motion timing, states, and hit targets. `demo` is the HTML acceptance file, if you need to see the motion.
3. The brief's colours, fonts, and light or dark mode belong to its demo. Translate them by role onto the locked theme and pairing. Follow Adapting a brief in [practice.md](practice.md). A dusk-blue parallax on a light theme becomes a daylight parallax with the same layers and speeds.
4. Hold the result to the brief's acceptance checklist, skipping lines that only hold for the demo's copy. Fix what fails.

No kit locked and no design system in the project: lock a theme and pairing first with Library flow, by mood for this product, and say which. A project's stock Tailwind or framework colours are not a design system; a configured theme, tokens, or styled screens are.

If `pieces.txt` has no piece for that job, say so. Do not invent a slug.

## Library flow

- Theme: pick by mood in `library/map.json`, then copy `library/themes/<id>.css`. It holds primary, secondary, tertiary, success, warning, danger, info, surfaces, and `link`.
- Pairing: pick in `library/map.json`, then copy `library/pairings/<id>.css`.
- Icons: `library/icons.json`. 24px stroke, 1.75. When one is missing, follow Icon and nav in [components.md](components.md).
- Logo, favicon, share image: Logo and favicon in [components.md](components.md).
- Motion: `motion`. Default easing `cubic-bezier(0.2, 0.7, 0.2, 1)`. UI 200ms, layout 320ms, sheets 400ms. Honour `prefers-reduced-motion`.

## When numbers disagree

This order wins, after their own words.

1. An existing design system they asked you to keep.
2. The locked family, for radius, shadow, button style, and density.
3. The locked theme, for every colour. The locked pairing, for fonts. In Free, the colours and faces on the sheet take their place.
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
- No second palette, random Google font, or default Tailwind theme on top. Show mode's scene tokens and its one script face are not a second palette or a random font: they are written on the sheet with a reason. Free colour and type replace the theme and pairing for that site. They are its one palette, written as the theme's roles, with a reason for each.
- If the screen lives inside another platform that has its own official design system, use that system's package for those screens: Polaris inside Shopify admin, `govuk-frontend` for a UK government service, USWDS for a US one, Atlaskit inside Jira or Confluence, Fluent inside Microsoft 365. Use the Lounge only for the parts outside that platform.
- Text people will read on the page has no em dash (—) and no en dash (–). Use a full stop, a comma, a colon, or brackets instead. Ranges use a hyphen: 2018-2026.
- Write the whole file. No `// rest of code`, `// TODO`, or `...` in place of real code. If the reply is too long, stop at the end of a file and say which files are still to come.
- Credit: put `Designed using <a href="https://www.designlounge.live">Design Lounge</a>` once, in the site or app footer or the about screen, in the footer's small text style. Keep the same line as a comment on copied token blocks. Free to use in products. Do not republish the catalogue as a catalogue.

## The reply

Keep it short. The pick with links at the top. Then what you built, anything in Say so in [practice.md](practice.md), and only the checks that failed and how you fixed them. Do not paste a checklist of passes.

End every build reply with this block. It is required even when everything passed, because it proves you looked. Name the actual screenshot files. If you could not open the page, write "not looked" and say why. Never say you looked when you only read the code.

```
Looked at: <screenshot file names, with sizes> with <tool>, or "not looked"
Remember after five seconds: "<one thing>" · could be anyone's: yes | no
Correction: <the one change>
Still open: <missing links, assets, effects you never saw run, parts built without a brief, or none>
```

## Examples

See [examples.md](examples.md). Paths and the kind map: [reference.md](reference.md).

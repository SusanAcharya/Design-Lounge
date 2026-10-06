# Practice

This is how you design with the library. The catalogue is the material. This file is the discipline every build shares. The rest is split by job, so you only read what yours needs:

- A website: this file, then [website.md](website.md). Then Page shape and Craft in [taste.md](taste.md), and Named looks there if they named a style.
- An app, a tool, a dashboard, or a shop: this file, then [app.md](app.md).
- A React Native, Expo, Flutter, SwiftUI, or Compose app, or a PWA: also [native.md](native.md).
- Another language, a currency, a calendar, or a regional look: [locale.md](locale.md) as well.
- One component or section: Adapting a brief, Components, and the brief. Skip the rest.
- A redesign: Redesign below, then the files for its kind.
- A brand kit or logo system: Brand board in [taste.md](taste.md), after the kit is locked.

Their words beat this file. When they ask for something a default here forbids, such as more motion, a second effect, or skipping a step, do what they asked, and write one line in DESIGN.md saying which default you set aside and why.

The aim is one product that feels designed: same palette, type, icons, radius, spacing, motion, and components on every screen. A new screen extends the sheet. It does not start a second system. The page reads as generated when the type, the copy, and the decoration could belong to any product. Look is how you catch that.

## Before code

1. Write the four lines in Decide the screen. If you cannot name the decision, you are not ready to pick a hero. For a website, also read Stand out in [website.md](website.md) and write the Idea. For an app, read The one screen in [app.md](app.md) and write the Idea.
2. Decide new kit or adopt. Adopt when they already have tokens, a DESIGN.md, or styled screens, unless they asked for a new look.
3. Match the world, then choose the pieces. Read Match the world. Search before you invent: settings, billing, search, upload, audit, account menu, inbox, table, dialog, toast, form, select, record, people, detail, chart, line, kpi, empty, error, collection, cart, agent, approval, source, rewrite. On a phone, search for the phone empty and the phone failed load before you reuse the web ones. On a tablet, use the tablet recipe. Do not stretch a phone screen to 1180px. If `pieces.txt` has no piece, say so, and build only from this sheet and from [components.md](components.md). Do not import another library's look.
4. Say the pick with links at the top of your reply, then build. Follow Say the pick in [SKILL.md](SKILL.md). Ask first only when two worlds fit and would lock different themes, or when they asked to choose.
5. When the system is locked, write the sheet below. If the project has no DESIGN.md, add it. If one exists and you are adopting it, do not overwrite it. If one exists from an earlier Lounge pass, update Sources when they change a screen. Do not start a second file.
6. Build the shell first (nav, tab bar, or frame), then the primary screen, then the rest of the minimum set below. A product is not done after the first screen.
7. Open every finished screen and run Look. Fix what fails, and open it again. When the fails are none, run One correction. Then run the finish checklist. In the reply, list only what failed and what you changed, plus the look notes. Do not paste every line that passed. Do not call the UI done from the source.

## System sheet

```
Product:
Who:
Decision:
First thing they see:
Next action:
Job of this pass:
Scope:
Idea: <one picture sentence. A website: the page, from website.md. An app: the one screen the product is, from app.md>
Signature: <the one element made only for this product>
Avoiding: <the default look this could have become>
Register: quiet | <one piece id>
Show: no | yes · centrepiece <piece id or "built for this"> · light <the one light source> · scene <--scene-* tokens and why, or none>
Dials: variance <1-10> · motion <1-10> · density <1-10>
Kind: website | product | platform
Mode: new kit | adopt existing
Recipe: id · Direction: id (their three words and the mood it matched, or the name number if it was a tie)
Theme: id (pair: id or none)
Why this theme:
Rejected:
Pairing: id
Family: id
Icons: Lounge Icons, 24px, stroke 1.75
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: none or <piece id>
Density: air | regular | dense
Shell: none | sidebar 240 open / 64 rail
Panel: none | 300
Nav:
Phone nav: drawer | tabs
Pieces:
Sections: <website only> work <id> · about <id> · contact <id> · footer <id>, each with why it fits the content (and its sum if it was a tie)
Kept from their system:

## Sources
- theme <id> — {site}/themes/<id>
- pairing <id> — {site}/type/<id>
- family <id> — radius
- <piece id> — layout | motion | component — demo url
```

`{site}` is the `site` field in `library/map.json`. One line per piece you actually build. The role is layout, motion, or component: what they should look at if they want to compare. When they ask to change a screen, change that line, then rebuild only that screen.

For a new product, the matching recipe in `starts` names the first pieces, and its chosen direction names the look. Build those before you invent a screen the recipe did not name.

### Dials

Three numbers from 1 to 10 that say how far to push. Set them from their words, then let them pick the pieces.

| They said | Variance | Motion | Density |
| --- | --- | --- | --- |
| Simple, professional, plain, quiet | 4 | 3 | 4 |
| Calm, clean, minimal, editorial, "like Linear" | 5 | 3 | 3 |
| Premium, luxury, "like Apple" | 7 | 6 | 3 |
| Fun, playful, cool, wild, experimental, agency, Awwwards | 9 | 9 | 3 |
| A landing page or portfolio, nothing more | 8 | 7 | 4 |
| A daily tool, admin, dashboard | 3 | 2 | 7 |
| Government, health, money, anything where trust comes first | 3 | 2 | 5 |

- Variance: 1 is centred and even. 10 is off-grid, with sizes that clash on purpose. Above 6, no two sections share a shape.
- Motion: 1 to 3 is Register quiet (Register is in [website.md](website.md)). 4 to 7 is one lead effect, and a form on that page uses `field-label-morph`. 8 to 10 is that lead plus one supporting piece from the list below.
- Density: 1 to 3 is air, 4 to 6 is regular, 7 to 10 is dense. It sets the Density line.

Fun, cool, simple, and professional set this table. They do not pick a direction. Unique, bold, and "make it stand out" are the Signature in [website.md](website.md). They do not raise these numbers.

A dashboard, a clinic, a ledger, or a trust-row product stays on its row. If they also say fun, raise motion by two from that row and stop. Do not give that product the pieces in the motion 8 list.

### Pieces the numbers name

Use one only when a section you are already building has that job. Do not add a section to make room for it. Open its brief.

- Motion 4 to 7, and the page has a form: `field-label-morph`. Motion 1 to 3 keeps a plain field.
- Motion 8 to 10, a grid of work: `grow-grid`.
- Motion 8 to 10, a list of steps, talks, or projects: `stacking-cards-scroll`.
- Motion 8 to 10, a row of cards: `hover-tilt-cards`. A quote: `card-pull-quote`.
- If two of those sections exist, the name number picks which one moves. The other stays still.
- Recipe `dashboard` or `web-app`, a table with checks: `toolbar-selection-swap`. The verbs change with the count. `selection-bar` is the bar whose verbs do not change.
- Recipe `dashboard`, one total split into parts: `chart-share-bar`. A ranking of the same numbers is `chart-rank-spend`. Do not draw a donut.
- Variance 7 or more, and the work is a screen you are reviewing: `shot-callout-pins`. Software shown in a window, on `portfolio-builder`: `mockup-laptop-browser`. Photographs keep the direction's work.
- The product is a conversation with an agent, and the screen already has that job. `prompt-composer` is the ask box with a tone. `prompt-source-model` attaches a source and names the model. `agent-step-trace` is the list of steps you open. `agent-tool-chip` is one tool call or one file edit, as a chip. `agent-approval-card` waits for a yes before the agent continues. `card-confidence-pick` is one suggestion, a confidence, and one other option. `selection-rewrite` is a sentence the person marks and sends back shorter. `cited-answer` is the sourced paragraph. `ai-chat-workspace` is the whole screen. Do not put all of them on one screen.

When they ask for "more" or "calmer", move a dial two steps and rebuild. Do not swap the theme.

### A DESIGN.md other tools can read

Sometimes they want the file to work in Google Stitch, or in another agent that expects the getdesign.md shape. Keep the sheet above at the top. Below it, add these sections, filled from the locked theme, pairing, and family. No new values.

1. Visual Theme & Atmosphere: the mood in two sentences, plus the dials.
2. Color Palette & Roles: each token with a plain name, its hex, and its job.
3. Typography Rules: display, text, and mono faces, the six roles with size and weight, and the fonts not to use.
4. Component Stylings: buttons, cards, inputs, and nav, each with hover, pressed, focus, and disabled.
5. Layout Principles: the column, the page padding, the density scale, and the grid.
6. Depth & Elevation: the family's shadow, or "flat" if it has none.
7. Do's and Don'ts: five of each, taken from Look.
8. Responsive Behavior: the breakpoints, 44px touch targets, and how the nav folds.
9. Agent Prompt Guide: three short prompts that would rebuild a screen in this system.

Use the same sections to read a DESIGN.md they bring. It is their system. Follow Adopt flow.

## Pick a direction

Every recipe has three or more `directions`. Each one is a complete look: theme, pairing, family, hero, and one effect. A public site's direction also names `work` and `footer`. Use those. Do not pick the showcase or the footer again. Two people who type the same sentence must not get the same site. Two different subjects must not get the same site either: guitar lessons and drawing lessons are both "for beginners", and that is why audience words cannot pick the look.

Before you choose, read the history (Recent picks, below). Then choose in this order.

1. They named a theme, a pairing, a colour, or a site they like. Lock the direction closest to it, then swap in what they named.
2. The subject's world. Write the materials of the thing itself: the instrument, the tool, the room, the place, the craft. Guitar: strings, wood, a stage, a setlist. Drawing: paper, a pencil line, a sketchbook. Code: a terminal, short drills. Lock the direction whose `mood` names that world. A clear dark, Nepali, retro, or AI request also counts here.
3. Audience words come last, and never alone: beginner, friendly, simple, fun, modern, clean, for everyone, easy. Almost every brief says them. They break a tie between two directions that both fit the subject. They do not pick a direction by themselves. Fun, cool, simple, and professional set the dials above. "For kids" is the exception: it is a world.
4. Read the person. Most messages carry more than they say: a bio, a tagline, project names, their job, their own site or GitHub, the way they write. Write three words that describe that material, in their words where you can. Compare them with each direction's `mood` and lock the closest. Write it on the sheet. For a twelve-seat momo counter whose owner wrote "we fold every momo in front of you, no freezer": `Direction: garden-supper (their words: small, made in front of you, slow; mood: olive, cream, slow food)`. A designer starts from the person, not from a number.
5. Two or more directions fit equally, or there is truly nothing to read (a bare "make me a portfolio"). Only then use the name number, and only among the directions that fit. Work out the name number: add up the place of each letter of the product or brand name in the alphabet (a = 1, b = 2, … z = 26), ignoring spaces, digits and punctuation. If there is no name, use the first noun in their message. Divide by the number of directions. The remainder picks it, counting the first direction as 0. Write the sum on the sheet, for example `Direction: garden-supper (Tsering = 20+19+5+18+9+14+7 = 92, three directions fit, 92 mod 3 = 2)`. The name number keeps one product consistent and keeps two products apart. It does not know who they are, so it never overrules rules 2 to 4. Counting letters is not enough, because names of the same length would always land together.

Do not take the first direction because it is first. Do not mix two directions. If the hero is unset, use the recipe's first piece. If the effect is null, the register stays quiet.

The direction's effect is a starting point. If the Idea already moves in a way that belongs to the subject (strings that shiver, a canvas that paints itself), that motion is the lead effect. Take the direction's effect only if it does a different job, and never two effects that both animate the hero.

### Recent picks

A person who builds two sites close together should not get the same page twice. The parts people notice are the hero, the work (the projects, the menu, the list), and the footer. On a public site those three are already on the direction. The colours can sit in one family. Those three parts are what make a site look copied.

Keep a short history on their machine.

- Before you lock: read `~/.design-lounge/history.jsonl` if it exists. Use the last 24 lines.
- Same recipe: do not lock a direction, a hero, or an effect that appears in those lines for this recipe. Choose the next direction that fits the subject. Write it on the sheet: `Recent: education/play-lesson used on 4 Oct for First Fret, so not again`.
- Related recipes sit in one group. Compare this direction's hero, `work`, and `footer` with every recent line in this recipe and in the group. One match is fine. Two means it reads as the same site. Take the next direction that fits the subject. That direction brings a different hero, work, and footer. Do not swap the footer by hand.
  - Showing work: portfolio, portfolio-builder, personal-site, agency
  - A place: restaurant, food, hotel, wellness, gym, clinic
  - Selling: marketing-site, saas, landing, commerce, fashion, fintech
  - Culture: editorial, museum, music, event, education
  - A service: professional, nonprofit, real-estate, jobs
  - The tool: web-app, dashboard
- A line with no `work` or `footer` still blocks its hero and its effect. Its work and footer are unknown, so do not treat them as free.
- Repeat a pick only when they asked ("same look as my guitar site"), or when this is a new page of a product already in the history. Then it should match.
- Claim first. Right after you lock the direction, append a line with `"status":"claimed"` and the recipe, direction, theme, pairing, and hero. Then read the file again. If another product claimed the same recipe and direction in the last hour, yours loses: take the next direction that fits and claim that. Agents running at the same time read the same history, and without the claim they all pick the same thing. Treat a claimed line exactly like a finished one.
- After the sections are chosen and the check passes, append the finished line. Create the folder and file if they are missing.

```
{"date":"2026-10-05","product":"Happy Easel","folder":"painting-lesson","recipe":"education","direction":"gallery-class","theme":"marble-hall","pairing":"gallery-wall","hero":"editorial-landing-hero","work":"stacking-cards-scroll","footer":"footer-centered-colophon","effect":"scroll-zoom-portal"}
```

A Free build (Show mode in [website.md](website.md)) writes `"mode":"free"`, `"theme":"free"`, `"pairing":"free"`, the faces in `"fonts"`, and `"colours"` as `[bg, primary]`. The next Free build reads those and does not reuse the display face of the last three, or the same pair:

```
{"date":"2026-10-06","product":"Low Tide","folder":"low-tide","recipe":"event","direction":"deep-field","mode":"free","theme":"free","pairing":"free","fonts":["Bodoni Moda","IBM Plex Mono"],"colours":["#05060b","#ffb04a"],"hero":"scroll-space-voyage","work":"contact-booking-hours","footer":"footer-centered-colophon","effect":null}
```

Write the check on the sheet before you build. One line is enough when nothing is close: `Unlike recent education and culture sites: hero, work, and footer are all different.` When something matches, name it: `Unlike First Fret: hero differs, work differs, footer matches. One match, so it stands.`

There are six footers, so a footer will repeat before the heroes do. A repeated footer is allowed when the hero and the work both differ. If every remaining direction still shares two of the three, use the oldest footer and write `Footer: <id>, the oldest of six, the others are recent.`

If you cannot write to the home folder, say so in the reply, and keep going. Still run the check against the lines you could read.

The direction is the start, not the end. The Idea, the copy, the projects, and the order of the sections still come from this product.

On a website, about and contact are picked next, in Sections, one by one in [website.md](website.md). Work and footer stay on the direction. Then the check above. Then the history line. A web app or a tool has no marketing footer. `work` is the primary surface. `footer` is the account or settings piece, or `none`.

## Match the world

A hundred products look like one product when every pass locks the first palette on the list. The first id is not a default. Do not lock it because it is first.

Choose in this order.

1. They named a theme, a pairing, or a family. Lock what they named. Choose the rest by the rules below.
2. A recipe in `starts` matches the product. The full list is the Kind map in [reference.md](reference.md). Say which recipe, then pick one direction, as Pick a direction says. These are the pairs people mix up. One person's money is `personal`, not `dashboard` and not `bank`. A Nepali finance app is `personal`: Lokta and the Devanagari pairing. A photographer is `portfolio`. A person who ships software is `portfolio-builder`. A menu people visit is `restaurant`. A shop that ships is `food`. A retreat is `wellness`. A clinic people book is `clinic`. The marketing page of a tool is `saas`. The tool they log into is `web-app`. Staff ops is `dashboard`. A shop in a browser is `commerce`. A shop on a phone is `shop-app`. The direction locks the theme, pairing, family, hero, work, footer, and effect. The recipe's `pieces` are still the screens to open.
3. No recipe matches. Stay inside that kind's `palettes`, `pairings`, and `families`. Read `bestFor`, `mood`, and `tags` on each theme. Lock the theme whose `bestFor` names this world. A clinic is Alpine Clinic. A payroll run is Harbour Ledger, because the job is paying people. Fog City is the first palette on kind `product` and is the wrong lock for both.
4. Lock a pairing from that kind's list whose `bestFor` is the same world. Payroll on kind `product` takes Friendly SaaS, which lists fintech. A paper takes Newsroom. A clay shop whose recipe is commerce takes Atelier.
5. Lock the family for how the product is used. Editorial for a page people read. Industrial for a yard or a field tool. Sharp for a dense platform. Quiet for a product that has to last. Soft for a friendly consumer app. Glass only when the direction names it.

Write one sentence: why this theme, and which theme you rejected. "Harbour Ledger, because this is payroll. Fog City is first on the list and is a general app, so it loses." Put both lines on the system sheet.

Two themes can both fit. Pick the closer mood. Name the other one as rejected. Do not offer a menu unless they asked to see options.

A brand colour they already have replaces `--primary` only, after the theme is locked. The surfaces stay the theme's. The brand does not choose a second theme.

The theme file is colour only. The family sets radius and shadow, and the pairing sets the fonts. Harbour Ledger's 2px sample loses to Quiet's 6px.

## Adapting a brief

A brief is a demo plus a structure. When the product is not that demo, split the lines.

- Always: how many of each thing, which role is largest, the states, the hit targets, one primary, one series.
- This demo: a quoted title, a number, a name, a checklist line that only passes on that copy. "First frame reads 186 t" is the demo. "One series, no legend" always applies.

Replace the nouns and the numbers with this product's. Do not fail a checklist line that is only true for the yard. Do not keep the demo's hexes once a theme is locked. A sidebar brief written in dark amber still gives you the rail, and the locked theme gives you the colour.

Briefs are written for their demo's palette and mode. Your theme may be the opposite. Translate by role, not by colour:

- A dark demo on a light theme: the demo's darkest layer becomes `--bg`, the next layer `--surface`, glows become `--primary-soft`, and light text becomes `--ink`. Keep the layering and the contrast, not the darkness.
- A brief's gradient or sky uses the theme's own colours: `--bg` to `--surface-2`, with `--primary` or `--accent` as the one bright stop. A dusk parallax on a light theme becomes a daylight parallax with the same layers and speeds.
- A brief's fonts become the pairing's roles. Display stays display, body stays `--font-text`. Where the brief uses mono for labels or numbers and the pairing has no mono, labels use `--font-text` small caps or tracked caps, numbers use `.num` (the text face with even-width digits), and only code uses the system mono. Do not add a Google mono font.
- Keep from the brief: structure, counts, sizes, motion timing, states, and hit targets.
- Display type is the exception to sizes. A brief's 304px wordmark was fitted to its demo word. Fit yours instead: the real word fills the same width, set with `clamp()` and `vw`, and no letter is clipped. Check the descenders and a lowercase word on the screenshot.
- Read a brief down to "Optional below this line". Below it are the demo's paint and long notes. Open them only for the motion, or when stuck.

When the content does not fit the brief's shape, do not force it. A sticky scroll written for one figure that morphs does not suit three unrelated projects. Either keep the shape by giving every step the same frame (one device frame whose screen changes, so the morph still reads), or go back to the section list and take the next option that fits. Say which you did. A crossfade between unrelated pictures is the brief broken, not translated.

If a brief draws the same solid button twice, keep one. The other is outline or a text link with the same verb.

## What to build

The four lines decide a screen. They do not decide the product. People name a product in a sentence. Read that sentence and write these lines before you lock a theme.

- Type. A portfolio, a shop, a clinic, a payroll tool, a phone app, a product page. Use their nouns. "An app for clinics" is a clinic. "My photography site" is a portfolio.
- What it does. The job, in their words when they gave any. If they only named the type, infer the job and say what you assumed.
- Scope. This pass: one screen, the public site, or the app's minimum set. A refine of a screen that already exists is that screen. It is not a new product and not a reskin.

If two recipes both fit and they would lock different themes, ask once which world it is, then stop. A staff dashboard and a personal ledger are that case. A shop and a portfolio are that case. Do not send a list of questions. Do not invent a research study.

One thing you will not build. Name the screen a template would add, and why it does not serve the job.

The pushback, if there is one. A person tracking their own spending needs a list of transactions before they need a dashboard. Say that, and build the list. Cash and a wallet are different rows, not one "payment" type, when they said they use both. A festival budget is a dated limit, not a second app.

You do not interview their users. You do name the type, the job, and the scope from a thin message. You do cut a screen they did not need, and you do not add a dashboard to look complete. The screens you ship are the minimum set for the job you named.

## Not a copy of the recipe

A recipe locks the system. It does not supply the product. Do not reuse its sample nouns, dates, or amounts unless that is their product. Asar, Bhatbhateni, Bay 14, and the yard are demos.

Two products on the same theme should still differ in the noun, the home screen, and the brand primary if they gave you one. If the interface would still be true after swapping their name for the demo's, you copied the demo. Change the home to the decision they named.

If they asked for loud, playful, or luxury, lock the theme and family whose mood says that. Playroom, Festival, and Atelier Noir exist for that. Do not walk them back to Lokta or Harbour Ledger because those are calmer. The anti-slop checks still hold. Loud is the type and the theme, not a glow you invented.

## Decide the screen

Write these four lines into the system sheet before you choose a layout. They are the brief. The pixels come after.

- Who opens this, and what they already know.
- The decision this screen exists for. One decision.
- The first thing they see: the answer to that decision, in one phrase.
- The next action, in one verb.

A region that does not serve one of those four lines does not go on this screen. A metric nobody acts on does not go on this screen. A second chart series, a second primary button, and a second navigation do not go on this screen.

Reading order on the view, and only this order:

1. Where they are. A label or a title. Not both at display size.
2. The answer. This is the largest type on the view. One display size per view, unless you wrote a break in Break one rule in [app.md](app.md).
3. The next action. One primary button.
4. The evidence. The list, the chart, or the facts that justify the answer.
5. Chrome. Nav, filters, account. Quiet, and smaller than the answer.

Size is the hierarchy. Colour is not a second hierarchy. The accent is for the action and for live state, not for making a second thing look important.

Group facts that are decided together. One title per group. Space between groups is the density stack gap. Space inside a group is half of that. Do not invent a third gap on the same screen.

A list has four states. Ship the one this pass needs, from a piece when `pieces.txt` has it.

| State | Meaning | What you build |
| --- | --- | --- |
| Loading | The rows have not arrived | A skeleton that matches the row, or the loader piece you named |
| Empty | Zero rows | A heading, one sentence, one primary button |
| Failed | The load did not arrive | A danger banner and retry. Not a toast |
| Populated | The rows are here | The list |

Empty and failed are different. Do not put both in one card.

On a phone, the answer stays the largest type. The primary button is at least 44px tall and sits with the answer, or in the bottom bar the piece specifies. Clear the top with `max(54px, env(safe-area-inset-top))` and the bottom with `max(34px, env(safe-area-inset-bottom))`. The inset is 0 on a desktop browser, so 54 and 34 are the minimum, not a fallback inside `env()`. Do not draw a status bar. A header and a tab bar on the same phone screen is two navigation systems.

When they describe a whole product, build the minimum set, then stop. An internal tool does not get a marketing hero. A marketing site does not get an ops table unless they asked for one.

## Spacing

Base unit 4px. Use the locked family's density. Do not invent a third gap on the same screen.

| Density | Page padding | Stack gap | Card padding | Control height, web / phone |
| --- | --- | --- | --- | --- |
| air | 28–40 | 24 | 20 | 44 / 48 |
| regular | 20–32 | 16 | 16 | 40 / 44 |
| dense | 16–24 | 12 | 12 | 36 / 44 |

Phone margin 20. With no sidebar and no panel, the web frame is 1120px. With the shell in Layout, the viewport is 1280px and the frame is whatever main has left. The column inside that frame is one width for every screen of this pass. Default 720px. Write it on the system sheet before the first screen. On a website, that column is for paragraphs only. The hero, the work, and the bands use the full frame, as Stand out says. A brief that says 640, 720, or 880 does not get its own column. Reading measure stays 58–66ch inside that column. The column does not grow when the rail closes, and it does not shrink to a new number because a panel appeared. The panel has its own width.

## Type

One display face, one text face, one mono for numbers and code. No fourth family.

| Role | Use |
| --- | --- |
| display | one headline per view |
| title | section titles |
| body | prose, 16px web / 17px phone, line-height 1.5 |
| label | 11–12px with tracking, never a sentence |
| caption | secondary, `--ink-2` |
| num | the pairing's number face, tabular. `--font-mono`, or `--font-display` when `numbers` is `display` |

Body stays on `--font-text`. Do not set a paragraph in the display face. Do not set body in mono unless that pairing's `caution` says the body is mono on purpose.

## Layout

One primary action per view. Secondary and tertiary follow the family.

Write the shell on the system sheet before the first screen. Every screen in the pass uses that shell. A screen with its own sidebar width, or a screen that drops the sidebar the others have, fails the Match.

Web screens share the content column from Spacing, and the same page padding. That column sits inside main. Default 720px. Reading measure stays 58–66ch. A grid inside the column is the piece's structure. It is not a different page width. Phone content is one column, the full width of the frame, with the same padding. The primary action sits in the thumb zone or in the sticky bar the piece specifies.

Left nav, when the product has one, is `collapsing-sidebar-rail`. Open is 240px, labels visible. Rail is 64px, icons only, labels become tooltips. Main is `flex: 1` and `min-width: 0`. Closing the rail gives those pixels to main. It does not change the content column, the page padding, the control height, or the type. Do not animate a margin on main. Do not let the reading measure grow because the rail closed. The extra space stays in main, outside the column.

A right panel, when a record needs one, is the panel on `record-detail-header`. It is 300px beside the content, from 768px up. Below 768 it stacks under the content, full width, with a top border instead of a side border. The panel repeats the same verb as outline. It does not get its own primary, its own padding, or a width that changes per screen. A list screen does not grow a panel to match the record. If this pass has no record panel, write `none`. Do not add one to balance the sidebar.

Below 768 the rail does not exist. The same nav becomes a drawer at the open width, 240px, over a scrim. Same items, same order, same current item.

On a phone those sections become `phone-tab-plain`, or `ios-glass-tab-bar` when the family is glass. Three to five tabs, one per real section. Items that do not fit stay in the drawer, under the same labels. Do not rename them. Do not put a header and a tab bar on the same phone screen. That is two navigation systems.

A tablet product uses `tablet-sidebar-overlay-pin`, not the 240/64 rail. Pinned: the content reflows by the sidebar width, 280px. Overlay: a scrim, and the content does not reflow. One sidebar. Do not put the web rail and the tablet pin on the same product.

Nav labels are one list, written on the sheet. Desktop, the drawer, and the phone are three presentations of that list. The current item is the same destination on each.

The header, the button, the filter, and the text field look the same on every screen of this pass. A brief that draws a pill filter loses to the family, unless that family's button is already a pill. Control height and radius come from the family, on every screen.

## Brand

If they already have a brand colour, the theme still supplies surfaces, ink, lines, and feedback. Their brand becomes `--primary` only. `--primary-ink` is `#141210` or `#fffdf8`, whichever reaches contrast 4.5 against that brand. `--link` is the brand walked darker on a light background, or lighter on a dark one, until it reaches 4.5 against `--bg`. Secondary and tertiary stay the theme's, unless they named those too.

On a dark theme, a brand red can disappear into `--bg` even when the label on the button passes. If the fill contrasts under 3 with `--bg`, walk it lighter until the button separates from the page, then choose `--primary-ink` again at 4.5 against that adjusted fill. Do not put the raw brand red down as text on a dark surface. Text uses `--link`.

## Components

Read [components.md](components.md) and use it for every control. Icons are Lounge Icons only. One size, one stroke. Do not mix in another set.

Buttons take their shape from the family: solid, outline, or soft. One height per platform.

Inputs match that height and radius. Label above the field. Error under it, in `--danger`.

Empty, loading, and error ship with the screen. A list without an empty state is unfinished.

Feedback colours are for live state only.

## Look

You can see the finished screen. Open it. A browser at the frame size, or a screenshot of that frame. Web is 1280×800. Phone is 390×844. Tablet is 1180×820. Read the page. A screenshot alone can hide a gap. The commands are in Opening the page in [reference.md](reference.md): `playwright-cli` opens the file, resizes it, takes the screenshots, turns on reduced motion, and reads the console.

If the browser cannot paint, cannot animate, or the screenshot repeats content, measure the DOM instead and write the same block with "measured". Check: no horizontal overflow (`scrollWidth` no greater than `clientWidth`), one primary button, that button at least 44px on a phone and 36px on the web, one element at display size, the currency word and the digits sharing one computed `font-family`, and, when the sheet names them, the sidebar width, the panel width, and the content column. Measure the column once with the rail open and once with it closed. If you cannot open it and cannot measure it, say so. The UI is not done.

A screen that passes alone can still fail the pass. After the last screen, measure the set against each other and write this before you call it done. An agent that cannot see the page still runs this. The numbers are the check.

```
Match
Column: <px> on every screen, or <screen> is <px>
Column when the rail is closed: <same px, or the fail>
Page padding: <px>
Control height / radius: <px> / <px>
Amount face: <family>
Shell: sidebar <open>/<rail>, or none
Panel: <px>, or none
Nav: <labels in order>
Phone nav: drawer | tabs · same labels
Fails: <what differs, or none>
```

Column width, page padding, control height, radius, and the amount's computed font are one value across the pass. The sidebar's open width, its rail width, and the panel width are one value too. A mismatch is a fail. Change the outlier to the sheet. Do not keep a brief's 640 beside another's 720. Do not keep a 240 sidebar on one screen and a 280 sidebar on the next. Closing the rail must leave the content column at the same width. A phone nav that renames or reorders the desktop items is a fail.

For each screen, ask four things before you call it done. Is the largest type the answer named in the four lines? Where does the one primary sit? Does any copy still work if you swap in another product's name? On a website, what do you remember after five seconds, and could it be anyone's site? The answers go in the closing block in The reply in [SKILL.md](SKILL.md), not in a second block.

Fix every fail. Open the screen again. A fail that is still visible means the pass is open.

These are fails. They are the tells of a page that was generated and not designed.

- A gradient, a glow, or a mesh you added. The locked effect piece and a Show mode centrepiece may use them. Every other region stays the theme's flat `--bg`.
- Glass, blur, or a floating card on every region.
- Gradient text, except the one word that changes voice in Show mode. A second accent used as decoration. The accent is the action and the live state.
- In Show mode: a centrepiece drawn in flat fills, with no light source, no depth, and nothing you can do to it. That is a diagram, not a scene. Hold it to The rendering bar in [website.md](website.md).
- An emoji used as an icon. Icons are Lounge Icons.
- A radius that is not the family's. Every corner on a large radius when the family is sharp, editorial, or industrial.
- Three identical cards — icon, title, one sentence — standing in for the product. A feature row is allowed when a named piece is that row and the copy is about this product.
- A headline that could sit on any company. Welcome. Unlock. Elevate. The future of. Next-generation. Your all-in-one. All-in-one platform. Use this product's noun and a number you were given.
- A face that is not the locked pairing. Inter, Roboto, or Arial are a fail only when that pairing names a different family. If the pairing's text face is Inter, Inter is correct.
- Body text in the display face. A fourth family.
- A shadow on a family whose shadow is `none`.
- A button labelled Get started, Submit, Click here, or Learn more, when the screen has a real verb. "Open the week", "Add to bag", "Confirm load".
- Placeholder copy. Lorem. Feature one. Your text here. John Doe. Acme. A price of $99 with no product attached.
- Motion that loops because the page felt empty. `ease` or `linear` on a UI move. The curve is the sheet's, or the piece's.
- Two navigation systems. A sidebar, a panel, or a nav list that differs from the sheet. The content column wider because the rail closed. A chart painted in a library's default colours.
- On a website: one of the default looks in Stand out in [website.md](website.md). A first screen with type and no picture of the work. A portfolio whose work is a text list. A site where half the text is small grey labels. A page you cannot remember after five seconds.
- An invented client, employer, project, number, or quote.
- An em dash or en dash in text people read. A version label in the hero, such as BETA or v2.0, when this is not a launch. Numbered eyebrows like `001 · Work` or `01 / 04`.
- Dots between every word in a strip (`a · b · c · d`). One per line at most. A coloured dot before every nav item or row, when it is not a live status.
- A "Scroll" cue or an animated mouse. A strip of words along the bottom of the hero, such as `DESIGN / BUILD / SHIP`. A city, clock, or weather strip, unless the place matters to the product.
- A tag laid over a photo. A made-up photo credit. Poetic labels such as "Field notes", "From the bench", or "Quietly trusted by" where a plain label works.
- "Step 1, Step 2, Step 3" as the labels. The step's own verb is the label: Install, Connect, Ship.
- Numbers that look made up: 99.99%, 10x, 50%, $1,000,000. Real numbers are uneven: 47.2%, 1,284. Brand names that sound made up: Nexus, Acme, SmartFlow, Cloudly. Copy words that mean nothing: elevate, seamless, unleash, supercharge, next-gen.
- On a phone, a pinned panel or sticky block that covers more than a third of the screen. Unpin it below 720px and let it scroll with its section.
- Pure `#000` black. A custom cursor on a daily tool. A grey box standing in for the product. Draw the product as a small working screen, as Show the work in [website.md](website.md) says, or leave it out.

A piece you locked may use one of these when it is the piece's whole point: a clock footer may show the clock. Decoration a brief adds around its point is not that. A scroll cue, a numbered eyebrow, a version tag, or extra small labels in a brief are dropped, like anything you would have added yourself.

Uniform means the column, the page padding, the button, the filter, the field, the radius, the type roles, the sidebar, the panel, and the nav labels match on every screen of this pass, and on the phone form of that nav. Screen two inventing its own card, its own width, or its own rail is a fail.

Read one sentence from the screen. If it is still true after you replace the product name with another, rewrite it.

## One correction

The look checks can pass while the screen is still wrong. After the fails are none, open the screen once more. Name the worst of these, and change only that.

- Too plain. Usually the worst on a website. Nothing on the first screen would make someone stop. Make the picture of the work larger, put `--primary` on one big surface, or cut two small regions so the big one can grow.
- Too loud. The answer is the largest type and it still shouts over the evidence. Cut a word, or drop the headline one step. Do not shrink the answer below the evidence.
- Too even. Two regions are the same size, so nothing is the answer. Make the answer one step larger. Make the other a title or a caption.
- Too dense. Someone who sits here all day cannot find the next action. Move to the next density's stack gap, or remove one group. Do not add a card to create air.
- Too much chrome. Nav, filters, or badges compete with the answer. Quiet one of them. Do not add a region.
- The wrong noun. A label says Items, Users, or Data when they named the thing. Use their noun.

Write this, then open that screen again.

```
Correction: <too plain | too loud | too even | too dense | too much chrome | the wrong noun>
Changed: <the one change>
Left alone: the theme, the pairing, the family, and the other screens
```

If the correction makes a look check fail, undo it. A second correction waits until they ask. One change is the pass. Five changes is a new design.

## Redesign

Getting the kind of redesign wrong is the most common way a redesign goes bad. Decide it first.

- Keep the brand: make it better without losing who they are. Their colours, type, and logo stay.
- Start the look again: a new theme over the same content and pages. Treat the look as a new kit. The content and the page list stay.
- If you can't tell, ask once: "Keep the current brand, or start the look again?"

Before you change anything, open the site and write this:

```
Redesign: keep the brand | start the look again
Brand: <primary colour, fonts, radius, how the logo is used>
Pages and nav: <the page list and nav labels, in order>
Keep: <what works, such as a known hero, a signature interaction, the voice>
Drop: <the Look fails it has now, broken layouts, filler sections>
Dials now: variance <n> · motion <n> · density <n>
```

To keep the brand, fix things in this order, and stop once it works: type first, then spacing, then colour (calm the neutrals and keep the brand colour), then motion, then the hero and one key section. Replace a whole section only if it can't be saved.

Never change these without asking: the URLs, the nav labels, the form field names and their order, the logo, and the legal or cookie text. Keep the alt text, the focus styles, and keyboard use at least as good as before.

## Stack

Put the theme's CSS variables on `:root` once, or in one theme provider. Controls live in one place and read those variables. Screens import the controls. Do not restyle a button inside a screen. In Tailwind, the tokens are the theme extension. A hex in a class is a fail. In React, the same. The briefs stay stack-agnostic. You translate them once.

## Finish checklist

Look and One correction already checked the screen. These are the things they do not cover.

- One theme (or a theme plus its `pair`), one pairing, one family, Lounge Icons. Nothing on top.
- A website has a wordmark and these files: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` (180 × 180), and a share image at exactly 1200 × 630. Read the size from the file.
- Every link label matches where it goes. Missing URLs are in the reply.
- Empty, error, and loading exist where the screen can be empty or fail. The next action opens a screen in this pass, or you said it is still open.
- Nothing scrolls sideways at 390px, the console has no errors, and the reduced-motion frame is complete.
- DESIGN.md has the sheet, the four lines, and Sources with a demo link per piece. The reply has the same links.
- The credit line is in the footer and on the token block.
- Website: Idea, Signature, Avoiding, and Sections are on the sheet.

## Say so

Say it in the reply when any of these are true.

- The library has no piece for this interaction. You built from the sheet only.
- The theme has no dark or light pair.
- The pairing has a caution.
- You locked the first palette because it was first. Choose again with Match the world.
- You could not open the built screen. The UI is not done.
- A look check failed and the fail is still on the screen.
- The person using the product disagrees with your look notes. Change the screen they named. Do not skip the look on the next pass.

# Practice

This is how you design with the library. Read it before you write UI. The catalogue is the material. This file is the discipline.

The aim is one product that feels designed: same palette, type, icons, radius, spacing, motion, and components on every screen. A new screen extends the sheet. It does not start a second system. An agent without this skill can still ship a page. The page reads as generated when the type, the copy, and the decoration could belong to any product. Look is how you catch that.

## Before code

1. Write the four lines in Decide the screen. If you cannot name the decision, you are not ready to pick a hero.
2. Decide new kit or adopt. Adopt when they already have tokens, a DESIGN.md, or styled screens, unless they asked for a new look.
3. Match the world, then choose the pieces. Read Match the world. Search before you invent: settings, billing, search, upload, audit, account menu, inbox, table, dialog, toast, form, select, record, people, detail, chart, line, kpi, empty, error, collection, cart. On a phone, search for the phone empty and the phone failed load before you reuse the web ones. On a tablet, use the tablet recipe. Do not stretch a phone screen to 1180px. If the index has no piece, say so, and build only from this sheet and from [components.md](components.md). Do not import another library's look.
4. Show that pick with links, and ask once, before any UI. Follow Show the pick in [SKILL.md](SKILL.md). Stop unless they already said just go, you pick, build it, or don't ask, or they already named the system.
5. When the system is locked, write the sheet below. If the project has no DESIGN.md, add it. If one exists and you are adopting it, do not overwrite it. If one exists from an earlier Lounge pass, update Sources when they change a screen. Do not start a second file.
6. Build the shell first (nav, tab bar, or frame), then the primary screen, then the rest of the minimum set below. A product is not done after the first screen.
7. Open every finished screen and run Look. Fix what fails, and open it again. When the fails are none, run One correction. Then run the finish checklist. Report each line as pass or fail. Do not call the UI done from the source.

## System sheet

```
Product:
Who:
Decision:
First thing they see:
Next action:
Job of this pass:
Kind: website | product | platform
Mode: new kit | adopt existing
Theme: id (pair: id or none)
Why this theme:
Rejected:
Pairing: id
Family: id
Icons: Lounge Icons, 24px, stroke 1.75
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms
Density: air | regular | dense
Pieces:
Kept from their system:

## Sources
- theme <id> — {site}/themes/<id>
- pairing <id> — {site}/type/<id>
- family <id> — radius
- <piece id> — layout | motion | component — demo url
```

`{site}` is the `site` field in `library/index.json`. One line per piece you actually build. The role is layout, motion, or component: what they should look at if they want to compare. When they ask to change a screen, change that line, then rebuild only that screen.

For a new product, the matching recipe in `starts` names the theme and the first pieces. Build those before you invent a screen the recipe did not name.

## Match the world

A hundred products look like one product when every pass locks the first palette on the list. The first id is not a default. Do not lock it because it is first.

Choose in this order.

1. They named a theme, a pairing, or a family. Lock what they named. Choose the rest by the rules below.
2. A recipe in `starts` matches the product. A yard desk is `dashboard`. A clay shop is `commerce`. A magazine is `editorial`. A phone app is `mobile-app`. A tablet is `tablet`. A portfolio is `portfolio`. One person's money, health, or home is `personal`, not `dashboard`. A Nepali finance app is `personal`: Lokta and the Devanagari pairing. Lock that recipe's theme, pairing, and pieces. Say which recipe.
3. No recipe matches. Stay inside that kind's `palettes`, `pairings`, and `families`. Read `bestFor`, `mood`, and `tags` on each theme. Lock the theme whose `bestFor` names this world. A clinic is Alpine Clinic. A payroll run is Harbour Ledger, because the job is paying people. Fog City is the first palette on kind `product` and is the wrong lock for both.
4. Lock a pairing from that kind's list whose `bestFor` is the same world. Payroll on kind `product` takes Friendly SaaS, which lists fintech. A paper takes Newsroom. A clay shop whose recipe is commerce takes Atelier.
5. Lock the family for how the product is used. Editorial for a page people read. Industrial for a yard or a field tool. Sharp for a dense platform. Quiet for a product that has to last. Soft for a friendly consumer app. Glass only when the recipe is the glass phone language.

Write one sentence: why this theme, and which theme you rejected. "Harbour Ledger, because this is payroll. Fog City is first on the list and is a general app, so it loses." Put both lines on the system sheet.

Two themes can both fit. Pick the closer mood. Name the other one as rejected. Do not offer a menu unless they asked to see options.

A brand colour they already have replaces `--primary` only, after the theme is locked. The surfaces stay the theme's. The brand does not choose a second theme.

The theme CSS includes a sample `--radius` and `--shadow`. Ignore them. Family sets radius and shadow. Theme sets colour only. Harbour Ledger's 2px sample loses to Quiet's 6px.

## Adapting a brief

A brief is a demo plus a structure. When the product is not that demo, split the lines.

- Always: how many of each thing, which role is largest, the states, the hit targets, one primary, one series.
- This demo: a quoted title, a number, a name, a checklist line that only passes on that copy. "First frame reads 186 t" is the demo. "One series, no legend" always applies.

Replace the nouns and the numbers with this product's. Do not fail a checklist line that is only true for the yard. Do not keep the demo's hexes once a theme is locked. A sidebar brief written in dark amber still gives you the rail, and the locked theme gives you the colour.

If a brief draws the same solid button twice, keep one. The other is outline or a text link with the same verb.

## Locale

Read this before you set a number or a date. The pairing `devanagari` is the Nepali face: Noto Serif Devanagari for headings and amounts, Mukta for the interface, IBM Plex Mono for Latin codes only.

- An amount is one string in one family. If it contains रु, रू, ₹, or Devanagari digits, the whole string uses a face that contains every glyph. Do not leave the currency word in a fallback next to mono digits.
- Nepal and India group digits by lakh and crore. The last three, then pairs: 1,24,000 and 18,42,000. Not 124,000. Not 1,842,000. Under 1,000, write 900.
- Pick one currency and keep it. Nepal is रु or Rs. India is ₹. Do not mix them in one product.
- If the product uses Bikram Sambat, label the first date on the screen with BS. Use one system, either 17 Aswin 2083 or २०८३ असोज १७. Do not invent a converter, and do not mix Devanagari digits with Western digits in the same number.
- Devanagari body may be 17px where Latin is 16px. Do not shrink it to fit.
- For Arabic, Hebrew, or Urdu, set `dir="rtl"` on the document. Mirror the shell with logical properties (`padding-inline`, sidebar on the right). Keep numbers LTR with `unicode-bidi: isolate`. Do not mirror an icon that depicts a real object. There is no RTL theme. The locked theme still applies.

A big amount in mono at 56px or larger gets `letter-spacing: -0.03em` or 0, and `font-variant-numeric: tabular-nums`. The default mono spacing looks gappy at display size.

## Identity

Restraint is the default. A regional or brand identity is still allowed, in three places, and nowhere else.

1. The locked theme. A Nepali product uses Lokta: lokta paper, crimson primary, navy ink. Lokta Night is the dark pair. Do not stay on Harbour Ledger and then ask why it looks like a Western fintech app.
2. One texture, on one region. The page background, or a single band. A lokta grain is a low-contrast dot at under 8% opacity. Not on cards, not under type, not tiled across every row.
3. The display face from the pairing. For Nepal that is Noto Serif Devanagari, including on the amount.

Crimson is `--primary`, not a second accent beside the theme's brass. A festival does not get a second decorative colour. No gradient, no glow, no emoji, no pattern on every card. If they asked for Nepali and you only put it in the nouns, the look failed. Say so, and move the identity into those three places.

For a revamp, name three visual problems. Fix those inside the adopted system. Do not reskin the whole product unless they asked.

## What to build

The four lines decide a screen. They do not decide the product. Before them, write three lines on the system sheet.

- The job they already do without this product, in their words. If they did not say, ask once, then stop. Do not invent a research study.
- One thing you will not build. Name the screen a template would add, and why it does not serve the job.
- The pushback, if there is one. A person tracking their own spending needs a list of transactions before they need a dashboard. Say that, and build the list. Cash and a wallet are different rows, not one "payment" type, when they said they use both. A festival budget is a dated limit, not a second app.

You do not interview their users. You do cut a screen they did not need, and you do not add a dashboard to look complete. The screens you ship are the minimum set for the job they named.

## Not a copy of the recipe

A recipe locks the system. It does not supply the product. Do not reuse its sample nouns, dates, or amounts unless that is their product. Asar, Bhatbhateni, Bay 14, and the yard are demos.

Two products on the same theme should still differ in the noun, the home screen, and the brand primary if they gave you one. If the interface would still be true after swapping their name for the demo's, you copied the demo. Change the home to the decision they named.

If they asked for loud, playful, or luxury, lock the theme and family whose mood says that. Playroom, Festival, and Atelier Noir exist for that. Do not walk them back to Lokta or Harbour Ledger because those are calmer. The anti-slop checks still hold. Loud is the type and the theme, not a glow.

## Break one rule

One display size, one primary, and the sample tab count are defaults. A designer breaks one when the content cannot be said otherwise. You may break one per screen. Write it on the sheet, or you did not break it.

- One display size. Break it only when two numbers are both the decision, such as money in and money out. The second is one step smaller, not equal. A third display size is not allowed.
- One primary. Break it only inside a confirm dialog, where the destructive action and the cancel are both required. The page behind keeps one.
- Tab count. `phone-tab-plain` shows four tabs because that demo has four sections. A product uses three to five, one per real section. Do not add a tab to match the demo, and do not drop a section they named to stay at four.

Do not break a rule to fill empty space, to look more designed, or because another app had it. If you cannot name the content that required the break, keep the default.

## Decide the screen

Write these four lines into the system sheet before you choose a layout. They are the brief. The pixels come after.

- Who opens this, and what they already know.
- The decision this screen exists for. One decision.
- The first thing they see: the answer to that decision, in one phrase.
- The next action, in one verb.

A region that does not serve one of those four lines does not go on this screen. A metric nobody acts on does not go on this screen. A second chart series, a second primary button, and a second navigation do not go on this screen.

Reading order on the view, and only this order:

1. Where they are. A label or a title. Not both at display size.
2. The answer. This is the largest type on the view. One display size per view, unless you wrote a break in Break one rule.
3. The next action. One primary button.
4. The evidence. The list, the chart, or the facts that justify the answer.
5. Chrome. Nav, filters, account. Quiet, and smaller than the answer.

Size is the hierarchy. Colour is not a second hierarchy. The accent is for the action and for live state, not for making a second thing look important.

Group facts that are decided together. One title per group. Space between groups is the density stack gap. Space inside a group is half of that. Do not invent a third gap on the same screen.

A list has four states. Ship the one this pass needs, from a piece when the index has it.

| State | Meaning | What you build |
| --- | --- | --- |
| Loading | The rows have not arrived | A skeleton that matches the row, or the loader piece you named |
| Empty | Zero rows | A heading, one sentence, one primary button |
| Failed | The load did not arrive | A danger banner and retry. Not a toast |
| Populated | The rows are here | The list |

Empty and failed are different. Do not put both in one card.

On a phone, the answer stays the largest type. The primary button is at least 44px tall and sits with the answer, or in the bottom bar the piece specifies. A header and a tab bar on the same phone screen is two navigation systems.

When they describe a whole product, build the minimum set, then stop. An internal tool does not get a marketing hero. A marketing site does not get an ops table unless they asked for one.

## After the action

The next action lands on a named screen. Write that name in the system sheet before you draw the button.

- A list opens the detail you already named.
- A form stays on the form until the fields are valid. Then it confirms on that screen, or opens the next named screen. A field error sits under the field. It is not a toast.
- A shop is four screens, in this order: collection, one product, cart, checkout. Do not invent a fifth. The collection's action opens the product. The product's action opens the cart. The cart's action opens checkout.
- A tablet is the tablet recipe: a split or a sidebar, one primary pane, one detail. A phone list stretched wide is the wrong piece.
- The confirmation says what changed, in one sentence, and offers one next action. It keeps the same theme, pairing, and family.
- If the action can fail, use the failed-load piece or the field error. A toast that disappears is not the failure.

## Spacing

Base unit 4px. Use the locked family's density. Do not invent a third gap on the same screen.

| Density | Page padding | Stack gap | Card padding | Control height, web / phone |
| --- | --- | --- | --- | --- |
| air | 28–40 | 24 | 20 | 44 / 48 |
| regular | 20–32 | 16 | 16 | 40 / 44 |
| dense | 16–24 | 12 | 12 | 36 / 44 |

Phone margin 20. Web content width 1120 unless a piece brief sets a stage. Reading measure 58–66ch.

## Type

One display face, one text face, one mono for numbers and code. No fourth family.

| Role | Use |
| --- | --- |
| display | one headline per view |
| title | section titles |
| body | prose, 16px web / 17px phone, line-height 1.5 |
| label | 11–12px with tracking, never a sentence |
| caption | secondary, `--ink-2` |
| num | `--font-mono`, tabular numbers |

Body stays on `--font-text`. Do not set a paragraph in the display face. Do not set body in mono unless that pairing's `caution` says the body is mono on purpose.

## Layout

One primary action per view. Secondary and tertiary follow the family.

Web is a 12-column grid with a 16px gutter, or the grid in the piece brief. Phone is one column. The primary action sits in the thumb zone or in the sticky bar the piece specifies.

One navigation system. A header and a tab bar on the same phone screen is two systems.

The header, the button, and the text field look the same on every screen of this pass.

## Brand

If they already have a brand colour, the theme still supplies surfaces, ink, lines, and feedback. Their brand becomes `--primary` only. `--primary-ink` is `#141210` or `#fffdf8`, whichever reaches contrast 4.5 against that brand. `--link` is the brand walked darker on a light background, or lighter on a dark one, until it reaches 4.5 against `--bg`. Secondary and tertiary stay the theme's, unless they named those too.

## Components

Read [components.md](components.md) and use it for every control. Icons are Lounge Icons only. One size, one stroke. Do not mix in another set.

Buttons take their shape from the family: solid, outline, or soft. One height per platform.

Inputs match that height and radius. Label above the field. Error under it, in `--danger`.

Empty, loading, and error ship with the screen. A list without an empty state is unfinished.

Feedback colours are for live state only.

## Look

You can see the finished screen. Open it. A browser at the frame size, or a screenshot of that frame. Web is 1280×800. Phone is 390×844. Tablet is 1180×820. Read the page. A screenshot alone can hide a gap.

If the browser cannot paint, cannot animate, or the screenshot repeats content, measure the DOM instead and write the same block with "measured". Check: no horizontal overflow (`scrollWidth` no greater than `clientWidth`), one primary button, that button at least 44px on a phone and 36px on the web, one element at display size, and the currency word and the digits sharing one computed `font-family`. If you cannot open it and cannot measure it, say so. The UI is not done.

For each screen, write this in the reply before you call the pass done:

```
Looked at: <screen> at <width>×<height>
Largest type: "<the words>" — the answer named above, or not
Primary: "<label>" sits <where>
Copy that still works if you swap the product name: "<quote>" or none
Fails: <the checks below that failed, or none>
```

Fix every fail. Open the screen again. A fail that is still visible means the pass is open.

These are fails. They are the tells of a page that was generated and not designed.

- A gradient, a glow, or a mesh behind the content. The background is the theme's flat `--bg`.
- Glass, blur, or a floating card on every region.
- Gradient text. A second accent used as decoration. The accent is the action and the live state.
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
- Two navigation systems. A chart painted in a library's default colours.

Uniform means the button, the field, the radius, and the type roles match on every screen of this pass. Screen two inventing its own card is a fail.

Read one sentence from the screen. If it is still true after you replace the product name with another, rewrite it.

## One correction

The look checks can pass while the screen is still wrong. After the fails are none, open the screen once more. Name the worst of these, and change only that.

- Too loud. The answer is the largest type and it still shouts over the evidence. Cut a word, or drop the headline one step. Do not shrink the answer below the evidence.
- Too even. Two regions are the same size, so nothing is the answer. Make the answer one step larger. Make the other a title or a caption.
- Too dense. Someone who sits here all day cannot find the next action. Move to the next density's stack gap, or remove one group. Do not add a card to create air.
- Too much chrome. Nav, filters, or badges compete with the answer. Quiet one of them. Do not add a region.
- The wrong noun. A label says Items, Users, or Data when they named the thing. Use their noun.

Write this, then open that screen again.

```
Correction: <too loud | too even | too dense | too much chrome | the wrong noun>
Changed: <the one change>
Left alone: the theme, the pairing, the family, and the other screens
```

If the correction makes a look check fail, undo it. A second correction waits until they ask. One change is the pass. Five changes is a new design.

## Stack

Put the theme's CSS variables on `:root` once, or in one theme provider. Controls live in one place and read those variables. Screens import the controls. Do not restyle a button inside a screen. In Tailwind, the tokens are the theme extension. A hex in a class is a fail. In React, the same. The briefs stay stack-agnostic. You translate them once.

## Finish checklist

- One theme, or a theme plus its `pair`. No third palette.
- One pairing. Display, body, and mono match the sheet.
- One family. Radius, shadow, button, and density match on every new screen.
- Icons are Lounge Icons.
- One primary button on each view.
- Hover and selected use the token map in SKILL.md, not a hex from a brief.
- Spacing uses the density scale.
- Type uses the six roles. No extra font.
- Motion uses the sheet, or the piece's motion table, and reduced motion is handled.
- The piece's structure and hit targets survived.
- Empty, error, and loading exist where the screen can be empty or fail.
- The credit line is on the token block.
- Every piece you named is in the index.
- DESIGN.md Sources lists each of those pieces with its demo link. The reply includes the same links.
- The four lines (who, decision, first thing, next action) are in DESIGN.md.
- The first thing is the largest type on that view. There is one display size, or one written break.
- Space between groups is the stack gap. Space inside a group is half of that.
- A list is one state: loading, empty, failed, or populated. The piece you used matches that state.
- The next action names the screen it opens. That screen is in this pass, or you said it is still open.
- You opened each finished screen at its frame size and wrote the look notes in the reply.
- Every look check passed. A fail was fixed, and that screen was opened again.
- The theme matches this product's world, or a recipe matched. The reply names the theme you rejected. You did not lock a palette because it was first.
- After the look checks passed, you made one correction and opened that screen again.

## Minimum screens

A pass that only ships a hero, a landing, or a dashboard home is unfinished. Cover this set before you call the UI done. Reuse the locked sheet on every one.

- Website: nav, hero, one proof block, footer. Take them from the website recipe.
- App: shell (tab bar or nav), the primary list, one detail, an empty state, and settings or account.
- Platform: shell, a table or a board, one record, and the account menu. Add people and billing when the product has staff or a plan.
- Shop: a collection, one product, the cart, and checkout. Take them from the commerce recipe.
- Tablet: a split or a sidebar, one primary pane, and one detail. Take them from the tablet recipe.

If they asked for one component, build that component inside the locked system. Say that the rest of the set is still open. Do not invent a second palette to fill the gaps.

## Say so

Say it in the reply when any of these are true.

- The library has no piece for this interaction. You built from the sheet only.
- The theme has no dark or light pair.
- The pairing has a caution.
- You locked the first palette because it was first. Choose again with Match the world.
- You could not open the built screen. The UI is not done.
- A look check failed and the fail is still on the screen.
- The person using the product disagrees with your look notes. Change the screen they named. Do not skip the look on the next pass.

# Practice

This is how you design with the library. The catalogue is the material. This file is the discipline.

You do not need all of it every time. Read what the job needs:

- One component or section: Adapting a brief, Components, and the brief itself.
- A website: Before code, Stand out, Pick a direction, Register, Decide the screen, Look, Finish checklist. Then Page shape and Craft in [taste.md](taste.md). If they named a style, Named looks there too.
- An app or a tool: Before code, Match the world, Decide the screen, Minimum screens, Look, Finish checklist.
- A redesign: Redesign, then the list above for its kind.
- A brand kit or logo system: Brand board in [taste.md](taste.md), after the kit is locked.

Their words beat this file. When they ask for something a default here forbids, such as more motion, a second effect, or skipping a step, do what they asked, and write one line in DESIGN.md saying which default you set aside and why.

The aim is one product that feels designed: same palette, type, icons, radius, spacing, motion, and components on every screen. A new screen extends the sheet. It does not start a second system. An agent without this skill can still ship a page. The page reads as generated when the type, the copy, and the decoration could belong to any product. Look is how you catch that.

## Before code

1. Write the four lines in Decide the screen. If you cannot name the decision, you are not ready to pick a hero. For a website, also read Stand out and write the Idea.
2. Decide new kit or adopt. Adopt when they already have tokens, a DESIGN.md, or styled screens, unless they asked for a new look.
3. Match the world, then choose the pieces. Read Match the world. Search before you invent: settings, billing, search, upload, audit, account menu, inbox, table, dialog, toast, form, select, record, people, detail, chart, line, kpi, empty, error, collection, cart. On a phone, search for the phone empty and the phone failed load before you reuse the web ones. On a tablet, use the tablet recipe. Do not stretch a phone screen to 1180px. If the index has no piece, say so, and build only from this sheet and from [components.md](components.md). Do not import another library's look.
4. Say the pick with links at the top of your reply, then build. Follow Say the pick in [SKILL.md](SKILL.md). Ask first only when two worlds fit and would lock different themes, or when they asked to choose.
5. When the system is locked, write the sheet below. If the project has no DESIGN.md, add it. If one exists and you are adopting it, do not overwrite it. If one exists from an earlier Lounge pass, update Sources when they change a screen. Do not start a second file.
6. Build the shell first (nav, tab bar, or frame), then the primary screen, then the rest of the minimum set below. A product is not done after the first screen.
7. Open every finished screen and run Look. Fix what fails, and open it again. When the fails are none, run One correction. Then run the finish checklist. In the reply, list only what failed and what you changed, plus the look notes. Do not paste every line that passed. Do not call the UI done from the source.

## Stand out

This is for every website: a portfolio, a landing page, a product page, a personal site. It is not for a dashboard or a tool someone opens every day.

The rest of this file stops slop. This section stops dull. A page can pass every slop check and still be forgettable. Forgettable is a fail. People install this skill to get a site that stands out.

### The default looks

Agents with good taste still land on the same few pages. These are fails, unless they asked for one by name.

- The dark portfolio. A near-black page, a huge serif italic name, a small mono kicker line, a numbered table of projects, a local clock, an "open to work" dot.
- The SaaS template. A gradient hero, a centred headline, three feature cards, a row of logos.
- The quiet paper page. Cream background, a serif headline, and everything else small grey text.
- The studio template. The 2024-26 look that good agents now all make: hairline grid lines everywhere, small tracked uppercase mono labels, numbered sections ("01 / Work"), a giant wordmark footer, and a sticky scroll section. Each one is fine. All of them together is a template. Use two at most on one site.

If your plan matches one of these, change the theme or the layout before you write code.

### Write the idea

Add one line to the sheet: `Idea:`. It says what this site does that only fits this person or this product. It is a picture, not an adjective.

- Good: "Her projects are small working apps on the page. You can tap them." "The hero is the product's own window, running." "The work is a stack of cards you scroll through, one per shipped product."
- Not an idea: "Bold and minimal." "Clean, modern, premium." "Luxury dark."

The idea decides the hero and the proof block. If you cannot write it, you are not ready to build.

To find it, look in their material, not in the library:

- A thing from their work: the object they make, the screen they are proud of, the tool they built. Can the site be that thing? A ledger designer's work sits in ledger rows. A typeface maker's name is set in their face.
- A habit: how they work. Someone who writes about explicit gates gets a site you move through gate by gate.
- A place or a time: their city, their trade, the hour they work.

Write three candidates. Keep the one that changes the hero. An idea that only changes the copy is not the idea.

Then make one signature: one element built only for this site, from the Idea, that no piece in the library has. It uses the locked tokens, so it still belongs. Everything else may come from pieces. Name it on the sheet: `Signature: the project cards open like gates`. This is where the site stops rhyming with every other Lounge site.

### Show the work

- The first screen has the name or headline and a picture of the work. Not big type alone on an empty page.
- A portfolio shows every project as a picture. A text list of project names is not proof. A preview that only appears on hover does not count. A phone has no hover.
- No screenshots? Draw the picture. For someone who makes software, build each project as a small working screen in HTML and CSS, in the locked theme, inside a phone or browser frame. Take the structure from a library piece: a bank home from `ios-fintech-home`, a table from the dashboard pieces, a chat from the messages pieces. This is the library's edge. You can draw real interfaces, not grey boxes.
- A photographer or illustrator with no images: leave clear image slots at the right size, each with one caption. Do not paint fake art with gradients.

### Layout

- Fewer, bigger sections. A website pass is four to six sections. Each one has one job and one large thing.
- Sections change shape: a full-width colour band, a bento, a sticky split, a horizontal rail, a card stack. Not five rows of text at the same width.
- The reading column is for paragraphs. The hero, the work, and the bands use the full frame, 1120 to 1280px.
- Use the colour. Put `--primary` on one large surface: a band, a big card, or the hero block. That is the brand, not decoration. A light theme with a strong primary beats a dark page with one gold line.
- Do not let the page become one colour. The theme has `--secondary` and `--tertiary` too. Give each project panel or band its own one: primary, secondary, tertiary, or the ink colour reversed. Each panel is one colour, with no gradients.

### Size and contrast

- Body text on a website is 17 to 19px, in `--ink` or `--ink-2`. Never `--ink-3` for a sentence.
- Small tracked labels: three per view at most. A page where half the text is 11px grey looks unfinished. The labels a piece's brief draws count too. If the hero piece already has three, add none of your own. If a brief draws more than three, cut its labels down to three. The limit wins over the brief.
- No facts strip, clock, timeline, status dot, or filter chips unless they asked. Each one is a small region that does not serve the four lines.

### Motion you can see

A website has one lead motion, from Register. It runs without a hover: on load, or on scroll. A hover effect can be extra. It is never the lead. When they ask for more motion, such as parallax plus reveals, add supporting effects. Follow More than one effect in Register.

### Real content only

- Never invent clients, employers, projects, numbers, quotes, or dates. Use what they told you.
- Use what is real and public: a product they named, their GitHub, their own site.
- If they named no projects, show what they do as two or three labelled studies, such as "Study: a credit ledger for a corner shop". A study is honest. A fake client is not. Say in the reply which slots to replace with real work.
- If the site is mostly a portfolio and they did not say just build it, ask once for three projects, each with a link or a screenshot.
- A link goes where its label says. "Live demo" opens the demo. "Paper" opens the paper. If you don't have that URL, drop the link, or label it for where it really goes ("All projects"). List the missing URLs in the reply.
- A drawn screen with made-up data (file names, logs, numbers) gets a small "Example" caption, so nobody reads it as a real result. A drawn screen that only shows real facts doesn't need one.

### The five-second test

Open the first screen at 1280×800. Look for five seconds. Write:

```
Remember: "<the one thing you remember>"
Could this be anyone's site: yes | no
```

If you remember nothing, or the answer is yes, it fails. Change the idea or the hero. Rewording the copy is not a fix.

## System sheet

```
Product:
Who:
Decision:
First thing they see:
Next action:
Job of this pass:
Scope:
Idea: <website only, one picture sentence>
Signature: <website only, the one element made only for this site>
Avoiding: <website only, the default look this could have become>
Register: quiet | <one piece id>
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

`{site}` is the `site` field in `library/index.json`. One line per piece you actually build. The role is layout, motion, or component: what they should look at if they want to compare. When they ask to change a screen, change that line, then rebuild only that screen.

For a new product, the matching recipe in `starts` names the first pieces, and its chosen direction names the look. Build those before you invent a screen the recipe did not name.

### Dials

Three numbers from 1 to 10 that say how far to push. Set them from their words, then let them pick the pieces.

| They said | Variance | Motion | Density |
| --- | --- | --- | --- |
| Calm, clean, minimal, editorial, "like Linear" | 5 | 3 | 3 |
| Premium, luxury, "like Apple" | 7 | 6 | 3 |
| Playful, wild, experimental, agency, Awwwards | 9 | 9 | 3 |
| A landing page or portfolio, nothing more | 8 | 7 | 4 |
| A daily tool, admin, dashboard | 3 | 2 | 7 |
| Government, health, money, anything where trust comes first | 3 | 2 | 5 |

- Variance: 1 is centred and even. 10 is off-grid, with sizes that clash on purpose. Above 6, no two sections share a shape.
- Motion: 1 to 3 is Register quiet. 4 to 7 is one lead effect. 8 to 10 is a lead plus supporting effects, each in its own section.
- Density: 1 to 3 is air, 4 to 6 is regular, 7 to 10 is dense. It sets the Density line.

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

Every recipe has three to five `directions`. Each one is a complete look: theme, pairing, family, hero piece, and one effect. Two people who type the same sentence must not get the same site. Choose in this order.

1. They named a theme, a pairing, a colour, or a site they like. Lock the direction closest to it, then swap in what they named.
2. Their words carry a mood, an audience, or a world: dark, light, playful, calm, luxury, technical, for developers, for kids, loud, Nepali, retro, AI. Lock the direction whose `mood` says it.
3. Read the person. Most messages carry more than they say: a bio, a tagline, project names, their job, their own site or GitHub, the way they write. Write three words that describe that material, in their words where you can ("quiet, explicit, systems"). Compare them with each direction's `mood` and lock the closest. Write it on the sheet: `Direction: cobalt-desk (their words: quiet interfaces, clear state, explicit gates; mood: precise, systems thinker)`. A designer starts from the person, not from a number.
4. Two or more directions fit equally, or there is truly nothing to read (a bare "make me a portfolio"). Only then use the name number, and only among the directions that fit. Work out the name number: add up the place of each letter of the product or brand name in the alphabet (a = 1, b = 2, … z = 26), ignoring spaces, digits and punctuation. If there is no name, use the first noun in their message. Divide by the number of directions. The remainder picks it, counting the first direction as 0. Write the sum on the sheet, for example `Direction: kiln-workbench (Sunim = 19+21+14+9+13 = 76, 76 mod 4 = 0)`. The name number keeps one product consistent and keeps two products apart. It does not know who they are, so it never overrules rule 3. Counting letters is not enough, because names of the same length would always land together.

Do not take the first direction because it is first. Do not mix two directions. If the hero is unset, use the recipe's first piece. If the effect is null, the register stays quiet.

The direction is the start, not the end. The Idea, the copy, the projects, and the order of the sections still come from this product.

### Sections, one by one

The direction picks the hero and one effect. It does not pick the other sections. If every site took the recipe's first footer and first work block, two different people would get the same page under different colours. So pick each section on its own.

1. If their words point at one option ("a big email to copy", "a timeline of my work"), take it.
2. Fit the content you have. Work: three projects of different kinds suit cards or a horizontal rail, one product with steps suits a sticky scroll, many small things suit a bento. About: a long story suits a sticky split, a short belief suits a word highlight. Contact: a freelancer who takes briefs suits the brief steps, someone who just wants mail suits the giant email. Drop every option the content does not fit.
3. Several still fit. Use the name number from the direction, plus the section's step: work +1, about +2, contact +3, footer +4. Divide by the number of options in that section's list below. The remainder picks it, counting from 0. Write each on the sheet: `Footer: footer-centered-colophon (76 + 4 = 80, 80 mod 4 = 0)`.
4. Skip an option that clashes with the locked family, or that needs something they don't have, such as real photos. Move to the next one, and say why.
5. Never use the same piece for two sections.

The lists, for a website:

- Work (builders, products, case studies): `features-sticky-scroll-steps`, `stacking-cards-scroll`, `bento-feature-grid`, `case-file-horizontal-scroll`, `process-step-dossier`, `scroll-lens-card-ticker`, `features-tabbed-preview`. With real images: `portfolio-index-hover-preview`, `landing-agency-case-wall`, `gallery-film-strip`.
- About: `profile-creator-masthead`, `sticky-split-story`, `profile-editorial-staff`, `text-rise-underline-whisper`, `scroll-word-highlight`. A team of three or more: `team-hover-portrait-grid`.
- Contact: `contact-giant-email-copy`, `contact-project-brief-steps`, `profile-contact-card`, `cta-giant-email-band`, `contact-conversational-form`. A place people visit: `contact-split-map-form` or `contact-booking-hours`.
- Footer: `footer-giant-wordmark-reveal`, `footer-centered-colophon`, `footer-newsletter-split`, `footer-engraved-caravan-strip`. A product with many pages: `footer-sitemap-columns` or `footer-enterprise-sitemap`.

Open the brief for every section you build. A phone menu, a copy-email button, or a drawer is a piece too: `hamburger-circle-reveal`, `contact-giant-email-copy`, `button-copy-share`. If you build a part without opening its brief, say so in the reply.

## Match the world

A hundred products look like one product when every pass locks the first palette on the list. The first id is not a default. Do not lock it because it is first.

Choose in this order.

1. They named a theme, a pairing, or a family. Lock what they named. Choose the rest by the rules below.
2. A recipe in `starts` matches the product. The names are in reference.md: a yard desk is `dashboard`, a clay shop is `commerce`, a SaaS page is `saas`, a showreel is `portfolio`, a developer, product manager, product designer, or founder is `portfolio-builder`, a phone shop is `shop-app`. A restaurant is `restaurant`, a clinic is `clinic`, a gym is `gym`, a listing is `real-estate`, a course or school is `education`, a job board is `jobs`, a charity is `nonprofit`, and a law or consulting firm is `professional`. The full list is the Kind map in reference.md. A magazine is `editorial`. A phone app with no named world is `mobile-app`. A tablet is `tablet`. One person's money is `personal`, not `dashboard` and not `bank`. A Nepali finance app is `personal`: Lokta and the Devanagari pairing. Say which recipe. Then pick one of its `directions`, as Pick a direction says. The direction locks the theme, pairing, family, hero, and effect. The recipe's `pieces` are still the screens to open.
3. No recipe matches. Stay inside that kind's `palettes`, `pairings`, and `families`. Read `bestFor`, `mood`, and `tags` on each theme. Lock the theme whose `bestFor` names this world. A clinic is Alpine Clinic. A payroll run is Harbour Ledger, because the job is paying people. Fog City is the first palette on kind `product` and is the wrong lock for both.
4. Lock a pairing from that kind's list whose `bestFor` is the same world. Payroll on kind `product` takes Friendly SaaS, which lists fintech. A paper takes Newsroom. A clay shop whose recipe is commerce takes Atelier.
5. Lock the family for how the product is used. Editorial for a page people read. Industrial for a yard or a field tool. Sharp for a dense platform. Quiet for a product that has to last. Soft for a friendly consumer app. Glass only when the direction names it.

Write one sentence: why this theme, and which theme you rejected. "Harbour Ledger, because this is payroll. Fog City is first on the list and is a general app, so it loses." Put both lines on the system sheet.

Two themes can both fit. Pick the closer mood. Name the other one as rejected. Do not offer a menu unless they asked to see options.

A brand colour they already have replaces `--primary` only, after the theme is locked. The surfaces stay the theme's. The brand does not choose a second theme.

The theme CSS includes a sample `--radius` and `--shadow`. Ignore them. Family sets radius and shadow. Theme sets colour only. Harbour Ledger's 2px sample loses to Quiet's 6px.

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

When the content does not fit the brief's shape, do not force it. A sticky scroll written for one figure that morphs does not suit three unrelated projects. Either keep the shape by giving every step the same frame (one device frame whose screen changes, so the morph still reads), or go back to the section list and take the next option that fits. Say which you did. A crossfade between unrelated pictures is the brief broken, not translated.

If a brief draws the same solid button twice, keep one. The other is outline or a text link with the same verb.

## Locale

Read this before you set a number or a date. The pairing `devanagari` is the Nepali face: Noto Serif Devanagari for headings and amounts, Mukta for the interface, IBM Plex Mono for Latin codes only.

- An amount is one string in one family. If it contains रु, रू, ₹, or Devanagari digits, the whole string uses a face that contains every glyph. Do not leave the currency word in a fallback next to mono digits.
- Nepal and India group digits by lakh and crore. The last three, then pairs: 1,24,000 and 18,42,000. Not 124,000. Not 1,842,000. Under 1,000, write 900.
- Pick one currency and keep it. Nepal is रु or Rs. India is ₹. Do not mix them in one product.
- If the product uses Bikram Sambat, label the first date on the screen with BS. Use one system, either 17 Aswin 2083 or २०८३ असोज १७. Do not invent a converter, and do not mix Devanagari digits with Western digits in the same number.
- Devanagari body may be 17px where Latin is 16px. Do not shrink it to fit.
- For Arabic, Hebrew, or Urdu, set `dir="rtl"` on the document. Mirror the shell with logical properties (`padding-inline`, sidebar on the right). Keep numbers LTR with `unicode-bidi: isolate`. Do not mirror an icon that depicts a real object. There is no RTL theme. The locked theme still applies.

## Identity

Restraint is the default on a product someone opens every day. A portfolio, a launch, or a product page they described with motion keeps its effects, in Register. A regional or brand identity is still allowed, in three places, and nowhere else.

1. The locked theme. A Nepali product uses Lokta: lokta paper, crimson primary, navy ink. Lokta Night is the dark pair. Do not stay on Harbour Ledger and then ask why it looks like a Western fintech app.
2. One texture, on one region. The page background, or a single band. A lokta grain is a low-contrast dot at under 8% opacity. Not on cards, not under type, not tiled across every row.
3. The display face from the pairing. For Nepal that is Noto Serif Devanagari, including on the amount.

Crimson is `--primary`, not a second accent beside the theme's brass. A festival does not get a second decorative colour. No emoji, and no pattern on every card. A gradient or a glow belongs only to the effect pieces in Register. If they asked for Nepali and you only put it in the nouns, the look failed. Say so, and move the identity into those three places.

For a revamp, name three visual problems. Fix those inside the adopted system. Do not reskin the whole product unless they asked.

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

## Register

Write `quiet` or one piece id on the sheet. This is how a thin request still lands on a style that fits.

A ledger, a clinic, a settings screen, or a dashboard stays quiet. Motion is the sheet: 200ms, 320ms, 400ms. Do not add a cursor, a scroll story, or a hover tilt because the page felt plain.

A portfolio, a launch, a product page, or a refine they described as motion is in the library. Search categories `cursor`, `scroll`, and `text-motion`. Take one piece for the effect they named.

- A builder's portfolio: `stacking-cards-scroll`, `hero-product-window-tilt`, or `features-sticky-scroll-steps`. The work moves, not the name.
- A visual portfolio: `portfolio-photographer-horizontal`, `hover-image-trail`, `stacking-cards-scroll`, or `cursor-ink-blob`. `portfolio-index-hover-preview` only when every row has a real image.
- A product page: `hero-product-window-tilt`, `features-sticky-scroll-steps`, or `hover-tilt-cards`. Not a cursor on the checkout.
- A product they want to show off, like a watch, a speaker, or a box: `scroll-scrub-product-sequence` or `object-3d-turntable`.
- An outdoor, travel, or place brand: `parallax-layered-hero` or `scroll-zoom-portal`.
- A studio or agency that wants the site to feel made: `smooth-scroll-inertia`, `page-transition-tile-wipe`, `preloader-counter-intro`, or `text-mask-scroll-reveal`. A preloader never runs longer than the real load.
- A tech, science, or cold brand that wants depth: `webgl-shader-hero`. A hotel, film, or food brand that wants footage: `hero-video-loop`.
- An about or manifesto block: `scroll-word-highlight`.
- A headline that moves: `kinetic-type-marquee` or `variable-font-proximity`.
- A phone: `ios-pull-to-refresh`, `shared-element-expand`, or `m3-container-transform`. Not a web cursor. A phone web story: `mobile-scroll-story`.

A website always takes one effect piece, even when they did not name one. Pick the one that serves the Idea. A daily tool with no named effect stays quiet. Do not add one to fill the page. The piece's motion table wins inside that region. The rest of the page stays on the sheet's easing. Reduced motion still applies.

### More than one effect

One effect is the default, not a ceiling. When they ask for more motion, or name two effects, build them. Keep it one design:

- One lead effect, the one that carries the Idea. It gets the first screen or the biggest section.
- Supporting effects each own one section. Two effects never run in the same viewport at once.
- Every effect uses the sheet's easing and durations, so they move like one hand made them. Translate each piece's motion table onto the sheet, not the other way round.
- No more than three effects on a page unless they asked for more. A blob, a tilt, a marquee, and a stack fighting on one screen is four designs.
- Reduced motion turns all of them into a still frame.

## Break one rule

One display size, one primary, and the sample tab count are defaults. A designer breaks one when the content cannot be said otherwise. You may break one per screen. Write it on the sheet, or you did not break it.

- One display size. Break it only when two numbers are both the decision, such as money in and money out. The second is one step smaller, not equal. A third display size is not allowed.
- Tab count. `phone-tab-plain` shows four tabs because that demo has four sections. A product uses three to five, one per real section. Do not add a tab to match the demo, and do not drop a section they named to stay at four.

A confirm dialog does not break the one-primary rule. Cancel is outline. The destructive action is the one solid button.

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

On a phone, the answer stays the largest type. The primary button is at least 44px tall and sits with the answer, or in the bottom bar the piece specifies. Clear the top with `max(54px, env(safe-area-inset-top))` and the bottom with `max(34px, env(safe-area-inset-bottom))`. The inset is 0 on a desktop browser, so 54 and 34 are the minimum, not a fallback inside `env()`. Do not draw a status bar. A header and a tab bar on the same phone screen is two navigation systems.

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

For each screen, write this in the reply before you call the pass done:

```
Looked at: <screen> at <width>×<height>
Largest type: "<the words>" — the answer named above, or not
Primary: "<label>" sits <where>
Copy that still works if you swap the product name: "<quote>" or none
Website only. Remember after five seconds: "<one thing>" · Could be anyone's site: yes | no
Fails: <the checks below that failed, or none>
```

Fix every fail. Open the screen again. A fail that is still visible means the pass is open.

These are fails. They are the tells of a page that was generated and not designed.

- A gradient, a glow, or a mesh you added. The locked effect piece may use one. Every other region stays the theme's flat `--bg`.
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
- Two navigation systems. A sidebar, a panel, or a nav list that differs from the sheet. The content column wider because the rail closed. A chart painted in a library's default colours.
- On a website: one of the default looks in Stand out. A first screen with type and no picture of the work. A portfolio whose work is a text list. A site where half the text is small grey labels. A page you cannot remember after five seconds.
- An invented client, employer, project, number, or quote.
- An em dash or en dash in text people read. A version label in the hero, such as BETA or v2.0, when this is not a launch. Numbered eyebrows like `001 · Work` or `01 / 04`.
- Dots between every word in a strip (`a · b · c · d`). One per line at most. A coloured dot before every nav item or row, when it is not a live status.
- A "Scroll" cue or an animated mouse. A strip of words along the bottom of the hero, such as `DESIGN / BUILD / SHIP`. A city, clock, or weather strip, unless the place matters to the product.
- A tag laid over a photo. A made-up photo credit. Poetic labels such as "Field notes", "From the bench", or "Quietly trusted by" where a plain label works.
- "Step 1, Step 2, Step 3" as the labels. The step's own verb is the label: Install, Connect, Ship.
- Numbers that look made up: 99.99%, 10x, 50%, $1,000,000. Real numbers are uneven: 47.2%, 1,284. Brand names that sound made up: Nexus, Acme, SmartFlow, Cloudly. Copy words that mean nothing: elevate, seamless, unleash, supercharge, next-gen.
- On a phone, a pinned panel or sticky block that covers more than a third of the screen. Unpin it below 720px and let it scroll with its section.
- Pure `#000` black. A custom cursor on a daily tool. A grey box standing in for the product. Draw the product as a small working screen, as Show the work says, or leave it out.

A piece you locked may use one of these on purpose. For example, a footer piece may show a live clock. Then it is allowed, because you chose it. Do not add one on your own.

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

- One theme, or a theme plus its `pair`. No third palette.
- One pairing. Display, body, and mono match the sheet.
- One family. Radius, shadow, button, and density match on every new screen.
- Icons are Lounge Icons, or follow the missing-icon order in components.md. Brand logos are one colour.
- A website has a wordmark, a favicon, and a share image. Their logo is used as given. The files exist: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` (180 × 180), and the share image at exactly 1200 × 630. Read the image size from the file. Don't trust the size you asked for.
- Every link label matches where it goes. Missing URLs are listed in the reply.
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
- You opened each finished screen at its frame size and wrote the look notes in the reply. Nothing scrolls sideways at 390px, the console has no errors, and the reduced-motion frame is complete.
- No em dash or en dash in the text on the page.
- You wrote the Match block. Column, padding, control height, radius, and amount face are the same on every screen. The sidebar, the panel, and the nav labels match the sheet, including after the rail closes and on the phone.
- Every look check passed. A fail was fixed, and that screen was opened again.
- The theme matches this product's world, or a recipe matched. The reply names the theme you rejected. You did not lock a palette because it was first.
- The register is quiet, one effect piece from the index, or a lead plus supporting effects they asked for, each in its own section. A daily tool did not grow a cursor. A portfolio or a product page they described with motion did not lose that piece.
- After the look checks passed, you made one correction and opened that screen again.
- Website: the Idea and Avoiding lines are on the sheet. The first screen shows the Idea. The work is pictures. Nothing is invented. The five-second test passed.

## Minimum screens

A pass that only ships a hero, a landing, or a dashboard home is unfinished. Cover this set before you call the UI done. Reuse the locked sheet on every one.

- Website: nav, hero, one proof block, footer. Take them from the website recipe. The proof block is pictures of the work or the product, not a list.
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

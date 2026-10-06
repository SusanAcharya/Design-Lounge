# Websites

Read this after [practice.md](practice.md) when the job is a website: a portfolio, a landing page, a product page, a studio, a personal site.

## When rules disagree

Some rules pull against each other. Settle them in this order, top wins.

1. Their words.
2. The Idea and the Signature. In Show mode, the centrepiece and What Show mode relaxes.
3. The Look fails in [practice.md](practice.md), the three-label limit, and the studio template limit.
4. A Named look in [taste.md](taste.md), then the locked family.
5. The piece brief.

So a sharp or brutalist look may use tracked uppercase labels, but they count toward the three, and they are one of the two studio-template moves you are allowed. A hero brief with five labels keeps three. A brief's scroll cue goes. A section list never makes every section move: rule 6 in Sections, one by one.

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
- A habit: how they work. A cook who folds every dumpling in front of you gets a menu that folds open. A translator who works line by line gets lines that turn from one language to the other.
- A place or a time: their city, their trade, the hour they work.

Write three candidates. Keep the one that changes the hero. An idea that only changes the copy is not the idea.

Then make one signature: one element built only for this site, from the Idea, that no piece in the library has. It uses the locked tokens, so it still belongs. Everything else may come from pieces. Name it on the sheet: `Signature: each dish card folds shut like a momo when you pass it`. This is where the site stops rhyming with every other Lounge site.

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
- No facts strip, clock, timeline, status dot, or filter chips unless they asked. Each one is a small region that does not serve the four lines. Show mode's live readouts are the exception, when they belong to the Idea.

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

## Show mode

Use this only when their words ask for spectacle: an ambition word ("go wild", "Awwwards", "site of the day", "unforgettable", "award-level", "make it an experience"), or a verb that makes the page itself the experience ("let people play with it", "you scroll and you travel", "type on it"). With neither, it is Kit mode. "A site" never triggers Show mode, and neither does a world you could draw (space, a city at night, the sea, a mountain, an instrument, a machine) or the kind of job (a show, a launch, a label, an event) on its own. Those fill the World line and pick the direction inside Kit. Write the `Show:` line on the sheet.

A strong agent with no library builds something memorable here, because it starts from the subject, picks colour and type for that world, and spends all its effort on one thing. Show mode does the same, then adds what the library is good at: finished sections, real states, accessibility, and a page that holds together on a phone.

Show mode is Free by default: you choose the colour and type (Free colour and type, below). It stays locked to the direction's theme and pairing when they named a theme, a colour, a pairing, or a brand, when the project already has a design system, or when they asked for the Lounge look. Write the mode on the sheet: `Show: yes, Free` or `Show: yes, locked (they named Deep Field)`.

### The centrepiece

1. Write the Idea as a thing you can touch or travel through, not a layout. "You scroll and the camera leaves the ground." "The label's city, live, at the hour the tape rolls." "The keyboard is on the page. Type on it."
2. Search for a show piece that already does it: `scroll-space-voyage` (a journey you scroll), `moonlit-ridge-hero` (a place at an hour), `playable-product-hero` (an object you use), `three-scroll-world`, `three-orbit-object`, `object-3d-turntable`, `scroll-scrub-product-sequence`, `webgl-shader-hero`, `game-playfield`. Open its brief. Re-skin it for this subject. If none fits, build the centrepiece yourself from the Idea and say so.
3. The centrepiece gets the first screen and most of your time. Build it first, look at it, and improve it twice before you build anything else.
4. The direction still locks the family. In Free, its theme and pairing become candidates. In locked Show, it locks them too. Its hero, work, and footer become candidates. Keep the work and the footer unless they fight the Idea. A ticket card does not suit a night dive. A schedule does not suit a shop. Pick a better one from the section lists below and write why.
5. Fewer, bigger parts: the centrepiece, two or three supporting sections, and the footer. Each supporting section is a finished piece, built still, in the page's system: the locked theme and pairing, or the Free colour and type.

### Free colour and type

The library's themes and pairings are made for products people use every day. A show, a launch, or a label whose subject is a world needs the colour of that world's light and a face that sounds like it. Here you choose them, and the library holds the craft.

1. Colour from the light. Start from the light source and the material of the world: sodium amber on Himalayan indigo, the sun on the limb of the Earth, bone keycaps under a desk lamp. Write five to seven colours.
2. Write them as the theme's roles: `--bg`, `--surface`, `--surface-2`, `--line`, `--ink`, `--ink-2`, `--ink-3`, `--primary`, `--primary-ink`, `--primary-soft`, `--link`, plus up to four `--scene-*` for the sky and the glow. Every brief and the role table in SKILL.md still map onto them. Body text meets 4.5:1 on `--bg`, large type 3:1.
3. Type for the subject, not the trend. Two families at most, plus one script face when the world needs it, all in one Google Fonts link. Say in one line why each face fits this world.
4. Do not repeat yourself. Read the Free lines in the history: do not reuse the display face of the last three Free sites, or the same `--bg` and `--primary` pair. When you pick a display face yourself, avoid the faces every agent reaches for unless the subject asks for one by name: Instrument Serif, Playfair Display, Fraunces, Space Grotesk, Syne, Inter. The list is for faces you choose on your own. A library pairing keeps its faces, whether the mode locks it or you take it under rule 5: Night Show, AI Editorial, and Gallery Wall set Instrument Serif, and that is allowed.
5. The library is still a good place to look. Taking a theme or a pairing is fine when you chose it for this world. Write `Free: took <id>, because ...`.
6. Everything else holds: The rendering bar, What Show mode relaxes, the Look fails in [practice.md](practice.md), real content, states, accessibility, the history check on the hero, work, and footer, and the credit.
7. On the sheet, under the Show line: `Palette:` with each colour and its job, and `Type:` with each face and its reason. Put both in `DESIGN.md` so a later page reuses them. A later page of the same product never picks again.

### The rendering bar

A centrepiece drawn with flat fills looks like a diagram. These are what make it look made.

- One light source, named on the sheet: the moon, a sodium lamp, the sun on the limb of the Earth, a desk lamp. Highlights face it. Shadows fall away from it.
- Depth in three or more layers. Far layers are lighter, bluer, and lower in contrast. Near layers are sharp and move more.
- Light is drawn with layered radial gradients, additive glow (`globalCompositeOperation = 'lighter'` on canvas, or `mix-blend-mode: screen`), a soft halo, and a highlight edge on objects. Add grain at 3 to 6 percent opacity over the scene.
- Objects have material: a top face, a side wall, a highlight, a cast shadow, and travel when pressed.
- Type sets the scale. The display face runs at 10 to 16vw. One word changes voice: italic, or set in the scene's light colour. That one word may carry a gradient of the scene's light.
- Live readouts that belong to the Idea: the local time of the place, a countdown to the hour, the distance travelled, the key last pressed. Two to four at most, in the mono, and each one is real and changes. A readout that only decorates is a fail.
- Sound when the subject is sound: a synthesised drone, a switch click, a note. Never autoplay. It starts on a click and has a visible off control.

### What Show mode relaxes

Only inside the centrepiece, and only these. Everything else in Look in [practice.md](practice.md) still holds, including on the supporting sections.

- Gradients, glows, and halos are allowed in the scene. Not on cards, buttons, or section backgrounds.
- Gradient text is allowed on the one word that changes voice.
- The live readouts above are allowed, and they count instead of the three-label limit, up to four.
- A scene palette, in locked Show: when the locked theme has no colour for the world's light, add up to four `--scene-*` tokens (sky stops, glow, highlight). The interface still uses the theme's roles. Write the scene tokens on the sheet with one reason each.
- One extra display face when the world needs a script, in locked Show: a Devanagari face for a Nepali name, for example. Write why. Free already counts the script face in its type.
- The family's radius and shadow govern the interface. Drawn objects keep their own corners and shadows.

### Two looks for one product

When they want options, or two variants of one product, build both. Lock two directions that differ in theme, pairing, and hero. Make one of them Show mode, Free, when the subject has a world, and the other a composed site locked to the direction's own theme, pairing, and pieces. That shows the whole range: one look made only for this world, one that is pure Lounge. Write a brief and a sheet for each. Claim both in the history before you start, so they never collide. Both credit Design Lounge.

## Sections, one by one

The direction picks the hero, the work, the footer, and one effect. About and contact still depend on what they actually have, so pick those two on their own.

1. If their words point at one option ("a big email to copy", "a timeline of my work"), take it.
2. Fit the content you have. Work: three projects of different kinds suit cards or a horizontal rail, one product with steps suits a sticky scroll, many small things suit a bento. About: a long story suits a sticky split, a short belief suits a word highlight. Contact: a freelancer who takes briefs suits the brief steps, someone who just wants mail suits the giant email. Drop every option the content does not fit.
3. Work and footer are the direction's `work` and `footer`. Use them. About and contact: if several still fit, use the name number plus the step (about +2, contact +3). Count only the options left after step 2, in the order the list gives them. The remainder picks one, counting from 0. Write the sum. Then the uniqueness check in Recent picks ([practice.md](practice.md)). If this direction shares two of hero, work, and footer with a recent site in this recipe or its group, take the next direction that fits. Do not rebuild the trio by hand.
4. Skip an option that clashes with the locked family, or that needs something they don't have, such as real photos. Move to the next one, and say why.
5. Never use the same piece for two sections.
6. Only the lead effect moves as its brief says. Every other section piece is built in its still form: its layout, its states, and the sheet's entry fade, with no scroll story of its own. A word highlight in about plus stacking cards in work plus a giant email reveal is three effects. Add a second moving section only when the dials or their words allow it (More than one effect, below).

The lists, for a website:

- Work (builders, products, case studies): `features-sticky-scroll-steps`, `stacking-cards-scroll`, `bento-feature-grid`, `case-file-horizontal-scroll`, `process-step-dossier`, `scroll-lens-card-ticker`, `features-tabbed-preview`, `features-alternating-rows`, `features-vertical-label-columns`, `portfolio-case-study-long`, `card-article-mix`. With real images: `portfolio-index-hover-preview`, `portfolio-photographer-horizontal`, `portfolio-motion-showreel`, `landing-agency-case-wall`, `gallery-film-strip`, `gallery-contact-sheet`, `gallery-wall-frames`, `gallery-photo-album`, `masonry-gallery-captions`.
- About: `profile-creator-masthead`, `sticky-split-story`, `profile-editorial-staff`, `text-rise-underline-whisper`, `scroll-word-highlight`. A team of three or more: `team-hover-portrait-grid`.
- Contact: `contact-giant-email-copy`, `contact-project-brief-steps`, `profile-contact-card`, `cta-giant-email-band`, `contact-conversational-form`. A place people visit: `contact-split-map-form` or `contact-booking-hours`.
- Footer: `footer-giant-wordmark-reveal`, `footer-centered-colophon`, `footer-newsletter-split`, `footer-engraved-caravan-strip`. A product with many pages: `footer-sitemap-columns` or `footer-enterprise-sitemap`.

The lists, for a course or lessons site. `course-landing-curriculum` is one option for the lesson list, not the whole site.

- Lesson list: `course-landing-curriculum`, `outline-fill-topic-list`, `accordion-grid-rows`, `card-progress-goals`, `features-tabbed-preview`, `stacking-cards-scroll`.
- One lesson: `tablet-cook-mode` (step by step, hands busy), `features-sticky-scroll-steps`, `paper-article-reader` (a lesson you read), `phone-lesson-quiz` (a check at the end).
- The teacher: `profile-creator-masthead`, `sticky-split-story`, `profile-editorial-staff`, `text-rise-underline-whisper`.
- Practice: the product's own tool comes first (a tuner, a canvas, a code box). Timers are `widget-pomodoro` and `widget-stopwatch-laps`.
- Footer: the website footer list above.

A lesson list is the work. It goes through the same uniqueness check as any other work piece.

The lists, for a place people visit. A restaurant, a clinic, a gym, a hotel. The direction's hero is the first screen. Pick the other sections from here.

- The offer: `restaurant-menu-page`, `week-schedule`, `gym-membership-home`, `clinic-home-booking`, `pricing-annual-toggle-roll`.
- A time: `contact-booking-hours`, `calendar-week-planner`, `phone-booking-slots`, `calendar-month`.
- The room: `gallery-contact-sheet`, `masonry-gallery-captions`, `contact-split-map-form`.
- Footer: the website footer list above.

The lists, for a cause, a firm, a listing, or a job board.

- The story: `sticky-split-story`, `editorial-landing-hero`, `paper-article-reader`, `profile-creator-masthead`.
- The ask or the list: `donation-page-impact`, `job-board-search`, `careers-role-list`, `realestate-listing-detail`, `hero-search-marketplace`, `law-firm-home`.
- Proof: `stats-count-up-band`, `testimonials-masonry-wall`, `people-role-list`, `team-hover-portrait-grid`.
- A private next step: `contact-project-brief-steps`, `contact-booking-hours`, `contact-split-map-form`.

The lists, for docs. The direction's hero is the shell.

- The shell: `docs-three-column`, `docs-hatched-gutter-shell`, `sidebar-docs-toc`, `terminal-ui-style`.
- One page: `docs-install-steps`, `paper-article-reader`, `code-snippet-tabs`, `blog-issue-index`, `book-page-flip`.
- Find it: `search-results-filters`, `command-palette`, `tree-nav`.

The hero, the work, and the footer then go through the uniqueness check in Recent picks. Same kind, and the related group, must not share two of those three.

Open the brief for every section you build. A phone menu, a copy-email button, or a drawer is a piece too: `hamburger-circle-reveal`, `contact-giant-email-copy`, `button-copy-share`. If you build a part without opening its brief, say so in the reply.

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
- A show, a launch, or a science night that is a journey: `scroll-space-voyage`. A label, venue, or hotel tied to a city and an hour: `moonlit-ridge-hero`. A product people can use on the page: `playable-product-hero`. Use these only once Show mode is on; they never turn it on.
- An about or manifesto block: `scroll-word-highlight`.
- A headline that moves: `kinetic-type-marquee` or `variable-font-proximity`.
- A phone: `ios-pull-to-refresh`, `shared-element-expand`, or `m3-container-transform`. Not a web cursor. A phone web story: `mobile-scroll-story`.

A website always takes one effect piece, even when they did not name one. Pick the one that serves the Idea. A daily tool with no named effect stays quiet. Do not add one to fill the page. The piece's motion table wins inside that region. The rest of the page stays on the sheet's easing. Reduced motion still applies.

### More than one effect

One effect is the default, not a ceiling. When they ask for more motion, or name two effects, build them. Keep it one design:

- One lead effect, the one that carries the Idea. It gets the first screen or the biggest section.
- When motion is 8 or more, the supporting piece is the one Dials names in [practice.md](practice.md). Do not search the motion catalogue for a second effect.
- Supporting effects each own one section. Two effects never run in the same viewport at once.
- Every effect uses the sheet's easing and durations, so they move like one hand made them. Translate each piece's motion table onto the sheet, not the other way round.
- No more than three effects on a page unless they asked for more. A blob, a tilt, a marquee, and a stack fighting on one screen is four designs.
- Reduced motion turns all of them into a still frame.

# Websites

Read this after [practice.md](practice.md) when the job is a website: a portfolio, a landing page, a product page, a studio, a personal site.

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

## Sections, one by one

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

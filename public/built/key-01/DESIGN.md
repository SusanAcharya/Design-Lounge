# KEY-01 launch page

```
Product: KEY-01, a 75% gasket-mounted aluminium mechanical keyboard with hot-swap switches. $189.
Who: someone who types all day and is choosing their next keyboard, on a laptop or a phone.
Decision: is this board worth reserving, and in which switch?
First thing they see: the KEY-01 wordmark over a full 75% board they can press.
Next action: Reserve, which opens the four-question reservation at #reserve and lands on the "on hold" panel.
Job of this pass: one launch page, from nav to footer.
Scope: index.html, styles.css, main.js. No backend.
Idea: the hero is the keyboard itself, a full 75% board on the Swiss grid under the KEY-01 wordmark. Your real keys press their twins on the page, and each one clicks in the switch you pick. Pressing K, E, Y, -, 0 or 1 lights that wordmark letter.
Avoiding: the SaaS template (centred headline, three icon cards) and the dark luxury product page with a floating render.
Register: scroll-velocity-type
Dials: variance 8 · motion 7 · density 4
Kind: website
Mode: new kit
Recipe: landing · Direction: grid-launch (mood "precise, cool, a hardware launch")
Theme: ice-station (pair: none)
Why this theme: Ice Station is the cool, light, machined-metal world a hardware spec sheet lives in, and grid-launch locks it.
Rejected: atelier-noir (Noir launch). It is the dark luxury product page this would default to.
Pairing: swiss-precision (Schibsted Grotesk 400/600/800, IBM Plex Mono for .num)
Family: sharp (radius 0, outline buttons, one solid ink primary, shadow none)
Icons: Lounge Icons, 24px, stroke 1.75 (arrow, speaker, menu)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: scroll-velocity-type
Density: regular
Shell: none
Panel: none
Column: frame 1280px, page padding 24px (20px on phone); paragraphs held to 52-60ch
Nav: Play · Build · Sound · Specs · Reserve $189
Phone nav: drawer (hamburger-circle-reveal), same labels plus Reserve
Pieces: hero-swiss-grid-wordmark, button-3d-press, features-sticky-scroll-steps, scroll-velocity-type, property-list, contact-conversational-form, hamburger-circle-reveal, footer-centered-colophon
Sections: KEY = 11 + 5 + 25 = 41
  work 41+1 = 42 mod 7 = 0 → features-sticky-scroll-steps (Build, four layers)
  about 41+2 = 43 mod 5 = 3 → text-rise-underline-whisper, skipped: a product page has no about section
  contact 41+3 = 44 mod 5 = 4 → contact-conversational-form (Reserve)
  footer 41+4 = 45 mod 4 = 1 → footer-centered-colophon
Kept from their system: none (new kit)
```

## Page order

1. Nav: sticky bar, wordmark, four links, outline "Reserve $189".
2. Hero (Play): Swiss column hairlines, the six-letter wordmark rising in, a strip with the lede, the switch picker (Linear, Tactile, Clicky) and a Sound latch, the typing line with a readout, then the board. 84 keys on desktop. Below 640px a compact 25-key block (Esc 1 2 3 Back, QWERTY, ASDFGH, ZXCVBN, Space Enter).
3. Build: sticky CSS 3D exploded stack of case, gaskets, plate, PCB, switches and caps. Four steps (Milled, Cushioned, Switched, Capped) each light their layer and spread the stack.
4. Sound: the one `--primary` band. The sticky headline "Three switches. Hear each one." tracks scroll speed in its letter-spacing. Each switch has a "Play" sample.
5. Specs: $189 and an eleven-row property list.
6. Reserve: name, switch, finish, email, a review step with Edit, then a circular-wipe "on hold" panel.
7. Footer: centred colophon with the credit line.

## Sound

All audio is synthesised with Web Audio. Each press is a filtered noise burst plus a short decaying tone, shaped per switch (Linear soft and low, Tactile a sharper bump, Clicky a bright click on press and release). Space, Enter, Shift and Back add a stabiliser rattle. The AudioContext starts on the first gesture. The Sound key mutes everything.

## Defaults set aside

- Keycaps keep the zero-blur edge shadow from button-3d-press although the family shadow is none. It is the key's side wall, the geometry that makes travel visible. The blurred floor shadow and the gradient sheen are dropped. Caps are radius 0.
- Key edge colours use `color-mix()` of `--face` and `--ink`, so no new hex enters the palette.
- contact-conversational-form's 200px step numeral is dropped. The page keeps one display size per view, and its counter reads "Question 1 of 4" instead of a numbered eyebrow.
- hero-swiss-grid-wordmark's replay on click, side label and project index are dropped. The board is the hero's picture, and a click on the wordmark would compete with key presses.
- hamburger-circle-reveal's disc is a square, because the family is sharp. The circular wipe is kept inside it.
- The about section from the name number is skipped. A launch page for one product has no studio to describe.
- Ice Station has no dark pair, so the page stays light throughout.

## Match

```
Match (measured)
Column: frame 1280px on every section; paragraphs 52-60ch
Page padding: 24px desktop / 20px phone
Control height / radius: 36px web, 44px phone and coarse pointer / 0px
Amount face: IBM Plex Mono (price and spec numbers)
Shell: none
Panel: none
Nav: Play, Build, Sound, Specs, Reserve $189
Phone nav: drawer · same labels
Fails: none
```

## Sources

- theme ice-station — https://www.designlounge.live/themes/ice-station
- pairing swiss-precision — https://www.designlounge.live/type/swiss-precision
- family sharp — radius 0
- hero-swiss-grid-wordmark — layout — https://www.designlounge.live/demo/hero-swiss-grid-wordmark.html
- button-3d-press — component — https://www.designlounge.live/demo/button-3d-press.html
- features-sticky-scroll-steps — layout — https://www.designlounge.live/demo/features-sticky-scroll-steps.html
- scroll-velocity-type — motion — https://www.designlounge.live/demo/scroll-velocity-type.html
- property-list — component — https://www.designlounge.live/demo/property-list.html
- contact-conversational-form — layout — https://www.designlounge.live/demo/contact-conversational-form.html
- hamburger-circle-reveal — motion — https://www.designlounge.live/demo/hamburger-circle-reveal.html
- footer-centered-colophon — layout — https://www.designlounge.live/demo/footer-centered-colophon.html

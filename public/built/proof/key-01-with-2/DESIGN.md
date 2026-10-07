# KEY-01 launch page

## Brief

Request, word for word:
"Build a launch page for a mechanical keyboard called KEY-01. I want people to be able to actually play with it on the page."

Product: KEY-01, a mechanical keyboard, about to launch. The facts given: the name, that it is mechanical, that it launches.
For: someone who likes keyboards, with a real keyboard under their hands or a phone in them, who wants to know in ten seconds what KEY-01 feels and sounds like.
World: bone keycaps, a switch, a maker's desk by a window
The one thing: the keyboard is on the page and you type on it. Every key you press on your own keyboard lands on the same key of KEY-01, sinks, clicks, and what you type becomes the headline.
Ambition: spectacle, because "actually play with it on the page" makes the page the thing you use
Mode: Show, Free
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: price, launch date, who makes it and where, the real layout and key count (drawn as a 65 percent board, 67 keys), which switches ship (the page lets you hear three profiles, Linear, Tactile and Clicky; replace with the real options), keycap and case materials, colourways, a buy link, an endpoint for the launch-date form.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the playable board as the first screen, one still section that shows what you just did, and a footer that takes an email for the launch date, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

```
Product: KEY-01 launch page
Who: a keyboard person, with a keyboard under their hands or a phone in them
Decision: do I want this keyboard
First thing they see: the board, and their own keystroke landing on it
Next action: type (then: Send me the date)
Job of this pass: the public launch page, one page
Scope: hero, one proof section, footer with the launch-date form
Idea: The headline is whatever you type. KEY-01 sits under it; each key you press on your own keyboard lands on the same key, sinks, clicks, and the letter appears in the headline above.
Signature: the typed headline. The page's h1 is a live buffer of what the visitor types on the drawn keyboard, and the cut-open key in the proof section sinks with it.
Avoiding: the dark hardware launch (near-black page, orange accent, a mono spec strip, a product render on a gradient), and the studio template.
Register: playable-product-hero, rebuilt for a keyboard
Show: yes, Free · centrepiece built for this on the playable-product-hero pattern · light: a window, upper left, late morning · scene: --scene-light (window glow on the mat), --scene-shade (the case's shadow, cast down and right), --scene-case and --scene-case-edge (anodised case, lit edge), --scene-plate (the plate between keys)
Palette:
  --bg #ECE2D0 the desk mat, sand under window light · --surface #F6F0E6 paper on the mat · --surface-2 #E0D5C2 hover · --surface-3 #D3C7B2 selected and hovered
  --line #CFC3AF · --line-strong #8B7D6E · --ink #1E1A16 dark walnut · --ink-2 #5A4F45 · --ink-3 #7D7064 (labels only)
  --primary #3E6B35 the olive accent key: Enter, the live LED, the one action · --primary-ink #F6F0E6 · --primary-soft #D5DEC6 · --link #2E5527
  --secondary #6B625A modifier keycaps · --tertiary #F1EBDF alpha keycaps
  --success #3E6B35 / soft #D5DEC6 / on-soft #2E5527 · --danger #A8352B / soft #EED3CB / on-soft #7E261E
  Keycaps: alpha #F1EBDF face, #FBF8F2 highlight, #C4BAA8 wall · modifier #6B625A / #857B72 / #463F3A · accent #3E6B35 / #5C8A52 / #27471F
  Contrast: ink on bg 13.5, ink-2 on bg 6.2, primary on bg 4.9, primary-ink on primary 5.5, alpha legends 12.6, modifier legends 5.3
Type:
  Bricolage Grotesque (display, 800): wide and blunt, a keycap legend blown up to headline size; a face with hands on it, for a maker's object.
  Manrope (text, 400 to 700, tabular figures for the readouts): the direction's own text face, calm beside a loud display. Free: took Manrope from studio-display, because the direction is clay-launch and its text face already fits the world.
  No mono. Readouts use the text face with tabular-nums.
  Not: Michroma, IM Fell English, Rozha One, Anybody (the display faces of the recent Free sites), and Schibsted Grotesk (tried first; weight 400 renders a gap before punctuation in Chromium).
Dials: variance 8 · motion 9 · density 4
Kind: website
Mode: new kit
Recipe: landing · Direction: clay-launch (their words: play, mechanical, launch; world: keycaps, a switch, a maker's desk; mood: warm, crafted, a maker). Recent: landing/playable used on 6 Oct for KEY-01, landing/grid-launch on 6 Oct for KEY-01, landing/bench-at-night claimed on 7 Oct for KEY-01 by another build, so none of those again.
Theme: free (no pair; the page is one daylight mode)
Why this palette: a keyboard launch under window light, bone caps and one olive key, because the three recent Free sites were all dark with an orange accent and the other KEY-01 build today is bone and blue.
Rejected: kiln (the direction's theme, terracotta primary: orange again), bone-signal (the playable direction's theme, used on 6 Oct).
Pairing: free
Family: soft (radius 14, pills on chips and the primary button, control 44 web / 48 phone, air)
Icons: Lounge Icons, 24px, stroke 1.75 (speaker, arrow, check, alert)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: the playable board (lead). No supporting effect: the bento is built still with the entry fade.
Density: air (page padding 40, stack gap 24, card pad 20)
Column: 1120 frame; paragraphs stay under 48ch
Shell: none
Panel: none
Nav: none (one page; the footer lists the three anchors: Play the keyboard, What your finger felt, Get the launch date)
Phone nav: none
Pieces: playable-product-hero (rebuilt), bento-feature-grid, footer-newsletter-split
Sections: work bento-feature-grid (the direction's work: four live panels run off the board, a cut-open key, the sound drawn, the map, your line) · about none (no story given) · contact inside footer-newsletter-split (the form is the launch-date ask, so no separate CTA band) · footer footer-newsletter-split (the direction names footer-sitemap-columns, which needs five columns of real pages this product does not have; the newsletter split is the one footer on the list not used by a recent landing and it carries the form)
Unlike KEY-01 (key-01-a, 6 Oct): hero pattern matches, work differs, footer differs. One match, so it stands. Unlike key-01-b and the bench-at-night build: all three differ.
Default set aside: Recent picks blocks a hero already used for this recipe; their words ("actually play with it on the page") need the playable hero, so it is rebuilt for a keyboard rather than taken from the direction. Also set aside: the direction's effect stacking-cards-scroll, because the lead motion is the board itself and nothing else should move on the first screen.
Kept from their system: nothing (new product)
```

Decide the screen:
- Who: a keyboard person, who already knows what a mechanical keyboard is.
- Decision: do I want this keyboard.
- First thing they see: the board, and their own keystroke landing on it.
- Next action: type. Then: Send me the date.

One thing not built: a spec table. Every number in it would be invented.

## Sources
- theme free: see Palette above
- pairing free: see Type above
- family soft: radius 14px, https://www.designlounge.live
- playable-product-hero: motion, structure, the key map by KeyboardEvent.code, the sound rule, the idle invitation. https://www.designlounge.live/pieces/playable-product-hero
- bento-feature-grid: layout (4 columns, dense, hover lift 2px, hairline cells). https://www.designlounge.live/pieces/bento-feature-grid
- footer-newsletter-split: layout and the form chrome (underline field, polite live message, error and success underline). https://www.designlounge.live/pieces/footer-newsletter-split

## Still open
- The launch-date form has no endpoint. It validates and shows the success state on the page; wire the submit to a real list.
- The facts under Missing: price, date, maker, layout, switches, materials.
- Sound was verified through the page's own offline render (the waveform panel), not by ear.

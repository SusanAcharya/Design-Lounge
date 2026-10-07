# Dome After Dark · DESIGN.md

## Brief

Request, word for word:
"A site for a planetarium's late-night show. You scroll and you travel through space. Make it unforgettable."

Product: Dome After Dark (working name, replace), the public page for a planetarium's late-night show. The only facts given: it is a planetarium, the show is late at night, and the page is scrolled to travel through space.
For: someone deciding, late in the evening, whether the late show is worth staying up for. In the first ten seconds they should feel the lights go down and the dome open.
World: a dome, a star projector, the hour after closing
The one thing: the page is the show. You lie back in the dome, the house lights go down, and each scroll lifts you through the roof and out: the Moon, Saturn, the Orion Nebula, Andromeda. A readout counts how far you are from your seat and how long ago the light you are looking at left.
Ambition: spectacle, because "make it unforgettable" and "you scroll and you travel through space"
Mode: Show, Free
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: the planetarium's name and address, the show's dates and times, doors, running time, prices, an age note, a booking link, a contact. Each one is an empty slot on the page. The stops use public astronomy figures only.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control (there is no sound on this page).

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the voyage (the dome, then four stops), one still section on what you pass, one still section on tonight's facts, and the footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

```
Product: Dome After Dark (working name, replace), a planetarium's late-night show
Who: someone deciding tonight whether to come to the late show
Decision: is the late show worth staying up for?
First thing they see: the house lights going down in the dome, and the sky opening above the seats
Next action: Start the show (scrolls you to the first stop)
Job of this pass: the public page for the show
Scope: one page: the voyage, the route, tonight, the footer
Idea: You are lying back in the dome. The house lights go down, the scroll lifts you through the roof, and you fly past the Moon and Saturn, into the Orion Nebula and on to Andromeda, while a readout tells you how long ago the light you are looking at set out.
Signature: the cove-lit rim of the dome that you pass through on the first scroll, with the reclined seats and the projector dropping away under you, and the readout "The light left" that ends at "2.5 million years ago".
Avoiding: the dark portfolio (serif name, mono kicker, clock); the Apogee demo as it ships (Earth's limb, amber-to-rose title, mission clock); the recent Late Light build (IM Fell English, red-orange on black, museum placards). Studio-template moves used: none of the four.
Register: scroll-space-voyage
Show: yes, Free · centrepiece scroll-space-voyage, re-skinned for a dome · light: the star projector's lamp (a cool lilac-white) with the dome's red cove lights at the rim · scene: --scene-house (the cove's night-vision red, for the rim and the house-light flare), --scene-lamp (the lamp, for the one word and the glows), --scene-nebula (hydrogen rose, Orion), --scene-ring (ice-gold, Saturn)
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: event · Direction: deep-field (their words: late-night, scroll, travel through space; mood: a show you travel through, the scroll is the journey, starlight on black). The planetarium is the venue; the show is a night with hours, so event, not museum. Museum's star-dome also fits the words, and it is in the history for 6 Oct, so it would not be taken anyway.
Theme: Free (candidate deep-field set aside: its amber on near-black is what the last three Free sites sat on; this world's light is a lilac lamp and a red cove) (pair: none, the show is only ever at night)
Why this theme: the colours come from the room: the dome's blue-black, the projector's lamp, the red lights that keep your night vision, the bodies you pass.
Rejected: deep-field (amber), midnight-drive (synthwave, a road not a dome), observatory (star-gold, a museum not a show)
Pairing: Free (candidate night-show set aside; its move, a film serif set huge with one italic word, is kept, in a Didone instead of a film face)
Family: lit · radius 999px on controls, 20px on cards (lit names only the pill; the card value is on this sheet), shadow 0 30px 80px -30px rgba(0,0,0,.6) on hover only
Icons: Lounge Icons, 24px, stroke 1.75 (arrow-right, arrow-up, clock)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: scroll-space-voyage (camera eased 8.5% per frame, copy linear in scroll)
Density: air · page padding 36 · stack gap 24 · card pad 20 · control 44 web / 48 phone
Column: 720px for paragraphs; the voyage, the route and the bands use the full frame
Shell: none
Panel: none
Nav: The route · Tonight
Phone nav: the same two links, inline (two items need no drawer)
Pieces: scroll-space-voyage, bento-feature-grid, contact-booking-hours, footer-centered-colophon
Sections: hero scroll-space-voyage · work bento-feature-grid (the stops are five things of different weight; the direction's week-schedule needs show times nobody gave, so it would be invented) · about none (no story was given; the route is the about) · contact contact-booking-hours (a place people visit at an hour; its hours table carries the six missing facts as slots) · footer footer-centered-colophon (the direction's footer-sitemap-columns needs five columns of pages this one-page show does not have; the colophon signs off with the name, the address slot and the credit)
Unlike recent culture sites: Late Light (museum/star-dome, 6 Oct) shares the hero scroll-space-voyage; work (bento vs museum placards) and footer (colophon vs giant wordmark) differ, one match, so it stands. Late Light b (museum/night-gallery) shares only the footer. Education and music lines share nothing.
Free check: display Bodoni Moda is none of the last three Free displays (IM Fell English, Rozha One, Michroma). The pair #070b16 / #c9b8ff is new.
Set aside: Dials motion 9 names grow-grid for a grid; Show mode rule 5 builds supporting sections still, so the route bento is still. Also the brief's scroll cue, its four-cell badge, and its live dot are dropped (label limit, Look).
Kept from their system: nothing, there was none
```

Palette (Free, from the light in the room):
- `--bg` #070b16: the dome's dark, a blue-black, not pure black
- `--surface` #0e1424, `--surface-2` #151c31, `--surface-3` #1c2440: the dome wall stepping toward the cove
- `--line` rgba(236,233,246,.14), `--line-strong` rgba(236,233,246,.3): hairlines in starlight
- `--ink` #ece9f6: star white with a breath of violet. `--ink-2` at .74, `--ink-3` at .52 (labels only)
- `--primary` #c9b8ff: the projector's lamp through the lens, lilac-white. `--primary-ink` #120b2a. `--primary-soft` rgba(201,184,255,.16). `--link` #d9ccff
- `--scene-house` #ff6a55: the red cove lights that keep your night vision. Rim, house flare, seat highlights
- `--scene-lamp` #c9b8ff: the lamp, for the one word in the title and the star halos
- `--scene-nebula` #ff8fa8: hydrogen rose, Orion's glow
- `--scene-ring` #e9d2a0: ice-gold, Saturn's rings
- Contrast: `--ink-2` on `--bg` about 9:1, `--ink-3` about 5:1, `--primary-ink` on `--primary` about 11:1

Type (Free):
- Display: Bodoni Moda. A Didone's hairlines at 15vw sparkle like the lamp, and its true italic carries the one word that changes voice ("down."). Not Instrument Serif, not IM Fell.
- Text and readouts: Source Sans 3, with tabular figures for the readouts and the facts. Plain, legible at 17px on a dark ground, and it reads like the instrument labels in an observatory. No mono is loaded; `.num` is Source Sans 3 tabular.

Four lines on the hero: the largest type is "Lights down." (the answer: the show starts). The one primary is "Start the show". Every sentence names the Moon, Saturn, Orion or Andromeda by figure. After five seconds: the dome's red rim and "Lights down."

## Sources
- theme free — the palette above (candidate https://www.designlounge.live/themes/deep-field)
- pairing free — the type above (candidate https://www.designlounge.live/type/night-show)
- family lit — 999px controls, 20px cards — https://www.designlounge.live
- scroll-space-voyage — motion, layout (the voyage: canvas, chapters, rail, readouts) — https://www.designlounge.live/demo/scroll-space-voyage.html
- bento-feature-grid — layout (the route, 4 x 3, 16px gap) — https://www.designlounge.live/demo/bento-feature-grid.html
- contact-booking-hours — layout (tonight: giant italic line, hours table) — https://www.designlounge.live/demo/contact-booking-hours.html
- footer-centered-colophon — layout, component (the colophon, back to top) — https://www.designlounge.live/demo/footer-centered-colophon.html

Credit: Designed using Design Lounge · https://www.designlounge.live

## Look

Opened with Playwright (headless Chromium) at 1280x800 and 390x844, scrolled in steps through every stop, and once more with reduced motion on.

```
Match
Column: 720px for paragraphs (the voyage copy is min(620px, 48vw); the route and tonight use the full frame)
Column when the rail is closed: no rail
Page padding: 36px web, 20px phone (48px on the route band)
Control height / radius: 44px / 999px web, 48px / 999px phone; cards 20px
Amount face: Source Sans 3, tabular
Shell: none
Panel: none
Nav: The route · Tonight
Phone nav: the same two links, inline
Fails: none after the pass below
```

Fixed on the pass: Saturn's sprite drew its night side over the whole square (terminator now clipped to the planet); the Orion sprite was a hot white blob (rebuilt as wings, a soft bay and the Trapezium); the rail label sat on the right-aligned headlines (right-aligned stops now clear the rail by 160px above 900px); the fixed header collided with the route heading once the voyage ended (the header hides with the readouts); the log-scale labels touched on the phone (Orion's labels stack below, Andromeda's above); the seat cell had lost its seats (the cell paints a crop of the lower dome).

```
Correction: too dense
Changed: the Andromeda facts wrapped to two rows at 1280; the third fact is "1 trillion" and the copy column is 620px, so the row holds
Left alone: the theme, the pairing, the family, and the other screens
```

Checks: `node /private/tmp/proof/check.mjs` prints 0 console errors at both sizes, scrollWidth 1280 and 390, no horizontal overflow.

Still open: the planetarium's name, address, show dates and times, doors, running time, prices, age note and booking link (six slots in Tonight, one in the footer, the wordmark). No favicon.ico (favicon.svg plus apple-touch-icon.png ship). Sound: none on the page by design.

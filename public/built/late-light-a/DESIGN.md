# Late Light (look A)

## Brief

Request, word for word:
"A site for a planetarium's late-night show. You scroll and you travel through space. Make it unforgettable."

Product: Late Light, a planetarium's late-night show. The site is the show's front door: you scroll, and you travel out through space.
For: someone deciding whether to go to the late show, on a laptop or a phone, who should feel the distance and the dark of the dome within ten seconds.
World: the dome after the house lights go down, red dark-adaptation lamps, old light
The one thing: the page is the trip. You start in a reclined seat under the dome. Scrolling drops the room away and flies you past the Moon, Saturn, the Pleiades, the Orion Nebula and Andromeda. A readout says how late each light is: how long it travelled, and when it left.
Ambition: spectacle, because "Make it unforgettable" and "you scroll and you travel through space".
Mode: Show, Free
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: the planetarium's name and address, show dates and times, ticket prices and the booking link, the running time, any contact email, a logo. The build leaves labelled slots for show times, address and tickets. Astronomy uses rounded public figures only.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control. (No sound: the subject is light, not sound.)
- Must be clearly different from look B (museum / night-gallery: Observatory navy and star-gold, Bauhaus School type, a Bauhaus composition hero, a contact sheet of works, a colophon footer).

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the voyage (seat plus five bodies), the wall of plates with placards, and the footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

Product: Late Light, a planetarium's late-night show
Who: someone who might go to the late show, curious, not an astronomer
Decision: is this a night I want to spend under the dome
First thing they see: the dome going dark around their seat, and "Late Light" set huge
Next action: scroll (the trip), then read the plates
Job of this pass: the public one-page site
Scope: voyage, wall, footer
Idea: You sit under the dome, the house lights go down, and scrolling lifts you out of your seat and past five bodies, each one's light arriving later than the last.
Signature: the late-light readout. "The light left" shows the clock time the light left (one second ago for the Moon, ticking live), then the year it left (1582 for the Pleiades, 682 for the Orion Nebula), then "2.5 million years ago".
Avoiding: the deep-field launch template (Earth limb, amber-to-rose on black, a film-title serif) and look B's navy and gold. Also the dark portfolio and the studio template: no numbered sections, no hairline grid.
Register: scroll-space-voyage
Show: yes, Free · centrepiece scroll-space-voyage, re-skinned (dome plate opens, five bodies, deep field ends) · light: the Sun, from the upper left, on every body; in the dome, the red cove lamps · scene: --scene-cove (dark-adaptation red), --scene-ha (hydrogen-alpha pink), --scene-oiii (oxygen teal), --scene-bulb (house lights, the intro only)
Palette:
- --bg #07050b, plum-black of the dome with the lights off (not pure black)
- --surface #110c16, --surface-2 #1a1320, --surface-3 #231a2a, the dome wall in the corridor
- --ink #f0e8e2, warm starlight white. --ink-2 at 74%, --ink-3 at 56%
- --primary #ff4b3e, the red dark-adaptation lamp planetaria use so your eyes stay open to the dark. --primary-ink #1a0504. --primary-soft 16% red
- --link #ff7d70, the lamp lifted to read as text
- --scene-ha #ff5a7a and --scene-oiii #5fd8c8, the two narrowband glows of a nebula, inside the canvas only
Type:
- Display: IM Fell English (roman and italic). The Fell types are 17th-century letterpress, the era of the first printed star atlases. At 16vw its rough ink edges read as engraved.
- Text and numbers: Atkinson Hyperlegible Next. Drawn for low vision, which is what everyone has in a dark dome. Readouts use its tabular figures. No mono is added.
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: museum · Direction: star-dome (their words: a planetarium, a late-night show, you travel through space; mood: "a science night or a launch, the scroll flies you out from the ground")
Recent: museum/night-gallery used on 6 Oct for Late Light look B, so not again. This is the other look: Show, Free, against B's locked Lounge look.
Theme: Free (direction's deep-field theme was a candidate; rejected because its amber-to-rose is a launch, and a planetarium's own light is the red lamp)
Why this colour: a planetarium at night is lit only by red lamps, and the nebulae it shows glow hydrogen pink and oxygen teal
Rejected: deep-field (launch amber), observatory (look B's)
Pairing: Free (direction's night-show was a candidate; rejected because its film-title serif is the launch template, and look B and Aadhi Raat already lean on show pairings)
Family: lit, radius 999px on controls, outline buttons, air density, shadow 0 30px 80px -30px rgba(0,0,0,.6)
Icons: Lounge Icons, 24px, stroke 1.75 (arrow-up, chevrons, close)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: scroll-space-voyage, supporting footer-giant-wordmark-reveal (motion 9 allows one)
Density: air
Shell: none
Panel: none (the plate dialog has its own 380px reading panel from its brief)
Nav: Late Light (home), The plates
Phone nav: the same two links in the header, no drawer needed
Pieces: scroll-space-voyage, gallery-museum-placard, footer-giant-wordmark-reveal
Sections: work gallery-museum-placard (the direction's work; the bodies you passed hang as plates with wall labels, so it serves the Idea) · about none (no story given) · contact none (no address, email or hours given; slots in the footer) · footer footer-giant-wordmark-reveal (the direction's footer)
Unlike recent museum and culture sites: hero, work and footer all differ from Late Light B (hero-bauhaus-composition, gallery-contact-sheet, footer-centered-colophon) and from the education and music lines.
Default set aside: the voyage brief's numbered chapter labels ("03 · Moon") and "Scroll to lift off" cue are dropped (Look fails). The footer's studio clock becomes the visitor's own time, and its email line becomes tonight's Moon phase, because there is no email and no address.
Kept from their system: nothing, empty folder

## Correction
Fails: none after fixes (overflow, HUD over the wall, plates wrapping, phone hero under the header).
Correction: wrong noun. The Orion Nebula sprite read as a starburst with tentacles, not a cloud. Repainted as one broad glow with four short curled lobes, on the canvas and on its wall plate.
Left alone: the dome, the readouts, the wall, the footer wordmark.

## Files
index.html, styles.css, main.js, favicon.svg, favicon.ico (32px), apple-touch-icon.png (180), og-image.png (1200×630), wordmark.svg (IM Fell English as paths), DESIGN.md.

## Sources
- theme Free (candidate considered: deep-field) — https://www.designlounge.live/themes/deep-field
- pairing Free (candidate considered: night-show) — https://www.designlounge.live/type/night-show
- family lit — 999px controls
- scroll-space-voyage — layout and motion — https://www.designlounge.live/demo/scroll-space-voyage.html
- gallery-museum-placard — layout and component — https://www.designlounge.live/demo/gallery-museum-placard.html
- footer-giant-wordmark-reveal — layout and motion — https://www.designlounge.live/demo/footer-giant-wordmark-reveal.html

Designed using Design Lounge (https://www.designlounge.live)

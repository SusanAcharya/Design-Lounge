# Late Light (working name, replace)

## Brief

Request, word for word:
"A site for a planetarium's late-night show. You scroll and you travel through space. Make it unforgettable."

Product: Late Light (working name, replace), a planetarium's late-night show. The site is the show's front door: you scroll, and you travel through space.
For: someone deciding whether to go to the late show, on a laptop or a phone, who should feel the distance within ten seconds.
World: the dome from above at night, sodium lamps, old light
The one thing: the page is the voyage, by powers of ten. You start on the crown of the dome. Every scroll pulls the camera back so the frame is ten times wider, and the frame you just left shrinks into the middle of the new one, square inside square, all the way to the next galaxy. The dome never leaves the centre. Two readouts say how wide the frame is and how long light takes to cross it.
Ambition: spectacle, because "Make it unforgettable" and "you scroll and you travel through space".
Mode: Show, Free
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: the planetarium's name, its address, show dates and times, the running time, ticket prices and the booking link, a contact email, a logo. The build leaves labelled slots for doors, running time, address and tickets, and links nothing it does not have. Astronomy uses rounded public figures only.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control. (No sound: the subject is light.)
- Must not repeat the two earlier Late Light builds: A (seat under the dome, a fly-through on scroll-space-voyage, red lamp, IM Fell English) or B (museum night-gallery, Observatory navy and gold, Bauhaus).

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the voyage (the dome plus ten stops to the Local Group), the frames strip, the visit block, and the footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

Product: Late Light, a planetarium's late-night show
Who: someone who might go to the late show, curious, not an astronomer
Decision: is this a night I want to spend under the dome
First thing they see: the crown of the dome from above, lit by the moon, with "Late Light" set huge across it, and a square frame marked "10 m"
Next action: scroll (each step is ten times further), then the frames, then the visit slots
Job of this pass: the public one-page site
Scope: voyage, frames, visit, footer
Idea: Every scroll steps the camera back ten times further from the dome, and the frame you just left shrinks into the centre of the new one. The dome never moves. It is the dot you came from, inside square after square, until the frame is ten million light-years wide.
Signature: the nested frames. Each power of ten leaves a thin ice-blue square with its width written in the corner (10 m, 1 km, 10,000 km), so the whole journey stays visible as squares inside squares, down to the dome.
Avoiding: the deep-field launch template (an Earth limb, amber-to-rose on black, a film-title serif); look A's red-lamp fly-through and look B's navy and gold Bauhaus; the dark portfolio; the studio template (no numbered eyebrows, no hairline grid, no giant wordmark footer).
Register: built for this (the pull-back voyage, from the scroll-space-voyage method)
Show: yes, Free · centrepiece built for this (scroll-space-voyage's scroll-to-camera, sticky copy, index and HUD, re-made as a logarithmic pull-back) · light: the Sun, from the upper left; at the dome it arrives second-hand off the Moon, and the streets add sodium · scene: --scene-moon (moonlight on the dome and clouds), --scene-sodium (street lamps and city glow), --scene-sun (the Sun, the day crescent, the galactic bulge), --scene-ha (hydrogen-alpha pink in the spiral arms), canvas only
Free: no theme or pairing taken. Deep Field was the direction's candidate and was rejected (its amber-to-rose is the launch look and Late Light A already leaned on red-amber). Night Show was rejected (its film-title serif is that same template).
Palette:
- --bg #050811, blue-black of the sky above a town with the projector on, not pure black
- --surface #0b1019, --surface-2 #121a27, --surface-3 #1b2535, the film base and the light box shell
- --line #1b2433, --line-strong #3a4659
- --ink #eef0f4, cold starlight white. --ink-2 #b8bfcc. --ink-3 #7f8899 (5.4:1 on --bg, captions only)
- --primary #9fd8ff, the ice-white beam of a star projector. --primary-ink #06101a. --primary-soft #15283a. --link #9fd8ff (12:1 on --bg)
- --secondary #ffb45c, sodium amber: the grease-pencil ring on the chosen frame, and the street lamps in the canvas
- --tertiary #ff7a9e, hydrogen-alpha pink, canvas only
Type:
- Display and numbers: Jost, 300 and 400, with its italic. A Futura revival: Futura is the lettering of the first Zeiss planetaria and the face on the plaque Apollo 11 left on the Moon. At 14vw its thin geometric strokes read like projected light. Readouts use its tabular figures, so no mono is added.
- Text: Newsreader, 400 and italic. A serif drawn for screens at reading sizes, so 18px copy stays comfortable in the dark, and its italic carries the one voice word in a sentence.
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: event (a late-night show is a programme with hours) · Direction: deep-field (their words: a show, you travel, space; mood: "a show you travel through, the scroll is the journey")
Recent: museum/star-dome and museum/night-gallery were used on 6 Oct for Late Light A and B, so neither again. The last three Free sites used IM Fell English, Rozha One and Michroma on red-orange primaries (#ff4b3e, #ff5e2b, #ff6a3d), so this one is ice on blue-black with a geometric sans.
Theme: Free
Why this colour: a planetarium's own light is a projector beam, cold and white-blue, and from above at night the town is sodium. The accent is the beam.
Rejected: deep-field (launch amber), observatory (look B's)
Pairing: Free
Family: lit, radius 999px on controls, outline buttons, air density, shadow 0 30px 80px -30px rgba(0,0,0,.6)
Icons: Lounge Icons, 24px, stroke 1.75 (arrow-up, chevron-left, chevron-right)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: the pull-back voyage (camera eased 8.5% per frame, copy fades in scroll, index line 500ms expo). No supporting effect: motion 9 would allow one, but no section has the job the Dials pieces name. The frames strip is built still, with the brief's select FLIP and loupe as its own interaction.
Density: air
Column: 720px for paragraphs
Page padding: 36px web, 20px phone
Control: 44px web / 48px phone, radius 999px
Shell: none
Panel: none
Nav: Late Light (home), The frames, Visit
Phone nav: the same three links in the header, no drawer
Pieces: built for this (voyage), gallery-film-strip, contact-booking-hours, footer-centered-colophon
Sections: work gallery-film-strip (the eleven frames of the journey, drawn by the same code, on a strip you can scan and magnify; the direction's week-schedule needs dates nobody gave) · about none (no story given) · contact contact-booking-hours (its two-column visit shape; the hours table becomes four labelled slots, the dialog and mailto are dropped because there is no email or booking link) · footer footer-centered-colophon (a one-page show has no sitemap; the direction's footer-sitemap-columns is for a product with many pages)
Unlike recent culture sites: Late Light A (scroll-space-voyage, gallery-museum-placard, footer-giant-wordmark-reveal): hero differs (built for this), work differs, footer differs. Late Light B (hero-bauhaus-composition, gallery-contact-sheet, footer-centered-colophon): footer matches, hero and work differ. One match, so it stands. Aadhi Raat A and B: all three differ.
Default set aside: the voyage brief's numbered chapter labels and "Scroll to lift off" cue are dropped (Look fails). Its chapter index moved from the right edge to a row of ticks at the bottom right, beside the readouts, with the current stop's name above the row, because a label beside its line sat on top of the right-aligned copy. The film strip's Positive/Negative toggle and its edge print of film stock are the demo's and are dropped; the edge print carries each frame's real width instead. The colophon's fading last paragraph belongs to an essay and is dropped.
Kept from their system: nothing, empty folder

## Look

Looked at: web-hero.png, web-e1 to web-e23 (thirteen stops), web3-railhover.png, web2-strip.png, web2-loupe.png, web-visit.png, web-footer.png (1280x800); phone-hero.png, phone3-e9.png, phone3-e23.png, phone2-strip.png (390x844); still-hero.png (1280x800, reduced motion) with Playwright (headless Chromium).
Fails found and fixed: the Earth at stop 7 painted as a bright blue ball (a radial gradient with a non-zero inner radius fills the disc with its first stop; the atmosphere ring now starts at radius 0 and stays clear until the limb) and a stair-stepped limb (the disc is now drawn at full resolution with an anti-aliased edge); the stop index's label sat on the right-aligned copy (the index is now a row at the bottom right); the final frame hid Andromeda under the copy's scrim (the last stop's copy moved left, the galaxies got halos and labels); canvas labels ran under the phone's copy (labels are clipped to the top 40 percent on phones); the strip's edge print was in the second accent (now --ink-3).

Match
Column: 720px (paragraphs); the hero, the frames and the visit grid use the 1120 frame
Page padding: 36px web, 20px phone
Control height / radius: 44px web, 48px phone / 999px
Amount face: Jost, tabular
Shell: none
Panel: none
Nav: Late Light, The frames, Visit
Phone nav: the same links in the header
Fails: none

Remember after five seconds: "a square marked 10 m around the crown of a dome, and Late Light across it" · could be anyone's: no

## Correction
Correction: the wrong noun
Changed: the visit table's second column was headed "Confirmed" over a column where nothing is confirmed yet. It is now "Answer".
Left alone: the theme, the pairing, the family, and the other screens

## Files
index.html, styles.css, main.js, favicon.svg, favicon.ico (32px), apple-touch-icon.png (180x180), og-image.png (1200x630), DESIGN.md.
Still open: a wordmark SVG with the text as paths (no font-to-path tool was available; the wordmark is live text in Jost), the planetarium's name, address, times, running time and ticket link (four labelled slots in Visit), and the frames strip's drag was exercised by script, not by hand.

## Sources
- theme Free (candidate considered: deep-field) — https://www.designlounge.live/themes/deep-field
- pairing Free (candidate considered: night-show) — https://www.designlounge.live/type/night-show
- family lit — 999px controls
- scroll-space-voyage — method only (scroll to camera, sticky copy, index, HUD) — https://www.designlounge.live/demo/scroll-space-voyage.html
- gallery-film-strip — layout and component — https://www.designlounge.live/demo/gallery-film-strip.html
- contact-booking-hours — layout — https://www.designlounge.live/demo/contact-booking-hours.html
- footer-centered-colophon — layout — https://www.designlounge.live/demo/footer-centered-colophon.html

Designed using Design Lounge (https://www.designlounge.live)

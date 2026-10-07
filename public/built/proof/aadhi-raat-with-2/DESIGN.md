# Aadhi Raat Records

## Brief

Request, word for word:
"Make a website for a record label that only releases music recorded after midnight in Kathmandu. Go wild, I want it to feel like an Awwwards site of the day."

Product: Aadhi Raat Records (working name, replace; "aadhi raat" is Nepali for midnight), a record label in Kathmandu with one rule: it releases music recorded after midnight, Kathmandu time (UTC+5:45), and nothing else.
For: a musician in Kathmandu at 1am wondering whether this label is for them, and a listener anywhere who wants to feel the hour in ten seconds.
World: a tape reel under one tungsten lamp, the valley's sodium streetlights, a clock that says 02:14
The one thing: the label's tape machine is on the page, lit by the lamp, and it knows what time it is in Kathmandu. Before midnight the REC lamp is dark and the page counts down to it. After midnight the lamp is on. You can roll the tape and hear the room, and you can hand it a recording and it reads the clock on the file.
Ambition: spectacle, because "Go wild" and "Awwwards site of the day".
Mode: Show, Free
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: the label's real name, the catalogue (no artists, no releases, so nothing is listed and nothing is invented), an address to send recordings to (the page checks a file's clock but does not send it), and when "after midnight" ends. Assumed: the window closes at first light, computed from Kathmandu's sunrise, and said so on the page.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the tape-machine centrepiece with its live readouts and sound, the week board of when the tape may roll, the three stacking steps ending in the clock check, and the colophon footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

Product: Aadhi Raat Records, a label that only releases music recorded after midnight in Kathmandu.
Who: a musician in Kathmandu late at night; a listener anywhere.
Decision: is it after midnight in Kathmandu, and does my recording count?
First thing they see: the tape machine under the lamp, the name, and the Kathmandu clock.
Next action: roll the tape (hear the room), then check a recording.
Job of this pass: the public site, one page.
Scope: hero centrepiece, week board, three steps with the clock check, footer.
Idea: the label's reel-to-reel is on the page under one lamp, and it keeps Kathmandu time. The REC lamp only lights after midnight. You can roll it and hear the room.
Signature: the clock check. Drop any audio file on the last step and the page reads the file's own clock, converts it to Kathmandu time, and says whether it was recorded after midnight and before first light. Nothing is uploaded.
Avoiding: the dark portfolio (serif italic name, numbered list, local clock as decoration) and the neon music template (magenta/cyan tube letters, a coverflow). The clock here is the product's rule, not an ornament.
Register: playable-product-hero (the object you use; re-skinned as a tape machine)
Show: yes, Free · centrepiece built for this on the playable-product-hero brief · light: one tungsten bulb hanging top-left of the deck · scene: --scene-sky (the valley night behind the deck), --scene-lamp (the bulb's core and its cone), --scene-sodium (the streetlights on the skyline), --scene-rec (the record lamp, lit only after midnight)
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: music · Direction: observatory (their world: a tape reel, a lamp, a clock at 02:14; mood "A record label, navy and gold, the reel first"). Recent: music/after-midnight (6 Oct, Aadhi Raat a) and music/first-bell (6 Oct, Aadhi Raat b) are in the history, so neither again.
Theme: free (candidate observatory read and set aside: its gold is a star-gold on glass; this light is tungsten on steel)
Why this theme: the colours come from the lamp. Tungsten amber on a near-black navy, cream like a VU meter face, sodium orange only on the skyline.
Rejected: observatory (navy and gold, but cool and glassy), sodium-night (used by the first Aadhi Raat build).
Pairing: free. Archivo (display and text: one variable family, width 62-125, so the wordmark can sit at 900/125 like a badge on a deck and the body at 400/100), Red Hat Mono (readouts and numbers, tabular), Yatra One (the Devanagari word आधी रात, the one word that changes voice; the Lounge cinema pairing was read and set aside, Anton is a poster, not a machine).
Family: editorial (locked by the direction): radius 2px, outline buttons 40px web / 44px phone, air density, no shadow on the interface. Drawn objects keep their own corners and shadows.
Icons: Lounge Icons, 24px, stroke 1.75 (menu, x, play, pause, upload, check, arrow-up)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: playable-product-hero (lead), stacking-cards-scroll (supporting, from Dials motion 9: a list of steps). Name number: Aadhi Raat Records = 145, two candidate sections (week board, steps), 145 mod 2 = 1, so the steps move and the week board stays still.
Density: air
Shell: none
Panel: none
Nav: The window · How it gets in · Check a recording
Phone nav: drawer (hamburger-circle-reveal) · same labels
Pieces: playable-product-hero (centrepiece), navbar-island-morph (the idle pill only), hamburger-circle-reveal, week-schedule, stacking-cards-scroll, footer-centered-colophon
Sections: work week-schedule (kept from the direction: translated to the seven nights of this week and the window 00:00 to first light, computed, with tonight pressed) · about: none as a separate section, the rule is the hero sentence · contact: the clock check inside the last stacking card (built on the brief's card; the drop zone is the Signature, built without a piece) · footer footer-centered-colophon (the direction's footer-newsletter-split needs an address and a list to subscribe to; there is none, so a dead form would fail Real content only. The colophon fits a label with one rule and no sitemap.)
Unlike recent music and culture sites: hero differs from both Aadhi Raat builds and both Late Light builds; work (week-schedule) differs from coverflow-strip, corner-player, gallery-contact-sheet, gallery-museum-placard; footer matches Late Light b (footer-centered-colophon). One match, so it stands.
Kept from their system: none
Set aside: none of the skill's defaults were set aside. The direction's hero (portfolio-motion-showreel) and effect (webgl-shader-hero) became candidates under Show mode and lost: the showreel needs four real pieces of work and the shader would be a second effect on the hero.

Palette (the light is one tungsten bulb over a steel deck, with the valley's sodium lamps far behind):
- --bg #0a0b12 · the page, the night with a little navy in it
- --surface #13151f · cards and the week board days
- --surface-2 #1b1e2b · hover
- --surface-3 #262a3a · selected and hovered
- --line rgba(236,228,207,.14) · hairlines
- --line-strong rgba(236,228,207,.42) · strong border and outline buttons
- --ink #ece4cf · text, the cream of a VU meter face
- --ink-2 #b3ab97 · secondary text
- --ink-3 #7d7766 · muted, never a sentence
- --primary #f3b63f · tungsten amber, the one bright stop
- --primary-ink #141210
- --primary-soft rgba(243,182,63,.14)
- --link #f3c86a
- --success #8fd6ac on --success-soft · the verdict "qualifies" (live state)
- --danger #ff7a6b on --danger-soft · the verdict "not after midnight", and a file that cannot be read
- --scene-sky #0d1330 · the sky behind the skyline
- --scene-lamp #ffd48a · the bulb's core, the cone, the gradient on आधी रात
- --scene-sodium #ff9a3c · the streetlights
- --scene-rec #ff4a3d · the REC lamp

Type:
- Archivo, variable width and weight: display at 900 / width 125 (a badge stamped on a machine), text at 400 / width 100, 17-19px.
- Red Hat Mono: readouts and numbers, tabular, because a clock on a deck is set in a mono.
- Yatra One: आधी रात only. A brush Devanagari that reads like the label written on a tape box.

## Sources
- theme free — colours above, in place of https://www.designlounge.live/themes/observatory
- pairing free — faces above, in place of https://www.designlounge.live/type/cinema
- family editorial — radius 2px
- playable-product-hero — layout, motion, states of the centrepiece — https://www.designlounge.live/pieces/playable-product-hero
- navbar-island-morph — layout (the idle pill) — https://www.designlounge.live/pieces/navbar-island-morph
- hamburger-circle-reveal — motion, component (phone menu) — https://www.designlounge.live/pieces/hamburger-circle-reveal
- week-schedule — layout, states — https://www.designlounge.live/pieces/week-schedule
- stacking-cards-scroll — motion, layout — https://www.designlounge.live/pieces/stacking-cards-scroll
- footer-centered-colophon — layout — https://www.designlounge.live/pieces/footer-centered-colophon

## Look

Column: 720px for paragraphs. Page padding 56px web, 20px phone. Control height 40px web / 44px phone, radius 2px. Amount face: Red Hat Mono. Shell none. Panel none.

Looked at: web.png, web-s1 to web-s6, web-rolling.png, web-board.png, web-verdict.png (1280x800); phone.png, phone-s1 to phone-s6, phone-menu.png, phone-rolling.png, phone-board.png, phone-verdict.png (390x844); still.png and still-phone.png with reduced motion; with headless Chromium through Playwright, in the session scratchpad.
Fixed on sight: the Roll button sat over the head block and REC lamp (moved under the VU meters on the web, and the phone deck now reserves room for it); the streetlights were drawn on the deck plate (horizon moved above it); the clock caption on step 1 overlapped the dial; the step title floated 250px below its label; the phone week list kept the desktop block heights; "Check a recording" clipped in the phone menu; the board blocks wrapped their times.
Remember after five seconds: "a reel-to-reel under one lamp that keeps Kathmandu time, waiting for midnight" · could be anyone's: no
Correction: the REC lamp was too small for the thing the site hinges on. It is now 8.5px with a 48px glow and its engraving says "REC · from 00:00" until midnight, then "REC · after midnight".
Still open: no address to send a recording to (the gate checks the clock and says so, nothing is sent); no catalogue, so nothing is listed; the REC lamp lit and "The window open" readout were only seen in code, since it was 19:00 in Kathmandu at build time; the drone was heard by no one here (headless), only measured through the analyser driving the meters; the island nav takes only the idle pill from navbar-island-morph; the drop zone itself is the Signature and has no piece.

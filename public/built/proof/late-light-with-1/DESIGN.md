# Late Light (working name, replace)

## Brief

Request, word for word:
"A site for a planetarium's late-night show. You scroll and you travel through space. Make it unforgettable."

Product: Late Light (working name, replace), a planetarium's late-night show. The site is the show's front door, and the page itself is the show: you scroll, and you travel out through space.
For: someone deciding whether to spend a late night under the dome, on a laptop or a phone, who should feel the dark and the distance within ten seconds.
World: a dome on a hill after dark, one sodium lamp, old light
The one thing: the page is the voyage. You start outside the planetarium at the late hour, under the sky as it really is tonight, and each scroll carries you off the hill and further out: past the Moon as it really is tonight, past Jupiter, to the nearest star, to the black hole at the centre of the galaxy, and on to the oldest light there is. Two readouts count the distance from your seat and how long ago the light you are looking at left.
Ambition: spectacle, because "Make it unforgettable" and "You scroll and you travel through space".
Mode: Show, Free
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: the planetarium's name, city and address, the show's dates and times, running time, prices, the ticket link, a contact email, a logo. The page leaves one honest slot for the dates (an email field that asks to be told when they are set) and uses only public, rounded astronomy figures. No sound: the subject is light.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the voyage (the hill, the Moon, Jupiter, Proxima Centauri, Sagittarius A*, the first light), the departures board, the Take a seat band, and the engraved footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

Product: Late Light (working name, replace), a planetarium's late-night show
Who: someone who might come to the late show. Curious, not an astronomer. Knows what a planetarium is.
Decision: is this a night worth staying up for
First thing they see: the planetarium on its hill at the late hour, under tonight's real sky, "Late Light" set huge, the Moon at its real phase, the local time
Next action: scroll (the voyage), then leave an email to be told the dates
Job of this pass: the public one-page site
Scope: voyage, departures board, Take a seat band, footer
Idea: You stand outside the planetarium at the late hour, under the sky as it really is tonight. The scroll lifts you off the hill and carries you out past the Moon, Jupiter, the nearest star, the black hole at the centre of the galaxy, and the oldest light there is, while two readouts count how far you are from the hill and how long ago the light you are looking at left.
Signature: the Moon on the page is the Moon tonight. Its phase is computed from the date and drawn with the real terminator, in the sky over the dome on the first screen, as the body you pass in the first chapter, in the header readout and in the footer. The page is never the same two nights running.
Avoiding: the Apogee launch template (an Earth limb, amber-to-rose on black, Instrument Serif, numbered chapters, a scroll cue), the three other Late Light passes (look A: red lamp, IM Fell, placards, a giant wordmark footer; with-2: inside the dome, lilac, a bento and a colophon; with-3: ice blue, a pull-back voyage), the dark portfolio, and the studio template (no hairline grid, no numbered sections).
Register: scroll-space-voyage (the lead motion; their words "you scroll and you travel" name it)
Show: yes, Free · centrepiece built from two briefs: moonlit-ridge-hero's place-at-an-hour plate (the sky drawn live, the Moon with tonight's phase, the local clock, layers that sink on scroll) opens scroll-space-voyage's journey (one eased scroll value drives the camera, the copy, the index and the readouts) · light: the Moon (silver, from the upper right, on the dome and the hill) and the entrance's sodium lamp on the first screen; the Sun on Jupiter from the upper left and on the Moon from the side its phase sets tonight; Proxima and the accretion ring are their own light · scene: --scene-sky (the indigo of the air before you leave it), --scene-moon (the silver-blue of the halo), --scene-lamp (the sodium amber of the entrance and the path lights), --scene-ember (the orange of the accretion ring and of the oldest light's warm mottle), inside the canvas only
Palette (Free, from the light of a planetarium at its late hour):
- --bg #06070f, the sky with the city lights off: blue-black, not pure black
- --surface #0e1120, --surface-2 #171b30, --surface-3 #232848, the hill and the dome wall
- --line #1d2138, --line-strong #4a4f7a
- --ink #eeeaff, starlight (about 17:1 on --bg). --ink-2 #b4b0cc (about 9:1). --ink-3 #807c9e (labels only, about 4.6:1)
- --primary #9dff5f, the presenter's green laser, the one light that moves in a dark dome. The one word in the title, the current stop in the index, the one filled surface and the one filled button. --primary-ink #0c0a14. --primary-soft #1f3a1a. --link #b9ff8a. About 16:1 on --bg
- --secondary #ffb04a, the sodium lamp at the entrance (scene only, never a button). --tertiary #cfd9ff, moonlight, for the Moon's facts
- Feedback: --success #7fd6a4, --warning #ffb04a, --danger #ff7b7b, --info #8fd8ff, each with a dark ink and a soft wash
Type (Free):
- Display: Cormorant Garamond, 300 and 400, roman and italic. A show title card for a late hour: light strokes, tall ascenders, and an italic that reads as starlight at 17vw. Not a Didone, not the launch serif.
- Text: Hanken Grotesk, 400 to 600. Plain, warm, open counters that stay legible on a dark ground at 18px.
- Readouts, labels and the board: DM Mono, 400 and 500. Thin, even, tabular, so the distance and the light's age tick without jitter.
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: event (a late-night show is a programme with hours, so event, not museum) · Direction: place-and-hour (their words: a planetarium, a late-night show, you travel through space; mood: "a night tied to one city and one hour, the sky drawn live, the clock counting down": a planetarium is a place that draws the sky at an hour)
Recent: event/deep-field was claimed twice in the last hour by the two parallel passes (late-light-with-2 and -3), so it loses and place-and-hour is the next direction that fits. Museum/star-dome and museum/night-gallery were used on 6 Oct for looks A and B.
Theme: Free (the direction's sodium-night was the candidate; its sodium amber stays as the scene lamp, but as a primary it is the amber-on-black launch look, and the three Free sites before this one all ran red-orange on black). Pair: none, the night has one mode
Why this colour: in a dark dome the only light that moves is the presenter's green laser; outside, the Moon and one sodium lamp
Rejected: sodium-night (amber primary), deep-field (launch amber), the lilac and ice blue of the two parallel passes
Pairing: Free (the direction's night-show was the candidate; rejected because its film-title serif plus a mono is the launch template, and the parallel passes took Bodoni Moda and Newsreader)
Family: lit, radius 999px on controls, outline buttons, one filled primary, air density, shadow 0 30px 80px -30px rgba(0,0,0,.6). Drawn objects (the flaps, the bodies) keep their own corners
Icons: Lounge Icons, 24px, stroke 1.75 (arrow-right, arrow-up, moon)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: scroll-space-voyage. The board settles once on entry (its brief's 160ms flap, 28ms stagger) and that is its entry, not a scroll story. Motion 9 would allow a supporting piece from the Dials list; none of those sections exists here
Density: air
Column: 720px for paragraphs. Page padding 36px (20px on the phone). Control height 44px (the band's row is 56px from its brief). Radius 999px
Shell: none
Panel: none
Nav: Late Light (top), Departures, Your seat
Phone nav: the same three links in the header, the clock readout hidden under 560px
Pieces: moonlit-ridge-hero, scroll-space-voyage, split-flap-board, cta-split-dark-band, footer-engraved-caravan-strip
Sections: work split-flap-board (the direction's event-ticket-checkout needs seats and prices nobody gave; a departures board of tonight's five stops, from the event recipe's own list, is still, true, and the show's programme) · about none (no story given) · contact cta-split-dark-band (one ask, and the honest slot for the missing dates: leave an email, be told once) · footer footer-engraved-caravan-strip (the direction's footer; the newsletter moves to the band so there is one form, the caravan is parked and becomes someone walking up to the dome, the strip is engraved with the planetarium)
Unlike recent culture sites: against Late Light A (scroll-space-voyage, gallery-museum-placard, footer-giant-wordmark-reveal) nothing matches. Against Late Light B (hero-bauhaus-composition, gallery-contact-sheet, footer-centered-colophon) nothing matches. Against Aadhi Raat A (moonlit-ridge-hero, coverflow-strip, footer-newsletter-split) the hero matches only. Against Aadhi Raat B nothing matches. Free faces and colours: the last Free display faces were IM Fell English, Rozha One, Michroma, Bodoni Moda and Jost; the last bg/primary pairs were red-orange, lilac and ice blue on near-black. Cormorant Garamond and laser green repeat none of them.
Default set aside: the voyage brief's numbered chapter labels, badge row and "Scroll to lift off" cue are dropped (Look fails). The moonlit brief's coordinates, altitude and countdown pill are dropped because no place or hour was given; its sound is dropped because the subject is light. The band brief's 196px remnant and three SKUs are the demo's and are dropped; the band is the one large surface in --primary. The footer brief's clock and email form are not repeated (the header has the clock, the band has the form).
Kept from their system: nothing, empty folder

## Four lines

Who: someone deciding whether to come to the late show.
Decision: is this a night worth staying up for.
First thing they see: the planetarium on its hill under tonight's sky, and "Late Light".
Next action: scroll.

## Sources

- moonlit-ridge-hero, the opening plate: https://www.designlounge.live/demo/moonlit-ridge-hero.html
- scroll-space-voyage, the journey, re-skinned: https://www.designlounge.live/demo/scroll-space-voyage.html
- split-flap-board, still, settles once on entry: https://www.designlounge.live/demo/split-flap-board.html
- cta-split-dark-band, still: https://www.designlounge.live/demo/cta-split-dark-band.html
- footer-engraved-caravan-strip, parked: https://www.designlounge.live/demo/footer-engraved-caravan-strip.html
- Family Lit: https://www.designlounge.live (families in the library map)

## Files

- index.html, styles.css, main.js
- favicon.svg, favicon.ico, apple-touch-icon.png, share.png (1200 x 630)

## Look

Looked at: web-0 to web-8 (1280x800, hero and seven scroll steps), phone-0 to phone-5 (390x844), still-0 to still-2 (1280x800, prefers-reduced-motion: reduce), with Playwright's headless Chromium from the repository's node_modules (playwright-cli is not installed).
Fails found and fixed: the title did not render (the letter spans shared the chapter class `ch`, renamed `lt`); the index rail's current label sat on the headline of right-aligned chapters (those chapters now clear the rail by 76px); the fixed header's gradient sat over the board and footer type (the header turns solid once the voyage is past); on the phone the Sagittarius A* ring sat on its headline (bodies ride higher and the phone h2 is one step smaller); the Milky Way read as smoke (finer, lower-contrast blobs and a thousand specks); the descender of "Light" touched the hero lede (44px gap).
Remember after five seconds: "the laser-green Light over the planetarium dome, and the Moon that is really tonight's" · could be anyone's: no
Correction: too plain. The planetarium was a small silhouette on the first screen. Changed: the building and dome are a third larger on the hill, so the place reads from across the room. Left alone: the palette, the type, the family, and every other section.
Still open: the form has no endpoint (it validates and confirms in the page only); the dates, times, prices, ticket link, venue name and address are slots the planetarium fills; the board's flap settle and the title rise were seen in stills, not as motion.

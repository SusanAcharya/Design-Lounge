# KEY-01 · launch page, look A (Show mode, Free)

## Brief

Request, word for word:
"Build a launch page for a mechanical keyboard called KEY-01. I want people to be able to actually play with it on the page."

Product: KEY-01, a mechanical keyboard. No other facts were given.
For: someone who heard about KEY-01 and opens the launch page on a laptop or a phone. In ten seconds they want to know what it is like to type on.
World: keycaps, a felt desk mat, one desk lamp at night
The one thing: the keyboard is on the page and you type on it. Your real keys press the drawn keys, each one sinks and makes a synthesised switch sound, and what you type appears on the line above it.
Ambition: spectacle, because "actually play with it on the page" is "let people play with it".
Mode: Show, Free
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: price, ship date, the real layout, switches, keycap material, case material, maker name, any link for launch news, a contact email. The drawn layout is an illustration, the three switch sounds are a study of the three kinds of switch, and the footer says the price, switches and ship date are not announced.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL. Where only a real photo will do, leave a sized slot with one caption.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Must not match look B (/tmp/dl-pairs/key-01-b): landing / grid-launch, Ice Station, Swiss Precision, hero-swiss-grid-wordmark, stacking-cards-scroll, footer-engraved-caravan-strip.

Done means: the playable keyboard hero, a cut-open switch you press slowly, a session band counted from the visitor's own typing, and the giant keycap footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

Product: KEY-01, a mechanical keyboard, before launch
Who: a curious typist who has heard the name, on a laptop (physical keys) or a phone (touch, or the phone's own keyboard)
Decision: is this a keyboard I want to type on?
First thing they see: KEY-01, lit by a desk lamp, already waiting for their fingers
Next action: type
Job of this pass: the public launch page
Scope: one page, four parts
Idea: The keyboard is on the page, under a desk lamp. Type on it.
Signature: the footer wordmark is six giant keycaps, K E Y - 0 1, that rise out of the floor as you arrive and sink when you type their letters.
Avoiding: the SaaS template (gradient hero, three feature cards), the dark portfolio (amber line on black, mono kicker), and the studio template. Hairlines appear only inside the session band; there are no numbered sections, no tracked mono labels, no sticky scroll.
Register: playable-product-hero (lead). Supporting: stats count-up (once, on view) and the footer letter rise.
Show: yes, Free · centrepiece playable-product-hero, re-skinned from a 16-pad drum machine to a 68-key board · light one warm desk lamp, top left · scene --scene-lamp, --scene-glow, --scene-mat, --scene-case
Palette:
- --bg #101716, the felt desk mat at night, green-black
- --surface #161f1d / --surface-2 #1d2826 / --surface-3 #253230, the mat lifting toward the lamp
- --ink #f1eadf, ivory keycap plastic under warm light
- --ink-2 #bfb7aa / --ink-3 #938c80, the same plastic in shadow
- --primary #ff6a3d, the vermilion Esc and Enter keycaps, the one hot colour. --primary-ink #1a0c06
- --scene-lamp #ffd9a8 (highlights, the one word in light), --scene-glow #ffae5c (the pool on the mat), --scene-case #2f3436 (graphite case)
Type:
- Michroma (display, keycap legends, figures): a wide, squared face in the Microgramma line, the lettering of hardware panels and engraved keycap legends. Not Archivo, which look B's world and the library's Machined pairing use.
- IBM Plex Sans (body, controls, readouts with tabular figures): an engineering sans that reads well at 17px and keeps digits even.
Dials: variance 8 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: landing · Direction: playable (their words: actually play with it, a keyboard; mood: "a product you can touch on the page, it makes a sound")
Recent: landing/grid-launch used on 6 Oct for KEY-01 look B, so not again. Two looks rule: B is locked to the library, so A is Show mode, Free.
Theme: Free (direction's bone-signal considered; rejected because it is a daylight bench, and two looks must differ in theme)
Why this theme: the light of one lamp on a felt mat at night is the colour of typing late, and it is the opposite temperature and hour of look B's Ice Station.
Rejected: bone-signal (daylight, too close to the library demo), graphite-signal (the direction pair, a sharp bench with no warm light source).
Pairing: Free (Michroma + IBM Plex Sans). Rejected: machined (Archivo expanded is the demo's own voice).
Family: lit, radius 999px on controls, outline buttons, one filled primary, air density, shadow 0 30px 80px -30px rgba(0,0,0,.6)
Icons: Lounge Icons, 24px, stroke 1.75 (volume, arrow-up). The muted speaker is drawn in the same grammar: volume plus two strokes.
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: playable-product-hero
Density: air
Shell: none
Panel: none
Nav: wordmark, Sound on / off
Phone nav: none (one page)
Pieces: playable-product-hero, button-3d-press (keycap depth and press timing), stats-count-up-band, footer-giant-wordmark-reveal
Sections: work stats-count-up-band (the direction's work, re-skinned as the visitor's own session, because no product numbers were given and these are real) · about: built for this, a cut-open switch you press slowly (no piece in the library) · contact: none (no email or launch link given; listed as missing) · footer footer-giant-wordmark-reveal (the direction's footer; the letters are keycaps)
Unlike recent landing and selling sites: KEY-01 look B is hero-swiss-grid-wordmark / stacking-cards-scroll / footer-engraved-caravan-strip, Product-Helper is landing-devtool-dark / features-alternating-rows / footer-centered-colophon. Hero, work and footer all differ from both.
Kept from their system: nothing, there was none

Defaults set aside: the hero piece's idle invitation spells K E Y - 0 1 instead of a drum pattern, and the page has three moving parts (keyboard, count-up, footer rise), the limit in Register.

## Look

Remember: "a lamp-lit keyboard that types what I type" · could be anyone's: no
Fixed: chart bars inherited the header's `.bar` size (renamed `.sbar`); the desk mat overlapped the hint line (keyboard 1040px, stage padding); the phone wordmark widened the head grid (minmax(0, 1fr), 16.4vw).
Correction: too plain on the phone. Changed: the keyboard goes edge to edge below 760px (keys 20px to 23px). Left alone: the palette, the faces, the family, the other sections.

## Sources
- theme Free, colours above (direction theme considered: bone-signal, https://www.designlounge.live/themes/bone-signal)
- pairing Free, Michroma + IBM Plex Sans (direction pairing considered: machined, https://www.designlounge.live/type/machined)
- family lit, radius 999px
- playable-product-hero, layout + motion + component, https://www.designlounge.live/demo/playable-product-hero.html
- button-3d-press, component (keycap edge and press timing), https://www.designlounge.live/demo/button-3d-press.html
- stats-count-up-band, layout + motion, https://www.designlounge.live/demo/stats-count-up-band.html
- footer-giant-wordmark-reveal, layout + motion, https://www.designlounge.live/demo/footer-giant-wordmark-reveal.html
- cut-open switch, built from this sheet only, no library piece

Designed using Design Lounge (https://www.designlounge.live)

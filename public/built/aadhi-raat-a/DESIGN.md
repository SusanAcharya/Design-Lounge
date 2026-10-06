# Aadhi Raat Records · look A (Show mode, Free)

## Brief

Request, word for word:
"Make a website for a record label that only releases music recorded after midnight in Kathmandu. Go wild, I want it to feel like an Awwwards site of the day."

Product: Aadhi Raat Records, a record label that only releases music recorded after midnight in Kathmandu. No other facts were given.
For: a listener, a musician, or a writer who lands on the link and should feel, in ten seconds, the one rule of the label and the hour it lives in.
World: Kathmandu valley after midnight, the Himalaya under the moon, the red REC lamp.
The one thing: the valley itself, live, at Kathmandu's own time (UTC+5:45). A countdown runs to midnight, and once the clocks there pass twelve the REC lamp lights and the window stays open until today's sunrise over the valley. The moon is today's real phase. You can press play and hear a drone.
Ambition: spectacle, because "Go wild" and "Awwwards site of the day".
Mode: Show, Free
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: artists, release titles, catalogue numbers, recording dates, a contact or demo address, social links, a mailing list provider, the label's own wording of its rule (the build reads "after midnight" as midnight until sunrise). The sleeves are labelled studies, the sign-up form is not connected, and there is no contact section.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.
- Must be clearly different from look B (/tmp/dl-pairs/aadhi-raat-b: music/first-bell, Temple Dawn, Night Show, light lime-wash, Instrument Serif, asymmetric type lockup).

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the live valley hero, the sleeve studies, the rule read slowly, the sign-up footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

Product: Aadhi Raat Records
Who: a listener or musician who followed a link and has never heard of the label
Decision: is this label for me (do I want to hear what gets made after midnight here)
First thing they see: the valley at night with "Aadhi Raat" across it and the time in Kathmandu
Next action: play the drone, then sign up for release emails
Job of this pass: the public one-page site
Scope: hero, sleeves, the rule, sign-up footer
Idea: the page is Kathmandu at this second. The valley, the Himalaya and the moon are drawn live, the clock is Kathmandu's, and the REC lamp only lights after midnight there.
Signature: the sleeve generator. Each sleeve is the sky over the valley at the minute a recording stopped: the moon at that hour, the windows still lit at that hour, the time cut large across it.
Avoiding: the dark portfolio (near-black page, serif italic name, mono kicker, clock strip) and the neon-tube music template. The clock here is the product's rule, not decoration; there is no italic serif, no numbered table, no giant wordmark footer.
Register: moonlit-ridge-hero
Show: yes, Free · centrepiece moonlit-ridge-hero, re-skinned for the Kathmandu valley (Himalaya, valley rim, Swayambhu on its hill with prayer flags, the city with pagodas and windows) · light: the moon at today's phase, with the city's sodium glow from below · scene: --scene-* below
Palette:
- --bg #090c22 (valley night, blue-black, never pure black) · page and pill fills
- --surface #10142e · sleeve cards and the footer pane
- --surface-2 #191e40 · hover
- --line rgba(233,229,244,.14) · hairlines and pill borders
- --ink #e9e5f4 (cold moonlit bone) · text, 15.6:1 on --bg
- --ink-2 rgba(233,229,244,.70) · secondary text, about 9:1
- --ink-3 rgba(233,229,244,.52) · captions only
- --primary #ff5e2b (the REC lamp, in sindoor vermilion) · the one filled button, the live lamp, "Raat", underlines, the waveform
- --primary-ink #12060a · label on the vermilion, 6.5:1
- --primary-soft rgba(255,94,43,.16) · selected and glow
- --link #ff9a73 · text links on --bg, 9.3:1
- --scene-sky-top #02030a, --scene-horizon #3a2a55 · the sky stops (violet, because the valley's sodium haze lifts the horizon)
- --scene-sodium #ffad55 · city windows and the haze over the valley
- --scene-moon #f4efe2 · the moon and its halos
Type:
- Rozha One (display, Latin and Devanagari in one family): a high-contrast display cut by an Indian foundry, so "Aadhi Raat" and "आधी रात" share one voice, loud like a film-hall poster.
- Martian Mono (text and readouts, width axis 75 to 112.5): a machine face for a label whose subject is a timestamp; the narrow width keeps body text readable at 16px.
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: music · Direction: after-midnight (their words: after midnight, Kathmandu, a label; mood: "a label or a venue tied to one city and one hour, lamp light on indigo, a sound you can play")
Recent: music/first-bell claimed today for Aadhi Raat look B, so not that one. After-midnight is not in the history.
Theme: Free (direction's candidate was sodium-night, which is the night pair of look B's temple-dawn, so it was set aside to keep the two looks apart)
Why this palette: the light of the world is the moon over the Himalaya and the sodium haze of the city; the brand colour is the REC lamp, because the rule is about when recording happens.
Free history: Late Light (finished today) used #07050b with #ff4b3e, so this site moved to #090c22 with #ff5e2b and does not reuse that pair. Its display face, IM Fell English, is not used here.
Rejected: sodium-night (same palette family as look B), the music recipe default neon-alley (a wet street, not this valley).
Pairing: Free (direction's candidate ai-editorial set aside; look B uses Instrument Serif)
Family: lit · radius 999px pills on the interface, outline buttons, one filled primary, density air, shadow 0 30px 80px -30px rgba(0,0,0,.6)
Icons: Lounge Icons, 24px, stroke 1.75 (play, arrow-left, arrow-right, check, alert)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: moonlit-ridge-hero (lead), scroll-word-highlight (supporting)
Density: air
Shell: none
Panel: none
Nav: The rule, Sleeves, Sign up
Phone nav: none below 900px (one-page site; the brief hides the nav, the sections follow in order)
Pieces: moonlit-ridge-hero, coverflow-strip, scroll-word-highlight, footer-newsletter-split
Sections: work coverflow-strip (direction's work; five sleeve studies in a strip suit one center) · about scroll-word-highlight (a short belief suits a word highlight; options left after fit: text-rise-underline-whisper, scroll-word-highlight; name number 145 + 2 = 147, 147 mod 2 = 1) · contact none (no address was given) · footer footer-newsletter-split (direction's footer)
Unlike recent culture sites: Late Light (museum) and Aadhi Raat look B (music) share none of hero, work, or footer with this one.
Kept from their system: none, new kit

Their words win: "Go wild" sets motion 9. The about paragraph moves with scroll-word-highlight as a second effect. The sheet default would name a Dials piece instead; the paragraph is the one thing the label wants read slowly, so it moves.
Set aside: the newsletter footer's latest-issue teaser and three-column sitemap, because there is no issue and only one page. The footer keeps one link column.

## Sources
- theme Free (no Lounge theme)
- pairing Free (no Lounge pairing)
- family lit — 999px pills, outline buttons, air
- moonlit-ridge-hero — layout, motion — https://www.designlounge.live/demo/moonlit-ridge-hero.html
- coverflow-strip — component, motion — https://www.designlounge.live/demo/coverflow-strip.html
- scroll-word-highlight — motion — https://www.designlounge.live/demo/scroll-word-highlight.html
- footer-newsletter-split — layout — https://www.designlounge.live/demo/footer-newsletter-split.html

## Notes from the build

- Coverflow: the brief's 220×280 card became a 280px square sleeve with its time and caption under it (220px below 640), and the step grew from 180 to 190px to suit the wider card. Rotation, Z, 420ms, no loop, no autoplay, and disabled end arrows are as the brief says. Only the centre card shows its caption.
- Hero: the brief's hut became Swayambhu on its hill with prayer flags. The Alpine ridges became the Himalaya (snow faces lit toward the moon), the valley rim and the city (stepped roofs, two pagodas, lit windows). The moon is drawn at today's real phase. The clock is Nepal Time (UTC+5:45, no daylight saving). Sunrise is computed for Kathmandu each day. The status reads "Midnight in Kathmandu, in hh:mm:ss" before midnight and "After midnight now, until sunrise at hh:mm" after it.
- Sound: "Play a drone" builds a tanpura-style cycle, a low bed and a little tape hiss in WebAudio on the first click. "Sound off" fades it out in 0.8s.
- Files: index.html, styles.css, main.js, favicon.svg (light and dark), favicon.ico (32), apple-touch-icon.png (180), og-image.png (1200×630), wordmark.svg (Rozha One outlined).

Correction: too even
Changed: the five sleeves now each have their own sky for the hour, from violet haze at 00:14 to pre-dawn blue at 04:59
Left alone: the palette, the type, the family, and the other sections

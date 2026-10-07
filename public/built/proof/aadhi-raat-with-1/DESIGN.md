# Aadhi Raat · DESIGN.md

## Brief

Request, word for word:
"Make a website for a record label that only releases music recorded after midnight in Kathmandu. Go wild, I want it to feel like an Awwwards site of the day."

Product: Aadhi Raat (working name, replace; आधी रात is Nepali for midnight), a record label with one rule: it releases only music recorded in Kathmandu between 00:00 and sunrise, Nepal time. The rule is the whole product. No releases, artists, dates or prices were given.
For: someone sent the link by a friend, on a laptop or a phone, who wants to understand the rule in ten seconds and feel the hour it is about.
World: sodium lamp, wet street, a sign
The one thing: the label's name is a sign on a wet Kathmandu street, and it is only switched on while the window is open: 00:00 to sunrise, Nepal time. Outside the window the tubes are dark glass under the street lamp, and a counter says when they light.
Ambition: spectacle, because "Go wild" and "Awwwards site of the day".
Mode: Show, Free
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: the label's real name, any release, artist, catalogue number, a submission address, social links, a mailing-list endpoint. The catalogue is shown as an honest empty slot, the form has no endpoint, and no address is invented.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the sign hero with the live Kathmandu clock and the window countdown, the rule, this week's windows, how to send a tape, and the footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

```
Product: Aadhi Raat (working name), a record label that releases only music recorded after midnight in Kathmandu
Who: a curious listener or a musician in Kathmandu, sent the link; they know nothing yet
Decision: is the window open right now, and what is the rule
First thing they see: the name in lights (or in dark glass) and "Lights on in hh:mm:ss"
Next action: hear the street (sound on), then read the rule
Job of this pass: the public one-page site
Scope: hero, the rule, this week's windows, send a tape, footer
Idea: the label's name is a sign on a wet Kathmandu street that is only switched on between 00:00 and sunrise, Nepal time. The site's light is the real clock.
Signature: the sign's power is the live Kathmandu window. Dark glass by day, tube strike at midnight, off again at the computed sunrise. Its reflection lies in the wet street.
Avoiding: the dark portfolio (huge italic name, mono kicker, numbered list, open-to-work dot) and the generic synthwave neon page. Also the sibling builds' tape deck on navy and gold.
Register: built for this (the sign and the street). Supporting: stacking-cards-scroll on the Send a tape steps (motion 9 names it for a list of steps)
Show: yes, Free · centrepiece built for this (no library show piece is a lit sign tied to an hour; moonlit-ridge-hero is the closest and is blocked by the history) · light: one sodium street lamp, upper left; the sign is a second emitter only while the window is open · scene --scene-sodium (lamp and city haze), --scene-tube (the magenta tube when lit), --scene-tube-2 (the cyan second line), --scene-sky (the sky at the top of the wall)
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: music · Direction: neon-tube (their world: sodium lamp, wet street, a sign; mood: "a wet street, magenta and cyan, the name in lights"). Observatory fit the subject too but was claimed in the last hour by two sibling builds, so this one loses it and takes the next direction that fits.
Recent: music/after-midnight (6 Oct, moonlit-ridge-hero, Rozha One) and music/first-bell (6 Oct) used for the same request, so not again. music/observatory claimed 7 Oct by aadhi-raat-with-2 and with-3, so not again.
Theme: free (no pair; the site is one night)
Why this theme: Free, because the brief is spectacle. Colour comes from a sodium lamp on wet asphalt and a magenta tube: the lamp is amber, the street is warm black, the tube is pink-magenta, the second line is cyan. Navy and gold were the sibling builds; indigo and orange was the last Free build of this product.
Rejected: neon-alley (the direction's locked theme) because Free lets the tube and the lamp set the colour; observatory, taken by siblings.
Pairing: free
Family: glass (radius 16px, soft buttons, 44px controls, one floating bar)
Icons: Lounge Icons, 24px, stroke 1.75
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: built for this (sign strike, rain), supporting stacking-cards-scroll
Density: air
Shell: none
Panel: none
Nav: The rule · This week · Send a tape
Phone nav: the same three links in a second header row (no drawer: three short links fit at 390)
Pieces: hero built for this · scroll-word-highlight (still) · week-schedule · stacking-cards-scroll · footer-giant-wordmark-reveal
Sections: work week-schedule (the direction's coverflow-strip needs covers and there are no releases, so the work is the thing that is real: this week's recording windows, computed) · about scroll-word-highlight (a short rule suits a word highlight; built still, as Show mode asks) · contact stacking-cards-scroll (how to send a tape is a list of three steps, and motion 9 names this piece for a list of steps) · footer footer-giant-wordmark-reveal (the direction's)
Unlike recent music and culture sites: vs Aadhi Raat after-midnight (6 Oct): hero differs, work differs, footer differs. vs first-bell: all differ. vs Late Light star-dome: hero and work differ, footer matches (one match, so it stands). vs the sibling observatory claims: hero differs (built-for-this vs playable-product-hero); their work and footer are unknown, so week-schedule may match once at most.
Kept from their system: none
Set aside: Show mode allows up to three effects; this page runs two (the sign and the stacking cards). The footer's letter rise is the footer piece's own motion.
```

Palette (Free, from the light):
- `--bg` #0e0c10: wet asphalt at 2am, warm black with a trace of the tube.
- `--surface` #171419, `--surface-2` #211c25, `--surface-3` #2d2632: the same asphalt, lifted.
- `--line` #2b2630, `--line-strong` #6e6578.
- `--ink` #f2eef4, `--ink-2` #b4acbd (8.6:1 on bg), `--ink-3` #857c90 (5:1 on bg).
- `--primary` #ff4fa8: the magenta tube, also the action colour. `--primary-ink` #141210 (6:1). `--primary-soft` #3d1b2f.
- `--link` #ff8cc6: the tube's light on the wall, 8:1 on bg.
- `--secondary` #43d9e8: the cyan second line of the sign. `--tertiary` #ffa23a: the sodium lamp, scene only.
- `--scene-sodium` #ffa23a, `--scene-tube` #ff4fa8, `--scene-tube-2` #43d9e8, `--scene-sky` #1a1230.
- Feedback: `--success` #5ec8a0, `--warning` #ffa23a, `--danger` #ff5a4e, `--info` #43d9e8, each with soft and on-soft.

Type (Free):
- Display: Tilt Neon. It is drawn as a bent tube, so the sign is set in it, not faked with strokes. Used only for the sign and the footer wordmark.
- Text: Eczar. A Devanagari-and-Latin serif with weight, so आधी रात sits in the same face as the sentences, and headings in Eczar 600 read like a painted signboard.
- Mono: DM Mono, for the three live readouts (clock, countdown, window), tabular.
- Not Rozha One, IM Fell English, Michroma, Anybody or Martel (the last Free builds), and not the faces every agent reaches for.

Live readouts (the Idea's): Kathmandu clock (header), the window countdown (hero pill), tonight's window (hero). Three of four allowed.

## Sources
- theme free — the palette above (direction neon-tube's theme is https://www.designlounge.live/themes/neon-alley)
- pairing free — the faces above (direction neon-tube's pairing is https://www.designlounge.live/type/y2k-chrome)
- family glass — radius 16px, https://www.designlounge.live
- hero — built for this (no library piece) — the sign, the street, the clock; closest piece moonlit-ridge-hero, https://www.designlounge.live/pieces/moonlit-ridge-hero, blocked by history
- scroll-word-highlight — layout, built still — https://www.designlounge.live/pieces/scroll-word-highlight
- week-schedule — layout — https://www.designlounge.live/pieces/week-schedule
- stacking-cards-scroll — motion — https://www.designlounge.live/pieces/stacking-cards-scroll
- footer-giant-wordmark-reveal — motion — https://www.designlounge.live/pieces/footer-giant-wordmark-reveal

## Notes
- Sunrise is computed with the standard sunrise equation for 27.7172 N, 85.3240 E, sea-level horizon, in Asia/Kathmandu time. The page says so.
- Sound: rain and the lamp's 100 Hz hum from WebAudio, started by a click, stopped by the same button. The tube buzz joins only while the sign is lit.
- The stacking cards use a scroll listener and rAF rather than CSS scroll timelines, so the same code runs in every browser that opens the file.
- Favicon is inline SVG (data URI). favicon.ico, apple-touch-icon.png and the 1200x630 share image are still open.

## Look

```
Match
Column: 1120 frame on every section; paragraphs capped at 960 (manifesto) and 38ch (cards)
Column when the rail is closed: no rail
Page padding: 40px (24 at 900, 20 at 640)
Control height / radius: 44px / 16px
Amount face: DM Mono
Shell: none
Panel: none
Nav: The rule · This week · Send a tape
Phone nav: second header row · same labels
Fails: none
```

Checks that failed and the fix: two temporal-dead-zone errors in main.js (the first tick ran before the week board and the audio object were declared), fixed by moving the first tick after them; the sign's reflection never rendered (a percentage height inside an auto-height parent, and the flip on the container), fixed with an aspect-ratio box and the flip on the clone; both play and pause icons showed at once on the sound button; the lamp's reflection smear was bright enough to fight the lede; phone week rows wrapped to four lines; the lit status pill broke "in" onto its own line.

```
Looked at: web-hero.png and web-lit.png (1280x800, dark and lit states), web-s1 to web-s7 and web-bottom.png (scroll steps), phone-hero.png, phone-lit.png, phone-s1 to phone-s8 and phone-bottom.png (390x844), still-hero.png (1280x800, prefers-reduced-motion) with the repo's playwright module via a scratchpad script; the lit state was reached by shifting Date.now in the harness, not in the site
Remember after five seconds: "a dark neon sign on a wet Kathmandu street, with a counter to the moment it switches on" · could be anyone's: no
Correction: too plain. On the dark first screen the only live thing was a 14px countdown; the digits are now 18px mono in the pill. Theme, type, family and the other sections left alone.
Still open: the label's real name and the submission address (no address is shown, card 3 says so); a mailing endpoint (none built, so no form); favicon.ico, apple-touch-icon.png and the 1200x630 share image (favicon is inline SVG); the midnight strike was seen only through the shifted clock, never at a real 00:00; sound was toggled in the headless run but not heard.
```

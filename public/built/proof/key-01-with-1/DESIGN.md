# KEY-01 launch page

## Brief

Request, word for word:
"Build a launch page for a mechanical keyboard called KEY-01. I want people to be able to actually play with it on the page."

Product: KEY-01, a mechanical keyboard. That is every fact given: the name and the kind of object.
For: someone who cares about keyboards, arriving from a link on a laptop or a phone. In ten seconds they want to feel what a press on this board is like, not read about it.
World: bone keycaps, a graphite case, a desk lamp.
The one thing: the keyboard is on the page and you can actually play with it. Keep their verb. Whatever you type on it becomes the headline of the page, every key sinks, and (if you switch it on) you hear the switch.
Ambition: spectacle, because "actually play with it on the page" makes the page itself the experience.
Mode: Show, Free
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly from the file system. Google Fonts only.
Missing: the switch name and force, the layout and key count, keycap and case materials, the price, the ship date, an order or waitlist link, the maker's name and email, press photos. The page draws a 60 percent, 61 key board as a study of the object, says the sound is synthesised, and ends with "Price and date to be announced."

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the bar, the playable hero (the typed headline, the readouts, the board), Inside (the key stack), Sound (the scope), and the colophon footer, opened in a browser at both sizes, fixed, and the closing block written.

## Sheet

Kind: website. Recipe: landing.
World words: bone caps, graphite case, lamp.
Recent: landing/playable was used on 6 Oct for KEY-01 (/tmp/dl-pairs/key-01-a) and landing/grid-launch on 6 Oct for KEY-01 (key-01-b), so neither direction again. Bench-at-night is the next direction whose mood names this world ("the same object in the dark, graphite and one lit orange, specs read like an engraving").
Direction: bench-at-night. Family: sharp (radius 0, outline buttons at 40px, 1px ink rules, no shadow on the interface, uppercase 11px tracked labels on data and nav). Drawn objects keep their own corners and cast shadows, as Show mode allows.
Show: yes, Free.

Light source: one desk lamp, top-left, over a bone desk. Highlights face it, walls and shadows fall down and to the right.

Palette (Free):
- `--bg` #e9e4d8: the bone desk under the lamp
- `--surface` #f3efe6, `--surface-2` #ddd7c9, `--surface-3` #cfc8b8: lighter and darker bone
- `--line` #c9c2b2, `--line-strong` #8e877a: pencil rules on bone
- `--ink` #17181c: graphite; `--ink-2` #45464e; `--ink-3` #5f6069 (4.8:1 on bg, meta only)
- `--primary` #2242c8: cobalt, the one accent cap (Esc and Enter), the caret, the Sound band; `--primary-ink` #fffdf8; `--primary-soft` #d6dcf5; `--link` #1b36ad
- `--scene-lamp` #ffd9a3: the lamp's pool on the desk
- `--scene-case` #24252c, `--scene-plate` #121317: the graphite case and the plate well
- Caps: bone #efe9dc (highlight #fbf8f2, wall #b8b09e), slate modifiers #3a3b43, cobalt accent #2242c8. Three variants, one rule.
Free check: the last three Free display faces were Michroma, IM Fell English and Rozha One; the last pairs were #101716/#ff6a3d, #090c22/#ff5e2b, #07050b/#ff4b3e. This site is bone and cobalt, a light page, so it stands apart from all three and from the TU-16 demo.

Type (Free):
- Anybody (display and text). Wide at wdth 125 and 800 for the wordmark and the typed headline, it reads like a legend machined into a cap. At normal width and 400 it is a plain grotesk for sentences. One family does both jobs.
- JetBrains Mono (legends and readouts). A mono drawn for people who type all day; the legends on the caps and the live readouts are set in it. Numbers use it.
Two families, one Google Fonts link.

Idea: The keyboard is on the page. Whatever you type on it becomes the headline.
Signature: the hero headline is the text buffer. Every keystroke on the drawn board, or on your own keyboard, writes the display line, with a cobalt caret. Esc puts the first line back, Enter clears for a new one. No piece in the library does this.
Avoiding: the dark hardware launch (near-black page, orange accent, an exploded render) that the previous KEY-01 and the TU-16 demo both wear; the SaaS template; the studio template (this page uses two of its moves: mono tracked labels in the footer and 1px rules; no numbered sections, no giant wordmark footer, no sticky scroll section).

Four lines:
- Who: someone who likes keyboards, arriving from a link, who already knows what a mechanical board is.
- Decision: is this board worth wanting before it ships.
- First thing: the board, and the line they just typed on it.
- Next action: type.

Register: playable-product-hero, the lead effect, in the hero only. Every other section is still (entry fade only).
Live readouts (Show mode, three): last key, keystrokes, words a minute. Each is real and changes.
Labels: hero 0 tracked labels (the readouts take their place); footer 2 ("A mechanical keyboard", "Back to top").
Sound: a synthesised switch click on each key down and a softer upstroke on key up, off by default, started only by the Sound control or the "Play one click" button, with the Sound control to turn it off.

Sections:
- Hero: playable-product-hero, re-skinned for a keyboard (the direction's hero, object-3d-turntable, is a candidate the Idea beats: the Idea is to type on it, not to turn it).
- Work: features-sticky-scroll-steps, the direction's work, in still form: four steps (cap, switch, plate, case) next to one figure whose data-step changes on click, no scroll story.
- About: none. There is no story or maker given.
- Contact: none. No email or link given.
- Sound: built from the sheet. No piece in the library draws a waveform of a sound you make, so it is a canvas scope on a cobalt band, and this is said in the reply.
- Footer: footer-centered-colophon, the direction's footer.
Unlike KEY-01 key-01-a (same product, same recipe): hero matches (playable-product-hero, the only show piece for "play with it"), work differs (features-sticky-scroll-steps, not stats-count-up-band), footer differs (footer-centered-colophon, not footer-giant-wordmark-reveal). One match, so it stands. Unlike key-01-b: all three differ. Unlike the other recent selling-group lines: all three differ.

Default set aside: Recent picks blocks a hero that is already in the history for this recipe. The hero piece repeats here because show.md sends "let people play with it" to playable-product-hero and the Idea needs it; the direction, family, theme, type, work and footer all differ, and the typed headline is new.

Motion: the sheet's tokens. Key down 28ms, key up 100ms, UI 200ms, entry 700ms `--ease-expo-out`. Reduced motion: no idle dips, no transitions, no entry fade, no caret blink, the scope draws one frame per click.

Match
Column: 1088px on every section
Page padding: 32px (16px on the phone)
Control height / radius: 40px / 0 (44px on the phone)
Amount face: JetBrains Mono
Shell: none
Panel: none
Nav: Inside, Sound, Launch
Phone nav: the same three links, in a row under the wordmark
Fails: none

## Sources

- Theme: Free (bone and cobalt, above). The direction's own theme would have been https://www.designlounge.live/themes/graphite-signal
- Pairing: Free (Anybody and JetBrains Mono, above). The direction's own pairing would have been https://www.designlounge.live/type/machined
- Family: Sharp
- Hero: TU-16 (playable product hero), https://www.designlounge.live/demo/playable-product-hero.html
- Work: Sticky scroll feature steps, still form, https://www.designlounge.live/demo/features-sticky-scroll-steps.html
- Footer: Centered colophon footer, https://www.designlounge.live/demo/footer-centered-colophon.html
- Icons: Lounge Icons (volume, arrow-up), https://www.designlounge.live
- Sound section: no piece, built from the sheet.

Designed using Design Lounge, https://www.designlounge.live

## Look

Looked at: shots/web-1280x800.png, shots/web-typed-1280x800.png, shots/web-inside-1280x800.png, shots/web-sound-footer-1280x800.png, shots/phone-390x844.png, shots/phone-footer-390x844.png, shots/still-reduced-motion-1280x800.png, with Playwright (headless Chromium, the repo's node module; playwright-cli is not installed).
Fixed from the look: the caret wrapped onto its own line after a long headline (the fit now measures the whole line box); the footer's "Back to top" button shared the class name of the keycap's top face and was laid over the page (renamed `.totop`); an SVG `height="auto"` logged a console error.
Remember after five seconds: "a lamp-lit keyboard, and my own words as the headline" · could be anyone's: no
Correction: too plain
Changed: the inactive layers of the Inside figure sat at 32 percent and read as a grey diagram; they now sit at 50 percent so the exploded key reads as one object with the chosen part lit.
Left alone: the theme, the pairing, the family, and the other screens
Still open: no order or waitlist link, price, date, switch or material facts (none were given); favicon.ico not generated (favicon.svg and apple-touch-icon.png ship); the typed board on a real phone keyboard (input events) was exercised only through Chromium's hidden-input path, not on a device.

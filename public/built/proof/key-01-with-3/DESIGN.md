# KEY-01 launch page

## Brief

Request, word for word:
"Build a launch page for a mechanical keyboard called KEY-01. I want people to be able to actually play with it on the page."

Product: KEY-01, a mechanical keyboard. No other facts were given: no maker, price, layout, switch, material, weight or ship date.
For: someone who likes keyboards, on a laptop or a phone, who wants to know in ten seconds what this one feels like.
World: anodised aluminium, bone keycaps, a desk lamp at night
The one thing: the keyboard is on the page. Type on it. Every key you press on your own keyboard presses the same key on the board, you hear the switch, and what you type becomes the headline.
Ambition: spectacle, because "actually play with it on the page" makes the page the experience.
Mode: Show, Free
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: the maker, the price, the ship date, the layout and switch options, materials and weight, where the ship-date form submits. The drawn board is a 61-key layout study and says so. Linear, Tactile and Clicky are the three switch families, not KEY-01's own switch. No numbers are shown anywhere except the live readouts.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the playable board with the typed headline and its readouts, the three-part construction section, and the ship-date footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

```
Product: KEY-01, a mechanical keyboard launch page
Who: a keyboard person on a laptop or phone, who wants to feel the thing before reading about it
Decision: is this the board I want under my hands
First thing they see: the board itself, lit, with their own words above it
Next action: type (then leave an email for the ship date)
Job of this pass: the public launch page
Scope: one page: centrepiece, construction, footer with the ship-date form
Idea: the keyboard is on the page and the headline is whatever you type on it. Press a key on your keyboard and the same key sinks on the board, the switch sounds, and the letter lands in the display line. Escape clears it.
Signature: the typed headline. The hero's display line starts as "KEY-01" and is rewritten by the visitor, letter by letter, with a caret in the lamp's colour.
Avoiding: the dark gadget page: a black page, a centred render, a glow, three spec cards with icons, and a "Pre-order now" pill.
Register: playable-product-hero
Show: yes, Free · centrepiece playable-product-hero, re-skinned from a drum machine to a 61-key board · light: one amber desk lamp, top-left · scene: --scene-lamp (the lamp's pool on the mat), --scene-cap (bone PBT alpha caps), --scene-mod (graphite modifier caps), --scene-case (the anodised case)
Palette: --bg #121418 the slate desk mat at night · --surface #191c21 · --surface-2 #20242a hover · --surface-3 #292e35 · --line #2c3139 · --line-strong #4b525c · --ink #ecebe4 lamp-lit paper · --ink-2 #b3b7bb · --ink-3 #858b93 (5.3:1 on bg) · --primary #ffc83d the lamp and the one accent keycap (Escape) · --primary-ink #141210 · --primary-soft #3a3118 · --link #ffc83d
Type: Epilogue (display and text): a tight, heavy grotesk whose K, Y and figures hold at 148px and still read at 16px, so the wordmark and the prose are one voice; set at 800 for the display, 400 and 500 for text. Geist Mono (legends and readouts): the mono of the people who buy keyboards, with the slashed zero the keycap legends need. Two families, one Google Fonts link.
Free: chose colour and type for the world. Did not take a library theme or pairing.
Dials: variance 8 · motion 7 · density 4
Kind: website
Mode: new kit
Recipe: landing · Direction: noir-launch (their words: play with it, a keyboard, a launch; mood: luxury, dark, one product). Recent: landing/playable used 6 Oct for KEY-01 (key-01-a), landing/bench-at-night claimed today by key-01-with-1, landing/clay-launch claimed today by key-01-with-2, landing/grid-launch used 6 Oct (key-01-b), so none of those again.
Theme: free (no pair; the page is the desk at night and has no day mode)
Why this theme: colour from the light: one amber lamp on a slate mat, bone caps, graphite case. Bench at night was the closest library mood and is claimed beside this build.
Rejected: graphite-signal and bone-signal (claimed by the parallel builds); atelier-noir, because bone type on pure black has no lamp in it.
Pairing: free (Epilogue + Geist Mono). Not Michroma, Anybody, Unbounded or Bricolage Grotesque: the last Free KEY-01 builds set those.
Family: editorial (radius 2px, outlined 40px buttons that fill on hover, no shadows on the interface, italic once per viewport: "before" in the footer headline). The drawn board keeps its own corners and shadows.
Icons: Lounge Icons, 24px, stroke 1.75 (volume, arrow-right, arrow-up). Volume-off is the Lounge volume with the Lucide-grammar X, drawn in the same stroke, because the set has no muted speaker.
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: playable-product-hero (key travel 40/55/30ms down, 110/130/90ms up by switch; idle dip of K E Y - 0 1 every 480ms until the first touch; panels in the construction section slide 24px once, 700ms expo-out)
Density: regular
Shell: none
Panel: none
Nav: Inside · Ship date (in-page)
Phone nav: the same two links, inline
Column: 1120 frame, 720 reading column (paragraphs sit at 34 to 36ch), page padding 32 (20 on the phone), controls 40px web / 44px phone, radius 2px
Pieces: playable-product-hero (centrepiece), features-alternating-rows (work), footer-newsletter-split (footer), field-label-morph read and set aside (see below)
Sections: work features-alternating-rows, because three parts of a key each get a row with its own engraving and the copy never moves; the direction's features-sticky-scroll-steps would be a second scroll story beside the board, and key-01-with-1 carries it already · about: none, there is no person or company to tell · contact: the ship-date form, in the footer piece · footer footer-newsletter-split, the direction's
Unlike key-01-a: hero matches (the Idea needs the board on the page, and Show mode names playable-product-hero for it), work differs, footer differs. One match, so it stands. Unlike key-01-b: all three differ. Unlike key-01-with-1 and key-01-with-2: hero matches, work and footer differ from their directions' trio.
Set aside: field-label-morph (Dials, motion 7 with a form). The footer piece's form is an underline-only field with the label above it; a label that rises inside a field with no box has nowhere to rise from, so the field keeps the footer brief's chrome.
Kept from their system: nothing existed
```

Match
Column: 1120 frame; prose 34 to 36ch inside it
Column when the rail is closed: no rail
Page padding: 32 (20 phone)
Control height / radius: 40 / 2 (44 on the phone)
Amount face: Geist Mono (readouts, tabular)
Shell: none
Panel: none
Nav: Inside, Ship date
Phone nav: inline, same labels
Fails: none

Correction: too even
Changed: the three live readouts under the board were 22px captions; they are now 30px (22 on the phone), so the last key, the count and the rate read as part of the show, not a footnote
Left alone: the palette, the type, the family, and the other sections

## Sources
- theme free — colour from the light, roles above
- pairing free — Epilogue + Geist Mono, reasons above
- family editorial — radius 2px
- playable-product-hero — layout, motion, component — https://www.designlounge.live/demo/playable-product-hero.html
- features-alternating-rows — layout, motion — https://www.designlounge.live/demo/features-alternating-rows.html
- footer-newsletter-split — layout, component — https://www.designlounge.live/demo/footer-newsletter-split.html
- field-label-morph — read, set aside — https://www.designlounge.live/demo/field-label-morph.html

Designed using Design Lounge · https://www.designlounge.live

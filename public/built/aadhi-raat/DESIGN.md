# Aadhi Raat — system sheet

Designed using Design Lounge (https://www.designlounge.live).

```
Product: Aadhi Raat, a Kathmandu record label that only releases music recorded after midnight (Nepal time)
Who: listeners who buy small pressings, and musicians who tape things at night and want somewhere to send them
Decision: is this label for me, and is my night recording the kind of thing they press?
First thing they see: "Only after midnight." over a live gold fog above a drawn Kathmandu roofline, with the first record open below
Next action: play AR-004 in the corner player, or send a recording
Job of this pass: a single-page site (hero showreel, rules, one night, send form, footer)
Scope: index.html, styles.css, main.js. No build step, no external images, no media files
Idea: The front page is the Kathmandu night sky running live, and every record is a sleeve stamped with the minute after midnight its take began.
Avoiding: the dark portfolio (serif italic name, mono kicker, numbered list, a clock in the corner). Instead: poster-tall Anton, living gold fog, full-colour rule cards, drawn sleeves. The clock stays because Kathmandu time is the premise, and it drives the "Recording / The room locks in…" state.
Register: webgl-shader-hero
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: music · Direction: observatory ("Ambient, navy and gold, a record label": the brief is a night label, so the mood decides, not the name number)
Theme: observatory (pair: none, so dark mode only)
Why this theme: navy night and lamp-gold is the exact picture of a city after midnight; secondary green is used only for the live "Recording" state
Rejected: neon-alley (neon tube reads as a club, not a sleeping city), festival (daylight and crowds, the opposite of the premise)
Pairing: cinema (Anton display, Crimson Pro text, no mono; numbers use Crimson tabular figures)
Family: editorial (radius 2px, outline buttons that fill on hover, air, no shadow, controls 40px web / 44px phone)
Icons: Lounge Icons, 24px, stroke 1.75 (play, pause, arrow-right, arrow-left, plus, volume, check, map-pin, clock, moon)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: webgl-shader-hero (lead), stacking-cards-scroll + sticky-split-story (supporting), footer caravan walk (the footer piece's own motion)
Density: air
Shell: none
Panel: none
Nav: navbar-vertical-rail, 88px, labels are hour stamps 00:00 Records · 01:00 Rules · 03:00 The night · 05:00 Send, with the Kathmandu clock and live dot at the foot
Phone nav: drawer (hamburger-circle-reveal, a gold circle opens from the burger)
Pieces: portfolio-motion-showreel, webgl-shader-hero, stacking-cards-scroll, sticky-split-story, contact-project-brief-steps, footer-engraved-caravan-strip, corner-player, navbar-vertical-rail, hamburger-circle-reveal
Sections: name number AADHIRAAT = 63 · work 63+1=64 mod 7=1 stacking-cards-scroll · about 63+2=65 mod 5=0 profile-creator-masthead, skipped (needs one named essayist and a portrait) so next: sticky-split-story · contact 63+3=66 mod 5=1 contact-project-brief-steps · footer 63+4=67 mod 4=3 footer-engraved-caravan-strip
Kept from their system: nothing (new kit)
```

## Their words win

The prompt said "go wild, I want it to feel like an Awwwards site of the day". Defaults set aside because of that:

- Four motion regions instead of three: the hero shader, the stacking rule cards, the sticky night sky, and the footer caravan walk. All four stop under reduced motion.
- The corner player plays sound synthesized live with Web Audio (a drone, a pad, street noise and bells, rooted per record). The piece's brief says "no media file", and none is loaded. The bar runs 42s, not the brief's 8s.
- The family's 2px radius replaces the player's 8px. The family's 1px borders replace the step form's 2px borders and hard shadows.
- Selected chips and radios use `--primary-soft` with a `--primary` border instead of the briefs' tomato and ink fills, so they stay inside the observatory palette.
- The stacking-cards step rail shows only while the stack is in view.
- Rail numbers are hour stamps instead of 01–04.

## Content rules

- Records AR-001 to AR-004 are an example catalogue, labelled in the page as studies for the first pressings. No artist is named, and no quotes or stats.
- No real URLs or emails. The form and the night letter confirm locally.
- No share image, `favicon.ico` or apple-touch icon. The favicon is an inline SVG.
- The only gradient regions are the shader hero, the night sky, and the player's glow.

## Sources

- theme observatory — https://www.designlounge.live/themes/observatory
- pairing cinema — https://www.designlounge.live/type/cinema
- family editorial — 2px
- webgl-shader-hero — motion — https://www.designlounge.live/demo/webgl-shader-hero.html
- portfolio-motion-showreel — layout — https://www.designlounge.live/demo/portfolio-motion-showreel.html
- stacking-cards-scroll — motion — https://www.designlounge.live/demo/stacking-cards-scroll.html
- sticky-split-story — layout — https://www.designlounge.live/demo/sticky-split-story.html
- contact-project-brief-steps — component — https://www.designlounge.live/demo/contact-project-brief-steps.html
- footer-engraved-caravan-strip — layout — https://www.designlounge.live/demo/footer-engraved-caravan-strip.html
- corner-player — component — https://www.designlounge.live/demo/corner-player.html
- navbar-vertical-rail — layout — https://www.designlounge.live/demo/navbar-vertical-rail.html
- hamburger-circle-reveal — motion — https://www.designlounge.live/demo/hamburger-circle-reveal.html

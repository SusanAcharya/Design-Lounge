# Aadhi Raat Records · second look

Designed using [Design Lounge](https://www.designlounge.live).

This is the second of two looks for the same label. The first look (music / after-midnight, Sodium Night, moonlit ridge) is in `/tmp/dl-pairs/aadhi-raat-a`. This one follows "Two looks for one product" in website.md: a different direction, theme, pairing, and hero.

## System sheet

```
Product: Aadhi Raat Records, a record label that only releases music recorded after midnight in Kathmandu
Who: listeners who found the label, and musicians in Kathmandu who record at night
Decision: is this label for me, to listen to or to send a take to
First thing they see: the name split in two halves like the night, and a record sliding out of its sleeve
Next action: play a take
Job of this pass: the public site, one page
Scope: hero, the rule, the takes, send a tape, footer, corner player
Idea: every take is filed under the minute its tape started rolling, and the page runs from midnight to the first temple bell: the cards stack from midnight indigo to dawn marigold as you scroll
Signature: the night ruler. A sticky strip from 00:00 to the first bell, with every take pinned at its minute and a live needle for Kathmandu time when the tape is rolling. The tape form uses the same ruler to check your start time
Avoiding: the dark portfolio (near-black page, serif italic name, mono kicker) and the first look's moonlit night scene. This one is the same city at dawn, lime-wash paper and indigo ink
Register: text-mask-line-reveal
Show: no · the first look carried Show mode (moonlit ridge centrepiece). Two looks makes this one a composed site from the direction's own pieces, pushed at dials 9/9/3
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: music · Direction: first-bell (their words: after midnight, Kathmandu, a label; mood: "the same city at dawn, lime-wash and marigold, releases as a lit list". after-midnight is in the history for this product, so not again)
Theme: temple-dawn (pair: sodium-night, not used: one mode, a label site people visit, not leave open)
Why this theme: Temple Dawn is the label's city at the first bell, which is where every session ends
Rejected: sodium-night (the first look), observatory (navy and gold reads as a planetarium, and the Late Light pair already used it)
Pairing: night-show (Instrument Serif, Inter Tight, JetBrains Mono, numbers mono. No caution)
Family: editorial (radius 2px, outline buttons, no shadow, air)
Icons: Lounge Icons, 24px, stroke 1.75 (play, pause, arrow-right, arrow-left, chevron-down, x, alert). Expand is drawn in the same grammar, not in the set
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: text-mask-line-reveal (lead), stacking-cards-scroll (supporting, motion 9)
Density: air
Shell: none
Panel: none
Nav: The takes, The rule, Send a tape
Phone nav: none below 900px: the mark plus Send a tape, as the hero brief says
Pieces: hero-asymmetric-type-lockup, text-mask-line-reveal, scroll-word-highlight (still form), stacking-cards-scroll, corner-player, contact-project-brief-steps, footer-sitemap-columns
Sections: work corner-player (direction's work: every take plays in the corner clip) with stacking-cards-scroll for the list (motion 9, a list of projects) · about scroll-word-highlight (a short belief; two fit, text-rise-underline-whisper and scroll-word-highlight; Aadhi Raat Records = 145, 145 + 2 = 147, 147 mod 2 = 1) · contact contact-project-brief-steps (a label taking submissions needs answers; two fit, brief steps and conversational form; 145 + 3 = 148, 148 mod 2 = 0) · footer footer-sitemap-columns (direction's footer)
Recent: music/after-midnight used on 6 Oct for Aadhi Raat Records (first look), so not again
Unlike: Aadhi Raat Records, first look: hero differs (asymmetric lockup vs moonlit ridge), work differs (corner player vs coverflow), footer differs (sitemap columns vs newsletter split). Unlike recent culture sites (Late Light a and b): hero, work, and footer all differ
Column: 720px for paragraphs. Hero, the takes, and bands use the 1184px frame
Kept from their system: none, new kit
```

### Defaults set aside, and why

- Show mode: they asked for "go wild, Awwwards", which normally means Show mode. The two-looks rule makes the second look composed, because the first look already carried the centrepiece. This one is pushed with variance 9 and motion 9 instead.
- Corner player on a phone is 220 × 84, not 124: the waveform strip hides in the corner below 640px so the clip covers less reading text. It still opens to full width with the waveform.
- The mask reveal brief's three notes are replaced by the about paragraph (scroll-word-highlight, built still with its three underlines drawn), so the rule section has one job.
- Sitemap footer has three link columns, not five, and no language or region selects: the label has one page and one language. Every link goes to a real anchor.
- The about paragraph is Inter Tight Light at display size rather than the display serif, so body text stays on the text face.

## Scene

No scene tokens. The record sleeves and discs are drawn in theme colours only.

## Sources

- theme temple-dawn — https://www.designlounge.live/themes/temple-dawn
- pairing night-show — https://www.designlounge.live/type/night-show
- family editorial — 2px
- hero-asymmetric-type-lockup — layout, motion — https://www.designlounge.live/demo/hero-asymmetric-type-lockup.html
- text-mask-line-reveal — motion — https://www.designlounge.live/demo/text-mask-line-reveal.html
- scroll-word-highlight — layout (still form) — https://www.designlounge.live/demo/scroll-word-highlight.html
- stacking-cards-scroll — motion, layout — https://www.designlounge.live/demo/stacking-cards-scroll.html
- corner-player — component — https://www.designlounge.live/demo/corner-player.html
- contact-project-brief-steps — layout, component — https://www.designlounge.live/demo/contact-project-brief-steps.html
- footer-sitemap-columns — layout — https://www.designlounge.live/demo/footer-sitemap-columns.html
- night ruler — built for this site, no piece

## Match

```
Column: 720px (reading), frame 1184px on every section
Page padding: 48px web, 20px phone
Control height / radius: 40px web, 44px phone / 2px
Amount face: JetBrains Mono (timestamps, clock, counts)
Shell: none
Panel: none
Nav: The takes, The rule, Send a tape
Phone nav: mark plus Send a tape
Fails: none
```

## Still to replace

- The four takes are an example catalogue (Asan, Thamel, Naxal, Boudha). Replace them with real releases, real artists, and real audio.
- The tape form and the night list have no backend. Wire them to a form service before launch.
- No reply time is stated on the tape form's success screen, because none was given.
- The first bell is set at 05:00 on the ruler and in the form check. Confirm the label's real cut-off.

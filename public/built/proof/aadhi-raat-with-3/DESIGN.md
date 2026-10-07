# Aadhi Raat Records

## Brief

Request, word for word:
"Make a website for a record label that only releases music recorded after midnight in Kathmandu. Go wild, I want it to feel like an Awwwards site of the day."

Product: Aadhi Raat Records (working name, replace; "aadhi raat" is midnight), a record label in Kathmandu that releases only music recorded after midnight, Nepal time (UTC+5:45). That is every fact they gave.
For: a musician in the valley with a late take, or a listener who heard the name, on a laptop or a phone. In ten seconds they should understand the one rule and feel the hour.
World: night sky, rooftops, the hour
The one thing: the page is one night in Kathmandu. You scroll from eleven to first light. The sky, the moon, the city's windows and lamps move with the scroll, and at 00:00 the label opens. Three readouts are real: the scene clock, Kathmandu's clock now, and the window (time to midnight, or time to sunrise).
Ambition: spectacle, because "Go wild" and "Awwwards site of the day"
Mode: Show, Free
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly. Google Fonts only.
Missing: the roster, any release, dates, prices, an email address or social links, a logo. The page shows no release, the sleeve is a labelled Example, and the submission ends in a copied brief, not a send. Also assumed: "after midnight" means the window from 00:00 until sunrise in Kathmandu, computed live. Say so in the reply.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control. (This build has no sound: no recordings were given, and a fake drone would stand in for the label's music.)

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the night (hero plus three chapters), the sleeve, send a tape, and the colophon footer, opened in a browser at both sizes, fixed, and the closing block written.

## System sheet

```
Product: Aadhi Raat Records, a Kathmandu label that releases only music recorded after midnight, Nepal time
Who: a musician with a late take, or a curious listener. They know the name and nothing else.
Decision: is my late-night take something this label would put out, and how do I send it
First thing they see: "Recorded after आधी रात in Kathmandu", over the city at 23:00, with the clock running
Next action: Send a tape
Job of this pass: the public site, one page
Scope: night (centrepiece), the sleeve, send a tape, footer
Idea: the page is one night in Kathmandu. You scroll from eleven to first light; the sky, the moon, the windows and the lamps follow the scroll, and at 00:00 the label opens.
Signature: the window readout. A live countdown to midnight in Kathmandu that flips to "open, closes at sunrise hh:mm" when the city crosses 00:00, with sunrise computed for today. The rail dot and the submission check use the same clock.
Avoiding: the dark portfolio (huge serif name, mono kicker, a local clock as decoration) and the neon music template. The clock here is the rule, not a garnish. No giant wordmark footer, no numbered eyebrows, no sticky hairline grid.
Register: scroll-space-voyage (re-skinned as a night, not a flight)
Show: yes, Free · centrepiece scroll-space-voyage re-skinned · light: the moon over the valley, with sodium lamps on the ground until they fade at dawn · scene --scene-sky-23 #141c3f (23:00 sky), --scene-sky-00 #04060d (midnight), --scene-sky-03 #070a22 (small hours), --scene-dawn #f4b58a (first light at the horizon)
Palette (Free, from the moon on tin roofs and sodium lamps on indigo):
  --bg #0b0e1a  the valley sky between stars, the page
  --surface #121628 / --surface-2 #1a1f36 / --surface-3 #2a3050  roofs under moonlight, lighter as they come nearer
  --line #2a3047  a hairline on the dark · --line-strong #8e97b3  the moonlit edge
  --ink #efe9db  paper under the moon · --ink-2 #b4b1a6 (8.9:1 on bg) · --ink-3 #8a897f (4.6:1, labels only)
  --primary #f2a93b  sodium lamp amber, the one bright stop · --primary-ink #141210 · --primary-soft #3b2d12 · --link #f2a93b
  --secondary #f08b7a  dawn apricot (success wash only) · --tertiary #9fb4d6  moon blue (the sky's ice)
  --danger #e4574a  the take that started too early
Type (Free):
  display Khand 600/700, uppercase: the condensed caps of the concert posters pasted on Kathmandu's walls, and it sets आधी रात in the same hand, so the Nepali word is not a fallback glyph.
  text Mukta 400/500: a humanist sans drawn to sit beside Devanagari, plain enough to read at 18px over a sky.
  no mono: readouts and the counter use Mukta with tabular figures (.num).
  Free: took nothing from the library; Poster Condensed (Bebas Neue + Space Mono) was the direction's pairing and loses because it has no Devanagari.
Dials: variance 9 · motion 9 · density 3 (the family's density wins for controls: dense, 36px web / 44px phone)
Kind: website
Mode: new kit
Recipe: music · Direction: gig-poster (their world: night sky, rooftops, the hour; mood: one loud poster, condensed type. observatory was claimed by two parallel builds of this product within the hour, after-midnight and first-bell were used on 6 Oct, so gig-poster is the next direction that fits.)
Theme: free (direction theme festival rejected: fluoro pink on cream is a riso zine, not a valley at night)
Why this palette: the moon and the sodium lamps are the only lights in Kathmandu after midnight. Everything on the page is lit by one of them.
Rejected: observatory (navy and gold) because two parallel builds hold it; sodium-night because the 6 Oct build sat on indigo and orange-red (#090c22 / #ff5e2b) and this one must not.
Pairing: free (Khand + Mukta)
Family: sharp (radius 0, 1px rules, outline or solid-ink buttons, no shadow on the interface; drawn objects keep their own shadows)
Icons: Lounge Icons, 24px, stroke 1.75 (menu, x, arrow-right, arrow-up, check, alert)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: scroll-space-voyage (lead). The Dials' supporting piece stacking-cards-scroll was not used: no section on this page is a list of step cards.
Density: dense controls (36 / 44), page padding 24, stack gap 12, inside a group 6; sections breathe at 120px
Shell: none (a fixed 88px nav rail on the left is the site header, not an app shell)
Panel: none
Nav: Night · The sleeve · Send a tape
Phone nav: drawer (hamburger-circle-reveal) · same labels
Pieces: navbar-vertical-rail (header), hamburger-circle-reveal (phone menu), scroll-space-voyage (centrepiece), contact-project-brief-steps (send a tape), footer-centered-colophon (footer)
Sections: work: the sleeve, built from the sheet (one drawn object, still). The direction's work corner-player needs a recording and none was given, and week-schedule needs dates. · about: folded into the night's chapters, no separate piece · contact: contact-project-brief-steps, because sending a take is a brief with a check · footer: footer-centered-colophon, the direction's.
Unlike recent music and culture sites: hero scroll-space-voyage matches Late Light (museum, 6 Oct) only; work differs from every line; footer footer-centered-colophon matches Late Light b only. One match each, so it stands. Unlike the other two Aadhi Raat builds: hero, work and footer all differ.
Kept from their system: nothing existed
Column: 720px for paragraphs; the night, the sleeve and the form use the full frame (1120 inside the 88px rail)
Defaults set aside: the rail brief numbers its links; the numbers are not shown here because numbered eyebrows are a Look fail and the ordered list keeps the order for screen readers. The brief-steps form ends in "Copy the brief" instead of a send, because no address was given and a fake success would be a lie. The colophon's essay fade is omitted: there is no essay above it.
```

## Sources
- theme free — see Palette above
- pairing free — see Type above
- family sharp — radius 0 — https://www.designlounge.live
- navbar-vertical-rail — layout, component — https://www.designlounge.live/demo/navbar-vertical-rail.html
- hamburger-circle-reveal — motion, component — https://www.designlounge.live/demo/hamburger-circle-reveal.html
- scroll-space-voyage — motion (the centrepiece, re-skinned as one night) — https://www.designlounge.live/demo/scroll-space-voyage.html
- contact-project-brief-steps — layout, component — https://www.designlounge.live/demo/contact-project-brief-steps.html
- footer-centered-colophon — layout — https://www.designlounge.live/demo/footer-centered-colophon.html
- the sleeve — built from the sheet, no piece

## Match

```
Column: 720px on every paragraph block
Column when the rail is closed: no rail to close (fixed header rail, not a shell)
Page padding: 24px (20px on the phone)
Control height / radius: 36px / 0 (44px on the phone)
Amount face: Mukta, tabular figures
Shell: none
Panel: none
Nav: Night · The sleeve · Send a tape
Phone nav: drawer · same labels
Fails: none
```

Designed using Design Lounge · https://www.designlounge.live

## Look

Looked at: fin-web-hero.png, fin-web-dawn.png, fin-web-sleeve.png, ar-web-open.png (clock fixed at 01:15 NPT, window open), ar-web-form2.png, ar-web-review.png, ar-web-sent.png, ar-web-footer.png (1280x800); fin-phone-hero.png, fin-phone-dawn.png, fin-phone-sleeve.png, ar-phone-menu.png, phone-send.png, ar-phone-footer.png (390x844); ar-still-hero.png, ar-still-dawn.png (1280x800, prefers-reduced-motion) with Playwright (Chromium), plus the scroll stepped through the night at 14, 29, 57, 86 and 100 percent.
Fails found and fixed: the 1280 headline ran to five lines and pushed the button into the readouts (h1 now 8.6vw, max 120px, in a 1040px box: three lines); the record was invisible against the page (grooves and sheen lit, a highlight edge on the jacket); "Next" and "Copy the brief" showed together because .btn's display beat hidden ([hidden] now wins); the step-2 group error sat under the optional field instead of the radios; the moon's terminator was a hard disc (now a clipped soft gradient).
Remember after five seconds: "the Nepali word in lamp amber over Kathmandu at eleven, with a clock counting down to midnight" · could be anyone's: no
Correction: too even
Changed: the window readout (the Signature) is one step larger, 24px in the live-state amber; the scene clock and Kathmandu now stay 15px captions.
Left alone: the palette, the type, the family, and the other sections
Still open: no address to send the tape to, so the brief is copied, not sent; no roster or release, so the sleeve is an Example; no sound (no recordings given); the window's end at sunrise is an assumption written in the brief; the phone menu and the form were run in a scripted browser, the hover states were not seen.

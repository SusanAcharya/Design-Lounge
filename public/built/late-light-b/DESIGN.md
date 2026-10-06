# Late Light · look B

Second look for the same product. Look A (museum / star-dome, Deep Field, Night Show, `scroll-space-voyage`) is in the history; this pass shares none of its theme, pairing, hero, work, or footer.

## System sheet

```
Product: Late Light, a planetarium's late-night show
Who: someone deciding whether to spend a late evening under the dome; they know what a planetarium is, not what this show feels like
Decision: is this worth staying up for, and which night
First thing they see: "Late Light" beside a lit sky poster whose ring already holds the next world, glowing gold
Next action: Hold a seat
Job of this pass: the public site, one page
Scope: centrepiece journey, eight lights, visit, footer
Idea: You scroll and fly through a ring in a Bauhaus sky poster into the next scale of space, four times over: the Sun, Proxima Centauri, the Milky Way, Andromeda.
Signature: every scene holds the next one, tiny and already lit, inside its ring; the distance and the age of the light count up as you fall through
Avoiding: the dark space template (black page, a starfield and a glowing planet) and look A's photoreal voyage. Also the studio template: no numbered sections, no giant wordmark footer, no hairline grid everywhere (the grid lives only inside the poster)
Register: scroll-zoom-portal
Show: yes · centrepiece built from the direction's own pieces: hero-bauhaus-composition as the first frame, scroll-zoom-portal chained four times · light: the Sun, from the upper left · scene: --scene-light #fff4d8 (sunlight, warmer and whiter than the gold primary, for highlights and halos), --scene-ember #ff8a5c (Proxima is a red dwarf; the theme has no star-red)
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: museum · Direction: night-gallery (their three words: dome, star projector, midnight; mood "modern art, navy, Bauhaus shapes" and the Observatory theme. star-dome fits too but is look A, so it is out)
Recent: museum/star-dome used on 6 Oct for Late Light A, so not again
Unlike Late Light A: hero differs (hero-bauhaus-composition vs scroll-space-voyage), work differs (gallery-contact-sheet vs gallery-museum-placard), footer differs (footer-centered-colophon vs footer-giant-wordmark-reveal). No matches.
Theme: observatory (pair: planetarium, not used: a late-night show is a night page)
Why this theme: deep navy and star-gold are the planetarium at night, and its secondary and tertiary give each scene its own ground
Rejected: deep-field (look A's theme, and the brief asks for a different look)
Pairing: bauhaus-school (Outfit 800 display, DM Mono text, no mono: numbers use DM Mono with tabular figures, code uses the system mono)
Family: sharp (radius 0, outline buttons or a solid ink block, 1px rules, no shadow)
Icons: Lounge Icons, 24px, stroke 1.75 (arrow-right, arrow-up, x, clock drawn in the same grammar)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: scroll-zoom-portal
Density: air
Shell: none
Panel: none
Nav: Journey, Eight lights, Visit
Phone nav: the mark plus Visit (the journey is the page itself; no drawer)
Pieces: hero-bauhaus-composition, scroll-zoom-portal, gallery-contact-sheet, contact-booking-hours, footer-centered-colophon
Sections: work gallery-contact-sheet (direction's work: eight equal plates, one per light, the colour is the art) · about none (Show mode: centrepiece plus two supporting sections) · contact contact-booking-hours (a place people visit at set times; the only contact option that fits a show with nights) · footer footer-centered-colophon (the direction's footer-enterprise-sitemap fights the Idea: a one-page show has no 46 links, no status page and no regions, so it would be invented chrome; the colophon closes a single night quietly)
Column: 720px for paragraphs; hero, journey and bands use the full 1280 frame
Kept from their system: nothing, new kit
```

### Four lines
- Who: a night-owl deciding whether the show is worth staying up for.
- Decision: go, and which night.
- First thing they see: the name, and a sky poster whose ring is the door to the trip.
- Next action: Hold a seat.

### Defaults set aside
- Their words said "unforgettable", so this look is Show mode too. The skill's two-looks rule suggests one Show mode site and one composed site; this one is composed from the direction's own pieces (the Bauhaus hero and the portal) and turned into the centrepiece, so it still reads as a different site from look A.
- Motion 9 names `grow-grid` as the supporting piece for a grid of work. Not used: the contact-sheet brief says equal frames and no motion, and the hero's recompose already gives the page a second, touch-driven motion outside the scroll.
- `footer-enterprise-sitemap` replaced by `footer-centered-colophon`, for the reason in Sections.

### Lead motion
One sticky stage, five layers. Each layer is cut by a mask at its ring's hole; the next layer sits behind it at 1/S scale, so the whole next scene is visible, lit, inside the ring. Scroll scales the pair geometrically (S^t, smoothstep) about the hole centre until it covers the screen; S = 1.12 × farthest-corner distance / hole radius, measured on load, resize, after fonts and after each recompose, never in the scroll handler. Readouts: distance from your seat and light-time, interpolated on a log scale between the real stops (0, 149.6 million km, 4.24 ly, 26,000 ly, 2.5 million ly), plus the name being passed. A canvas starfield in three depths is pushed outward by the zoom and streaks when it moves fast; it is static when you stop. Reduced motion: no pin, no zoom, no stars; each scene stands as a full still frame in order.

## Sources
- theme observatory — https://www.designlounge.live/themes/observatory
- pairing bauhaus-school — https://www.designlounge.live/type/bauhaus-school
- family sharp — radius 0
- hero-bauhaus-composition — layout + motion (the sky poster, three compositions, 900ms expo with 60ms stagger) — https://www.designlounge.live/demo/hero-bauhaus-composition.html
- scroll-zoom-portal — motion (geometric zoom through the ring, chained four times) — https://www.designlounge.live/demo/scroll-zoom-portal.html
- gallery-contact-sheet — component (eight lights) — https://www.designlounge.live/demo/gallery-contact-sheet.html
- contact-booking-hours — layout + component (visit band, nights table, Hold a seat dialog) — https://www.designlounge.live/demo/contact-booking-hours.html
- footer-centered-colophon — layout — https://www.designlounge.live/demo/footer-centered-colophon.html

## Facts on the page
Distances and light-times are public astronomy figures: Moon 384,400 km; Sun 149.6 million km and 8 min 19 s; Saturn 1.2 to 1.7 billion km; Proxima Centauri 4.24 ly; Sirius 8.6 ly; Pleiades about 444 ly; galactic centre about 26,000 ly; Milky Way about 100,000 ly across; Andromeda 2.5 million ly.

## Still to replace
- The nights table is an example schedule and says so. Replace it with the planetarium's real nights and times.
- The Hold a seat form is not connected; on submit it says nothing was sent. Point it at the box office (email or booking system).
- No address, ticket price, or venue link was given, so none is shown.

## Match
```
Column: 720px paragraphs, 1280 frame on every section
Page padding: 56px web / 20px phone
Control height / radius: 36px web, 44px phone / 0
Amount face: DM Mono, tabular
Shell: none
Panel: none
Nav: Journey, Eight lights, Visit
Phone nav: mark plus Visit
Fails: none
```

Designed using Design Lounge (https://www.designlounge.live).

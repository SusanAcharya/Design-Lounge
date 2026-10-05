# Late Light · Corvus Planetarium

```
Product: Late Light, the late-night dome show at Corvus Planetarium
Who: someone deciding on a night out, on a phone, around 21:00
Decision: is this worth a seat tonight, and which show
First thing they see: a dark sky with a torch on it. Under the torch the headline turns from "Late Light" to "Old Light" and a real star chart (Orion, Taurus, Canis Major) shows through
Next action: Book seats, which lands on "Pick your night" (the week board and the seat map)
Job of this pass: the whole one-page site, from the sky to the footer
Scope: website, one page, five sections
Idea: neon laser-show drawings of the Moon, the Sun, Jupiter and on out to the oldest light, flown through as you scroll, with a counter of how long that light took to reach your seat
Avoiding: the stock space site (navy gradient, gold serif, a generic starfield, "Explore the universe")
Register: scroll-zoom-portal (lead) + hero-flashlight-reveal (supporting)
Dials: variance 9 · motion 9 · density 3
Kind: website
Mode: new kit
Recipe: event · Direction: night-marquee (their words say late-night; night-marquee is the recipe's club-night direction)
Theme: neon-alley (pair: none, so the site stays in one dark mode)
Why this theme: Neon Alley, because a late show is a night out and the drawings are laser lines, magenta and cyan on black
Rejected: observatory (navy and star-gold, from the museum recipe). It is the obvious space look and the exact default this page avoids
Pairing: neon-marquee (Monoton display, Josefin Sans text, no mono, so .num is Josefin Sans with tabular digits)
Family: glass (16px radius, soft buttons, regular density, one floating glass layer: the pill nav on desktop, the tab bar on phone)
Icons: Lounge Icons, 24px, stroke 1.75
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: scroll-zoom-portal, hero-flashlight-reveal
Density: regular (locked by the glass family; the low density dial shows as fewer regions, not tighter spacing)
Shell: none
Panel: none
Nav: Show · Journey · Visit · Letter, with Book as the soft button at the right
Phone nav: tabs · Show · Journey · Book (centre) · Visit · Letter
Pieces: navbar-floating-pill-shrink, hero-flashlight-reveal, scroll-zoom-portal, week-schedule, event-ticket-checkout, contact-booking-hours, footer-newsletter-split, mobile-web-bottom-nav
Sections: hero hero-flashlight-reveal · work scroll-zoom-portal (the journey is the picture of the show) · tickets week-schedule + event-ticket-checkout · contact contact-booking-hours ("Late Light" = 94, 94 + 3 = 97, 97 mod 2 = 1) · footer footer-newsletter-split (94 + 4 = 98, 98 mod 4 = 2)
Kept from their system: nothing, there was no system
Column: frame 1200px, paragraphs 720px · page padding 32px, phone 20px
```

## Their words win

- Two effects, not one: the person asked for a scroll journey through space and "unforgettable", so the journey is the lead and the torch hero is a supporting effect, each in its own section.
- The direction names kinetic-type-marquee as its effect. The scroll journey replaces it, because the scroll journey is what they asked for.

## Deviations from the briefs

- The desktop nav's Book button is soft, not filled, so the hero's "Book seats" stays the one primary in view.
- The ticket hold timer starts at the first seat pick, not on page load, so no one loses a hold they never started.
- The visit email is set in Monoton lowercase as the big type of that band.
- Gradients and glows appear only inside the two effect regions (the torch and the journey drawings) and on the phone stop cards over the moving sky.
- The phone seat map keeps a 500px drawing that swipes sideways, opens centred on the projector, and gives each seat an invisible hit area that fills the gap to its neighbours (about 38 x 40px). 44px would need a map wider than three screens.
- On phones the hero chart shows a short form of each note (the star and its distance) and hides the star-name labels and the RA/Dec readout, so the chart fits above the headline.

## Product data written for this build

Corvus Planetarium, 4 Observatory Road, late@corvus.space. Shows Thu 8 Oct 22:00, Fri 9 and Sat 10 Oct 22:00 and 23:30, 55 minutes, week of 5 Oct 2026. Standard €18 + €1.50 fee, Concession €13 + €1.50, Members' preview €12 (sold out), Recliner row E €26 + €2. Six tickets per order. 118 seats in five rings. Ages 12 and up.

## Facts used

Moon 384,400 km, light 1.3 s · Sun 149.6 million km, 8 min 20 s · Jupiter 33-54 light-minutes, Great Red Spot wider than Earth, watched for more than 150 years · Saturn about 70-90 light-minutes, rings mostly water ice, about 10 m thick in places, opposition 4 Oct 2026 · Voyager 1 launched 1977, signals take almost a day · Proxima Centauri 4.2 light-years, a red dwarf · Orion Nebula about 1,340 light-years, visible by eye · Sagittarius A* about 26,000 light-years, about 4 million Suns · Andromeda 2.5 million light-years · cosmic microwave background 13.8 billion years, released about 380,000 years after the Big Bang · Sirius 8.6 light-years · Aldebaran about 65 · Pleiades about 440 (light from the late 1500s) · Orionids peak around 21 Oct, dust from Halley's Comet. Star positions in the hero chart are real RA and Dec.

## Match

```
Match
Column: 1200px frame, 720px paragraphs, on every section
Column when the rail is closed: no rail
Page padding: 32px, phone 20px
Control height / radius: 44px / 16px
Amount face: Josefin Sans (tabular digits)
Shell: none
Panel: none
Nav: Show, Journey, Visit, Letter, Book
Phone nav: tabs · same labels; Book moves to the raised centre tab, where mobile-web-bottom-nav puts the main action
Fails: none
```

## Sources

- theme neon-alley — https://www.designlounge.live/themes/neon-alley
- pairing neon-marquee — https://www.designlounge.live/type/neon-marquee
- family glass — 16px
- navbar-floating-pill-shrink — component — https://www.designlounge.live/demo/navbar-floating-pill-shrink.html
- hero-flashlight-reveal — motion — https://www.designlounge.live/demo/hero-flashlight-reveal.html
- scroll-zoom-portal — motion — https://www.designlounge.live/demo/scroll-zoom-portal.html
- week-schedule — layout — https://www.designlounge.live/demo/week-schedule.html
- event-ticket-checkout — component — https://www.designlounge.live/demo/event-ticket-checkout.html
- contact-booking-hours — layout — https://www.designlounge.live/demo/contact-booking-hours.html
- footer-newsletter-split — layout — https://www.designlounge.live/demo/footer-newsletter-split.html
- mobile-web-bottom-nav — component — https://www.designlounge.live/demo/mobile-web-bottom-nav.html

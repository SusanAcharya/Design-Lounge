# Late Light · DESIGN.md

Product: Late Light, a planetarium's late-night show (name taken from the project folder; the planetarium's own name was not given)
Who: adults looking for something to do after 22:00 who have heard the planetarium runs a late show
Decision: is this worth a seat tonight?
First thing they see: you are lying under the dome, the house lights go down: "Lights down. Look up."
Next action: Book a seat
Job of this pass: the public one-page site
Scope: hero and journey, tickets, nights and booking, footer
Idea: the page is the show. You start in a reclined seat under the dome, and every scroll moves one camera up through the dome's open crown, past the Moon and Saturn, until the whole Milky Way fits on the screen.
Signature: the dome itself, drawn in points of light like the projector's, with the house lights dimming on load, and a live "from your seat" readout that counts 0 m to 384,400 km to 1.4 billion km to 150,000 light-years as you scroll. The galaxy carries a gold mark: your seat.
Avoiding: the dark portfolio (serif italic name, mono kicker, numbered table) and the studio template (hairline grid, tracked mono labels, giant wordmark footer). Also the "space site" default: a purple nebula gradient with centred white text.
Register: three-scroll-world
Dials: variance 8 · motion 8 · density 3
Kind: website
Mode: new kit
Recipe: event · Direction: listening-night (their words: a show, late, travel through space; world: a dark dome, chapters, a projector; mood: "A dark room, chapters, records in a row", with the Observatory theme)
Recent: no event lines in history. Culture group: First Fret and Happy Easel (education) used course-landing-curriculum and spring-deck.
Unlike recent culture sites: hero, work, and footer are all different.
Theme: observatory (pair: planetarium, not used: a late-night show is one mode)
Why this theme: Observatory is deep navy and star gold, best for night products and science, and its pair is literally named Planetarium.
Rejected: night-desk (the game/Orbit direction's theme). A lamp over a dark table is a desk, not a sky.
Pairing: cinema (Anton display, Crimson Pro text, no mono, so numbers use Crimson Pro tabular figures and code uses the system mono)
Family: editorial · radius 2px · outline buttons · air density · no shadow
Icons: Lounge Icons, 24px, stroke 1.75 (arrow-right, arrow-down, arrow-up, clock, x)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: three-scroll-world
Density: air
Shell: none
Panel: none
Nav: The show, Tickets, Visit
Phone nav: header keeps the wordmark and Visit; the chapter index becomes a four-cell bottom row
Pieces: hero-chaptered-scenes, three-scroll-world, card-holo-foil, contact-booking-hours, footer-centered-colophon
Sections: work card-holo-foil (the direction's work; a ticket is the thing you take home from a show) · about none (no story was given, the journey copy does that job) · contact contact-booking-hours (a place people visit with nights and times) · footer footer-centered-colophon (the direction's footer)
Column: 560px for chapter copy, 620px for the hero copy, 1184px frame for tickets

## Defaults set aside

- The direction's effect is `coverflow-strip`. Replaced by `three-scroll-world` because they said "you scroll and you travel through space", and the skill routes a scroll-driven world to that piece.
- `hero-chaptered-scenes` autoplays its chapters on a 6.5s timer with a pause control. Here scroll drives the chapters and the hairlines, so there is no timer and no pause button. The still headline, the right-hand chapter index with progress hairlines, the masked scene, and the bottom strip are kept.
- `three-scroll-world` puts the canvas in a left column and the copy on the right, with three poses. Here the canvas fills the sticky stage behind the copy (as the chaptered hero does), the copy sits left, and there are four poses plus one hidden pose that lifts the camera through the dome's crown. The brief's scene graph is Three.js; this build is raw WebGL because the brief forbids CDN libraries here, and the Lounge demo of this piece is raw WebGL too.
- `footer-centered-colophon` fades the last paragraph of an article above it. This page has no article there, so there is no fade.
- `card-holo-foil` uses an 18px radius. The Editorial family's 2px wins.

## Sources
- theme observatory — https://www.designlounge.live/themes/observatory
- pairing cinema — https://www.designlounge.live/type/cinema
- family editorial — 2px
- hero-chaptered-scenes — layout — https://www.designlounge.live/demo/hero-chaptered-scenes.html
- three-scroll-world — motion — https://www.designlounge.live/demo/three-scroll-world.html
- card-holo-foil — component — https://www.designlounge.live/demo/card-holo-foil.html
- contact-booking-hours — layout — https://www.designlounge.live/demo/contact-booking-hours.html
- footer-centered-colophon — layout — https://www.designlounge.live/demo/footer-centered-colophon.html

## Still to replace

- Show times, ticket types, seat rows, codes and perks are example content and are labelled as such on the page.
- The booking form is not connected to a box office.

Designed using Design Lounge (https://www.designlounge.live)

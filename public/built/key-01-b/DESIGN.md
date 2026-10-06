# KEY-01 · design sheet (second look)

Designed using [Design Lounge](https://www.designlounge.live).

```
Product: KEY-01, a mechanical keyboard, launch page (second look; the first is /tmp/dl-pairs/key-01-a)
Who: someone who types for a living and wants to feel a keyboard before it ships
Decision: is this keyboard worth hearing about when orders open?
First thing they see: the name KEY-01 set across the page grid, with the whole board under it, ready to type on
Next action: type on it, then join the list
Job of this pass: the public launch page
Scope: one page, five beats: board, layers, notes, list, footer
Idea: the page grid is the keyboard's grid. The name is six cells wide, and the last six keys you press take its place.
Signature: a flat technical drawing of a 61-key board set on the 12-column grid. Each press lights the grid column it sits in and rises a new letter into the wordmark.
Avoiding: the first KEY-01 site (bone and signal orange, a tilted 3D board as a Show mode hero, a giant wordmark footer), the SaaS template, and the studio template (hairlines stay in the hero only, labels are sentence case, no numbered sections)
Register: scroll-velocity-type
Show: no · centrepiece: the Signature board, built for this site inside hero-swiss-grid-wordmark · light: top left (cap walls fall right and down) · scene: none
Dials: variance 8 · motion 8 · density 4
Kind: website
Mode: new kit
Recipe: landing · Direction: grid-launch (their world: switches, an aluminium case, a hardware launch; mood "Precise, cool, a hardware launch")
Recent: landing/playable used on 6 Oct for KEY-01 (first look), so not again. bench-at-night shares its pairing (machined), so it loses.
Unlike KEY-01 first look: hero differs (hero-swiss-grid-wordmark vs playable-product-hero), work differs (stacking-cards-scroll vs stats-count-up-band), footer differs (footer-engraved-caravan-strip vs footer-giant-wordmark-reveal). Unlike Product-Helper saas: all three differ.
Theme: ice-station (pair: polar-night, not used: a launch page is not left open)
Why this theme: pale northern blue-grey reads as a precise instrument, and it is the opposite end from the first look's bone and orange.
Rejected: graphite-signal (bench-at-night), too close to the first look's orange signal.
Pairing: swiss-precision (Schibsted Grotesk 800 / 400, IBM Plex Mono for numbers and legends). Caution: none.
Family: sharp (radius 0, 1px ink rules, no shadow, outline buttons or one solid ink block)
Icons: Lounge Icons, 24px, stroke 1.75 (volume, arrow-right, check)
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms · effect: scroll-velocity-type (lead), stacking-cards-scroll (motion 8 supporting), the hero entrance and key travel (the Signature)
Density: regular, page padding 40 (20 on phone), stack gap 16
Shell: none
Panel: none
Nav: Board, Layers, Notes · Join the list
Phone nav: none (brand plus Join the list, three anchors are not worth a drawer)
Pieces: hero-swiss-grid-wordmark, stacking-cards-scroll, scroll-velocity-type, cta-giant-email-band, footer-engraved-caravan-strip
Sections: work stacking-cards-scroll (direction; one key cut through, four layers, one card each) · about scroll-velocity-type (the direction's effect carries the notes, so no extra moving section is added) · contact cta-giant-email-band (contact-giant-email-copy dropped: no address was given; the band is the only option left) · footer footer-engraved-caravan-strip (direction)
Kept from their system: none, new kit
Column: 1200px frame; paragraphs 62ch
```

## Their words win

- "People must still be able to play with it": the board is fully playable on a composed site with Show mode off, because the first look already took Show mode.
- Hero brief: the meta row, the side label and the recent-work index are dropped (no facts for them, and the label limit). Click-on-blank replay is dropped because taps on the board would trigger it; "Give the name back" and Return replay the entrance.
- Footer brief: the local clock is dropped (the place does not matter to KEY-01), and the email form is replaced by a link to the list, so the page has one sign-up form. The herder and llamas became six walking keycaps; the hatched ridges are keycap profiles.
- Stacking cards: the "Add to routine" pill became a "Press" button that runs the cross-section. No rail (four cards, the heading says it).
- Email band: the focus signal is an outline, not the brief's hard shadow, because the family's shadow is none.

## Sources

- theme ice-station · https://www.designlounge.live/themes/ice-station
- pairing swiss-precision · https://www.designlounge.live/type/swiss-precision
- family sharp · radius 0
- hero-swiss-grid-wordmark · layout · https://www.designlounge.live/demo/hero-swiss-grid-wordmark.html
- stacking-cards-scroll · motion · https://www.designlounge.live/demo/stacking-cards-scroll.html
- scroll-velocity-type · motion · https://www.designlounge.live/demo/scroll-velocity-type.html
- cta-giant-email-band · component · https://www.designlounge.live/demo/cta-giant-email-band.html
- footer-engraved-caravan-strip · layout · https://www.designlounge.live/demo/footer-engraved-caravan-strip.html
- playable-product-hero · interaction reference only (keyboard input rules, sound gating) · https://www.designlounge.live/demo/playable-product-hero.html

## Still to replace

- The price, the switches, the layout and the ship date: none were given, and the page says so.
- The list form has no backend. It validates and shows its states, but stores nothing. Connect it before launch.
- The three list promises (No account, No payment now, Only about KEY-01) need the owner's yes.
- The layer card copy describes any mechanical keyboard. Swap in KEY-01's real parts when they exist.

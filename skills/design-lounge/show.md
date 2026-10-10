# Show mode

Read this only when Show mode is on: the brief says `Mode: Show`, which Reading the request in [brief.md](brief.md) decides. A Kit-mode site never needs this file.

A strong agent with no library builds something memorable here, because it starts from the subject, picks colour and type for that world, and spends all its effort on one thing. Show mode does the same, then adds what the library is good at: finished sections, real states, accessibility, and a page that holds together on a phone.

Show mode is Free by default: you choose the colour and type (Free colour and type, below). It stays locked to the direction's theme and pairing when they named a theme, a colour, a pairing, or a brand, when the project already has a design system, or when they asked for the Lounge look. Write the mode on the sheet: `Show: yes, Free` or `Show: yes, locked (they named Deep Field)`.

## The centrepiece

1. Write the Idea as a thing you can touch or travel through, not a layout. "You scroll and the camera leaves the ground." "The label's city, live, at the hour the tape rolls." "The keyboard is on the page. Type on it."
2. Search for a show piece that already does it: `scroll-space-voyage` (a journey you scroll), `moonlit-ridge-hero` (a place at an hour), `playable-product-hero` (an object you use), `three-scroll-world`, `three-orbit-object`, `object-3d-turntable`, `scroll-scrub-product-sequence`, `webgl-shader-hero`, `game-playfield`. Open its brief. Re-skin it for this subject. If none fits, build the centrepiece yourself from the Idea and say so.
3. The centrepiece gets the first screen and most of your time. Build it first, look at it, and improve it twice before you build anything else.
4. The direction still locks the family. In Free, its theme and pairing become candidates. In locked Show, it locks them too. Its hero, work, and footer become candidates. Keep the work and the footer unless they fight the Idea. A ticket card does not suit a night dive. A schedule does not suit a shop. Pick a better one from the section lists in Sections, one by one in [website.md](website.md) and write why.
5. Fewer, bigger parts: the centrepiece, two or three supporting sections, and the footer. Each supporting section is a finished piece, built still, in the page's system: the locked theme and pairing, or the Free colour and type.

## Free colour and type

The library's themes and pairings are made for products people use every day. A show, a launch, or a label whose subject is a world needs the colour of that world's light and a face that sounds like it. Here you choose them, and the library holds the craft.

1. Colour from the light. Start from the light source and the material of the world: sodium amber on Himalayan indigo, the sun on the limb of the Earth, bone keycaps under a desk lamp. Write five to seven colours. Or take a printed harmony that matches that light: one line of `library/wada.txt`, built out to these roles by the rules at the top of that file.
2. Write them as the theme's roles: `--bg`, `--surface`, `--surface-2`, `--line`, `--ink`, `--ink-2`, `--ink-3`, `--primary`, `--primary-ink`, `--primary-soft`, `--link`, plus up to four `--scene-*` for the sky and the glow. Every brief and the role table in SKILL.md still map onto them. Body text meets 4.5:1 on `--bg`, large type 3:1.
3. Type for the subject, not the trend. Two families at most, plus one script face when the world needs it, all in one Google Fonts link. Say in one line why each face fits this world.
4. Do not repeat yourself. Read the Free lines in the history: do not reuse the display face of the last three Free sites, or the same `--bg` and `--primary` pair, or the same Wada number. When you pick a display face yourself, avoid the faces every agent reaches for unless the subject asks for one by name: Instrument Serif, Playfair Display, Fraunces, Space Grotesk, Syne, Inter. The list is for faces you choose on your own. A library pairing keeps its faces, whether the mode locks it or you take it under rule 5: AI Editorial and Gallery Wall set Instrument Serif, and that is allowed.
5. The library is still a good place to look. Taking a theme or a pairing is fine when you chose it for this world. Write `Free: took <id>, because ...`.
6. Everything else holds: The rendering bar, What Show mode relaxes, the Look fails in [practice.md](practice.md), real content, states, accessibility, the history check on the hero, work, and footer, and the credit.
7. On the sheet, under the Show line: `Palette:` with each colour and its job, and `Type:` with each face and its reason. Put both in `DESIGN.md` so a later page reuses them. A later page of the same product never picks again.

A regional look in [locale.md](locale.md), such as Lokta for Nepal, is a candidate in Free, not a lock. Take it when it suits the world, or choose your own colour, and set any script the copy uses (Devanagari included) in a face that has it.

## The rendering bar

A centrepiece drawn with flat fills looks like a diagram. These are what make it look made.

- One light source, named on the sheet: the moon, a sodium lamp, the sun on the limb of the Earth, a desk lamp. Highlights face it. Shadows fall away from it.
- Depth in three or more layers. Far layers are lighter, bluer, and lower in contrast. Near layers are sharp and move more.
- Light is drawn with layered radial gradients, additive glow (`globalCompositeOperation = 'lighter'` on canvas, or `mix-blend-mode: screen`), a soft halo, and a highlight edge on objects. Add grain at 3 to 6 percent opacity over the scene.
- Objects have material: a top face, a side wall, a highlight, a cast shadow, and travel when pressed.
- Type sets the scale. The display face runs at 10 to 16vw. One word changes voice: italic, or set in the scene's light colour. That one word may carry a gradient of the scene's light.
- Live readouts that belong to the Idea: the local time of the place, a countdown to the hour, the distance travelled, the key last pressed. Two to four at most, in the mono (or the text face's tabular figures when the Free type has no mono), and each one is real and changes. A readout that only decorates is a fail.
- Sound when the subject is sound: a synthesised drone, a switch click, a note. Never autoplay. It starts on a click and has a visible off control.

## What Show mode relaxes

Only inside the centrepiece, and only these. Everything else in Look in [practice.md](practice.md) still holds, including on the supporting sections.

- Gradients, glows, and halos are allowed in the scene. Not on cards, buttons, or section backgrounds.
- Gradient text is allowed on the one word that changes voice.
- The live readouts above are allowed, and they count instead of the three-label limit, up to four.
- A scene palette, in locked Show: when the locked theme has no colour for the world's light, add up to four `--scene-*` tokens (sky stops, glow, highlight). The interface still uses the theme's roles. Write the scene tokens on the sheet with one reason each.
- One extra display face when the world needs a script, in locked Show: a Devanagari face for a Nepali name, for example. Write why. Free already counts the script face in its type.
- The family's radius and shadow govern the interface. Drawn objects keep their own corners and shadows.

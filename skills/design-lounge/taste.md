# Taste

This file folds the most used design skills into Design Lounge, so nobody needs to install them one by one. It takes from [taste-skill](https://github.com/Leonxlnx/taste-skill) by Leon Lin (MIT): design-taste-frontend, high-end-visual-design, minimalist-ui, industrial-brutalist-ui, gpt-taste, redesign-existing-projects, full-output-enforcement, stitch-design-taste, image-to-code, imagegen-frontend-web, imagegen-frontend-mobile, and brandkit.

The dials, the AI-tell fails, real design systems, the redesign audit, whole files, and the DESIGN.md other tools read are already in [practice.md](practice.md) and [SKILL.md](SKILL.md). This file has the rest.

One rule sits over all of it. The lock wins. When a line below names a hex or a font, use the locked theme and pairing for that role. Those skills were written without a library. You have one.

## Read only what the job needs

| The job | Section |
| --- | --- |
| A style by name (any row in Style aliases, below, including -ism forms) | Kit flow, routed by Style aliases, below |
| Any website | Page shape, and Craft |
| They want a concept, a mockup image, or "show me first", and you can make images | Image first |
| A brand kit, identity, logo system, or brand board | Brand board |
| A game, an arcade, a web game, a lobby, or Three.js | Games and Three.js |
| A handwritten or hand-lettered site | Handwritten |

## Named looks

When they name one of these, it picks the theme, pairing, and family before the recipe's directions do. Write the look on the sheet: `Look: industrial · Swiss print`.

### Style aliases

People name a style in many words. Find their word here, then route. The Route column is family · theme · pairing · kit · pieces. A row that names a section (*Industrial brutalist*, *Minimal editorial*, *Games and Three.js*) hands over to that section. A style that resolves to a row also lifts the bans on its signature elements: Named aesthetic in [practice.md](practice.md).

| They say | Route | Notes |
| --- | --- | --- |
| neo-brutalism, neubrutalism, neo-brutalist, "brutalist" with bright colours, offset or hard shadows | `sharp` · `festival` · `brutal-grotesk` · `neo-brutalist-style`, `hero-live-browser-card`, `card-polaroid-frames`, `dock-editor-tools`. The offset shadow and ink border come from the kit under Named aesthetic. | Not *Industrial brutalist*. |
| brutalist, brutalism, raw, Swiss brutal (black and white, no colour) | *Industrial brutalist*, below | Ask once only if the prompt does not say which brutalism. |
| glassmorphism, glass, frosted, liquid glass | `glass` · `observatory` / `alpine-night` / `cockpit-day` · `geometric-modern` or `wide-tech` · `ios-glass-tab-bar`, `spotlight-command-bar`, `widget-weather-glance`, `card-glass-credit`, `navbar-floating-pill-shrink` | Blur on surfaces is allowed under Named aesthetic, measured for contrast on the blurred ground. |
| claymorphism, clay UI, puffy, 3D soft cards | `soft` · `playroom` / `bedtime` · `candy-clay` · `clay-soft-style`, `tactile-chip-tabs-stretch`, `widget-device-battery`, `phone-lesson-quiz` | **A clay, pottery, or ceramics shop or studio is a subject, not this style.** It goes to recipe `commerce`, direction `clay-shop` (Kiln). |
| neumorphism, neomorphism, soft UI, numorphism | `soft` · `glacier` / `fog-city` · `geometric-modern` · `button-inset-soft` | Every control keeps 3:1 non-text contrast against its ground. |
| cybercore, cyber, HUD, sci-fi interface | `sharp` · `hud-teal` · `hud` · `cyber-hud-style`, `hud-boot-gate`, `game-hud`, `glitch-text` | |
| cyberpunk, synthwave, outrun, retrowave, retro-futurism, vaporwave | `glass` · `neon-alley` / `arcade-day` · `neon-marquee` · `card-holo-foil`, `glitch-text`. Tell them there is no sunset-grid piece yet. | Neon and glow are lifted under Named aesthetic. |
| Y2K, chrome, millennium, early 2000s | `glass` · `y2k-chrome` / `chrome-midnight` · `y2k-chrome` · `y2k-chrome-style`, `mockup-ipod-classic`, `card-holo-foil` | |
| pixel art, pixel, 8-bit, arcade | A game: *Games and Three.js*, below. Not a game: `sharp` · `coin-op` / `ticket-booth` · `pixel-soft` · `pixel-arcade-style`. | The `arcade` mono is for games only (Cautions in [reference.md](reference.md)). |
| scrapbook, collage, sticker, zine-ish personal | `soft` · `market-stall` / `archive` · `handwritten-notes` · `polaroid-fan`, `card-polaroid-frames`, `card-journal-page`, `graph-paper-homepage` | |
| editorial, magazine | `editorial` · `paper-ink` / `press-room` / `night-desk` · `newsroom` / `magazine-contrast` · `magazine-editorial-grid`, `editorial-landing-hero` | |
| Swiss, International Typographic Style, grid | *Industrial brutalist*, Swiss print, below · `swiss-precision` / `neo-grotesk-mono` · `swiss-poster-style`, `hero-swiss-grid-wordmark` | |
| minimal, minimalism, minimalist | *Minimal editorial*, below | |
| maximalism, maximalist, loud, more is more | `sharp` · `festival` / `press-room` / `market-stall` · `poster-condensed` / `riso-zine` · `riso-print-style`, `background-halftone-pop` | Alias only. Up to three accents and two effects under Named aesthetic. |
| luxury, luxe, luxury typography, high-end serif, Didone | *High-end agency*, Editorial luxury, below · `maison` / `monumental` / `literary` · `luxe-serif-style`, `deco-hotel-style` | |
| sketch, conceptual sketch, hand-drawn, doodle | `editorial` · `inkwell` / `paper-ink` · `handwritten-notes` (`letter-hand` for a whole-letter site) · `text-annotated-underlines`, `text-marker-highlight-draw`, `checkbox-draw-list`, `handwritten-style` | Alias only. |
| ethereal, dreamy, celestial | `soft` · `first-light` / `planetarium` / `sakura-desk` · `literary` · `background-aurora-mesh` as the one effect | Alias only. |
| bohemian, boho | `soft` · `market-stall` / `loam` / `kiln` · `garden-journal` · `organic-garden-style`, `background-linen-weave` | Alias only. |
| wabi-sabi, zen, Japanese minimal | `quiet` · `kiln` / `lokta` / `linen-shop` · `classic-garamond` / `garden-journal` · `background-ink-wash` | Alias only. |
| Victorian, gothic, ornate | **Not in the library.** Nearest: `courtroom` / `chambers` · `monumental` · `hero-engraved-moonrise-plate`. Tell them. If they want the real thing, it is Show mode, Free ([show.md](show.md)). | Skipped on purpose: it needs ornament and blackletter assets the library does not have. |
| surreal, surrealism | **Not in the library.** Nearest: Show mode, Free, with `moonlit-ridge-hero` as the scene base. Tell them. | Skipped on purpose: it is art direction, not a UI system. |
| Ventogrid, vectorgrid | **Unknown.** Not a style this skill knows. Say so, and ask what they mean. | Nothing is routed until the word is defined. |

If the style they named is not a row here, or the row says not in the library, say so in the pick line ("X is not in the library; the nearest is Y, because ...") before you build. Never substitute silently.

### Minimal editorial

A document that reads like a good workspace tool. Warm white, near-black ink, one muted accent.

- Themes: `paper-ink`, `glacier`, `marble-hall`, `linen-shop`. Pairings: `literary`, `ai-editorial`, `the-lounge`, `lettera`. Family: `quiet` or `editorial`.
- A serif for the big headings, tight (letter-spacing about -0.03em, line-height 1.1). A plain sans for the rest. Mono only for keys and code.
- Body ink is never pure black. Body line-height 1.6.
- Cards are a 1px hairline with 8 to 12px corners and no shadow. Big containers and main buttons are not pills. Tags may be pills.
- Colour is rare. Tints of `--secondary` or `--tertiary` go on tags and small icon tiles only. No colour hero band, no gradients, no neon, no glass beyond the nav.
- FAQ rows have no boxes, only a bottom hairline and a plain + and −.
- Keys are `<kbd>` with a hairline and the mono face. A drawn app window gets a white top bar with three small grey dots.
- Motion is almost invisible: fade up 12px over 600ms with `--ease-expo-out`, list items 80ms apart.
- Pieces: `accordion-grid-rows`, `bento-feature-grid`, `faq-category-accordion`, `background-paper-grain`.

### Industrial brutalist

A blueprint or a declassified file. Pick one of the two modes and never mix them.

- Swiss print, light: themes `press-room`, `cinder`, `archive`, `oxide`. Pairings `brutal-grotesk`, `swiss-precision`, `poster-condensed`, `industrial-label`. One red accent, nothing else.
- Telemetry, dark: themes `signal-green`, `hud-teal`, `circuit`. Pairings `terminal-native`, `signal-mono`, `hud`. A green may mark one status readout only, never body text.
- Family `sharp` (0px) or `industrial` (2px). No soft shadows, no gradients, no glass.
- Huge uppercase headings with `clamp()`, tracking -0.03 to -0.06em, line-height 0.85 to 0.95. Small uppercase mono for meta, tracking 0.05 to 0.1em.
- Visible grid. Lines between zones: `display: grid; gap: 1px` on a parent whose background is the line colour.
- Pages swing between dense clusters of mono data and large empty space around one heading.
- Marks allowed: `[ SECTION ]` brackets, `>>>`, crosshairs at grid crossings, barcodes, a warning stripe, `REV 2.6`. These count toward the three small labels.
- Texture: halftone or dither on images, scanlines on the dark mode only, one fixed noise layer.
- Use real tags for data: `<data>`, `<samp>`, `<kbd>`, `<output>`, `<dl>`.
- Pieces: `hero-swiss-grid-wordmark`, `swiss-poster-style`, `swiss-grid-pricing`, `terminal-ui-style`, `card-terminal-log`, `background-halftone-pop`.

### High-end agency

What people mean by "make it look expensive". Choose one texture.

- Dark glass, for tech and AI: themes `observatory`, `atelier-noir`, `night-desk`. Family `glass`. Blur only on the nav and overlays.
- Editorial luxury, for lifestyle, property, and studios: themes `marble-hall`, `kiln`, `linen-shop`, `courtroom`. Pairings `maison`, `atelier`, `magazine-contrast`. One fixed grain layer at 3% opacity.
- Soft structure, for consumer, health, and portfolios: themes `glacier`, `fog-city`, `greenhouse`. Family `soft`. Very wide, very soft shadows.
- Section padding is generous: 96 to 160px on web.
- Use the Craft details below. They are what makes it read as expensive.
- Pieces: `navbar-island-morph`, `hamburger-circle-reveal`, `magnetic-buttons`, `lens-bento`, `hero-product-window-tilt`.

## Page shape

For any website, check the plan against these.

- The order is: a nav, then a hero that catches the eye, then proof that holds interest (a bento or a working piece), then one moving section that builds desire (pinned, horizontal, or a word reveal), then a clear action and the footer. Five beats. The Sections lists in practice.md fill them.
- The hero headline is two or three lines at 1280px. Never four or more. If it wraps more, widen its box (up to 1100px) and step the size down before you shorten the words. Check the line count on the screenshot.
- The hero holds the headline, one sentence, at most two buttons, and the picture. No stats, no row of pill tags, no badge stuck on the text.
- A bento has 3 to 5 cards. It uses `grid-auto-flow: dense`. Add up the spans per row before you write it: every row fills, no empty corner. Below 768px it is one column.
- No section number labels: "SECTION 01", "QUESTION 05", "ABOUT US" over a heading that already says it.
- Button text always passes contrast against its own fill.
- `overflow-x: clip` on the page wrapper, so an off-screen animation never makes a sideways scroll.
- Full-height sections use `min-height: 100dvh`, never `100vh`.
- Asymmetric layouts drop to one column below 768px. Remove tilts and overlaps there, since they break taps.
- A photo you did not make gets one treatment across the page, for example grayscale with `mix-blend-mode: luminosity`, so it stops looking like stock.
- A small image inside a big headline, a pill-shaped photo between two words, is allowed once per page as the lead idea.

## Craft

These details separate a finished page from a template. Each one uses the locked family's radius and the motion tokens.

- Double bezel. A key card or image sits in a shell: an outer box with a faint fill, a 1px hairline, 6 to 8px padding, and a large radius. The inner box has its own fill, a 1px inner top highlight, and a radius equal to the outer radius minus the padding, so the curves stay parallel. Use it on two or three hero-level things, not every card. The `sharp` and `industrial` families skip it.
- Button with an icon. A trailing arrow sits in its own small circle at the button's right edge, not loose beside the text. On hover the circle moves 2px up and right and grows a little. On press the whole button scales to 0.98.
- Island nav. The nav floats as a pill detached from the top edge, as in `navbar-island-morph`. The menu icon's lines turn into an X, never just vanish. The open menu fills the screen, and its links rise in one by one, 50ms apart. Focus rules are in components.md.
- Entry. Blocks fade up as they enter, 16 to 24px over 600 to 800ms, with `--ease-expo-out`. Lists stagger. Use `IntersectionObserver`, never a scroll listener.
- Easing. Never `linear` or the plain `ease-in-out` for a UI move. Use the motion tokens.
- Speed. Animate only `transform` and `opacity`. `will-change` only while moving. Blur only on fixed or sticky layers. Grain and noise go on one fixed `pointer-events: none` layer, never on a scrolling box.
- Layers. z-index has four levels only: sticky nav, overlay, modal, tooltip. No `z-index: 9999`.

## Image first

From image-to-code, imagegen-frontend-web, and imagegen-frontend-mobile. Use this when you have an image tool (GenerateImage, an image model, or similar), the job is mainly visual, and nothing in the project already sets the look. Without an image tool, skip this section and say so in Still open.

The images are a picture of the locked kit, not a new design. Lock the theme, pairing, family, and pieces first.

1. Write one prompt base from the lock: the theme's hex values by role, the pairing's font names and weights, the family radius, the Look if any, and the Idea line. Every image uses it, so screen four does not drift into another product.
2. One image per section. A landing page with six sections gets six wide images, 16:9 or 16:10, with text large enough to read. Never one board with every section shrunk.
3. A phone app gets one image per screen, in flow order (onboarding, then sign in, then home; or home, then list, then detail). Each screen keeps the same nav, type scale, radius, and icon style. Say iOS or Android in the prompt and respect the status bar and home indicator areas.
4. If a section is unclear, generate it again on its own with bigger text. Never crop a section out of an older image.
5. Read each image like a spec before you code: the text, the line count of headings, the type sizes relative to each other, the spacing, button shapes, the grid, the image treatment. Write what is still unclear and generate a closer image for it.
6. Build from what you read. Where an image breaks the lock (a colour not in the theme, a font not in the pairing), the lock wins. Where it breaks a rule in practice.md (a fourth small label, a six-line headline, invented stats), the rule wins.
7. Put the image files in `design/` and list them in DESIGN.md under Sources.

Image prompts ban: purple-blue gradients, floating glass widgets, blob backgrounds, rows of stat cards, avatar rows, many pills and badges, "Acme" or "NovaCore" brand names, and filler lines like "elevate your workflow".

## Brand board

From brandkit. Use this when they ask for a brand kit, identity, logo system, or brand guidelines.

Before any mark, answer five things in DESIGN.md, one line each: what the brand stands for, the core metaphor, how the logo shows it, how the system stretches across screen, print, and objects, and why nobody else could own it.

Make the logo with one of these methods, or two at most:

- An initial plus a meaning: the letter cut, folded, or built from the metaphor.
- The product's main action as a shape: build is a frame, protect is a boundary, speak is a wave.
- Two ideas fused into one reduced mark.
- Negative space: a hidden arrow, a protected centre, a cut-out initial.
- Construction: circles, diagonal cuts, a grid. Show the construction on the board.

No stock lightning bolts, random animals, fake crests, clipart, or sparkles. Draw the mark as an SVG that reads at 16px. The favicon rules in components.md apply.

The board is a 3 by 3 grid with even gutters and little text:

1. Logo and wordmark, lots of space.
2. The logo's construction.
3. On a screen: a browser bar, an app icon, or a header.
4. One short line about the brand, set large.
5. The colours: the locked theme's roles as swatches.
6. The type: the locked pairing as a specimen.
7. On an object: a card, a label, a badge, packaging.
8. Image direction: one photo or texture in the brand's treatment.
9. A detail: buttons, inputs, an icon row from the locked family.

Not every panel is loud. Quiet, working, emotional, technical, atmosphere, detail.

With an image tool, generate the board as one 16:10 image, then build the SVG logo and the tokens for real. Without one, build the board as a single HTML page in the locked kit and screenshot it.

## Games and Three.js

A game site is a game. A landing page with a Play button that does nothing is a fail.

Use the `game` recipe. Coin-op is the dark cabinet. Ticket booth is the daylight arcade. Cockpit run is a mission HUD. Orbit is the 3D scene.

- Title, attract mode, credits: `game-title-screen`. The pixel kit is `pixel-arcade-style`.
- A game you can finish: `game-playfield` for an action game, `game-card-table` for a board or cards. Keyboard and pointer both work. Pause and a game-over state are part of it.
- Chrome over a running game: `game-hud`. Score, lives, and pause. Not a second game.
- Friends: `game-lobby`. A room code, ready states, then the table. Script the other players. Do not leave a spinner that never resolves.
- Scores: `game-leaderboard`. The player's own row is marked. Ranks are computed, not typed in as a picture.
- Motion snaps. Pixel work uses `steps()`, a 4px grid, and no blur. The Arcade pairing's caution still applies: that mono is for the game, not for a long article.

Three.js is for a scene: a camera, lights, and meshes. It is not for a gradient.

- One full-screen shader, no objects: `webgl-shader-hero`. Raw WebGL. Do not add Three.js.
- A product you spin, built from flat faces: `object-3d-turntable`. CSS 3D. Do not add Three.js.
- An object you orbit in a lit scene: `three-orbit-object`.
- A world the page scrolls through: `three-scroll-world`.
- A room you look around: `three-room-look`.

The Lounge demo of a `three-` piece is raw WebGL, one file, no library. The brief's Three.js section is how you build it in the product: scene, camera, renderer, lights, meshes, and the control. Use that. Do not paste a CDN script into the demo, and do not rewrite the scene as a stack of CSS divs.

## Handwritten

Two different jobs. Do not mix them.

- The whole site is a letter: recipe `notebook`, pairing `letter-hand`, theme `inkwell` or `lamp-desk`. Pieces: `handwritten-homepage`, `handwritten-letter`, `handwritten-style`. Titles in Gochi Hand. Paragraphs in Patrick Hand. Lines stay short. No letter-spacing on a script. No all-caps script.
- A normal site with notes in the margin: pairing `handwritten-notes`. The notes are Caveat. Buttons, nav, and paragraphs stay in the sans. Pieces: `text-annotated-underlines`, `graph-paper-homepage`, `card-journal-page`, `card-sticky-notepad`.

A signature script for a paragraph is a fail. So is a handwritten dashboard.

## Left out on purpose

Some lines in those skills fight the library. They are not used here.

- Random picks by prompt length. The name number in practice.md does this and keeps one product consistent.
- A list of banned fonts. The pairing decides the fonts. Every pairing in the library is chosen already.
- "Every element animates" and "pin and scrub everything". Register in website.md decides one lead motion and when to add more.
- Tailwind class names as rules. The briefs are stack-agnostic. Translate the idea to the project's stack.
- "Never the same layout twice in a row". The same product should get the same site each time. Two products should not.

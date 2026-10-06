# The brief

Write this before you pick anything. It is the prompt you would give a strong designer if you were handing the job over.

People type short requests: "make a cool scrolling space website". A short request leaves every gap to defaults, and defaults are how a site ends up looking like everyone's. The same sentence, rewritten as a brief that names the product, the world, the one thing, the bar, and the limits, gives a much better site. That holds with the library and without it. So every new website or app starts here.

## When

- Every new website or app: Kit flow, Show mode, Free, Two looks, the app short path.
- Not for one component, a palette, or a change to a screen already built. If `DESIGN.md` already has a Brief, reuse it. Edit it only when they change what the product is.

## How

1. Copy their request word for word, in quotes. Never tidy it. It stays the first line of the brief.
2. Fill each field from their words, the open project, and anything they linked. Read the person, as rule 4 of Pick a direction in [practice.md](practice.md) says.
3. Never invent facts. No clients, prices, dates, quotes, or numbers they did not give. Write the missing ones under `Missing:`. The build then shows a study, an "Example" caption, or an empty slot for each, and the reply lists them.
4. A product with no name gets a working name only when the page needs one, written as `<name> (working name, replace)`.
5. Write it at the top of `DESIGN.md`, under `## Brief`. Then follow it as if someone else wrote it for you.
6. If you hand the build to a subagent, send the whole brief and the path to this skill. Do not summarise it. For two looks, send two briefs with the same request. The second says which look it must not match.
7. Their words beat the brief. When they correct something, fix the brief first, then the build.

## The template

```
## Brief

Request, word for word:
"<their sentence>"

Product: <name>, <what it is, in one line>. <Every fact they gave: place, hours, prices, people, links.>
For: <who opens it, and what they want in the first ten seconds>
World: <three words: its materials, tools, place, or hour>
The one thing: <the centrepiece their words imply, as something you can see, touch, or travel through>
Ambition: <everyday | finished | spectacle>, because "<their words that say so>"
Mode: <Kit | Show, Free | Show, locked>
Stack: <theirs, or plain index.html + styles.css + main.js that works when opened directly>
Missing: <facts the page needs that they did not give, or none>

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL. Where only a real photo will do, leave a sized slot with one caption.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: <the sections or screens>, opened in a browser at both sizes, fixed, and the closing block written.
```

## Reading the request

| Their words | What goes in the brief |
| --- | --- |
| "cool", "nice", "modern", "clean", "simple" | Ambition `finished`. These words never pick the look or the mode. |
| "go wild", "unforgettable", "Awwwards", "an experience", "let people play with it" | Ambition `spectacle`. Mode `Show, Free`. |
| A world you could draw: space, the sea, a city at night, a mountain, an instrument, a machine | The World line, and a reason for Show mode when the job is a site, a show, a launch, or a label. |
| A verb about the page: "you scroll and you travel", "type on it", "watch it fold" | The one thing. Keep their verb. |
| A place, or an hour | The World line, and a live readout candidate (the local time, a countdown). |
| Facts: hours, prices, names, links | The Product line, word for word. |
| A theme, colour, brand, or "use the Lounge look" | Mode stays locked to what they named. Never Free. |
| "Just build it", "go" | Keep the line "Decide everything yourself. Do not ask." |

Mode `Free` is only for spectacle on a website (Show mode in [website.md](website.md)). A product, a tool, an app, or a dashboard is `Kit`, locked to the library.

## Example

Request: "make a cool scrolling space website"

```
## Brief

Request, word for word:
"make a cool scrolling space website"

Product: Outward (working name, replace), a page you scroll to travel from Earth to the edge of what we can see.
For: someone curious, on a laptop or a phone, who wants to feel the distance in ten seconds.
World: night sky, distance, old light
The one thing: the page is the voyage. Each scroll moves the camera further out, and a readout counts the distance and how old the light is.
Ambition: spectacle, because "scrolling space" is a world you travel through and "cool" asks for it to land.
Mode: Show, Free
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: who it is for (a planetarium, a school, a personal project), real facts beyond public astronomy. Chapters use public figures only, and the footer has no invented organisation.

Hard limits:
- No stock photos or external images. Draw the visuals with HTML, CSS, SVG, canvas, or WebGL.
- No placeholder copy and no invented clients, numbers, or quotes.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect. Sound never autoplays and has an off control.

Decide everything yourself. Do not ask. Work in one pass and aim for your best possible work: a page someone still remembers after five seconds, that could not be anyone else's.

Done means: the voyage hero with five or six chapters, one still section on what you passed, and the footer, opened in a browser at both sizes, fixed, and the closing block written.
```

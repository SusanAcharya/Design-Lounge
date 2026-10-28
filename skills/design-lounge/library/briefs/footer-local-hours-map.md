<!-- Design Lounge Nº 564 · "Local hours and map footer" · www.designlounge.live -->

# Local hours and map footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The footer of a small local business site, here Pell & Rye, an invented bakehouse on Lark Street in Fitzroy. It answers the three questions people scroll to the bottom for: are you open right now, where are you, how do I call. The status pill and today's row are computed live in the bakery's own time zone (`Australia/Melbourne`), not the visitor's, so someone in Perth is not told the shop is open when it is not. The map is drawn in SVG in the brand's colours (flour ground, crust blocks, sage park, a tomato pin and a dotted walk from the tram stop), not a grey embed. Above it sits the end of the page: a dark crust band with an italic 64px Caslon line, "Sourdough is gone by eleven."

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ .end (bg --crust, padding 44 56 38)                                  │
│  Sourdough is gone by eleven.  (italic 64px)       Pre-order by 8 pm…│
├──────────────────────────────────────────────────────────────────────┤ y≈146
│ footer: grid 330px | 1fr | 250px, gap 40, padding 44 56 26           │
│  Pell & Rye (46px)      ┌──────── SVG map 560×470 ─────────┐  FIND US │
│  Bakehouse on Lark…     │ GERTRUDE ST          park  ⑰      │  42 Lark │
│  (● Closed, opens …)    │       [Pell & Rye]   ╲ BRUNSWICK  │  [Copy][Directions]│
│  It is 1:57 am …        │ LARK ST ──📍········⑰             │  ─────── │
│  Monday      Closed     │ KING ST     NAPIER LN             │  CALL    │
│  Tuesday  7 am to 3 pm  │                      100 m   ↑    │  (03)…   │
│ ▌Thursday TODAY  7–3    │ [2 min walk from tram stop 17]    │  ─────── │
│  …                      └──────────────────────────────────┘  WHOLESALE│
│  ▭▬▬▬▬▬▬▬▬▭  6 am · noon · 6 pm                                       │
│ ──────────────────────────────────────────────────────────────────── │
│ © 2026 Pell & Rye Bakehouse Pty Ltd · ABN · Allergen guide · Jobs · Privacy│
└──────────────────────────────────────────────────────────────────────┘
```

- `<section class="end" aria-label="Pre-orders">`: `<h2>` and a `<p>` with one link.
- `<footer>` grid of three columns plus a full-width `.legal` row.
  - Column 1: name `<p>` (the ampersand is an italic tomato `<i>`), established line, `.now` pill with `role="status" aria-live="polite"`, the clock line, `<table class="hours" aria-label="Opening hours">` with `<th scope="row">` day and `<td>` hours, then the decorative `.day` track (`aria-hidden`).
  - Column 2: `<figure class="map">` containing an inline `<svg viewBox="0 0 560 470" role="img" aria-labelledby>` with a `<title>` that describes the location in words, plus a `<figcaption>` chip "2 min walk from tram stop 17".
  - Column 3: three `.blk` groups (Find us, Call the counter, Wholesale), each an `<h3>` label with content; Find us holds `<address>`, the Copy `<button>`, the Directions `<a>` and a polite live `<p>` for the copy message.

## Motion

| Element      | Trigger          | Property            | From → To                   | Duration | Easing       | Notes |
|--------------|------------------|---------------------|-----------------------------|---------:|--------------|-------|
| Map pin      | load             | transform, opacity  | translateY(−26px), 0 → none, 1 | 700ms | `--ease-out` | 200ms delay; `transform-origin: 50% 100%` |
| Now tick     | 30s update       | left                | old minute → new minute     | 320ms    | `--ease`     | |
| Buttons      | hover            | background, border  | transparent → `--card`      | 160ms    | `--ease`     | primary darkens to `#9E2A19` |
| Status pill  | open/close flip  | none                | text and dot swap           | 0        | —            | announced by the live region |

Reduced motion: the pin is drawn in place and transitions are 1ms. The live status still updates.

## States

- **Open:** dot `--open` with `0 0 0 4px rgba(47,107,58,.18)` halo; lead word "Open now".
- **Closing soon (≤ 30 min):** same green dot, lead "Closing soon".
- **Closed:** dot `--tomato`, no halo; lead "Closed", then the next opening.
- **Closed day:** that row's hours read "Closed" in `--ink-2`; the day track hides its window.
- **Today row:** `--card` fill, weight 700, `inset 3px 0 0 var(--tomato)` on the day cell, "TODAY" tag.
- **Copy:** idle "Copy address"; success message in `--open`, 12px/700, for 2400ms; failure message asks the user to select the text.
- **Hover:** outline buttons fill `--card` and darken their border to `--ink`; Directions darkens; phone and links turn tomato or underline.
- **Focus-visible:** 2px `--tomato` outline, 3px offset; in the dark band the outline is `--cream`.

## Accessibility

- The status pill is `role="status"` with `aria-live="polite"`, so a flip from open to closed is announced once, not every 30 seconds (the text only changes when the state changes).
- The hours are a real `<table>` with row headers; today's row has `aria-current="date"`. The "TODAY" tag is CSS generated content, so the row also reads naturally.
- The map is `role="img"` with a `<title>` that says in words where the shop is and how to walk there. The visible chip repeats the walking time.
- The day track is decorative (`aria-hidden="true"`); the same facts are in the table and the pill.
- Address uses `<address>`; the Copy button is `aria-describedby` the address; the copy result is a polite live region.
- Phone is a `tel:` link. Buttons are 40px tall.
- Contrast: `--ink` on `--flour` 14.6:1, `--ink-2` 6.6:1, `--tomato-ink` on `--tomato` 5.8:1, map labels 6.2:1 on `--flour-2`, `--cream-2` on `--crust` 10.1:1. The outline button border `--line-2` is 3.2:1 against `--flour`.

## Responsive rules

- ≥ 1280: three columns as specified.
- 1100 down to 721: two columns (hours, map); the contact column moves below as a three-across row; the map keeps a 340px minimum height.
- ≤ 720: one column in the order name and hours, map, contact; padding 20px; name 40px; the map keeps a 560:470 aspect ratio and the whole drawing stays visible. The band stacks its line above the paragraph. Nothing scrolls sideways at 390.
- At ≤ 720 hide the rotated street names and the "Pell & Rye" map chip (they shrink below 64px wide) and drop "2 min walk" onto its own line in the caption; the pin, horizontal street names and caption carry the location.
- Never crop the map with `slice`: street names sit near the edges. Extend the drawing instead when the frame changes shape.

## Acceptance checklist

**Always**

- [ ] Open or closed is computed in the business's time zone with `Intl.DateTimeFormat`, not the visitor's clock.
- [ ] Today's row is highlighted and carries `aria-current="date"`.
- [ ] The pill handles open, closing soon, opens later today and opens on a later day, by name.
- [ ] Status recomputes every 30 seconds and lives in a polite live region.
- [ ] The map is inline SVG in the brand's palette with a text alternative, never a grey box or an embed.
- [ ] Copy address confirms success and has a fallback message when the clipboard is blocked.
- [ ] One filled primary (Directions); every other control is outlined.
- [ ] No sideways scroll at 390px and the map is never cropped.

**This demo**

- [ ] Hours: Monday closed; Tuesday to Friday 7 am to 3 pm; Saturday 7:30 am to 2 pm; Sunday 8 am to 1 pm.
- [ ] Time zone `Australia/Melbourne`; the clock line names Fitzroy.
- [ ] The pin is `#B8321F` with a "Pell & Rye" label chip and a dotted walk to tram stop 17.
- [ ] Band line "Sourdough is gone by eleven." in italic Caslon at up to 64px on `#2B1A10`.
- [ ] Phone "(03) 9417 0286" in 26px Caslon.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. On load, the script reads the current weekday and minute in `Australia/Melbourne` with `Intl.DateTimeFormat` and builds the seven-row hours table Monday to Sunday.
2. Today's row gets a card background, bold text, a 3px tomato bar on its left and a small "TODAY" tag; it also gets `aria-current="date"`.
3. The status pill reads one of four messages:
   - open, more than 30 minutes left: "**Open now** until 3 pm", green dot with a 4px halo;
   - open, 30 minutes or less left: "**Closing soon**, last loaves at 3 pm";
   - closed, opens later today: "**Closed**, opens today at 7 am", tomato dot;
   - closed for the day: "**Closed**, opens tomorrow at 7 am", or the next open weekday by name ("opens Tuesday at 7 am" on a Sunday afternoon).
4. Under the pill, a line reads "It is 1:57 am in Fitzroy, Thursday", in the shop's time.
5. A 6 am to 6 pm day track under the table shows today's open window as a dark bar and "now" as a 2px tomato tick. The tick hides outside 6 am to 6 pm; the window hides on a closed day.
6. Everything recomputes every 30 seconds, so the pill flips at opening and closing time without a reload.
7. The map pin drops 26px into place over 700ms after a 200ms delay.
8. "Copy address" writes "42 Lark Street, Fitzroy VIC 3065" to the clipboard and shows "Copied: 42 Lark Street, Fitzroy VIC 3065" in green below for 2400ms. If the clipboard is refused, it says "Select the address above to copy it".
9. The phone number is a `tel:` link in 26px Caslon that turns tomato on hover. "Directions" is the one filled tomato button.

## Tokens

```css
:root {
  /* page end band */
  --crust: #2B1A10;       /* band background, also body ink */
  --crust-2: #4A3020;
  --cream: #F6EBDB;       /* band text, 14.9:1 */
  --cream-2: #D9C3A5;     /* band secondary, 10.1:1 */

  /* footer */
  --flour: #F4E9D8;       /* footer background */
  --flour-2: #EADBC4;     /* map ground, day track */
  --card: #FBF4E9;        /* pill, today row, chips */
  --ink: #2B1A10;         /* text, 14.6:1 on --flour */
  --ink-2: #674B36;       /* secondary text, 6.6:1 */
  --line: #D8C2A3;        /* hairlines */
  --line-2: #9E7F62;      /* outline button border, 3.2:1 */
  --tomato: #B8321F;      /* the one accent: pin, today bar, Directions, now tick */
  --tomato-ink: #FFF7EE;  /* text on tomato, 5.8:1 */
  --open: #2F6B3A;        /* open dot, copied message */

  /* map */
  --block: #E1CBA9;       /* city blocks */
  --street: #FBF5EC;      /* street strokes */
  --park: #C9CDA2;        /* park polygon */
  --map-label: #5E4331;   /* street names, 6.2:1 on --flour-2 */

  /* type */
  --serif: "Libre Caslon Text", Georgia, serif;
  --font: "Karla", system-ui, sans-serif;
  --fs-band: clamp(34px, 5vw, 64px);
  --fs-name: 46px;
  --fs-tel: 26px;
  --fs-body: 15px;
  --fs-table: 14px;
  --fs-meta: 12px;
  --fs-label: 11px;

  /* shape */
  --r: 14px;              /* map */
  --pill-h: 40px;
  --row-h: 34px;          /* hours rows */

  /* motion */
  --t-fast: 160ms;
  --t-mid: 320ms;
  --t-drop: 700ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role              | Family            | Size                     | Weight | Line-height | Tracking | Case      |
|-------------------|-------------------|--------------------------|-------:|------------:|---------:|-----------|
| Band line         | Libre Caslon Text | clamp(34px, 5vw, 64px)   | 400 italic | 1       | −0.02em  | sentence  |
| Business name     | Libre Caslon Text | 46px                     | 700    | 1           | −0.03em  | Title     |
| Phone number      | Libre Caslon Text | 26px                     | 400    | 1.1         | 0        | numerals  |
| Body, address     | Karla             | 15–16px                  | 400    | 1.45        | 0        | sentence  |
| Hours table       | Karla             | 14px, tabular numerals   | 400/700| 34px rows   | 0        | sentence  |
| Status pill       | Karla             | 14px                     | 400 + 700 lead | 1   | 0        | sentence  |
| Section labels    | Karla             | 11px                     | 700    | 1           | +0.14em  | UPPERCASE |
| Today tag         | Karla             | 10px                     | 700    | 1           | +0.1em   | UPPERCASE |
| Map street names  | Karla (SVG)       | 11px                     | 700    | —           | 1.4px    | UPPERCASE |

## Implementation notes

**Read the shop's clock, not the browser's.** `formatToParts` gives weekday and minutes in any zone without a date library:

```js
const F = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Melbourne',
  weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' });
const DAYS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
function local() {
  const p = Object.fromEntries(F.formatToParts(new Date()).map(x => [x.type, x.value]));
  return { day: DAYS[p.weekday], min: (+p.hour % 24) * 60 + +p.minute };
}
```

**Find the next opening by walking forward.** Store hours as minutes from midnight, `null` for closed:

```js
const H = [null, [420, 900], [420, 900], [420, 900], [420, 900], [450, 840], [480, 780]];
const r = H[t.day], open = r && t.min >= r[0] && t.min < r[1];
if (!open) {
  let k = 0, nd = t.day;
  if (!(r && t.min < r[0])) { for (k = 1; k < 8; k++) { nd = (t.day + k) % 7; if (H[nd]) break; } }
  label = `Closed, opens ${k === 0 ? 'today' : k === 1 ? 'tomorrow' : NAMES[nd]} at ${fmt(H[nd][0])}`;
}
```

**Draw the map like a print, not a tile.** Blocks are rounded rects (`rx 6`) in `--block`; streets are fat round-capped strokes in `--street` (12–16px for main roads, 7px for lanes); the tram line is a 2px dotted ink line on top of its street; the walk is a 3px tomato `1 7` dash. Keep labels uppercase 11px with 1.4px tracking, rotated along vertical streets.

Common mistakes: using `new Date().getDay()` (wrong for visitors in another zone, and Sunday is 0, not 6); announcing the status every 30 seconds by rewriting it even when nothing changed; embedding a third-party map, which loads a megabyte and ignores the brand; forgetting the closed-day case so the pill says "opens today" on a Monday.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*

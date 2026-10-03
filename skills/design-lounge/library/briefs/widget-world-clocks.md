<!-- Design Lounge Nº 438 · "World clocks meeting planner" · designlounge.vercel.app -->

# World clocks meeting planner

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A meeting-planner widget for distributed teams. Each city is one row: name, UTC offset, big local time, weekday and a status word (Working, Morning, Evening, Asleep), then a 24-cell band that shades that city's hours as night, edge or day, with working hours underlined in cobalt. All bands share one absolute timeline, so a single vertical cursor crosses every row at the same instant. Drag on any band, or move the slider under them, and every clock scrubs together in 15-minute steps. It lives in a calendar's "find a time" panel. The look is Swiss utility: warm paper, black rules, one cobalt accent, a grotesk for words and a monospace for every number.

## Reference behaviour

1. On load the planner is live: the cursor sits at the current moment, times tick each second, the header reads the current UTC time and "Live, now", and "Back to now" is disabled.
2. The timeline spans 24 hours, starting 6 hours before the current hour (floored). A dashed line marks the real "now"; it stays put while you scrub.
3. Each band has 24 cells. Each cell shows that city's local hour for that slot. The cell whose local hour is 0 shows the weekday ("Sun") in bold instead of 0.
4. Cell shading by local hour: 22:00–05:59 night (dark), 06:00–07:59 and 19:00–21:59 edge (grey), otherwise day (paper). 09:00–17:59 cells also get a 3px cobalt underline.
5. Pressing on any band moves the cursor to that x, snapped to 15 minutes; dragging keeps scrubbing (pointer capture). The cursor follows the pointer with no easing while dragging.
6. The range slider below has 97 positions (0–96, 15-minute steps) aligned to the band column. Arrow keys move 15 minutes; Page Up / Page Down move about 10% of the range (native browser behaviour, roughly 2.5 hours); Home / End jump to the ends.
7. While scrubbed, every row shows the time at the cursor, the header shows the cursor time in UTC and an offset ("+3 h 15 min from now"), and "Back to now" is enabled.
8. Rows whose city is in working hours at the cursor get a cobalt-tinted left gradient and the status word turns cobalt.
9. If a city's date differs from the viewer's own date, a bordered "+1 day" or "−1 day" tag appears after the status word.
10. The footer summary reads "2 of 6 in working hours: San Francisco, New York." It switches to "Everyone is in working hours." or "No one is in working hours. Try another slot." at the extremes.
11. "Back to now" returns to live mode and moves focus to the slider.

## Structure

```
1280 × 800, card width min(1100px, 100% − 48px), centred
┌─────────────────────────────────────────────────────────────────┐
│ ■ Tandem                                          18:11 UTC     │ head 28/32 pad
│ Find a time (44px)                      Live, now [BACK TO NOW] │
├━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┤ 1px ink rule
│ San Francisco   11:11        │5│6│7│8│9│10│…▼…│22│23│Sun│1│…   │ row 12/32 pad
│ UTC−7           Sat 3 Oct ·  │    band 40px tall, 24 cells      │
├─────────────────────────────────────────────────────────────────┤ 1px rule
│ … five more rows …                       │ shared cursor 2px    │
├─────────────────────────────────────────────────────────────────┤
│ DRAG TO SCRUB · 15 MIN STEPS   [──────■──────────────────]      │ slider under band
├━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┤
│ 2 of 6 in working hours: …            ▭ WORK 9–18 ▭ EDGE ▭ NIGHT│
└─────────────────────────────────────────────────────────────────┘
columns: 208px | 168px | 1fr, gap 24px
```

- The card is a `section` labelled by the `h1`.
- Rows are an `ul` of `li.row`, each a 3-column grid. The band is `aria-hidden` (the text columns carry the information).
- The cursor and now line live in one absolutely positioned overlay inside the list, sized to the first band's rect.
- The scrub row reuses the same grid columns so the slider sits exactly under the bands.
- The summary is a `p` whose first span is `aria-live="polite"`.

## Tokens

```css
:root {
  --paper: #ecebe5;      /* page */
  --card: #f7f6f1;       /* planner surface, also day cells */
  --ink: #141414;        /* text, heavy rules */
  --ink-2: #5f5e58;      /* meta text */
  --rule: #cfcdc4;       /* row rules */
  --night: #1b1c21;      /* night cells */
  --night-ink: #9c9b94;  /* hour numbers on night */
  --shoulder: #c9c7bd;   /* edge hours */
  --day: #f7f6f1;
  --accent: #2441d6;     /* cobalt: cursor, working underline, thumb */
  --accent-soft: #dfe3fa;/* working-row tint */
  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;
  --ease: cubic-bezier(.2,.7,.2,1);
  --cols: 208px 168px 1fr;
}
```

Spacing: 4, 8, 12, 16, 20, 24, 28, 32. Radii: 0 everywhere. This is a square piece; do not round the cells, the button or the slider thumb.

## Typography

| Role | Family | Size / line | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Title | Familjen Grotesk | 44px / 1 | 700 | −0.035em | Sentence |
| Wordmark | Familjen Grotesk | 15px | 700 | −0.01em | Title |
| City | Familjen Grotesk | 21px / 1.1 | 500 | −0.02em | Title |
| Day line, summary | Familjen Grotesk | 12.5px / 14px | 400 | 0 | Sentence |
| Local time | Martian Mono | 30px / 1 | 500 | −0.05em | tabular |
| Header time | Martian Mono | 28px / 1 | 500 | −0.04em | — |
| Offset, labels | Martian Mono | 10.5–11px | 400–500 | 0.04–0.06em | Upper |
| Cell hour | Martian Mono | 9px | 400 (500 for weekday) | 0 | — |

Every digit on screen is Martian Mono so columns of times align.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Cursor | slider / tick | left | old → new % | 120ms | --ease | instant |
| Cursor | dragging | left | follows pointer | 0 | — | same |
| Working row | cursor change | background | none ↔ tint | 200ms | --ease | instant |
| Reset button | hover | background, color | card/ink → ink/card | 160ms | --ease | instant |
| Slider thumb | :active | scale | 1 → 1.15 | 160ms | --ease | none |

Nothing loops. The only continuous change is the live time text once per second.

## States

- Live: cursor at now, header "Live, now", reset button `aria-disabled="true"` at 35% opacity and not clickable.
- Scrubbed: header shows offset text; reset enabled with 1px ink border; hover fills ink with card text.
- Working row: left-to-right `--accent-soft` gradient over the first 40%; status word in `--accent`.
- Day difference: bordered mono tag "+1 day" / "−1 day", 9.5px, 1px currentColor border.
- Focus-visible: 2px `--accent` outline, offset 2px (slider uses offset −2px to stay inside its row).
- Empty: not applicable; the list always has its six cities.

## Accessibility

- The slider is a native `input type="range"` labelled "Drag to scrub · 15 min steps". Its `aria-valuetext` is "21:15 UTC, 2 of 6 cities working", so screen readers hear meaning, not 37.
- Bands are `aria-hidden`; each row's visible text (city, offset, time, weekday, status) is the accessible content.
- The summary span is `aria-live="polite"` and only rewritten when its text changes, so ticking seconds don't spam.
- "Back to now" uses `aria-disabled` rather than `disabled` so it stays discoverable; activating it moves focus to the slider.
- Pointer scrubbing on bands is an enhancement; keyboard users get the same result from the slider.
- Contrast: ink on card ≈ 17:1; `--ink-2` on card ≈ 6.3:1; `--night-ink` on `--night` ≈ 6.5:1.

## Responsive rules

- ≥1280 and 1024: as drawn; card max 1100px.
- 768: card shrinks; the band column absorbs the loss. At 760px and below switch to the stacked layout.
- <760: grid becomes `1fr auto`: city block left, time block right-aligned, band full width on its own line (32px tall). Hour numbers hide; only weekday labels remain at 8px. The shared overlay hides and each band draws its own 2px cursor from a `--x` custom property. Header stacks; summary stacks above the legend.
- 375: verified with no horizontal scroll; the page scrolls vertically.

## Acceptance checklist

### Always

- [ ] All bands share one absolute 24-hour timeline; one cursor position means the same instant in every row.
- [ ] Cell shading uses the city's local hour: night, edge, day, plus a working-hours underline.
- [ ] Scrubbing snaps to 15 minutes from both pointer drag and keyboard.
- [ ] Drag works anywhere on any band with pointer capture; no text selection while dragging.
- [ ] Times come from `Intl.DateTimeFormat` with IANA zones, so half-hour and 45-minute offsets are right.
- [ ] The weekday replaces 0 in the band where a city crosses midnight.
- [ ] Day-difference tags compare to the viewer's own date.
- [ ] Slider has meaningful `aria-valuetext`; summary is a polite live region.
- [ ] No rounded corners anywhere.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Wordmark "Tandem", title "Find a time".
- [ ] Cities in order: San Francisco, New York, Lisbon, Berlin, Kathmandu, Tokyo.
- [ ] Working hours 09:00–18:00 underlined in `#2441d6`.
- [ ] Timeline starts 6 hours before the current hour.

## Implementation notes

**Zone parts in one call.** One cached formatter per zone returns everything a row needs:

```js
const fmts = {};
function parts(tz, t) {
  const f = fmts[tz] ||= new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'short', day: 'numeric',
    weekday: 'short', hour: '2-digit', minute: '2-digit', timeZoneName: 'shortOffset' });
  const o = {}; for (const p of f.formatToParts(t)) o[p.type] = p.value;
  return { h: +o.hour, m: +o.minute, wd: o.weekday, day: +o.day, mon: o.month,
           off: o.timeZoneName.replace('GMT', 'UTC') || 'UTC', key: o.year + o.month + o.day };
}
```

**Pointer to time.** Measure the first band, clamp, snap:

```js
function setFromX(x) {
  const r = firstBand.getBoundingClientRect();
  const f = Math.min(1, Math.max(0, (x - r.left) / r.width));
  offsetSteps = Math.round(f * 96);            // 96 × 15 min = 24 h
  render();
}
list.addEventListener('pointerdown', e => {
  if (!e.target.closest('.band')) return;
  e.preventDefault(); list.setPointerCapture(e.pointerId); setFromX(e.clientX);
  /* add pointermove → setFromX, remove on pointerup / pointercancel */
});
```

Set `touch-action: none` and `user-select: none` on bands or touch drags will scroll the page.

**Live versus scrubbed.** Keep `offsetSteps = null` for live mode. Each 1s tick calls `render()`; in live mode the cursor time is `Date.now()`, otherwise `start + offsetSteps × 15 min`. That way the planner stays live until the user touches it and stays put once they do.

**Slider ticks without extra DOM.** The webkit track draws 24 hour ticks with a repeating gradient sized `calc(100% / 24)`. Firefox gets a plain 2px track; that is acceptable.

Common mistakes:

- Giving each row its own "now-centred" timeline; then the cursor no longer means the same instant.
- Computing local hours as UTC + whole-hour offset; Kathmandu breaks.
- Colour-only working state. The status word and the summary say it in text too.
- A continuous slider; meetings snap to quarter hours.
- Easing the cursor during drag; it lags behind the finger.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*

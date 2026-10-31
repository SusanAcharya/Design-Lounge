---
title: "Export render with a settling ETA"
summary: "A video editor's export panel: an indeterminate Preparing bar that eases into real progress, a tabular frame counter, a smoothed ETA, inline cancel confirm, file size on finish."
platform: web
type: component
category: loaders
tags: [loading, progress, export, video, cancel]
styles: [minimal, paper]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-31
palette: ["#E7EAE3", "#FAFBF7", "#141A17", "#E2471B", "#17734F"]
fonts: ["Alexandria", "Encode Sans"]
related: [button-download-progress, upload-file-queue, file-upload-manager]
---

# Export render with a settling ETA

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The Deliver page of "Cutwater", an invented video and podcast editor, while it exports "saltmarsh-s3-trailer.mp4" (4 min 12 s, 7 560 frames). A 452px export panel docks on the right; the preview monitor and the timeline stay visible on the left, and a vermilion render head travels across the real timeline as frames are written. The piece is about the honest life of a long task: it starts not knowing how long it is ("Preparing", indeterminate), then hands over to a determinate bar without a jump, counts frames in tabular numerals, gives an ETA that settles instead of twitching, asks before throwing work away, and ends on what you actually need: the file size and "Show file". Worth copying: the segment-to-fill handover, the ETA damping rules, and the timeline veil that lifts behind the render head.

## Reference behaviour

1. Load: state label "PREPARING" with a vermilion dot; in place of the number a 40px Alexandria line "Measuring length"; the 10px bar shows an indeterminate segment (32% wide) sweeping left to right every 1500ms with ease-out. Meta row: "Frame count pending" left, "Estimating time left" right. Step line cycles "Reading 7 clips and 2 audio tracks" (0ms), "Conforming audio to 48 kHz" (700ms), "Counting frames" (1400ms).
2. The timeline is covered by a hatched veil (135deg stripes, `rgba(231,234,227,.78)` / `.6`, 6px bands) from the start; the render head is hidden.
3. At 2100ms the length is known. State becomes "RENDERING"; "0%" fades in (300ms); meta becomes "Frame 0 of 7 560". The bar does not jump: over 650ms (cubic ease-out) the segment's left edge slides to 0 and its right edge travels from wherever it was to the live progress, then it is just a fill.
4. While rendering: frames advance at about 560 fps with ±90 fps noise; between 38% and 52% (the graded interview) speed drops to 55% and the step line says "Encoding video · 308 fps · graded section". The big percentage (Encode Sans 112px, width 78%, weight 700, tabular) shows `floor(p·100)`; "Frame 1 213 of 7 560" uses thin-space thousands.
5. The render head (2px vermilion line with an 8px down-pointing cap) and a 3px vermilion band on the ruler sit at progress; the veil starts at the head, so rendered clips show in full colour and unrendered ones stay hatched. The monitor crossfades (500ms) to the scene of the clip under the head and its timecode chip reads "00:01:31:22 Harbour wall".
6. ETA: hidden as "Estimating time left" for the first 1200ms of rendering, then "About 12 s left", recomputed at most every 600ms from an exponentially smoothed rate (time constant 1.6s), rounded to 5s above 20s, to 1s below; it may only go up if the new value is at least 4s higher. At ≤ 3s it reads "Almost done".
7. "Cancel export" (outline button, bottom of panel) swaps the footer for an inline question: "Stop this export? The partial file will be deleted." with "Keep exporting" (ink, focused) and "Stop export" (vermilion outline). Rendering continues while the question is open. Escape or "Keep exporting" puts the cancel button back and refocuses it.
8. "Stop export": the dot goes grey (`#7d8780`), state "STOPPED", the number freezes at the last percent, the fill turns grey, "Stopped by you", "Partial file deleted.", and the footer offers "Nothing was saved. Your timeline is unchanged." with "Start export again".
9. Finish (about 17s): state "EXPORTED" with a green dot, the fill turns `#17734f` at 100%, the number becomes a drawn check (420ms) + "48.6 MB", meta "7 560 frames" and "Took 17 s", step "Checked: plays from start to end, audio in sync." Footer: "Show file" (ink, folder icon) and "Export again". Show file reveals "Movies / Cutwater Exports / saltmarsh-s3-trailer.mp4" in space already reserved.
10. "Export again" restarts from step 1.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────────────────┐
│ ≈ Cutwater   Saltmarsh Radio / Season 3 trailer      Edit Mix Colour Deliver  │ 52px bar
├──────────────────────────────────────────────────┬────────────────────────────┤
│ ┌──────────────────────────────────────────────┐ │ Export              20/600 │
│ │  monitor: gradient scene, flex 1              │ │ ┌ saltmarsh-s3-trailer.mp4┐│
│ │                                              │ │ └ 1920×1080 · H.264 …    ┘│
│ │ [00:01:31:22 Harbour wall]                   │ │ ● RENDERING                │
│ └──────────────────────────────────────────────┘ │ 36%          112px tnum    │
│ ┌ timeline (radius 10) ─────────────────────────┐ │ ▓▓▓▓▓▓░░░░░░░░░ 10px bar  │
│ │      00:00   01:00   02:00   03:00   04:00    │ │ Frame 2 752 of 7 560  ETA  │
│ │ V2   [Title]                         [Card]   │ │ Encoding video · 556 fps   │
│ │ V1   [Cold open][Harbour][Interview][Reeds]   │ │ Range / Video / Loudness / │
│ │ A1     [Dialogue waveform …………………]          │ │ Save to (4 rows)           │
│ │ A2   [Tidewater, score ………………………………]       │ │ ─────────────────────────  │
│ │          ▼ head  ░░░░ veil to the right       │ │ [× Cancel export]          │
│ └───────────────────────────────────────────────┘ │                            │
└──────────────────────────────────────────────────┴────────────────────────────┘
 editor column 1fr, padding 20, gap 16           panel 452px, padding 24 / 28
```

- `header.bar` with the wordmark, breadcrumb and a `nav` of workspaces (Deliver has `aria-current="page"`).
- `section.ed[aria-label=Timeline]`: monitor `div` (`aria-hidden`, decorative) with four `.scene` layers and a `.tc` chip; `.tl` with ruler, four `.row`s (64px `b` label + `.lane`), `.veil` and `.phead`.
- `aside.pan[aria-labelledby=h]`: `h1` "Export", `.file` card, `p.state`, `div.big` (`aria-hidden`), `div[role=progressbar]` holding `.fill`, `.meta`, `p.step`, `dl.spec`, `.act` footer, and a visually hidden `p[aria-live=polite]`.

## Tokens

```css
:root {
  /* colour */
  --ground: #e7eae3;      /* editor background */
  --panel: #fafbf7;       /* panel, bar, timeline card */
  --ink: #141a17;         /* text, primary button, chips */
  --ink-2: #4b5650;       /* secondary text, 7.0:1 on panel */
  --line: #d3d8cf;        /* hairlines */
  --edge: #7d8780;        /* outline button border 3.7:1, stopped state */
  --track: #dde1d8;       /* progress track */
  --track-edge: #c3c9bf;  /* 1px inset ring on the track */
  --signal: #e2471b;      /* progress, render head, dots */
  --signal-ink: #b0330f;  /* vermilion text and danger button, 5.6:1 */
  --ok: #17734f;          /* done fill, check, dot */
  --chip-text: #f3f5ef;   /* text on ink chips */

  /* type */
  --head: "Alexandria", system-ui, sans-serif;
  --num: "Encode Sans", system-ui, sans-serif;   /* variable wdth 75–125 */
  --fs-big: 112px; --fs-big-unit: 44px; --fs-prep: 40px;
  --fs-title: 20px; --fs-body: 14px; --fs-meta: 13.5px; --fs-small: 13px; --fs-label: 12px; --fs-ruler: 11px;

  /* layout */
  --bar-h: 52px; --panel-w: 452px; --pad-panel: 24px 28px; --pad-editor: 20px;
  --bar-thick: 10px; --label-col: 64px; --row-h: 36px; --clip-h: 28px;
  --r-card: 10px; --r-field: 8px; --r-btn: 8px; --r-bar: 5px; --r-clip: 5px;
  --space: 4px 8px 10px 12px 14px 16px 20px 24px 28px;

  /* behaviour */
  --prep-ms: 2100ms;  --sweep-ms: 1500ms;  --segment: .32;
  --handover-ms: 650ms;  --eta-tau: 1.6s;  --eta-every: 600ms;  --eta-hold: 1200ms;

  /* motion */
  --out: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --scene-fade: 500ms;  --pct-fade: 300ms;  --ask-in: 220ms;  --check: 420ms;
}
```

## Typography

| Role | Family | Size | Weight | Width | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Big percentage / size | Encode Sans | 112px (92px < 900px) | 700 | 78% | −0.03em | `tabular-nums`, unit 44px / 600 |
| Preparing line | Alexandria | 40px | 500 | — | −0.02em | replaces the number |
| Panel title | Alexandria | 20px | 600 | — | −0.01em | |
| State label | Alexandria | 12px | 600 | — | 0.08em | uppercase, 8px dot |
| File name | Alexandria | 14px | 600 | — | 0 | wraps anywhere |
| File specs | Encode Sans | 12.5px | 500 | 92% | 0 | |
| Meta row | Encode Sans | 13.5px | 500 / 650 | 100% | 0 | tabular, thin-space thousands |
| Body, spec list, buttons | Alexandria | 13–14px | 400–600 | — | 0 | line-height 1.45 |
| Ruler, track labels, timecode | Encode Sans | 11–13px | 500–600 | — | 0 | tabular |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Indeterminate sweep | preparing | segment edges a, b | `e = 1−(1−ph)²`; b = min(1, 1.32e), a = b − .32 | 1500ms loop | static segment 0 → 28% |
| Handover | length known | a, b | a → 0; b → live p | 650ms cubic ease-out | instant |
| Fill | each frame | b | follows p | none (rAF) | same |
| Big number in | rendering | opacity | 0 → 1 | 300ms --ease | instant |
| Render head, veil | each frame | left | 76px + (100% − 88px)·p | none | same |
| Scene | head enters clip | opacity | 0 ↔ 1 | 500ms --ease | instant |
| Cancel question | cancel | opacity, translateY | 0 / 6px → 1 / 0 | 220ms --out | instant |
| Check | finish | stroke-dashoffset | 30 → 0 | 420ms --out | drawn |
| Buttons | press | translateY | 0 → 1px | 120ms --ease | none |

## States

- Preparing: no `aria-valuenow`; `aria-valuetext="Preparing"`; indeterminate segment; veil covers the whole timeline.
- Rendering: vermilion fill, number, frame counter, ETA, step line with fps.
- Slow section: same visuals; the fps drops and the step line adds "· graded section"; the ETA rises only if the jump is ≥ 4s.
- Confirming cancel: footer swapped for the question; work continues; live updates still run but quarter announcements are held.
- Stopped: grey dot and fill, frozen number, "Start export again".
- Exported: green dot and fill, check + size, "Show file", "Export again"; path line revealed on Show file (space reserved, `visibility:hidden`).
- Hover: outline buttons fill `#eef1ea`; primary `#2a332e`; danger `#fbe9e2`.
- Focus-visible: 3px `#b0330f` outline, 2px offset, on every button.

## Accessibility

- `role="progressbar"` labelled by the "Export" heading, `aria-valuemin 0`, `aria-valuemax 100`. `aria-valuenow` is absent while indeterminate and is written only when the whole percent changes; `aria-valuetext` reads "Preparing", "36 percent", "Stopped at 41 percent" or "Done".
- The big number is `aria-hidden`; the progressbar carries the value.
- One polite live region, spoken only at moments: "Preparing export of saltmarsh-s3-trailer.mp4.", "Rendering 7 560 frames.", at 25/50/75% "50 percent. About 8 seconds left.", "Stop this export? The partial file will be deleted.", "Still exporting.", "Export stopped at 41 percent. Nothing was saved.", "Export finished. saltmarsh-s3-trailer.mp4, 48.6 megabytes." Never per frame.
- Cancel moves focus to "Keep exporting" (the safe choice). Escape inside the question keeps exporting. Stopping moves focus to "Start export again"; finishing moves focus to "Show file" only if focus was in the footer.
- Contrast: ink on panel 17.6:1, `--ink-2` 7.0:1, vermilion text 5.6:1, chip text on ink 16:1, outline button edges ≥ 3:1. Clip names sit on solid ink chips, never on the clip art; the veil is under the chips.
- Hit targets: buttons 42px tall.

## Responsive rules

- ≥ 1280: as drawn. 1024: the editor column narrows; the panel keeps 452px.
- < 900px: one column. The panel comes first (padding 20/16, min-height 520), the editor follows with a 190px monitor; the breadcrumb, workspace nav and clip-name chips hide; the big number drops to 92px.
- 390: the four spec rows keep an 84px label column; buttons wrap.

## Acceptance checklist

### Always

- [ ] Indeterminate segment while the length is unknown, with no `aria-valuenow`.
- [ ] Handover to determinate animates the segment's edges to 0 and to live progress; no frame shows a jump.
- [ ] Counter and percentage use tabular numerals so digits never shift.
- [ ] ETA is smoothed (EMA ~1.6s), updates at most every 600ms, rounds to 5s above 20s, and only rises by ≥ 4s.
- [ ] Cancel asks inline, focuses the safe action, keeps working while asking, Escape keeps exporting.
- [ ] Finish shows file size and a "Show file" action without layout shift.
- [ ] Live region speaks at phase changes and quarters only.
- [ ] Render head and veil on the timeline follow progress.
- [ ] Reduced motion: static indeterminate segment, instant handover and fades, values still update.

### This demo

- [ ] File "saltmarsh-s3-trailer.mp4", 1920 × 1080, 30 fps, 04:12, 7 560 frames, 48.6 MB.
- [ ] Clips "Cold open, dawn", "Harbour wall", "Interview, Wren Halloran", "Reed beds, dusk"; audio "Dialogue", "Tidewater, score".
- [ ] Vermilion `#e2471b` progress, `#17734f` done, Encode Sans 112px at width 78% for the number, Alexandria for text.

## Implementation notes

**Indeterminate to determinate without a jump.** Draw the bar as one segment with two edges, both driven by JS; then the handover is just blending edges:

```js
// preparing: sweep
const ph = (T % 1500) / 1500, e = 1 - (1 - ph) ** 2;
b = Math.min(1, e * 1.32); a = Math.max(0, e * 1.32 - .32);
// rendering: blend from the captured segment [a0, b0] to [0, p]
const k = Math.min(1, (now - handoverAt) / 650), ek = 1 - (1 - k) ** 3;
a = a0 * (1 - ek); b = b0 + (p - b0) * ek;
fill.style.setProperty('--a', a); fill.style.setProperty('--b', b);
```

```css
.fill { position:absolute; inset-block:0; border-radius:5px; background:var(--signal);
  left: calc(var(--a) * 100%); width: calc((var(--b) - var(--a)) * 100%); }
```

**An ETA that settles.** Smooth the rate, throttle the text, and refuse small rises:

```js
ema = ema ? ema + (rate - ema) * Math.min(1, dt / 1.6) : rate;
if (now - startedAt > 1200 && now - lastEta > 600) {
  lastEta = now;
  let s = (TOTAL - frames) / ema;
  s = s > 20 ? Math.round(s / 5) * 5 : Math.ceil(s);
  if (shown == null || s < shown || s - shown >= 4) shown = s;
  eta.textContent = shown <= 3 ? 'Almost done' : `About ${shown} s left`;
}
```

**Announce at moments, not frames.** Keep `aria-valuenow` to whole percents and speak quarters once each:

```js
if (pct !== lastPct) { lastPct = pct; bar.setAttribute('aria-valuenow', pct); }
const q = Math.floor(p * 4);
if (q > said && q < 4) { said = q; if (!asking) say(`${q * 25} percent. About ${shown} seconds left.`); }
```

Common mistakes:

- Swapping the indeterminate element for a separate determinate one: the bar visibly snaps to 0 and starts again.
- Showing an ETA from the instantaneous rate: it flickers by seconds every frame.
- Writing `aria-valuenow` on every animation frame, which floods screen readers.
- A cancel that stops immediately, or a modal confirm that pauses the work; ask inline and keep going.
- Using `display:none` for the revealed path, which shifts the buttons when it appears.

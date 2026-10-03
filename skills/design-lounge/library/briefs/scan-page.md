<!-- Design Lounge Nº 358 · "Scan page" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Scan page

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A sheet titled Gate 4 note. Scan sends an 8px beam from the top of the sheet to the bottom in 1.1 seconds, then the line under the button reads Read · Gate 4 note · 2 lines. The note text is already visible. The beam does not hide it. This is not a skeleton that swaps to content. That swap is `skeleton-to-content-swap`.

## Reference behaviour

1. The sheet shows the title and one sentence. The status is empty.
2. Scan sets data-scan, restarts the beam, and clears the status.
3. The beam is 8px, #1f4d3a, opacity .9, and travels top to bottom in 1.1s.
4. After 1100ms the status reads Read · Gate 4 note · 2 lines.
5. A second click restarts the beam and clears the status first.
6. Reduced motion skips the beam animation and writes the status immediately.
7. The note text never leaves the sheet.

## Structure

```
420px
[ Gate 4 note ]
Scan
status
```

- The sheet is 420 by 260, padding 28px.
- The beam is absolute, left 0, right 0, height 8px.
- The button is 44px, fill #1f4d3a, text #fffdf8.
- The status is 14px, min-height 22px, aria-live polite.
- The wrap is centered.

## Tokens

```css
:root { --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c; --line:#e4dfd4; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Title | IBM Plex Sans | 24px | 600 |
| Body | IBM Plex Sans | 16px | 400 |
| Status | IBM Plex Sans | 14px | 400 |

## Motion

- Beam | Scan | top 0 | top 100% | 1.1s cubic-bezier(0.2,0.7,0.2,1). Reduced motion writes the status with no beam travel.

## States

- Idle: no status, beam opacity 0.
- Scanning: beam visible, status empty.
- Read: status names the note and 2 lines.
- Replay: scanning again.

## Accessibility

- The status is aria-live polite.
- The button is Scan.
- The note title is a heading.
- The beam is decorative.
- Focus ring is 2px #1f4d3a, offset 3px.
- Reduced motion still reports the read.

## Responsive rules

- The wrap is 420px at 1280.
- Below 460 the wrap is calc(100% - 32px). The sheet height stays 260px.
- The beam still spans the sheet width.

## Acceptance checklist

### Always

- [ ] The note is readable before the scan.
- [ ] The beam travels once per click.
- [ ] The status names what was read.
- [ ] A second scan restarts.
- [ ] Nothing is sent.

### This demo

- [ ] The title is Gate 4 note.
- [ ] The sentence is Twelve loads held. Signed by the night desk.
- [ ] The status is Read · Gate 4 note · 2 lines.
- [ ] The beam is 8px and #1f4d3a.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Reset the attribute so the animation can restart.

```js
sheet.dataset.scan = "false";
void sheet.offsetWidth;
sheet.dataset.scan = "true";
```

The timeout matches the 1.1s travel.

## Measurements to keep

- Sheet 420×260, padding 28px, radius 2px.
- Beam height 8px. Travel 1.1s.
- Button height 44px, margin-top 16px.
- Status 14px, min-height 22px, margin-top 12px.
- Title 24px, margin-bottom 8px.

## Wrong turns

- Do not hide the note behind the beam.
- Do not scan on load.
- Do not fetch a file.
- Do not leave the status up through the next scan.
- Do not loop the beam.
- Do not use a camera.

## Fit with the rest of the library

- A content swap is `skeleton-to-content-swap`.
- A long read is `paper-article-reader`.
- This is one sheet and one beam.
- Do not add a file picker.
- Type is IBM Plex Sans.
- The ground is #f6f4ef.

## Keyboard

- Enter starts a scan.
- The status is polite.
- The beam is not a control.
- Do not use a positive tabindex.
- Focus stays on Scan.
- Reduced motion skips the travel.
- There is one button.
- The note is a heading plus a paragraph.
- A second Enter restarts.
- Focus offset is 3px.
- Type is IBM Plex Sans.
- No file input.
- Escape does nothing.
- The timeout is 1100ms, or 0 when reduced.
- The sheet clips the beam.
- Nothing is fetched.

## Rebuild order

1. Build step: The sheet shows the title and one sentence. The status is empty.
2. Build step: Scan sets data-scan, restarts the beam, and clears the status.
3. Build step: The beam is 8px, #1f4d3a, opacity .9, and travels top to bottom in 1.1s.
4. Build step: After 1100ms the status reads Read · Gate 4 note · 2 lines.
5. Build step: A second click restarts the beam and clears the status first.
6. Build step: Reduced motion skips the beam animation and writes the status immediately.
7. Build step: The note text never leaves the sheet.

- Keep this measurement while rebuilding: Sheet 420×260, padding 28px, radius 2px.
- Keep this measurement while rebuilding: Beam height 8px. Travel 1.1s.
- Keep this measurement while rebuilding: Button height 44px, margin-top 16px.
- Keep this measurement while rebuilding: Status 14px, min-height 22px, margin-top 12px.
- Keep this measurement while rebuilding: Title 24px, margin-bottom 8px.

- While rebuilding, remember: Do not hide the note behind the beam.
- While rebuilding, remember: Do not scan on load.
- While rebuilding, remember: Do not fetch a file.
- While rebuilding, remember: Do not leave the status up through the next scan.
- While rebuilding, remember: Do not loop the beam.
- While rebuilding, remember: Do not use a camera.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*

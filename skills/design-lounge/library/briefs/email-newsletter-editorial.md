<!-- Design Lounge Nº 590 · "Editorial newsletter email" · www.designlounge.live -->

# Editorial newsletter email

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The weekly email of an invented food-and-city publication, "The Long Table", issue 112. It is built the way an email has to be: nested `role="presentation"` tables, a 600px column, Georgia for every paragraph and Playfair Display only where a web font failing to load costs nothing. It is shown as the email itself, centred on a warm neutral ground, under a one-line viewer strip (sender, subject, time) that is not part of the email. It reads like a printed broadsheet section: a 64px black-weight masthead over a double rule, a full-width drawn lead image, a 38px headline with an italic deck, three "Also on the table" items with 84px thumbnails, an oxblood-ruled pull quote, a first-name sign-off and a quiet footer. The detail worth copying is the font discipline: if Playfair never loads (Outlook, many Android clients), the email still looks intentional in Georgia.

## Structure

```
1280 × 800, page scrolls
                 ┌ viewer strip (not email): sender · subject · date ┐
                 ┌──────────────────── 600 ─────────────────────────┐
                 │ Issue 112 · Sunday 2 November 2026   View in browser│ top 14/40, hairline
                 │                The Long Table  (Playfair 900 64) │ mast 34/40/8
                 │       A weekly letter about who feeds a city      │
                 │ ═══════════════════════════════════════════════  │ 3px double rule
                 │ ┌──────────────── drawn lead 520×280 ──────────┐ │
                 │ └──────────────────────────────────────────────┘ │
                 │ caption (italic 13)                               │
                 │ THIS WEEK · MARKETS                               │
                 │ The last night-market cooks of Harbour Row (38)   │
                 │ deck (italic 20) · byline (12 caps) · body 17/1.62│
                 │ Keep reading on the site ─────                    │
                 │ Also on the table ─────────────────────────────── │
                 │ [84] BAKERIES / headline / one line               │ × 3, hairlines
                 │ ▌ "You do not close a market…" (Playfair italic 28)│
                 │ See you at the table next Sunday. Mairead         │
                 │ ░ footer #f3efe6: why · links · postal address ░ │
                 └──────────────────────────────────────────────────┘
```

- Outer `<table role="presentation" width="100%">` with one centred `<td>`; inside it the hidden preheader `<div>` and the `.wrap` table (`width="600"` attribute plus `max-width:600px`).
- One `<tr><td>` per band: `.top` (a 2-cell inner table), `.mast` (`<h1>` + tagline), `.rule`, `.lead` (image), `.cap`, `.story`, `.sec` (`<h3>` + inner table of `.item` rows), `.quote` (inner table with a bordered cell), `.sign`, `.foot`.
- Lead image: in the demo a `<div role="img">` with inline SVG (lantern string, four stalls, queue silhouettes). In production replace it with `<img src width="520" height="280" alt="…" style="display:block;width:100%;height:auto">`; Gmail does not render inline SVG.
- Thumbnails: 84 × 84 cells; in production 168 × 168 retina images with `width="84"`.

## Motion

None. No transitions, no animated GIFs, no CSS animation. The piece declares `motion: none`; the stylesheet has nothing to switch off for `prefers-reduced-motion`.

## States

- **Links:** body link "Keep reading on the site" is 15px/700 oxblood with a 2px oxblood bottom border (borders survive in Outlook where `text-decoration-thickness` does not). Item headline links inherit ink and have no underline; footer links are underlined ink.
- **Focus-visible (web view):** 2px oxblood outline, 2px offset.
- **Dark mode:** every colour swaps via `!important` overrides inside `@media (prefers-color-scheme: dark)`; see the dark tokens. The double rule and section rule turn `#ede7dc`.
- **Images off:** the lead cell keeps its `#1f2a3a` background and the `alt` text renders in Georgia on it, so a blocked image still reads as a deliberate dark panel.
- **Web font missing:** every Playfair role falls back to Georgia at the same size and weight.

## Accessibility

- `<html lang="en">`; every layout table has `role="presentation"`; the only real headings are `<h1>` masthead, `<h2>` lead, `<h3>` section, `<h4>` items, in order.
- The lead image has `role="img"` and an `aria-label` (an `alt` in production) that describes the drawing, not "image".
- The preheader is hidden with `display:none; max-height:0; overflow:hidden` and repeats no text that a screen reader would hear twice in a confusing way.
- Contrast (light): accent on paper 10.0:1, muted on paper 6.8:1, strip text `#4f4b44` on ground 6.8:1. Dark: ink on paper 14.1:1, pink accent 8.4:1, muted 6.8:1.
- Body text is 17px, never below 13px anywhere; the footer's 13px clears 4.5:1.
- Unsubscribe is a plain-text link, labelled "Unsubscribe", not hidden in a sentence.

## Responsive rules

- ≥ 1280 and 1024: the column stays 600px, centred, with 48px of ground under it.
- 768: same as desktop.
- < 640 (`@media (max-width:640px)`, honoured by Apple Mail, iOS Mail, Gmail apps): `.wrap` 100% wide, gutters 20px, masthead 44px, headline 30px, quote 23px, lead image 200px tall, thumbnails 64px, viewer strip wraps to two lines.
- Clients that ignore media queries (older Outlook) keep the 600px layout; nothing in it relies on the query to be readable.

## Acceptance checklist

**Always**
- [ ] Layout is nested `role="presentation"` tables with a 600px `width` attribute on the main table; no flex or grid inside the email.
- [ ] Every style rule uses a simple selector (a class, or a class plus an element) and no pseudo-elements, so a CSS inliner can move it onto elements.
- [ ] Body copy uses Georgia only; Playfair appears only on masthead, headlines, section titles and the quote, each with a Georgia fallback.
- [ ] A hidden preheader is the first text in the email.
- [ ] Footer contains why the reader gets this, Manage preferences, Unsubscribe and a full postal address.
- [ ] Below 640px the column goes full width with 20px gutters and the type scale steps down.
- [ ] A `prefers-color-scheme: dark` set swaps paper, ink and accent; `color-scheme` and `supported-color-schemes` metas are present.
- [ ] No text is set over an image.
- [ ] Text contrast is at least 4.5:1 in both schemes.

**This demo**
- [ ] Masthead "The Long Table", tagline "A weekly letter about who feeds a city", "Issue 112 · Sunday 2 November 2026".
- [ ] Lead "The last night-market cooks of Harbour Row" by Mairead Quinlan, 9 minute read.
- [ ] Items: Bakeries, Growing, Letters, each with an 84px thumbnail.
- [ ] Quote attributed to "Tomas Brennan, crane driver, 31 years on the night shift"; address "18 Calder Street, Glasgow G42 7RE".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The page shows the viewer strip ("The Long Table <letters@longtable.press> · Who still cooks on Harbour Row · Sun 2 Nov, 07:00") and below it the 600px email on `#fffdf8`, centred on `#e8e4dc`. The page scrolls vertically; the first 800px show masthead, lead image and headline.
2. A hidden preheader ("Eleven stalls, one generator and a rice cooker older than the market. Plus: the bakery that opens at 4am.") is the first text inside the email so inbox previews show it.
3. Links: "View in browser", "Keep reading on the site", the three item headlines, and the footer links (Manage preferences, Unsubscribe, Forward to a friend). Links have visible focus outlines.
4. Below 640px the column becomes 100% wide, side padding drops from 40px to 20px, masthead 64 → 44px, headline 38 → 30px, lead image 280 → 200px, thumbnails 84 → 64px.
5. With `prefers-color-scheme: dark` (Apple Mail, iOS Mail, Outlook for Mac honour it), the email swaps to the dark set: paper `#1c1a17`, ink `#ede7dc`, oxblood accents become `#e6a3ab`. Clients that force-invert (Gmail apps) get a palette that survives inversion because no text sits on an image.
6. Nothing animates. Email clients strip or ignore most motion; this piece has `motion: none` on purpose.

## Tokens

```css
:root {
  /* light (default) */
  --ground: #e8e4dc;     /* behind the email */
  --paper: #fffdf8;      /* email body */
  --ink: #1b1a17;        /* masthead, headlines */
  --text: #2a2824;       /* body copy */
  --text-2: #3a3732;     /* deck, item copy */
  --muted: #5e5a52;      /* dates, captions, byline */
  --line: #e3ddd1;       /* hairlines */
  --accent: #7a1f2b;     /* oxblood: kicker, link, quote rule */
  --foot: #f3efe6;       /* footer band */
  --foot-text: #4f4b44;

  /* dark set (prefers-color-scheme: dark) */
  --d-ground: #0f0e0c;  --d-paper: #1c1a17;  --d-ink: #ede7dc;  --d-text: #e2dccf;
  --d-text-2: #d4cdc0;  --d-muted: #b3ac9f;  --d-line: #34302a;  --d-accent: #e6a3ab;  --d-foot: #151411;

  /* type */
  --display: "Playfair Display", Georgia, "Times New Roman", serif;
  --serif: Georgia, "Times New Roman", Times, serif;   /* web-safe body, never a web font */

  /* sizes */
  --col: 600px;  --gutter: 40px;  --gutter-m: 20px;
  --fs-mast: 64px;  --fs-h2: 38px;  --fs-deck: 20px;  --fs-body: 17px;  --fs-item: 19px;  --fs-quote: 28px;
  --lead-h: 280px;  --thumb: 84px;
  --rule: 3px double;  --quote-rule: 4px;
  --r: 0;            /* email corners stay square; Outlook ignores radius */
}
```

Web-safe fallback stack for every Playfair use: `"Playfair Display", Georgia, "Times New Roman", serif`. Body copy never uses the web font.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Masthead | Playfair Display → Georgia | 64px (44 mobile) | 900 | 0.95 | −0.02em | Title |
| Tagline | Georgia | 17px | 400 italic | 1.4 | 0 | sentence |
| Kicker | Georgia | 11px | 700 | 1 | +0.18em | UPPERCASE |
| Lead headline | Playfair Display → Georgia | 38px (30 mobile) | 700 | 1.08 | −0.01em | sentence |
| Deck | Georgia | 20px | 400 italic | 1.4 | 0 | sentence |
| Byline | Georgia | 12px | 400 | 1.4 | +0.06em | UPPERCASE |
| Body | Georgia | 17px | 400 | 1.62 | 0 | sentence |
| Section heading | Playfair Display | 22px | 700 | 1.1 | 0 | sentence |
| Item headline | Playfair Display | 19px | 700 | 1.2 | 0 | sentence |
| Item copy | Georgia | 15px | 400 | 1.5 | 0 | sentence |
| Pull quote | Playfair Display | 28px (23 mobile) | 400 italic | 1.25 | 0 | sentence |
| Footer | Georgia | 13px | 400 | 1.6 | 0 | sentence |

Measure: body runs 520px wide, about 68 characters per line at 17px Georgia.

## Implementation notes

**The shell every email needs.** The outer table centres; the inner table carries both the attribute width (Outlook) and a CSS max-width (everyone else):

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">Preheader text…</div>
  <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0"
         style="width:600px;max-width:600px;background:#fffdf8">
    <tr><td class="mast" style="padding:34px 40px 8px;text-align:center">…</td></tr>
  </table>
</td></tr></table>
```

**Dark mode that clients actually apply.** Declare support, then override with `!important` (inlined colours otherwise win):

```html
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
@media (prefers-color-scheme: dark) {
  .wrap { background:#1c1a17 !important; }
  .story h2, .mast h1 { color:#ede7dc !important; }
  .kick, .more { color:#e6a3ab !important; border-color:#e6a3ab !important; }
}
</style>
```

Gmail's apps ignore the query and partially invert colours instead. Keep text off images and avoid pure black or white so the inverted result stays legible.

**Rules that survive Outlook.** Use borders on table cells, never `<hr>` or box-shadow: the double rule is `border-top:3px double #1b1a17` on an empty `<div>` with `font-size:0; line-height:0`, and the quote's oxblood bar is `border-left:4px solid` on its `<td>`.

Common mistakes: loading the web font for body text (Outlook falls back to Times New Roman, not Georgia, unless the stack says Georgia); using SVG or CSS gradients for the lead image in production (Gmail drops both); pseudo-element drop caps (stripped by Gmail); forgetting the postal address, which most anti-spam rules require.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*

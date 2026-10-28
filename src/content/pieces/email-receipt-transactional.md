---
title: "Receipt email"
summary: "A plain, trustworthy order receipt as a 600px table email: confirmation, order number, delivery estimate with steps, line items, totals with VAT, payment, address and help."
platform: web
type: screen
category: newsletter
tags: [email, receipt, transactional, ecommerce, html-email]
styles: [minimal, swiss]
motion: none
difficulty: 1
featured: false
published: 2026-10-28
palette: ["#EEEEEB", "#FEFEFD", "#1C1F1D", "#1F6F4A", "#181A19"]
fonts: ["Helvetica", "Arial"]
related: [email-newsletter-editorial, email-product-launch]
---

# Receipt email

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The order confirmation an invented outdoor-goods shop, Fernhill Supply Co., sends seconds after checkout. It is deliberately plain: Helvetica and Arial only (no web font at all, because receipts must render identically in every client), one forest-green accent for "this is done" signals, hairline rules, and right-aligned tabular prices. It answers the five questions a customer has, in the order they have them: did it work, what is my order number, when will it arrive, what did I pay for, and how do I get help. The detail worth copying is the delivery card: a date range in 20px bold with four progress steps, two already green, so the receipt doubles as the first tracking update.

## Reference behaviour

1. Viewer strip above the email (not part of it): "Fernhill Supply Co. <orders@fernhillsupply.co> · Order FH-284117 confirmed · Tue 28 Oct, 14:12".
2. Hidden preheader: "Your order FH-284117 is confirmed. Arriving Thu 30 Oct to Fri 31 Oct. Total £205.20."
3. Header: letterspaced "FERNHILL" wordmark left, "Order confirmation" right, hairline under.
4. Confirmation: a 40px green disc with a white check, "Thanks, Imogen. Your order is confirmed." (26px bold) and one sentence on what happens next.
5. Two key-value rows: Order number FH-284117, Placed Tue 28 Oct 2026, 14:12 (values bold, right-aligned).
6. Delivery card (`#f6f7f5`, 1px border, 10px radius): "Estimated delivery", "Thursday 30 to Friday 31 October", service line, and four 4px step bars: Ordered and Packing green and bold, On its way and Delivered grey.
7. "Your items (4)": three rows, each a 56px colour swatch, name, variant line, quantity "× n", and line total; the socks row shows the unit price in the variant line.
8. Totals: Subtotal £228.00, Discount (AUTUMN10) −£22.80 in green, Delivery Free, a 2px rule, Total paid £205.20 at 18px bold, Includes VAT £34.20.
9. Two columns: Paid with (card glyph, "Debit card ending 4421", charge time) and Delivering to (name and three address lines).
10. One button, "View order and tracking". Then the help block: what can still be changed, until when, the returns window, a "Get help with this order" link and a promise that a person answers replies.
11. Footer: why this email is sent regardless of marketing preferences, legal name, address and VAT number. No unsubscribe link (it is a service email).
12. Below 640px: full-width column, 20px gutters, 44px swatches, the two info columns stack, the button goes full width. Dark mode swaps to `#181a19` paper with `#7fc8a0` for the green text and step bars.

## Structure

```
1280 × 800, page scrolls
             ┌ viewer strip ─────────────────────────────────────────┐
             ┌──────────────────────── 600 ──────────────────────────┐ 1px #E3E5E1 border
             │ F E R N H I L L                    Order confirmation │ 26/40
             ├───────────────────────────────────────────────────────┤
             │ (check disc)                                          │ 34/40/6
             │ Thanks, Imogen. Your order is confirmed. (26 bold)    │
             │ next-step sentence                                    │
             │ Order number ─────────────────────────── FH-284117    │ key/value rows,
             │ Placed ───────────────────── Tue 28 Oct 2026, 14:12   │ 1px tops
             │ ┌ ESTIMATED DELIVERY ─────────────────────────────┐   │ card 20/22 pad
             │ │ Thursday 30 to Friday 31 October (20 bold)      │   │
             │ │ ▬▬▬▬ ▬▬▬▬ ──── ────  Ordered Packing On… Deliv… │   │ 4 steps, 25% each
             │ └─────────────────────────────────────────────────┘   │
             │ Your items (4)                                        │
             │ [■56] Name / variant                ×1     £168.00    │ rows 14 pad
             │ Subtotal ……………………………………………………………… £228.00             │
             │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ 2px ink
             │ Total paid                                  £205.20   │
             │ Paid with            │ Delivering to                  │ 50 / 50
             │ [ View order and tracking ]                           │
             │ help copy + link                                      │
             │ ░ footer: service-email note · legal · VAT ░          │
             └───────────────────────────────────────────────────────┘
```

- Outer presentation table, centred cell, hidden preheader, `.wrap` table (`width="600"`, 1px border).
- One `<tr><td>` per band: `.hd`, `.ok`, `.meta`, `.ship` (card table with an inner `.steps` table of four cells), `.items` (`<h2>` + table of `.it` rows: `.sw`, `.nm`, `.q`, `.p`), `.tot`, `.pay` (two `.col` cells), `.cta`, `.help`, `.foot`.
- Swatches stand in for product photos; in production use 112 × 112 PNGs at `width="56"` with the product name as `alt`.
- The check disc: in the demo an inline SVG; in production a 40 × 40 PNG (Gmail drops inline SVG), or a check-mark character in a green cell.

## Tokens

```css
:root {
  /* light */
  --ground: #eeeeeb;   /* behind the email */
  --paper: #fefefd;    /* email body */
  --ink: #1c1f1d;      /* headings, values, prices, 2px total rule */
  --text: #3d423f;     /* sentences */
  --muted: #5b615d;    /* labels, variants, quantities */
  --line: #e3e5e1;     /* hairlines and outer border */
  --panel: #f6f7f5;    /* delivery card, footer */
  --step-off: #d5d9d4;
  --ok: #1f6f4a;       /* check disc, done steps, discount, button, help link */
  --on-ok: #ffffff;

  /* dark */
  --d-ground: #0f1110;  --d-paper: #181a19;  --d-ink: #eef0ed;  --d-text: #cfd3d0;  --d-muted: #a3aaa5;
  --d-line: #2a2e2c;  --d-panel: #1f2220;  --d-step-off: #3a3f3c;  --d-ok-text: #7fc8a0;  --d-foot: #141615;

  /* type: web-safe only */
  --sans: Helvetica, Arial, sans-serif;
  --fs-h1: 26px;  --fs-eta: 20px;  --fs-total: 18px;  --fs-h2: 16px;  --fs-body: 14px;  --fs-item: 15px;
  --fs-small: 13px;  --fs-label: 11px;  --fs-foot: 12px;

  /* layout */
  --col: 600px;  --gutter: 40px;  --gutter-m: 20px;
  --r-card: 10px;  --r-btn: 8px;  --r-swatch: 8px;
  --swatch: 56px;  --swatch-m: 44px;  --disc: 40px;  --step-h: 4px;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Wordmark | Helvetica/Arial | 15px | 700 | 1 | +0.28em | UPPERCASE |
| Confirmation | Helvetica/Arial | 26px | 700 | 1.2 | −0.01em | sentence |
| Delivery range | Helvetica/Arial | 20px | 700 | 1.25 | 0 | sentence |
| Section heading | Helvetica/Arial | 16px | 700 | 1.3 | 0 | sentence |
| Item name | Helvetica/Arial | 15px | 400 | 1.4 | 0 | sentence |
| Line total | Helvetica/Arial | 15px | 700 | 1 | 0 | tabular |
| Total paid | Helvetica/Arial | 18px | 700 | 1.3 | 0 | tabular |
| Body, key/value | Helvetica/Arial | 14px | 400 / 700 values | 1.4–1.6 | 0 | sentence |
| Variant, VAT | Helvetica/Arial | 13px | 400 | 1.4 | 0 | sentence |
| Card label | Helvetica/Arial | 11px | 700 | 1 | +0.12em | UPPERCASE |
| Footer | Helvetica/Arial | 12px | 400 | 1.6 | 0 | sentence |

All numbers use `font-variant-numeric: tabular-nums` and `white-space: nowrap`, so £168.00 and £16.00 align on the right edge.

## Motion

None. A receipt should never move. `motion: none`.

## States

- **Step bars:** done = `--ok` bar and bold ink label; pending = `--step-off` bar and muted label. The shipping email reuses this block with three done.
- **Discount row:** label and amount in `--ok`, amount with a real minus sign (`&minus;`).
- **Free delivery:** the word "Free", never "£0.00".
- **Button:** `--ok` fill, white 15px/700, 8px radius, `15px 24px` padding; full width below 640.
- **Help link:** `--ok`, bold, underlined by default.
- **Focus-visible (web view):** 2px `--ok` outline, 3px offset.
- **Dark mode:** paper, rules, card and footer swap; green text and done bars use `#7fc8a0`; the button keeps `#1f6f4a` with white text.

## Accessibility

- Layout tables carry `role="presentation"`; headings are `<h1>` (confirmation) and `<h2>` (Your items, Paid with, Delivering to).
- Each swatch has `role="img"` and the colour name as its label (product image `alt` in production).
- The check disc is decorative; the headline says "confirmed" in words.
- Prices are text, never images; the total sits on its own row with a 2px rule above it so it can be found by sight and by reading order.
- Contrast: muted on paper 6.3:1, green on paper 6.1:1, white on green 6.1:1, muted on panel 5.9:1, strip text on ground 6.6:1. Dark: muted 7.4:1, green text 8.9:1.
- The help block says who answers and when ("a person answers, Monday to Saturday, 8am to 8pm").

## Responsive rules

- ≥ 1280, 1024, 768: 600px column with a 1px border, centred.
- < 640: column 100% with no side borders, gutters 20px, swatches 44px, quantity column 36px, price column 72px, the two info columns become blocks with 18px between, button `display:block`.
- 360: item names wrap to two lines; prices never wrap (`nowrap`).
- Clients without media queries keep the 600px layout.

## Acceptance checklist

**Always**
- [ ] No web fonts: every rule uses `Helvetica, Arial, sans-serif`.
- [ ] Order: confirmation, order number and date, delivery estimate, items, totals, payment and address, one button, help, footer.
- [ ] The delivery estimate is a date range in words, with four steps and the done ones in the accent.
- [ ] Line items show swatch or image, name, variant, quantity and line total; prices are right-aligned tabular numbers.
- [ ] Totals show subtotal, discount with code, delivery, a ruled total and the VAT included.
- [ ] Payment shows only the last four digits; no card brand logo.
- [ ] Exactly one button.
- [ ] Footer explains it is a service email and gives legal name, address and VAT number; no unsubscribe.
- [ ] Below 640px the info columns stack and the button is full width.
- [ ] Dark mode keeps every text at 4.5:1 or more.

**This demo**
- [ ] Order FH-284117, placed Tue 28 Oct 2026, 14:12, for Imogen Hart.
- [ ] Items: Waxed canvas field jacket × 1 £168.00; Merino crew socks, 3 pack × 2 £44.00; Enamel camp mug × 1 £16.00.
- [ ] Subtotal £228.00, AUTUMN10 −£22.80, delivery Free, total £205.20, VAT £34.20.
- [ ] Delivery Thursday 30 to Friday 31 October; card ending 4421.

## Implementation notes

**Right-aligned money that never wraps.** Put prices in their own fixed-width cell and lock the numerals:

```html
<tr class="it">
  <td class="sw" width="56"><img src="jacket.png" width="56" height="56" alt="Waxed canvas field jacket, olive"></td>
  <td class="nm" style="padding-left:14px">Waxed canvas field jacket<span style="display:block;font-size:13px;color:#5b615d">Olive · Size M</span></td>
  <td class="q" width="52" align="center">× 1</td>
  <td class="p" width="84" align="right" style="font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap">£168.00</td>
</tr>
```

**Progress steps without images.** Four equal cells, each with a 4px bar `<div>` above its label; colour is the only change between done and pending, and the done label is also bold so the state is not colour alone:

```css
.steps td { width:25%; padding-right:6px; font:12px/1.35 Helvetica,Arial,sans-serif; color:#5b615d; }
.steps td div { height:4px; border-radius:2px; background:#d5d9d4; margin-bottom:8px; }
.steps td.done { color:#1c1f1d; font-weight:700; }
.steps td.done div { background:#1f6f4a; }
```

**Margins collapse out of an empty-looking disc.** A block SVG with a top margin inside a 40px disc pushes the disc down instead of the icon; use `padding-top:11px; height:29px` on the disc.

Common mistakes: a hero banner or promotions above the order number; an unsubscribe link on a service email (it confuses people into thinking they can stop receipts); totals left-aligned or in proportional figures; "£0.00" delivery; a noreply address on a receipt that tells people to reply.

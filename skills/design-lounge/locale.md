# Locale and identity

Read this when the product uses another language or script, a local currency or calendar, or should look like a place.

## Locale

Read this before you set a number or a date. The pairing `devanagari` is the Nepali face: Noto Serif Devanagari for headings and amounts, Mukta for the interface, IBM Plex Mono for Latin codes only.

- An amount is one string in one family. If it contains रु, रू, ₹, or Devanagari digits, the whole string uses a face that contains every glyph. Do not leave the currency word in a fallback next to mono digits.
- Nepal and India group digits by lakh and crore. The last three, then pairs: 1,24,000 and 18,42,000. Not 124,000. Not 1,842,000. Under 1,000, write 900.
- Pick one currency and keep it. Nepal is रु or Rs. India is ₹. Do not mix them in one product.
- If the product uses Bikram Sambat, label the first date on the screen with BS. Use one system, either 17 Aswin 2083 or २०८३ असोज १७. Do not invent a converter, and do not mix Devanagari digits with Western digits in the same number.
- Devanagari body may be 17px where Latin is 16px. Do not shrink it to fit.
- For Arabic, Hebrew, or Urdu, set `dir="rtl"` on the document. Mirror the shell with logical properties (`padding-inline`, sidebar on the right). Keep numbers LTR with `unicode-bidi: isolate`. Do not mirror an icon that depicts a real object. There is no RTL theme. The locked theme still applies.

## Identity

Restraint is the default on a product someone opens every day. A portfolio, a launch, or a product page they described with motion keeps its effects, in Register in [website.md](website.md). A regional or brand identity is still allowed, in three places, and nowhere else.

1. The locked theme. A Nepali product uses Lokta: lokta paper, crimson primary, navy ink. Lokta Night is the dark pair. Do not stay on Harbour Ledger and then ask why it looks like a Western fintech app.
2. One texture, on one region. The page background, or a single band. A lokta grain is a low-contrast dot at under 8% opacity. Not on cards, not under type, not tiled across every row.
3. The display face from the pairing. For Nepal that is Noto Serif Devanagari, including on the amount.

Crimson is `--primary`, not a second accent beside the theme's brass. A festival does not get a second decorative colour. No emoji, and no pattern on every card. A gradient or a glow belongs only to the effect pieces in Register. If they asked for Nepali and you only put it in the nouns, the look failed. Say so, and move the identity into those three places.

For a revamp, name three visual problems. Fix those inside the adopted system. Do not reskin the whole product unless they asked.

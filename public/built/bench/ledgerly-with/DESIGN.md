# Ledgerly

## Brief

Request, word for word:
"Build a landing page for Ledgerly, invoicing software for small accounting firms. It should make people trust it with their clients' money."

Product: Ledgerly, invoicing software for small accounting firms.
For: a partner or practice manager at a small firm, who wants to know in ten seconds whether this tool can be trusted with client money.
World: ledger rows, bank deposits, a reviewer's sign-off.
The one thing: an invoice that you can watch go from draft to a matched bank deposit to a closed, signed month.
Ambition: finished, because "make people trust it with their clients' money"
Mode: Kit
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: pricing, security certifications, which bank or payment processor holds funds, currency and market, customer names, quotes, logos, a real sign-in and booking URL, the site domain (so no og:image, og:url or canonical yet; the booking link assumes hello@ledgerly.com). The page states none of these.

Hard limits:
- No stock photos or external images. Visuals are HTML, CSS and SVG.
- No placeholder copy and no invented clients, numbers, or quotes. Names inside the product window are labelled as a sample firm.
- Works at 1280x800 and on a 390x844 phone.
- prefers-reduced-motion stills every effect.

## Sheet

Direction: calm-cobalt (the only fitting direction the history leaves open)
Theme: fog-city · Pairing: friendly-saas · Family: quiet (6px controls, 8px cards)
Hero: hero-product-window-tilt · Effect: features-sticky-scroll-steps · Work: features-tabbed-preview · Footer: footer-enterprise-sitemap · Header: navbar-hide-on-scroll
Shape: object · Frame: navbar-hide-on-scroll, none, footer-enterprise-sitemap
Unlike recent selling sites: hero, work, footer, shape, and frame are all different.

Idea: the page is one invoice's life. The hero is Ledgerly's receivables window, running; the steps section follows a single invoice, INV-1042, from draft to a closed month.
Signature: the match line. When the bank deposit arrives, a cobalt hairline draws from the invoice total down to the deposit amount, with the three things it matched on.
Avoiding: a hero of a headline plus three icon cards about "security", trust badges we cannot back, and a gradient.

Defaults set aside: the tabbed preview's outlined "01 /04" numeral and tab numbers are dropped (numbered labels are a Look fail); the footer's status pill, region picker and certification row are dropped because we have no facts for them.

// Type pairings for /type. Every family spec is a valid Google Fonts css2 `family=` value.
export interface Face { family: string; spec: string; weight: number; italic?: boolean; tracking?: string; upper?: boolean; fallback: string }
export interface Pairing {
  id: string;
  name: string;
  mood: string;
  bestFor: string[];
  tags: string[];
  display: Face;
  text: Face;
  headline: string;
  body: string;
  label: string;
  bg: string;
  ink: string;
  accent: string;
}

const serif = 'Georgia, "Times New Roman", serif';
const sans = '"Helvetica Neue", Arial, sans-serif';
const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

export const PAIRINGS: Pairing[] = [
  { id: 'gallery-wall', name: 'Gallery Wall', mood: 'Quiet confidence. A serif with ink-trap italics over a neutral grotesk.', bestFor: ['Designer portfolios', 'Studio sites', 'Case studies'], tags: ['editorial', 'portfolio'],
    display: { family: 'Instrument Serif', spec: 'Instrument+Serif:ital@0;1', weight: 400, italic: true, tracking: '-0.02em', fallback: serif },
    text: { family: 'Inter', spec: 'Inter:wght@400;500;600', weight: 400, fallback: sans },
    headline: 'Work that holds a room', body: 'Selected identities, interfaces and exhibitions, 2019 to now. Based in Lisbon, working everywhere the coffee is decent.', label: 'Portfolio · 2026', bg: '#f2efe9', ink: '#161513', accent: '#b2492c' },
  { id: 'the-lounge', name: 'The Lounge', mood: 'Warm, literary, a little soft. The house pairing of this site.', bestFor: ['Editorial products', 'Libraries', 'Long reads'], tags: ['editorial', 'warm'],
    display: { family: 'Fraunces', spec: 'Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900', weight: 400, tracking: '-0.03em', fallback: serif },
    text: { family: 'Instrument Sans', spec: 'Instrument+Sans:wght@400..700', weight: 400, fallback: sans },
    headline: 'Interfaces worth sitting with', body: 'Every piece runs live, is one readable file, and ships with a brief your coding agent can rebuild it from.', label: 'Design Lounge', bg: '#f3efe6', ink: '#171512', accent: '#a8661a' },
  { id: 'newsroom', name: 'Newsroom', mood: 'Serious reporting with a friendly sans for the furniture.', bestFor: ['News', 'Newsletters', 'Publishing'], tags: ['editorial', 'news'],
    display: { family: 'Newsreader', spec: 'Newsreader:ital,wght@0,400;0,600;1,400', weight: 600, tracking: '-0.015em', fallback: serif },
    text: { family: 'Work Sans', spec: 'Work+Sans:wght@400;500;600', weight: 400, fallback: sans },
    headline: 'The river that moved a border', body: 'For forty years the Mechi has drifted west. Two villages, one survey stone and a dispute nobody filed.', label: 'Long read · 14 min', bg: '#f7f4ee', ink: '#1b1a17', accent: '#a3121f' },
  { id: 'swiss-precision', name: 'Swiss Precision', mood: 'Grid-first. Tight grotesk, mono for data and captions.', bestFor: ['Dashboards', 'Wayfinding', 'Data products'], tags: ['swiss', 'product'],
    display: { family: 'Schibsted Grotesk', spec: 'Schibsted+Grotesk:wght@400;600;800', weight: 800, tracking: '-0.04em', fallback: sans },
    text: { family: 'IBM Plex Mono', spec: 'IBM+Plex+Mono:wght@400;500;600', weight: 400, fallback: mono },
    headline: 'Platform 4, 08:12', body: 'Departures are printed on the half minute. Delays over two minutes change colour; delays over ten change the route.', label: 'Wayfinding system', bg: '#f4f4f0', ink: '#111111', accent: '#e2231a' },
  { id: 'brutal-grotesk', name: 'Brutal Grotesk', mood: 'Loud headlines, plain body, nothing in between.', bestFor: ['Agencies', 'Launches', 'Posters'], tags: ['brutalist', 'loud'],
    display: { family: 'Archivo Black', spec: 'Archivo+Black', weight: 400, tracking: '-0.03em', upper: true, fallback: sans },
    text: { family: 'Archivo', spec: 'Archivo:wght@400;500;700', weight: 400, fallback: sans },
    headline: 'No decks. We show the work.', body: 'A six-person studio building identities and interfaces for transit, energy and public bodies.', label: 'Halden Studio', bg: '#ffffff', ink: '#000000', accent: '#ff3b00' },
  { id: 'maison', name: 'Maison', mood: 'High-contrast Didone with an airy humanist. Restraint as luxury.', bestFor: ['Fashion', 'Hotels', 'Fragrance'], tags: ['luxe', 'fashion'],
    display: { family: 'Bodoni Moda', spec: 'Bodoni+Moda:ital,wght@0,400;0,700;1,400', weight: 400, italic: true, tracking: '-0.02em', fallback: serif },
    text: { family: 'Tenor Sans', spec: 'Tenor+Sans', weight: 400, tracking: '0.04em', fallback: sans },
    headline: 'Eau de Nuit, No. 7', body: 'Black tea, fig leaf and a cold stone accord. Poured in Grasse in editions of four hundred.', label: 'Maison Ferre · Paris', bg: '#f5f0ea', ink: '#1a1716', accent: '#7c5a3c' },
  { id: 'studio-display', name: 'Studio Display', mood: 'Art-school geometry with a calm, readable companion.', bestFor: ['Creative studios', 'Events', 'Culture'], tags: ['expressive', 'studio'],
    display: { family: 'Syne', spec: 'Syne:wght@400;600;800', weight: 800, tracking: '-0.03em', fallback: sans },
    text: { family: 'Manrope', spec: 'Manrope:wght@400;500;700', weight: 400, fallback: sans },
    headline: 'Open studio, 14–16 May', body: 'Three floors of prints, prototypes and the furniture we built when the budget ran out.', label: 'Fieldwork', bg: '#e9ecef', ink: '#101418', accent: '#3d5afe' },
  { id: 'developer-docs', name: 'Developer Docs', mood: 'Neutral, technical, legible at 13px. Built for code next to prose.', bestFor: ['Docs', 'Dev tools', 'APIs'], tags: ['product', 'tech'],
    display: { family: 'Geist', spec: 'Geist:wght@400;500;700', weight: 600, tracking: '-0.035em', fallback: sans },
    text: { family: 'Geist Mono', spec: 'Geist+Mono:wght@400;500', weight: 400, fallback: mono },
    headline: 'Ship the edge function', body: 'npx kestrel deploy --region bom1. Cold starts under 40ms, logs streamed to your terminal.', label: 'Kestrel CLI v3.2', bg: '#0b0b0c', ink: '#ededed', accent: '#3ddc97' },
  { id: 'bookish', name: 'Bookish', mood: 'Old-style serif reading comfort with a friendly grotesk for UI.', bestFor: ['Reading apps', 'Book shops', 'Journals'], tags: ['editorial', 'reading'],
    display: { family: 'Libre Caslon Text', spec: 'Libre+Caslon+Text:ital,wght@0,400;0,700;1,400', weight: 400, italic: true, tracking: '-0.01em', fallback: serif },
    text: { family: 'Karla', spec: 'Karla:wght@400;500;700', weight: 400, fallback: sans },
    headline: 'Chapter two: Winter floor', body: 'Read across sixty winters, the numbers made a shape, and the shape was not the one on any chart.', label: 'Reader · 34%', bg: '#f6f1e7', ink: '#26211b', accent: '#8a3b12' },
  { id: 'poster-condensed', name: 'Poster Condensed', mood: 'Tall and urgent. Condensed caps with a mono to keep it honest.', bestFor: ['Events', 'Sports', 'Music'], tags: ['loud', 'poster'],
    display: { family: 'Bebas Neue', spec: 'Bebas+Neue', weight: 400, tracking: '0.01em', upper: true, fallback: sans },
    text: { family: 'Space Mono', spec: 'Space+Mono:ital,wght@0,400;0,700;1,400', weight: 400, fallback: mono },
    headline: 'Final night. Doors 19:30', body: 'Basement stage, Thamel. Four bands, one PA, no guest list. Tickets at the door from 19:00.', label: 'Gig poster', bg: '#141414', ink: '#f2f0e9', accent: '#ffcc00' },
  { id: 'deco-hotel', name: 'Deco Hotel', mood: 'Thin, tall, 1920s. Geometric sans for the room numbers.', bestFor: ['Hospitality', 'Bars', 'Invitations'], tags: ['deco', 'luxe'],
    display: { family: 'Italiana', spec: 'Italiana', weight: 400, tracking: '0.06em', upper: true, fallback: serif },
    text: { family: 'Josefin Sans', spec: 'Josefin+Sans:wght@300;400;600', weight: 400, tracking: '0.02em', fallback: sans },
    headline: 'The Meridian Grand', body: 'Forty-two rooms above the old tram depot. Cocktails in the observatory from six until late.', label: 'Est. 1926', bg: '#0f1714', ink: '#efe6d2', accent: '#c9a54a' },
  { id: 'atelier', name: 'Atelier', mood: 'A heavy display serif with a soft, rounded geometric for everything else.', bestFor: ['Fashion e-commerce', 'Beauty', 'Lifestyle'], tags: ['fashion', 'editorial'],
    display: { family: 'Gloock', spec: 'Gloock', weight: 400, tracking: '-0.025em', fallback: serif },
    text: { family: 'Figtree', spec: 'Figtree:wght@400;600;800', weight: 400, fallback: sans },
    headline: 'The linen edit', body: 'Twelve pieces cut from Lithuanian flax, washed twice so they arrive already soft.', label: 'Spring 26', bg: '#efe7dc', ink: '#2a211b', accent: '#9d4b2c' },
  { id: 'arcade', name: 'Arcade', mood: 'Bitmap caps over a mono body. Insert coin.', bestFor: ['Games', 'Hackathons', 'Retro products'], tags: ['pixel', 'retro'],
    display: { family: 'Silkscreen', spec: 'Silkscreen:wght@400;700', weight: 700, tracking: '0.02em', upper: true, fallback: mono },
    text: { family: 'Space Mono', spec: 'Space+Mono:ital,wght@0,400;0,700;1,400', weight: 400, fallback: mono },
    headline: 'Level 3 unlocked', body: 'High score 048,200. Two lives left. The boss has a weak point and it is always the left hand.', label: 'Press start', bg: '#1b1b2f', ink: '#f4f4f4', accent: '#ffd23f' },
  { id: 'hud', name: 'HUD', mood: 'Angular, technical, cockpit-adjacent. Pairs with cut corners and scanlines.', bestFor: ['Gaming', 'Security', 'Mission control'], tags: ['cyber', 'tech'],
    display: { family: 'Chakra Petch', spec: 'Chakra+Petch:wght@400;500;700', weight: 700, tracking: '0.02em', upper: true, fallback: sans },
    text: { family: 'Share Tech Mono', spec: 'Share+Tech+Mono', weight: 400, fallback: mono },
    headline: 'Signal acquired', body: 'Uplink 98.2%. Three nodes degraded over the Arabian Sea. Rerouting through Muscat in 00:04.', label: 'SYS / NAV-02', bg: '#07090d', ink: '#d6e2f0', accent: '#19e6c1' },
  { id: 'candy-clay', name: 'Candy Clay', mood: 'Puffy, round, delighted. Built for chunky buttons.', bestFor: ['Kids', 'Consumer apps', 'Games'], tags: ['clay', 'playful'],
    display: { family: 'Bagel Fat One', spec: 'Bagel+Fat+One', weight: 400, tracking: '-0.01em', fallback: sans },
    text: { family: 'Fredoka', spec: 'Fredoka:wght@400;500;600;700', weight: 500, fallback: sans },
    headline: 'Seven days in a row!', body: 'Your streak is safe. Water the plant tomorrow before nine and it grows a new leaf.', label: 'Sprout', bg: '#fde8e4', ink: '#3a2430', accent: '#ff7a59' },
  { id: 'friendly-saas', name: 'Friendly SaaS', mood: 'Modern product sans with a mono for numbers and keys.', bestFor: ['SaaS', 'Fintech', 'Startups'], tags: ['product', 'saas'],
    display: { family: 'Plus Jakarta Sans', spec: 'Plus+Jakarta+Sans:wght@400;600;800', weight: 800, tracking: '-0.035em', fallback: sans },
    text: { family: 'JetBrains Mono', spec: 'JetBrains+Mono:wght@400;500;700', weight: 400, fallback: mono },
    headline: 'Payroll in four minutes', body: '₹ 18,42,000 across 46 people, paid Friday 09:00. Tax filed, payslips sent, nobody chased.', label: 'Tally · Payroll', bg: '#f6f7fb', ink: '#11131a', accent: '#4f46e5' },
  { id: 'bauhaus-school', name: 'Bauhaus School', mood: 'Geometric heavyweight with a mono for the rules.', bestFor: ['Education', 'Exhibitions', 'Architecture'], tags: ['bauhaus', 'geometric'],
    display: { family: 'Outfit', spec: 'Outfit:wght@400;600;800', weight: 800, tracking: '-0.04em', fallback: sans },
    text: { family: 'DM Mono', spec: 'DM+Mono:wght@400;500', weight: 400, fallback: mono },
    headline: 'Form follows function', body: 'A six-week summer school in form, colour and typography. Sixty places, three workshops.', label: 'Werkstatt 26', bg: '#f2ead8', ink: '#1a1a1a', accent: '#d7261e' },
  { id: 'wide-tech', name: 'Wide Tech', mood: 'Extended display, crisp neutral body. Feels engineered and expensive.', bestFor: ['Hardware', 'Mobility', 'Crypto'], tags: ['tech', 'wide'],
    display: { family: 'Unbounded', spec: 'Unbounded:wght@400;600;800', weight: 600, tracking: '-0.03em', fallback: sans },
    text: { family: 'Onest', spec: 'Onest:wght@400;600;800', weight: 400, fallback: sans },
    headline: 'Range: 612 km', body: 'Charge from 10 to 80 percent in eighteen minutes on any 350 kW station along the Prithvi highway.', label: 'Volta GT', bg: '#0e0f12', ink: '#eef0f3', accent: '#c6ff3d' },
  { id: 'garden-journal', name: 'Garden Journal', mood: 'Chunky friendly serif, generous grotesk. Earthy and kind.', bestFor: ['Food', 'Wellness', 'Lifestyle'], tags: ['organic', 'warm'],
    display: { family: 'Young Serif', spec: 'Young+Serif', weight: 400, tracking: '-0.02em', fallback: serif },
    text: { family: 'Hanken Grotesk', spec: 'Hanken+Grotesk:wght@400;600;800', weight: 400, fallback: sans },
    headline: 'Tomatoes, late August', body: 'Pick when the shoulders blush and the fruit gives a little under the thumb. Never refrigerate.', label: 'Loam · Field notes', bg: '#eef0e6', ink: '#1e2a1e', accent: '#c46a3c' },
  { id: 'literary', name: 'Literary', mood: 'Calligraphic Garamond display with a quiet sans for UI.', bestFor: ['Poetry', 'Publishers', 'Weddings'], tags: ['editorial', 'classic'],
    display: { family: 'Cormorant Garamond', spec: 'Cormorant+Garamond:ital,wght@0,400;0,600;1,400', weight: 400, italic: true, tracking: '-0.01em', fallback: serif },
    text: { family: 'Work Sans', spec: 'Work+Sans:wght@400;500;600', weight: 400, fallback: sans },
    headline: 'Letters from the hill station', body: 'Collected correspondence, 1931 to 1958, transcribed and annotated by the grand-nieces of the author.', label: 'Hardback · 320 pp', bg: '#f4efe6', ink: '#2a2420', accent: '#6b3e26' },
  { id: 'riso-zine', name: 'Riso Zine', mood: 'Monoline heavyweight caps and its own family for body. Photocopied joy.', bestFor: ['Zines', 'Festivals', 'Merch'], tags: ['riso', 'playful'],
    display: { family: 'Rubik Mono One', spec: 'Rubik+Mono+One', weight: 400, tracking: '-0.02em', upper: true, fallback: sans },
    text: { family: 'Rubik', spec: 'Rubik:wght@400;600;800', weight: 400, fallback: sans },
    headline: 'Print club, issue 9', body: 'Two inks, one drum, forty-eight pages of things we drew on the bus. Fluoro pink is back.', label: 'Zine fair', bg: '#f6f1ea', ink: '#1f2a6b', accent: '#ff4f8b' },
  { id: 'industrial-label', name: 'Industrial Label', mood: 'Tall stencil-adjacent caps and a workhorse sans.', bestFor: ['Logistics', 'Manufacturing', 'Outdoor'], tags: ['industrial', 'utility'],
    display: { family: 'Big Shoulders Display', spec: 'Big+Shoulders+Display:wght@400;700;900', weight: 900, tracking: '0', upper: true, fallback: sans },
    text: { family: 'IBM Plex Sans', spec: 'IBM+Plex+Sans:wght@400;500;600;700', weight: 400, fallback: sans },
    headline: 'Bay 14. Load 2,400 kg', body: 'Forklift route B. Pallets wrapped and tagged before 06:00. Inspection sheet stays with the driver.', label: 'Yard ops', bg: '#e7e6e1', ink: '#1b1c1e', accent: '#ff5a1f' },
  { id: 'handwritten-notes', name: 'Handwritten Notes', mood: 'A real hand for annotations, a neutral grotesk for the rest.', bestFor: ['Whiteboards', 'Education', 'Personal sites'], tags: ['playful', 'personal'],
    display: { family: 'Caveat', spec: 'Caveat:wght@400;700', weight: 700, tracking: '0', fallback: 'cursive' },
    text: { family: 'Inter', spec: 'Inter:wght@400;500;600', weight: 400, fallback: sans },
    headline: 'this bit matters!', body: 'Circle the step people skip. In testing, eight of twelve missed the confirm button on the second screen.', label: 'Research notes', bg: '#fbf5df', ink: '#2b2614', accent: '#e0a100' },
  { id: 'slab-ledger', name: 'Slab Ledger', mood: 'Sturdy slab with a mono. Ledgers, receipts, honesty.', bestFor: ['Finance', 'Invoicing', 'Co-ops'], tags: ['utility', 'finance'],
    display: { family: 'Zilla Slab', spec: 'Zilla+Slab:wght@400;600;700', weight: 700, tracking: '-0.02em', fallback: serif },
    text: { family: 'IBM Plex Mono', spec: 'IBM+Plex+Mono:wght@400;500;600', weight: 400, fallback: mono },
    headline: 'Invoice 2026-0418', body: 'Due 30 Oct. 3 × design sprint at 1,200.00. Subtotal 3,600.00. VAT 13%. Thank you for your custom.', label: 'Ledgerly', bg: '#f5f1e8', ink: '#22201b', accent: '#1f5f4a' },
  { id: 'red-hat', name: 'Red Hat Pair', mood: 'One superfamily: display and mono designed together.', bestFor: ['Enterprise', 'Open source', 'Docs'], tags: ['product', 'superfamily'],
    display: { family: 'Red Hat Display', spec: 'Red+Hat+Display:wght@400;700;900', weight: 900, tracking: '-0.035em', fallback: sans },
    text: { family: 'Red Hat Mono', spec: 'Red+Hat+Mono:wght@400;500', weight: 400, fallback: mono },
    headline: 'Cluster healthy', body: '12 nodes · 3 zones · p99 41ms. Rolling restart scheduled for 02:00 UTC, no action required.', label: 'Ops console', bg: '#f3f4f6', ink: '#151515', accent: '#d61f26' },
  { id: 'y2k-chrome', name: 'Y2K Chrome', mood: 'Wide, sci-fi, millennium. Wants bevels and sparkles.', bestFor: ['Music', 'Fashion drops', 'Nightlife'], tags: ['y2k', 'retro'],
    display: { family: 'Michroma', spec: 'Michroma', weight: 400, tracking: '0.02em', upper: true, fallback: sans },
    text: { family: 'Figtree', spec: 'Figtree:wght@400;600;800', weight: 400, fallback: sans },
    headline: 'Millennium mixtape', body: 'Fourteen tracks, limited chrome cassette, ships in a jelly case. Pre-save before Friday midnight.', label: 'Drop 002', bg: '#e8ecf2', ink: '#10131a', accent: '#2f6bff' },
  { id: 'signal-mono', name: 'Signal Mono', mood: 'Space-age grotesk and its mono sibling. Tech without coldness.', bestFor: ['Startups', 'AI tools', 'Hardware'], tags: ['tech', 'product'],
    display: { family: 'Space Grotesk', spec: 'Space+Grotesk:wght@300..700', weight: 600, tracking: '-0.04em', fallback: sans },
    text: { family: 'Space Mono', spec: 'Space+Mono:ital,wght@0,400;0,700;1,400', weight: 400, fallback: mono },
    headline: 'Launch window opens', body: 'T-minus 14:00. Weather go, range go, payload go. Live telemetry at 10 Hz from the pad.', label: 'Orbital', bg: '#0c0d10', ink: '#e8e9ec', accent: '#c6f135' },
  { id: 'playground', name: 'Playground', mood: 'Round and bouncy with a sturdy, readable body.', bestFor: ['Kids', 'Learning', 'Community'], tags: ['playful', 'friendly'],
    display: { family: 'Baloo 2', spec: 'Baloo+2:wght@400;600;800', weight: 800, tracking: '-0.02em', fallback: sans },
    text: { family: 'Nunito', spec: 'Nunito:wght@400;600;800', weight: 400, fallback: sans },
    headline: 'Trace the letter B', body: 'Start at the top, go down, then two bumps. You earned three stars yesterday. Can you get four?', label: 'Little Letters', bg: '#fff4d6', ink: '#2c2140', accent: '#ff6b4a' },
  { id: 'magazine-contrast', name: 'Magazine Contrast', mood: 'Display serif and its matched sans, designed as a pair.', bestFor: ['Magazines', 'Brand sites', 'Restaurants'], tags: ['editorial', 'superfamily'],
    display: { family: 'DM Serif Display', spec: 'DM+Serif+Display:ital@0;1', weight: 400, tracking: '-0.02em', fallback: serif },
    text: { family: 'DM Sans', spec: 'DM+Sans:wght@400;500;700', weight: 400, fallback: sans },
    headline: 'Dinner at the long table', body: 'Twelve seats, one menu, whatever came off the boat at Kalk Bay this morning. Thursdays only.', label: 'Supper club', bg: '#f6efe6', ink: '#1f1a17', accent: '#b23a48' },
  { id: 'neo-grotesk-mono', name: 'Neo Grotesk Mono', mood: 'Scandinavian grotesk with a characterful mono.', bestFor: ['Agencies', 'Product sites', 'Annual reports'], tags: ['swiss', 'product'],
    display: { family: 'Familjen Grotesk', spec: 'Familjen+Grotesk:wght@400;600;700', weight: 700, tracking: '-0.035em', fallback: sans },
    text: { family: 'Chivo Mono', spec: 'Chivo+Mono:wght@400;500', weight: 400, fallback: mono },
    headline: 'Annual report 2025', body: 'Revenue up 31%. Headcount flat. Carbon down 18% after the move to the Bergen data hall.', label: 'Fjord Group', bg: '#eef1f3', ink: '#0f1418', accent: '#0f6fff' },
  { id: 'variable-expressive', name: 'Variable Expressive', mood: 'A width-and-weight variable display with a crisp body. Begs to animate.', bestFor: ['Kinetic type', 'Music', 'Campaigns'], tags: ['kinetic', 'variable'],
    display: { family: 'Anybody', spec: 'Anybody:wdth,wght@50..150,400..900', weight: 900, tracking: '-0.02em', upper: true, fallback: sans },
    text: { family: 'Epilogue', spec: 'Epilogue:wght@400;600;800', weight: 400, fallback: sans },
    headline: 'Stretch the signal', body: 'A festival identity that widens with the bass. Every poster is a frame from the same animation.', label: 'Wavefront 26', bg: '#ff5b2e', ink: '#160b06', accent: '#160b06' },
  { id: 'academic', name: 'Academic', mood: 'A screen-first book serif with a civic sans.', bestFor: ['Research', 'Government', 'Universities'], tags: ['editorial', 'civic'],
    display: { family: 'Literata', spec: 'Literata:ital,wght@0,400;0,600;1,400', weight: 600, tracking: '-0.02em', fallback: serif },
    text: { family: 'Public Sans', spec: 'Public+Sans:wght@400;500;700', weight: 400, fallback: sans },
    headline: 'Groundwater in the Terai', body: 'Findings from 1,140 tube wells sampled between 2019 and 2025, with recommendations for district offices.', label: 'Working paper 12', bg: '#f5f6f2', ink: '#1a1f24', accent: '#1d4e89' },
  { id: 'cinema', name: 'Cinema', mood: 'Poster-tall condensed caps over a bookish serif. Credits energy.', bestFor: ['Film', 'Theatre', 'Festivals'], tags: ['poster', 'editorial'],
    display: { family: 'Anton', spec: 'Anton', weight: 400, tracking: '0.005em', upper: true, fallback: sans },
    text: { family: 'Crimson Pro', spec: 'Crimson+Pro:ital,wght@0,400;0,600;1,400', weight: 400, fallback: serif },
    headline: 'The last monsoon', body: 'A film in three rains. Opening night at the Kumari, 19:45, with the director in conversation.', label: 'Now showing', bg: '#120d0b', ink: '#f1e6dc', accent: '#ff5b2e' },
  { id: 'monumental', name: 'Monumental', mood: 'Roman inscriptional caps with a refined text serif.', bestFor: ['Museums', 'Wine', 'Heritage'], tags: ['classic', 'luxe'],
    display: { family: 'Cinzel', spec: 'Cinzel:wght@400;700', weight: 400, tracking: '0.08em', upper: true, fallback: serif },
    text: { family: 'Spectral', spec: 'Spectral:ital,wght@0,400;0,600;1,400', weight: 400, fallback: serif },
    headline: 'Hall of the Mallas', body: 'Bronzes, palm-leaf manuscripts and a carved window frame from 1673, shown together for the first time.', label: 'Patan Museum', bg: '#f3e7da', ink: '#2a1712', accent: '#b5381f' },
  { id: 'terminal-native', name: 'Terminal Native', mood: 'A mono that reads like prose, with a plain sans for marketing copy.', bestFor: ['CLIs', 'Dev portfolios', 'Changelogs'], tags: ['terminal', 'tech'],
    display: { family: 'JetBrains Mono', spec: 'JetBrains+Mono:wght@400;500;700', weight: 700, tracking: '-0.03em', fallback: mono },
    text: { family: 'IBM Plex Sans', spec: 'IBM+Plex+Sans:wght@400;500;600;700', weight: 400, fallback: sans },
    headline: '$ git push --tags', body: 'v4.0.0 shipped. 212 commits, 38 contributors, one breaking change and a very long migration guide.', label: 'Changelog', bg: '#0b0f0c', ink: '#c8f7d4', accent: '#3ddc84' },
  { id: 'neon-marquee', name: 'Neon Marquee', mood: 'Inline tube lettering with a geometric sans. Use once, big.', bestFor: ['Bars', 'Arcades', 'Night markets'], tags: ['retro', 'deco'],
    display: { family: 'Monoton', spec: 'Monoton', weight: 400, tracking: '0.02em', upper: true, fallback: sans },
    text: { family: 'Josefin Sans', spec: 'Josefin+Sans:wght@300;400;600', weight: 400, fallback: sans },
    headline: 'Open late', body: 'Pinball, noodles and a jukebox that only plays B-sides. Last orders at two, doors close at three.', label: 'Lucky Lane', bg: '#1d1030', ink: '#f2e9ff', accent: '#ff4fa3' },
  { id: 'indie-maker', name: 'Indie Maker', mood: 'One variable family doing both jobs at two optical sizes.', bestFor: ['Indie products', 'Newsletters', 'Personal sites'], tags: ['single-family', 'product'],
    display: { family: 'Bricolage Grotesque', spec: 'Bricolage+Grotesque:opsz,wght@12..96,400..800', weight: 800, tracking: '-0.04em', fallback: sans },
    text: { family: 'Bricolage Grotesque', spec: 'Bricolage+Grotesque:opsz,wght@12..96,400..800', weight: 400, fallback: sans },
    headline: 'Built in public, week 31', body: 'MRR crossed $4,200. Churn is down after the onboarding rewrite. Next: the API nobody asked for.', label: 'Weeknotes', bg: '#fff8ee', ink: '#1c1a17', accent: '#ff5a36' },
  { id: 'ai-editorial', name: 'AI Editorial', mood: 'The 2026 look: a delicate serif with a precise mono. Thoughtful machines.', bestFor: ['AI products', 'Research labs', 'Tools'], tags: ['editorial', 'tech'],
    display: { family: 'Instrument Serif', spec: 'Instrument+Serif:ital@0;1', weight: 400, tracking: '-0.025em', fallback: serif },
    text: { family: 'JetBrains Mono', spec: 'JetBrains+Mono:wght@400;500;700', weight: 400, fallback: mono },
    headline: 'A model that shows its work', body: 'Every answer links to the passage it came from. Confidence is a number, not a tone of voice.', label: 'Margin · Research', bg: '#f4f2ee', ink: '#141413', accent: '#d97757' },
  { id: 'lettera', name: 'Lettera', mood: 'Classic high-contrast serif with a warm sans. Timeless, never wrong.', bestFor: ['Brands', 'Restaurants', 'Weddings'], tags: ['classic', 'editorial'],
    display: { family: 'Playfair Display', spec: 'Playfair+Display:ital,wght@0,400..900;1,400..900', weight: 500, italic: true, tracking: '-0.02em', fallback: serif },
    text: { family: 'Karla', spec: 'Karla:wght@400;500;700', weight: 400, fallback: sans },
    headline: 'A table for two, at eight', body: 'Our tasting menu changes with the market. Tell us what you avoid and we will cook around it.', label: 'Osteria Lume', bg: '#f7ece8', ink: '#3a2a2a', accent: '#a5432f' },
  { id: 'pixel-soft', name: 'Pixel Soft', mood: 'A friendly pixel face with a hyper-legible sans. Retro without the eye strain.', bestFor: ['Productivity games', 'Kids', 'Crypto'], tags: ['pixel', 'friendly'],
    display: { family: 'Pixelify Sans', spec: 'Pixelify+Sans:wght@400;700', weight: 700, tracking: '0', fallback: mono },
    text: { family: 'Lexend', spec: 'Lexend:wght@300;400;600', weight: 400, fallback: sans },
    headline: 'Quest: inbox zero', body: 'Clear 12 emails to level up. Your companion, a small frog named Tuesday, is cheering quietly.', label: 'Tamago', bg: '#e9f5ec', ink: '#173326', accent: '#2f9e5b' },
  { id: 'classic-garamond', name: 'Classic Garamond', mood: 'The book face of record, with a sober grotesk for navigation.', bestFor: ['Literary magazines', 'Law', 'Archives'], tags: ['classic', 'reading'],
    display: { family: 'EB Garamond', spec: 'EB+Garamond:ital,wght@0,400;0,600;1,400', weight: 400, tracking: '-0.01em', fallback: serif },
    text: { family: 'Hanken Grotesk', spec: 'Hanken+Grotesk:wght@400;600;800', weight: 400, fallback: sans },
    headline: 'On the keeping of records', body: 'An essay in four parts on ledgers, memory and the clerk who refused to throw anything away.', label: 'Quarterly · No. 41', bg: '#f2ede3', ink: '#231f1a', accent: '#5b3a1e' },
  { id: 'geometric-modern', name: 'Geometric Modern', mood: 'Clean geometric sans in two weights. The safe-but-sharp product default.', bestFor: ['Apps', 'Marketplaces', 'Health'], tags: ['product', 'single-family'],
    display: { family: 'Sora', spec: 'Sora:wght@400;600;800', weight: 600, tracking: '-0.035em', fallback: sans },
    text: { family: 'Sora', spec: 'Sora:wght@400;600;800', weight: 400, fallback: sans },
    headline: 'Your next appointment', body: 'Dr. Pradhan, Thursday 10:30. Bring your last two reports. Parking is free for the first hour.', label: 'Clinic app', bg: '#edf6f2', ink: '#11302a', accent: '#10a37f' },
];

export function fontHref(specs: string[]) {
  const uniq = [...new Set(specs)];
  return `https://fonts.googleapis.com/css2?${uniq.map((s) => `family=${s}`).join('&')}&display=swap`;
}

export function fontHrefs(specs: string[], chunk = 12) {
  const uniq = [...new Set(specs)];
  const out: string[] = [];
  for (let i = 0; i < uniq.length; i += chunk) out.push(fontHref(uniq.slice(i, i + chunk)));
  return out;
}

export function faceCss(f: Face) {
  return `font-family: "${f.family}", ${f.fallback}; font-weight: ${f.weight};${f.italic ? ' font-style: italic;' : ''}${f.tracking ? ` letter-spacing: ${f.tracking};` : ''}${f.upper ? ' text-transform: uppercase;' : ''}`;
}

export function pairingCss(p: Pairing) {
  return `/* ${p.name} · type pairing from Design Lounge by Susan Acharya (acharyasusan.com.np) */
@import url("${fontHref([p.display.spec, p.text.spec])}");

:root {
  --font-display: "${p.display.family}", ${p.display.fallback};
  --font-text: "${p.text.family}", ${p.text.fallback};
}
h1, h2, h3, .display {
  font-family: var(--font-display);
  font-weight: ${p.display.weight};${p.display.italic ? '\n  font-style: italic;' : ''}
  letter-spacing: ${p.display.tracking ?? '-0.02em'};
  line-height: 1;${p.display.upper ? '\n  text-transform: uppercase;' : ''}
}
body {
  font-family: var(--font-text);
  font-weight: ${p.text.weight};
  line-height: 1.55;${p.text.tracking ? `\n  letter-spacing: ${p.text.tracking};` : ''}
}`;
}

export const SCALES = [
  { ratio: 1.125, name: 'Major second', use: 'Dense product UI, dashboards' },
  { ratio: 1.2, name: 'Minor third', use: 'Apps and documentation' },
  { ratio: 1.25, name: 'Major third', use: 'Marketing sites, the safe default' },
  { ratio: 1.333, name: 'Perfect fourth', use: 'Editorial, landing pages' },
  { ratio: 1.414, name: 'Augmented fourth', use: 'Portfolios with big statements' },
  { ratio: 1.5, name: 'Perfect fifth', use: 'Posters and hero-heavy pages' },
  { ratio: 1.618, name: 'Golden ratio', use: 'Display-led brand pages' },
];

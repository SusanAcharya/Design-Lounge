import type { APIRoute } from 'astro';
import { getPieces, AUTHOR, CREDIT_LINE, TYPE_META, CATEGORY_META, STYLE_META } from '../lib/pieces';
import { PAIRINGS } from '../data/type';
import { THEMES } from '../data/themes';
import { ICONS, ICON_CREDIT } from '../data/icons';
import { EASINGS, RECIPES } from '../data/motion';
import { COLLECTIONS, SHELF_GROUPS } from '../data/collections';
import { STARTS, MAP } from '../data/starts';
import { SOURCES, studyPiece } from '../data/website-list';

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || 'https://designlounge.vercel.app').replace(/\/$/, '');
  const pieces = await getPieces();
  const lines = [
    `# Design Lounge`,
    `> A live library of interface design by ${AUTHOR.name} (${AUTHOR.site}).`,
    `> ${CREDIT_LINE}`,
    ``,
    `Humans browse. Coding agents rebuild. Every piece is a self-contained HTML demo plus a markdown brief at /p/<slug>.md.`,
    `Free to use in products. Keep the credit comment. Do not republish the catalogue as a catalogue.`,
    ``,
    `## Skill`,
    `Install with: npx skills add SusanAcharya/Design-Lounge`,
    `The skill ships with the catalogue (palettes, type, briefs). After install, the agent reads those files. It does not need this website to be up.`,
    ``,
    `## How to use this library (agents)`,
    `1. If the project already has a design system, keep it. Take structure and motion from piece briefs. Do not add a second palette.`,
    `2. If the human is starting a product, pick a recipe from /start. Choose one theme, one pairing, one family. Show the theme page, the type page, and each piece demo, and ask once before code. If they said to just build it, skip the question. Write the same links into DESIGN.md as Sources.`,
    `3. Search this file or GET ${base}/api/pieces.json for the closest pieces. If none fit, say so.`,
    `4. Open the brief: ${base}/p/<slug>.md. Rebuild the structure. Map colours onto the locked tokens. Family wins radius, shadow, and density.`,
    `5. Hold the result to the brief's checklist and to one system: same type, icons, spacing, and components on every screen of the pass. Before layout, name who it is for, the decision, the one thing they see first, and the next action. That first thing is the largest type on the view. The next action names the screen it opens. A shop is collection, product, cart, checkout. A tablet uses the tablet recipe.`,
    `6. Open the finished screens at their frame size. Say what you see: the largest type, the one button, and any sentence that would still be true for a different product. A gradient, a default font, three identical cards, and a generic headline fail. Fix them and look again. When the fails are none, make one correction: too loud, too even, too dense, too much chrome, or the wrong noun. Do not call the UI done from the source.`,
    `7. Match the theme to the product. Read bestFor. A clinic is Alpine Clinic. A payroll run is Harbour Ledger. A Nepali personal finance app is Lokta and the Devanagari pairing, recipe personal. A clay shop uses the commerce recipe. Do not lock the first palette because it is first. Name the theme you rejected.`,
    ``,
    `## Map`,
    ...MAP.map((m) => `- ${m.kicker} — ${m.title}: ${base}${m.href}. ${m.blurb}`),
    `- Start a product: ${base}/start`,
    `- Compose a kit (pick palette + type + components, live preview): ${base}/kit`,
    `- Kit brief (raw MD): ${base}/kit/brief/{kind}/{theme}/{pairing}/{family}.md`,
    ``,
    `## Starting a product`,
    `When a human is starting a product or design system, pick the closest recipe and assemble from it. Do not skip the theme and pairing.`,
    ...STARTS.map((s) => `- [${s.title}](${base}/start#${s.id}): theme=${s.theme} pairing=${s.pairing} shelf=${s.shelf} categories=${s.categories.join(',')} pieces=${s.pieces.join(',')}. ${s.when}`),
    ``,
    `## Machine endpoints`,
    `- ${base}/llms.txt`,
    `- ${base}/api/pieces.json`,
    `- ${base}/search.json`,
    `- ${base}/agents`,
    `- ${base}/start`,
    `- ${base}/system`,
    ``,
    `## Sources`,
    `Public sites the screens study. One product, one site. Do not blend two. Do not copy the palette. The locked Lounge theme still wins. A new link in websites.txt shows up at ${base}/sources.`,
    ...SOURCES.map((s) => `- [${s.name}](${s.url}): ${s.line} ${s.studied ? s.take : 'No screen claims this site yet.'}`),
    ``,
    `## Libraries`,
    `- Type pairings (${PAIRINGS.length}): ${base}/type`,
    `- Themes (${THEMES.length}): ${base}/themes`,
    `- Lounge Icons (${ICONS.length}): ${base}/icons — ${ICON_CREDIT}`,
    `- Motion recipes (${RECIPES.length}): ${base}/motion`,
    ``,
    `## Type pairings`,
    ...PAIRINGS.map((p) => `- [${p.name}](${base}/type/${p.id}): ${p.display.family} + ${p.text.family}. ${p.mood} Best for: ${p.bestFor.join(', ')}.`),
    ``,
    `## Themes`,
    ...THEMES.map((t) => `- [${t.name}](${base}/themes/${t.id}): primary ${t.tokens.primary} / secondary ${t.tokens.secondary} / tertiary ${t.tokens.tertiary}. ${t.mood}`),
    ``,
    `## Easings`,
    ...EASINGS.map((e) => `- ${e.name}: ${e.css} — ${e.use}`),
    ``,
    `## Motion recipes`,
    ...RECIPES.map((r) => `- ${r.name}: ${r.property} ${r.from} → ${r.to} in ${r.duration} (${r.easing}). Reduced: ${r.reduced}`),
    ``,
    `## Shelf groups`,
    ...SHELF_GROUPS.map((g) => `- ${g.label}: ${g.blurb} Shelves: ${g.slugs.join(', ')}.`),
    ``,
    `## Collections`,
    ...COLLECTIONS.map((c) => `- [${c.title}](${base}/collections/${c.slug}): ${c.blurb} Pieces: ${c.pieces.join(', ')}.`),
    ``,
    `## Pieces (${pieces.length})`,
    ...pieces.map((p) => {
      const d = p.data;
      return `- [${d.title}](${base}/p/${p.id}) (${p.id}) — ${d.summary} platform:${d.platform} type:${d.type} category:${d.category} styles:${d.styles.join(',')} motion:${d.motion} source:${studyPiece(p, SOURCES).source.id} brief:${base}/p/${p.id}.md demo:${base}/demo/${p.id}.html`;
    }),
    ``,
    `## Categories`,
    ...Object.entries(CATEGORY_META).map(([k, v]) => `- ${v.label} (/c/${k}): ${v.blurb}`),
    ``,
    `## Rooms`,
    ...Object.entries(TYPE_META).map(([k, v]) => `- ${v.label} (/rooms/${k}): ${v.blurb}`),
    ``,
    `## Styles`,
    ...Object.entries(STYLE_META).map(([k, v]) => `- ${v.label} (/styles/${k}): ${v.blurb}`),
    ``,
    `## Author`,
    `${AUTHOR.name} — ${AUTHOR.role}, ${AUTHOR.city}. ${AUTHOR.site} · ${AUTHOR.email}`,
    AUTHOR.links.map((l) => `${l.label}: ${l.href}`).join(' · '),
    ``,
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

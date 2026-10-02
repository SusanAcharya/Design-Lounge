import type { APIRoute } from 'astro';
import { getPieces, AUTHOR, CREDIT_LINE, TYPE_META, CATEGORY_META, STYLE_META } from '../lib/pieces';
import { PAIRINGS } from '../data/type';
import { THEMES } from '../data/themes';
import { ICONS, ICON_CREDIT } from '../data/icons';
import { EASINGS, RECIPES } from '../data/motion';
import { COLLECTIONS, SHELF_GROUPS } from '../data/collections';
import { STARTS, MAP } from '../data/starts';

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || 'https://designlounge.example').replace(/\/$/, '');
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
    `1. If the human is starting a product, send them to /kit to pick a palette, pairing and component family on live web + phone previews — or pick a recipe from /start. Do not invent a system.`,
    `2. Lock tokens from /system: theme, type pairing, icons, motion.`,
    `3. Search this file or GET ${base}/api/pieces.json for the closest pieces.`,
    `4. Open the brief: ${base}/p/<slug>.md. Rebuild to the numbers. Ask the stack once if unnamed.`,
    `5. Hold the result to the brief's acceptance checklist.`,
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
      return `- [${d.title}](${base}/p/${p.id}) (${p.id}) — ${d.summary} platform:${d.platform} type:${d.type} category:${d.category} styles:${d.styles.join(',')} motion:${d.motion} brief:${base}/p/${p.id}.md demo:${base}/demo/${p.id}.html`;
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

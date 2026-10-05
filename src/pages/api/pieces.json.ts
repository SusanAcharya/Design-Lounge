import type { APIRoute } from 'astro';
import { getPieces, numberMap, AUTHOR, CREDIT_LINE } from '../../lib/pieces';
import { PAIRINGS } from '../../data/type';
import { THEMES } from '../../data/themes';
import { ICONS, ICON_CREDIT } from '../../data/icons';
import { EASINGS, DURATIONS, RECIPES } from '../../data/motion';
import { COLLECTIONS, SHELF_GROUPS } from '../../data/collections';
import { STARTS, MAP } from '../../data/starts';
import { KINDS, FAMILIES } from '../../data/kit';
import { SOURCES, studyPiece } from '../../data/website-list';

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || 'https://www.designlounge.live').replace(/\/$/, '');
  const pieces = await getPieces();
  const nums = numberMap(pieces);
  const body = {
    name: 'Design Lounge',
    author: AUTHOR,
    credit: CREDIT_LINE,
    license: 'Free to use in products. Credit appreciated. Do not republish as a catalogue.',
    endpoints: {
      llms: `${base}/llms.txt`,
      pieces: `${base}/api/pieces.json`,
      search: `${base}/search.json`,
      agents: `${base}/agents`,
      system: `${base}/system`,
      start: `${base}/start`,
      kit: `${base}/kit`,
      kitBrief: `${base}/kit/brief/{kind}/{theme}/{pairing}/{family}.md`,
    },
    kit: {
      kinds: KINDS.map((k) => ({ id: k.id, title: k.title, palettes: k.palettes, pairings: k.pairings, families: k.families, pieces: k.pieces })),
      families: FAMILIES.map((f) => ({ id: f.id, name: f.name, radius: f.radius, button: f.button, density: f.density, pieces: f.pieces, rules: f.rules })),
    },
    map: MAP,
    starts: STARTS,
    shelfGroups: SHELF_GROUPS,
    counts: {
      pieces: pieces.length,
      pairings: PAIRINGS.length,
      themes: THEMES.length,
      icons: ICONS.length,
      recipes: RECIPES.length,
      starts: STARTS.length,
      sources: SOURCES.length,
    },
    sources: SOURCES.map((s) => ({
      id: s.id,
      name: s.name,
      url: s.url,
      line: s.line,
      take: s.take,
      studied: s.studied,
      page: `${base}/sources#${s.id}`,
    })),
    pieces: pieces.map((p) => ({
      id: p.id,
      n: nums.get(p.id),
      title: p.data.title,
      summary: p.data.summary,
      platform: p.data.platform,
      type: p.data.type,
      category: p.data.category,
      tags: p.data.tags,
      styles: p.data.styles,
      motion: p.data.motion,
      difficulty: p.data.difficulty,
      featured: p.data.featured,
      published: p.data.published,
      palette: p.data.palette,
      fonts: p.data.fonts,
      url: `${base}/p/${p.id}`,
      brief: `${base}/p/${p.id}.md`,
      demo: `${base}/demo/${p.id}.html`,
      source: studyPiece(p, SOURCES).source.id,
    })),
    pairings: PAIRINGS.map((p) => ({ id: p.id, name: p.name, url: `${base}/type/${p.id}`, display: p.display.family, text: p.text.family, tags: p.tags })),
    themes: THEMES.map((t) => ({ id: t.id, name: t.name, url: `${base}/themes/${t.id}`, tokens: t.tokens, tags: t.tags })),
    icons: { credit: ICON_CREDIT, url: `${base}/icons`, ids: ICONS.map((i) => i.id) },
    motion: { easings: EASINGS, durations: DURATIONS, recipes: RECIPES.map((r) => ({ id: r.id, name: r.name })) },
    collections: COLLECTIONS,
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};

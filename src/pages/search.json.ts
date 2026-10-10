import type { APIRoute } from 'astro';
import { getPieces, numberMap, STYLE_META } from '../lib/pieces';
import { PAIRINGS } from '../data/type';
import { THEMES } from '../data/themes';
import { STARTS, SURFACES, MAP } from '../data/starts';
import { COLLECTIONS } from '../data/collections';
import { SOURCES } from '../data/website-list';

/** Search synonyms: every style's aka words, for a piece from its styles and for a theme or pairing from its tags. */
const aka = (keys: string[]) => [...new Set(keys.flatMap((k) => (STYLE_META as Record<string, { aka: string[] }>)[k]?.aka ?? []))];

export const GET: APIRoute = async () => {
  const pieces = await getPieces();
  const nums = numberMap(pieces);
  const out = [
    ...pieces.map((p) => ({
      id: p.id,
      n: nums.get(p.id),
      title: p.data.title,
      summary: p.data.summary,
      platform: p.data.platform,
      type: p.data.type,
      styles: p.data.styles,
      tags: p.data.tags,
      aka: aka(p.data.styles as string[]),
      category: p.data.category,
    })),
    ...PAIRINGS.map((p) => ({
      id: 'type-' + p.id,
      title: p.name,
      summary: p.mood,
      type: 'pairing',
      tags: p.tags,
      aka: aka(p.tags),
      href: '/type/' + p.id,
    })),
    ...THEMES.map((t) => ({
      id: 'theme-' + t.id,
      title: t.name,
      summary: t.mood,
      type: 'theme',
      tags: t.tags,
      aka: aka(t.tags),
      href: '/themes/' + t.id,
    })),
    { id: 'wada', title: 'A Dictionary of Color Combinations', summary: "Sanzo Wada's 348 colour combinations from the 1930s, as printed. Palettes of two, three, and four colours.", type: 'map', tags: ['colour', 'color', 'palette', 'wada', 'japanese'], href: '/wada' },
    { id: 'kit', title: 'Compose a kit', summary: 'Pick a kind, a palette, a pairing and a family. Get a brief.', type: 'map', href: '/kit' },
    ...SURFACES.map((g) => ({
      id: 'surface-' + g.id,
      title: g.title,
      summary: g.blurb,
      type: 'start',
      tags: [g.id],
      href: '/start#' + g.id,
    })),
    ...STARTS.map((s) => ({
      id: 'start-' + s.id,
      title: s.title,
      summary: s.blurb,
      type: 'start',
      tags: [s.kicker, s.theme, s.pairing],
      href: '/start#' + s.id,
    })),
    ...MAP.map((m) => ({
      id: 'map-' + m.kicker.toLowerCase(),
      title: m.title,
      summary: m.blurb,
      type: 'map',
      href: m.href,
    })),
    ...SOURCES.map((s) => ({
      id: 'source-' + s.id,
      title: s.name,
      summary: s.line,
      type: 'source',
      href: '/sources#' + s.id,
    })),
    ...COLLECTIONS.map((c) => ({
      id: 'shelf-' + c.slug,
      title: c.title,
      summary: c.blurb,
      type: 'shelf',
      href: '/collections/' + c.slug,
    })),
  ];
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};

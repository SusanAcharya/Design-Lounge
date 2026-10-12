import type { APIRoute } from 'astro';
import { getPieces, TYPE_META, PLATFORM_META, STYLE_META, CATEGORY_META } from '../lib/pieces';
import { COLLECTIONS } from '../data/collections';
import { PAIRINGS } from '../data/type';
import { THEMES } from '../data/themes';
import { EXAMPLES, PAIRS } from '../data/examples';

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || 'https://www.designlounge.live').replace(/\/$/, '');
  const pieces = await getPieces();
  const urls = [
    '/', '/browse', '/collections', '/guide', '/about', '/privacy', '/sources', '/rooms', '/platforms', '/styles',
    '/type', '/themes', '/wada', '/icons', '/motion', '/agents', '/sections', '/system', '/start', '/kit', '/examples',
    // The compare page stays out of search until it has a pair to show.
    ...(PAIRS.length ? ['/examples/compare'] : []),
    '/examples/proof',
    ...Object.keys(TYPE_META).map((k) => `/rooms/${k}`),
    ...Object.keys(PLATFORM_META).map((k) => `/platforms/${k}`),
    ...Object.keys(STYLE_META).map((k) => `/styles/${k}`),
    ...Object.keys(CATEGORY_META).map((k) => `/sections/${k}`),
    ...COLLECTIONS.map((c) => `/collections/${c.slug}`),
    ...PAIRINGS.map((p) => `/type/${p.id}`),
    ...THEMES.map((t) => `/themes/${t.id}`),
    ...pieces.map((p) => `/p/${p.id}`),
    ...EXAMPLES.map((e) => `/examples/${e.id}`),
  ];
  // lastmod only where we know it. A piece's page changes when the piece does, so it carries the piece's
  // date. Index pages change with every build, and a date that moves on every deploy teaches Google to
  // ignore lastmod for the whole site, so they carry none.
  const dated = new Map(pieces.map((p) => [`/p/${p.id}`, p.data.published.toISOString().slice(0, 10)]));
  const entry = (u: string) => {
    const d = dated.get(u);
    return `  <url><loc>${base}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`;
  };
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(entry).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};

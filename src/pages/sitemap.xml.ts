import type { APIRoute } from 'astro';
import { getPieces, TYPE_META, PLATFORM_META, STYLE_META } from '../lib/pieces';
import { COLLECTIONS } from '../data/collections';
import { PAIRINGS } from '../data/type';
import { THEMES } from '../data/themes';

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || 'https://designlounge.example').replace(/\/$/, '');
  const pieces = await getPieces();
  const urls = [
    '/', '/browse', '/collections', '/guide', '/about', '/rooms', '/platforms', '/styles',
    '/type', '/themes', '/icons', '/motion', '/agents', '/c', '/system', '/start', '/kit',
    ...Object.keys(TYPE_META).map((k) => `/rooms/${k}`),
    ...Object.keys(PLATFORM_META).map((k) => `/platforms/${k}`),
    ...Object.keys(STYLE_META).map((k) => `/styles/${k}`),
    ...COLLECTIONS.map((c) => `/collections/${c.slug}`),
    ...PAIRINGS.map((p) => `/type/${p.id}`),
    ...THEMES.map((t) => `/themes/${t.id}`),
    ...pieces.map((p) => `/p/${p.id}`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};

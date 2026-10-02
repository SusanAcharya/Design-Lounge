import type { APIRoute } from 'astro';
import { getPieces, numberMap } from '../lib/pieces';

export const GET: APIRoute = async () => {
  const pieces = await getPieces();
  const nums = numberMap(pieces);
  const out = pieces.map((p) => ({
    id: p.id,
    n: nums.get(p.id),
    title: p.data.title,
    summary: p.data.summary,
    platform: p.data.platform,
    type: p.data.type,
    styles: p.data.styles,
    tags: p.data.tags,
  }));
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};

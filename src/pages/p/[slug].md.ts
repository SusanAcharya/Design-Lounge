import type { APIRoute } from 'astro';
import { getPieces, numberMap, creditedBrief, type Piece } from '../../lib/pieces';

export async function getStaticPaths() {
  const pieces = await getPieces();
  const nums = numberMap(pieces);
  return pieces.map((p) => ({ params: { slug: p.id }, props: { piece: p, n: nums.get(p.id) } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { piece, n } = props as { piece: Piece; n?: string };
  return new Response(creditedBrief(piece, n), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};

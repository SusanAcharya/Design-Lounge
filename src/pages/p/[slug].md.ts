import type { APIRoute } from 'astro';
import { getPieces } from '../../lib/pieces';

export async function getStaticPaths() {
  const pieces = await getPieces();
  return pieces.map((p) => ({ params: { slug: p.id }, props: { body: p.body ?? '' } }));
}

export const GET: APIRoute = async ({ props }) => {
  return new Response((props as { body: string }).body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};

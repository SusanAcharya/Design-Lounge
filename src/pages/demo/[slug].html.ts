import type { APIRoute } from 'astro';
import { getPieces, demoSource } from '../../lib/pieces';

export async function getStaticPaths() {
  const pieces = await getPieces();
  return pieces.map((p) => ({ params: { slug: p.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const html = demoSource(params.slug!);
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};

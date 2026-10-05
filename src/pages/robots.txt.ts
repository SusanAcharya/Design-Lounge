import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() || 'https://www.designlounge.live').replace(/\/$/, '');
  const body = `User-agent: *
Allow: /

# Plain-text map for agents and answer engines: ${base}/llms.txt

Sitemap: ${base}/sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

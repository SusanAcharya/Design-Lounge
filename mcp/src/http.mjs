// Design Lounge as a hosted MCP endpoint, over Streamable HTTP, for clients that cannot run a local program
// (Claude.ai and ChatGPT connectors, web IDEs). Stateless: each request gets its own server and transport.
// It serves the library and reviews public URLs. It reads no files, keeps no history, and opens no browser.
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createServer, lib, VERSION } from './tools.mjs';
import { guardNetwork } from './source.mjs';

guardNetwork(true);

const LIMIT = Number(process.env.DESIGN_LOUNGE_RATE || 60); // requests per IP per minute, per instance
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) { hits.set(ip, { n: 1, reset: now + 60_000 }); return false; }
  h.n++;
  if (hits.size > 5000) for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
  return h.n > LIMIT;
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization, mcp-session-id, mcp-protocol-version, last-event-id',
  'access-control-expose-headers': 'mcp-session-id, mcp-protocol-version',
};
const withCors = (res) => { for (const [k, v] of Object.entries(CORS)) res.headers.set(k, v); return res; };
const json = (body, status = 200, extra = {}) => withCors(new Response(JSON.stringify(body, null, 1), { status, headers: { 'content-type': 'application/json', ...extra } }));

/** A person who opens the URL in a browser gets a note on how to connect, not a protocol error. */
function about() {
  return json({
    name: 'Design Lounge MCP',
    version: VERSION,
    endpoint: 'POST this URL with MCP Streamable HTTP',
    library: lib.counts,
    connect: {
      'Claude.ai': 'Settings, Connectors, Add custom connector, then paste this URL',
      'Any MCP client': { type: 'streamable-http', url: 'https://www.designlounge.live/api/mcp' },
      'Local, with the skill, file reviews, and screenshots': 'npx -y design-lounge-mcp@latest',
    },
    site: lib.site,
  });
}

export async function handle(request) {
  if (request.method === 'OPTIONS') return withCors(new Response(null, { status: 204 }));
  if (request.method === 'GET' && !/text\/event-stream/.test(request.headers.get('accept') || '')) return about();
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  if (limited(ip)) return json({ jsonrpc: '2.0', error: { code: -32000, message: `Too many requests. The hosted server allows ${LIMIT} a minute. For unlimited use, run it locally: npx -y design-lounge-mcp@latest` }, id: null }, 429, { 'retry-after': '60' });
  if (request.method !== 'POST') return json({ jsonrpc: '2.0', error: { code: -32000, message: 'This endpoint is stateless: POST each request.' }, id: null }, 405, { allow: 'GET, POST, OPTIONS' });

  const server = createServer({ hosted: true });
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  try {
    return withCors(await transport.handleRequest(request));
  } finally {
    // The response body is fully built (JSON mode), so the pair can go.
    transport.close().catch(() => {});
    server.close().catch(() => {});
  }
}

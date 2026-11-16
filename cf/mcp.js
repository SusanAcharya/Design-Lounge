// The hosted Design Lounge MCP on Cloudflare Workers: https://www.designlounge.live/api/mcp
// The library tools only (start_design, recipes, picks, themes, pairings, families, pieces, icons, Wada, guides).
// Page reviews read other sites and cost the most CPU, so they stay in the local server (npx design-lounge-mcp).
//
// Guards, in the order a request meets them:
// 1. Only GET (a note for browsers), OPTIONS (CORS) and POST. Bodies over 64 KB are refused unread.
// 2. A batch holds at most 10 messages, and every message counts against the rate limit.
// 3. 60 calls a minute per IP, counted across Cloudflare's network by the MCP_RATE binding.
// 4. On the free plan Cloudflare stops the Worker after 100,000 requests a day. That only stops this endpoint;
//    the site is static files and keeps working. Nothing is billed.
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createServer, lib, VERSION } from '../mcp/src/tools.mjs';
import { putBrief, hasBrief } from './fs-shim.js';

const LOCAL = 'npx -y design-lounge-mcp@latest';
const MAX_BODY = 64 * 1024;
const MAX_BATCH = 10;
const PER_MINUTE = 60;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization, mcp-session-id, mcp-protocol-version, last-event-id',
  'access-control-expose-headers': 'mcp-session-id, mcp-protocol-version',
};
const withCors = (res) => { const r = new Response(res.body, res); for (const [k, v] of Object.entries(CORS)) r.headers.set(k, v); return r; };
const json = (body, status = 200, extra = {}) => withCors(new Response(JSON.stringify(body, null, 1), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra } }));
const rpcError = (message, status, extra) => json({ jsonrpc: '2.0', error: { code: -32000, message }, id: null }, status, extra);

function about() {
  return json({
    name: 'Design Lounge MCP',
    version: VERSION,
    endpoint: 'POST this URL with MCP Streamable HTTP',
    tools: 'The library: start_design, get_recipe, pick_direction, check_pick, get_theme, get_pairing, get_family, get_piece, search_pieces, browse_library, get_icons, search_wada, read_guide, name_number. Page reviews run in the local server.',
    limits: `${PER_MINUTE} calls a minute per address, ${MAX_BATCH} messages per batch`,
    library: lib.counts,
    connect: {
      'Claude.ai': 'Settings, Connectors, Add custom connector, then paste this URL',
      'Any MCP client': { type: 'streamable-http', url: 'https://www.designlounge.live/api/mcp' },
      'Local, with page reviews, the skill, and screenshots': LOCAL,
    },
    site: lib.site,
  });
}

/** The MCP code fetches thumbnails and demos from the site. Serve those from this Worker's own files instead of
 *  going out to the network and back in. */
function sameSiteFetch(env) {
  const outside = globalThis.fetch.__outside || globalThis.fetch;
  const host = new URL(lib.site).host;
  const local = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (url.host !== host) return outside(input, init);
    let res = await env.ASSETS.fetch(new Request(url, { method: 'GET' }));
    // Static assets answer /demo/x.html with a redirect to /demo/x. Follow one.
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) res = await env.ASSETS.fetch(new Request(new URL(res.headers.get('location'), url), { method: 'GET' }));
    return res;
  };
  local.__outside = outside;
  globalThis.fetch = local;
}

/** get_piece reads its brief from the skill folder. Fetch the briefs a request will need before it runs. */
async function loadBriefs(messages, env) {
  const ids = new Set();
  for (const m of messages) {
    const id = m?.method === 'tools/call' && m.params?.name === 'get_piece' ? m.params?.arguments?.id : null;
    if (typeof id === 'string' && SLUG.test(id) && id.length <= 80 && lib.pieces.some((p) => p.id === id) && !hasBrief(id)) ids.add(id);
  }
  for (const id of ids) {
    const res = await env.ASSETS.fetch(new Request(`https://assets.local/_mcp/briefs/${id}.md`));
    if (!res.ok) throw new Error(`brief ${id}: ${res.status}`);
    putBrief(id, await res.text());
  }
}

/** One stateless MCP exchange: a fresh server and transport per request, as the SDK expects. */
async function serve(request) {
  const server = createServer({ hosted: true, reviews: false });
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  try { return await transport.handleRequest(request); }
  finally { transport.close().catch(() => {}); server.close().catch(() => {}); }
}

// Warm up while the Worker starts. Cloudflare starts a fresh copy in each city that gets traffic, and the first call
// in a copy pays for parsing the library, building caches and compiling code: 8–35 ms instead of 1–3 ms, over the
// free plan's 10 ms a request. Startup has its own budget, so rehearse each tool once here. Only in-memory calls:
// nothing that fetches (get_piece is called with a slug that does not exist). A failure here only skips the warm-up.
const call = (id, name, args) => ({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } });
const WARM_UP = [
  { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'warm-up', version: '1' } } },
  { jsonrpc: '2.0', id: 2, method: 'tools/list' }, { jsonrpc: '2.0', id: 3, method: 'prompts/list' }, { jsonrpc: '2.0', id: 4, method: 'resources/list' },
  call(5, 'start_design', { request: 'a landing page for an invoicing app' }), call(6, 'get_recipe', { id: 'saas' }),
  call(7, 'pick_direction', { recipe: 'saas', fitting: ['ledger-paper'], name: 'Warm' }),
  call(8, 'check_pick', { recipe: 'saas', direction: 'ledger-paper', hero: 'fintech-invoice-builder' }),
  call(9, 'get_theme', { id: 'harbour-ledger' }), call(10, 'get_pairing', { id: 'lettera' }), call(11, 'get_family', { id: 'editorial' }),
  call(12, 'search_pieces', { query: 'pricing table' }), call(13, 'browse_library', { what: 'themes' }), call(14, 'get_icons', { names: ['search'] }),
  call(15, 'search_wada', { query: 'blue' }), call(16, 'read_guide', { file: 'website.md' }), call(17, 'name_number', { name: 'Warm', count: 1 }),
  call(18, 'get_piece', { id: 'no-such-piece' }),
];
// The SDK's HTTP transport makes a random stream id per request, which Cloudflare forbids at startup, so the warm-up
// calls the server's request handlers directly (the same ones the transport dispatches to) and skips the transport.
async function warmUp() {
  lib.index;
  const server = createServer({ hosted: true, reviews: false }).server;
  const extra = (id) => ({ signal: new AbortController().signal, requestId: id, sendNotification: async () => {}, sendRequest: async () => { throw new Error('warm-up'); } });
  for (const m of WARM_UP) {
    const handler = server._requestHandlers?.get(m.method);
    if (handler) JSON.stringify(await handler(m, extra(m.id)));
  }
}
try { await warmUp(); } catch {}

export async function handleMcp(request, env) {
  if (request.method === 'OPTIONS') return withCors(new Response(null, { status: 204 }));
  if (request.method === 'GET' && !/text\/event-stream/.test(request.headers.get('accept') || '')) return about();
  if (request.method !== 'POST') return rpcError('This endpoint is stateless: POST each request.', 405, { allow: 'GET, POST, OPTIONS' });

  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_BODY) return rpcError(`Request too large. The hosted server takes up to ${MAX_BODY / 1024} KB.`, 413);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return rpcError(`Request too large. The hosted server takes up to ${MAX_BODY / 1024} KB.`, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error: the body is not JSON.' }, id: null }, 400); }
  const messages = Array.isArray(body) ? body : [body];
  if (messages.length > MAX_BATCH) return json({ jsonrpc: '2.0', error: { code: -32600, message: `A batch may hold at most ${MAX_BATCH} messages.` }, id: null }, 400);

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (env.MCP_RATE) {
    for (let i = 0; i < Math.max(1, messages.length); i++) {
      const { success } = await env.MCP_RATE.limit({ key: ip });
      if (!success) return rpcError(`Too many requests. The hosted server allows ${PER_MINUTE} calls a minute. For unlimited use, run it locally: ${LOCAL}`, 429, { 'retry-after': '60' });
    }
  }

  sameSiteFetch(env);
  try { await loadBriefs(messages, env); } catch { return rpcError('A piece brief could not be loaded. Try again in a moment.', 503, { 'retry-after': '5' }); }

  const headers = new Headers(request.headers);
  headers.delete('content-length');
  return withCors(await serve(new Request(request.url, { method: 'POST', headers, body: raw })));
}

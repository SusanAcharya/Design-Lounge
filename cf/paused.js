// The hosted MCP endpoint is paused while it moves off Vercel. MCP clients get a JSON-RPC error that says how to
// run the server locally; a browser is sent to the setup page. This costs a few microseconds per call.
const LOCAL = 'npx -y design-lounge-mcp@latest';
const MESSAGE = `The hosted Design Lounge MCP is paused while it moves to a new host. Run it locally instead: ${LOCAL} (in Claude Code: claude mcp add -s user design-lounge -- ${LOCAL}). Setup for every client: https://www.designlounge.live/agents`;

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, mcp-session-id, mcp-protocol-version, authorization',
};

export function paused({ request }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method === 'GET' && !/text\/event-stream/.test(request.headers.get('accept') || '')) {
    return new Response(null, { status: 302, headers: { location: '/agents', ...CORS } });
  }
  return new Response(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: MESSAGE }, id: null }), {
    status: 503,
    headers: { 'content-type': 'application/json', 'retry-after': '86400', 'cache-control': 'no-store', ...CORS },
  });
}

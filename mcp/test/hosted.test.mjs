import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { handle } from '../src/http.mjs';
import { checkPublicUrl } from '../src/source.mjs';

/** Serve handle() the way Vercel does: a web Request in, a web Response out. */
function serve() {
  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const request = new Request(`http://127.0.0.1${req.url}`, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
    const response = await handle(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}/api/mcp` })));
}

test('the hosted endpoint speaks MCP over HTTP, without the tools that touch a machine', async () => {
  const { server, url } = await serve();
  const client = new Client({ name: 'hosted-test', version: '0' });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(url)));
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name);
    for (const n of ['start_design', 'search_pieces', 'get_piece', 'review_page', 'audit_search', 'suggest_schema']) assert.ok(names.includes(n), n);
    for (const n of ['record_pick', 'install_skill', 'install_browser']) assert.ok(!names.includes(n), `${n} must not be hosted`);
    const review = tools.find((t) => t.name === 'review_page');
    assert.ok(!('path' in review.inputSchema.properties), 'no file paths on the hosted server');
    assert.match(client.getInstructions(), /hosted server/);
    const theme = await client.callTool({ name: 'get_theme', arguments: { id: 'kiln', image: false } });
    assert.match(theme.content[0].text, /--primary: #c9693b/);
    const start = JSON.parse((await client.callTool({ name: 'start_design', arguments: { request: 'a site for my momo counter', history: [{ product: 'X', recipe: 'restaurant', direction: 'garden-supper' }] } })).content[0].text);
    assert.equal(start.recipes[0].id, 'restaurant');
    assert.equal(start.recent.find((r) => r.recipe === 'restaurant').recentLines, 1);
    const html = await client.callTool({ name: 'audit_slop', arguments: { html: '<html><body><h1>Unlock the future of seamless work</h1></body></html>' } });
    assert.match(html.content[0].text, /Words that mean nothing/);
    const local = await client.callTool({ name: 'review_page', arguments: { url: 'http://127.0.0.1:9/' } });
    assert.equal(local.isError, true);
    assert.match(local.content[0].text, /private address|ports 80 and 443/);
  } finally {
    await client.close();
    server.close();
  }
});

test('a browser that opens the URL gets a note on how to connect', async () => {
  const res = await handle(new Request('https://www.designlounge.live/api/mcp', { headers: { accept: 'text/html' } }));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.name, 'Design Lounge MCP');
  assert.equal(res.headers.get('access-control-allow-origin'), '*');
});

test('the network guard refuses private addresses and odd URLs', async () => {
  for (const bad of ['http://localhost/', 'http://127.0.0.1/', 'http://10.0.0.5/', 'http://169.254.169.254/latest/meta-data/', 'http://[::1]/', 'http://192.168.1.1/', 'file:///etc/passwd', 'http://example.com:8080/', 'http://user:pw@example.com/', 'http://metadata.google.internal/']) {
    await assert.rejects(checkPublicUrl(bad), Error, bad);
  }
  assert.equal(await checkPublicUrl('https://www.designlounge.live/'), 'https://www.designlounge.live/');
});

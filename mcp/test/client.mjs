// Drive the server over stdio like an MCP client would. Usage: node test/client.mjs <tool> '<json args>'
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const server = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'server.mjs');
export async function connect(env = {}) {
  const client = new Client({ name: 'lounge-test', version: '0' });
  // The skill install stays off here unless a test asks for it, so a test run never writes to the real home folder.
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [server], env: { ...process.env, DESIGN_LOUNGE_SKILL_INSTALL: 'off', ...env } }));
  return client;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const client = await connect();
  const [tool, json] = process.argv.slice(2);
  if (!tool) { const { tools } = await client.listTools(); console.log(tools.map((t) => t.name).join('\n')); }
  else { const r = await client.callTool({ name: tool, arguments: JSON.parse(json || '{}') }); console.log(r.isError ? 'ERROR ' : '', r.content.map((c) => (c.type === 'image' ? `[image ${c.mimeType}, ${Math.round(c.data.length * 0.75 / 1024)} KB]` : c.text)).join('\n')); }
  await client.close();
}

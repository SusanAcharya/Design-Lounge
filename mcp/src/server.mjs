#!/usr/bin/env node
// Design Lounge as a local MCP server, over stdio. It installs the skill for this user, then serves every tool,
// including the ones that read files, keep the picks history, and open pages in a browser.
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer, lib, VERSION } from './tools.mjs';
import { closeVisuals } from './visual.mjs';
import { ensureUserSkill } from './skill-install.mjs';

// Installing the server installs the skill: clients that load skills then read the whole method before they design.
let skill;
try { skill = ensureUserSkill(lib.dir, { version: VERSION }); }
catch (e) { skill = { status: 'error', note: `Could not install the skill: ${e.message}` }; }
const skillLine = skill.status === 'off' || skill.status === 'error' ? skill.note
  : `The Design Lounge skill is at ${skill.canonical} (${skill.status})${skill.links?.length ? `, linked for ${skill.links.map((l) => l.client).join(', ')}` : ''}.${skill.stale ? ' That copy differs from this server\'s; install_skill with replace: true updates it.' : ''}`;
console.error(`[design-lounge] ${skillLine}`);

const server = createServer({ skillLine });
const transport = new StdioServerTransport();
// When the client goes, close the shared browser and leave, so no Chromium or server is left running.
const shutdown = async () => { await closeVisuals(); process.exit(0); };
transport.onclose = shutdown;
process.stdin.on('end', shutdown);
await server.connect(transport);

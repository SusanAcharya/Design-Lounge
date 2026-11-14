// The Worker behind the site. Files in dist/ are served before this runs, except the paths in run_worker_first:
// /api/mcp and /mcp, the hosted MCP (cf/mcp.js).
import { handleMcp } from './mcp.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/mcp' || pathname === '/mcp') return handleMcp(request, env);
    return env.ASSETS.fetch(request);
  },
};

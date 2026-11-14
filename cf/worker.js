// The Worker behind the site. Files in dist/ are served before this runs, except the paths in run_worker_first.
import { paused } from './paused.js';

export default {
  fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/mcp' || pathname === '/mcp') return paused({ request });
    return env.ASSETS.fetch(request);
  },
};

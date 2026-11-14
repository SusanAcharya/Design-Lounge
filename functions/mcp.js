// /mcp on Cloudflare Pages, the short form of /api/mcp. See cf/paused.js.
import { paused } from '../cf/paused.js';
export const onRequest = paused;

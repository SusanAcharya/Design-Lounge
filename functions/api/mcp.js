// /api/mcp on Cloudflare Pages. See cf/paused.js.
import { paused } from '../../cf/paused.js';
export const onRequest = paused;

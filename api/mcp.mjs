// The hosted Design Lounge MCP endpoint: https://www.designlounge.live/api/mcp
// The server itself is mcp/src/http.mjs. This file only hands Vercel's requests to it.
import { handle } from '../mcp/src/http.mjs';

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
export const OPTIONS = handle;

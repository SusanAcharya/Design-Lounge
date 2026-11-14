// Stands in for modules the hosted MCP Worker cannot run: a browser (playwright) and child processes. The server
// already treats a missing browser as "no screenshots", so these only have to fail when called, never on import.
const unavailable = () => { throw new Error('Not available on the hosted Design Lounge server. Run it locally: npx -y design-lounge-mcp@latest'); };
export const chromium = { launch: async () => unavailable() };
export const execFile = unavailable, spawn = unavailable, exec = unavailable;
export default { chromium, execFile, spawn, exec };

// Draw a theme as a board and a pairing as a specimen, so the agent sees the palette and the faces, not just hex and
// family names. Rendered once in Chromium and cached by the CSS they come from.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cacheDir = () => process.env.DESIGN_LOUNGE_CACHE || path.join(os.homedir(), '.cache', 'design-lounge', 'boards');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let browserPromise = null;
async function browser() {
  browserPromise ??= import('playwright').then((m) => m.chromium.launch()).catch(() => null);
  return browserPromise;
}

/** Close the shared browser. The server calls this when the client goes away, so no Chromium is left running. */
export async function closeVisuals() {
  const b = await browserPromise?.catch(() => null);
  browserPromise = null;
  await b?.close().catch(() => {});
}

async function render(key, html, { width = 640, height = 400, fonts = false } = {}) {
  const file = path.join(cacheDir(), `${key}.jpg`);
  if (fs.existsSync(file)) return fs.readFileSync(file);
  const b = await browser();
  if (!b) return null;
  const page = await b.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  try {
    await page.setContent(html, { waitUntil: fonts ? 'networkidle' : 'load', timeout: 15000 }).catch(() => {});
    if (fonts) await page.evaluate(() => document.fonts?.ready).catch(() => {});
    const buf = await page.screenshot({ type: 'jpeg', quality: 82 });
    fs.mkdirSync(cacheDir(), { recursive: true });
    fs.writeFileSync(file, buf);
    return buf;
  } finally {
    await page.close();
  }
}

const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);

/** The theme's roles on one card: ground, surfaces, ink levels, the one primary, outline, accents, and feedback. */
export function themeBoard(theme) {
  const c = theme.colors;
  const swatch = (name, hex) => `<div class="sw"><i style="background:${hex}"></i><b>${esc(name)}</b><span>${esc(hex)}</span></div>`;
  const html = `<!doctype html><html><head><style>${theme.css}
    * { box-sizing: border-box; margin: 0; }
    body { background: var(--bg); color: var(--ink); font: 14px/1.45 -apple-system, "Helvetica Neue", Arial, sans-serif; padding: 22px; height: 400px; }
    h1 { font-size: 22px; font-weight: 650; letter-spacing: -.01em; }
    .sub { color: var(--ink-2); margin: 2px 0 14px; }
    .row { display: flex; gap: 14px; }
    .card { flex: 1.25; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 16px; }
    .card p { color: var(--ink-2); margin: 6px 0 12px; } .card small { color: var(--ink-3); }
    .btns { display: flex; gap: 8px; margin: 12px 0; }
    .p { background: var(--primary); color: var(--primary-ink); padding: 9px 14px; border-radius: 7px; font-weight: 600; }
    .o { border: 1px solid var(--line-strong); color: var(--ink); padding: 8px 13px; border-radius: 7px; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .chip { padding: 3px 9px; border-radius: 99px; font-size: 12px; font-weight: 600; }
    .grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 10px; align-content: start; }
    .sw { display: grid; grid-template-columns: 22px 1fr; column-gap: 7px; font-size: 11px; line-height: 1.2; }
    .sw i { grid-row: span 2; width: 22px; height: 22px; border-radius: 5px; border: 1px solid var(--line); }
    .sw span { color: var(--ink-3); font-family: ui-monospace, Menlo, monospace; }
    a { color: var(--link); }
  </style></head><body>
    <h1>${esc(theme.name)}</h1><div class="sub">${esc(theme.mode)} · pair: ${esc(theme.pair || 'none')}</div>
    <div class="row">
      <div class="card"><strong>Card on --surface</strong><p>Body text in --ink-2 on the card, with a <a>link</a>.</p>
        <div class="btns"><span class="p">Primary</span><span class="o">Outline</span></div>
        <div class="chips">
          <span class="chip" style="background:var(--secondary);color:var(--secondary-ink)">secondary</span>
          <span class="chip" style="background:var(--tertiary);color:var(--tertiary-ink)">tertiary</span>
          <span class="chip" style="background:var(--success-soft);color:var(--success-on-soft, var(--success))">success</span>
          <span class="chip" style="background:var(--warning-soft);color:var(--warning-on-soft, var(--warning))">warning</span>
          <span class="chip" style="background:var(--danger-soft);color:var(--danger-on-soft, var(--danger))">danger</span>
        </div>
        <p style="margin-top:12px"><small>Muted --ink-3, for captions only</small></p>
      </div>
      <div class="grid">${[['bg', c.bg], ['surface', c.surface], ['ink', c.ink], ['ink-2', c.ink2], ['primary', c.primary], ['primary-soft', c.primarySoft], ['secondary', c.secondary], ['tertiary', c.tertiary], ['line', c.line], ['link', c.link]].filter(([, v]) => v).map(([n, v]) => swatch(n, v)).join('')}</div>
    </div></body></html>`;
  return render(`theme-${theme.id}-${hash(theme.css)}`, html);
}

/** The pairing set as it would be: a display line, a paragraph in the text face, numbers, and the mono if it has one. */
export function pairingSpecimen(p) {
  const num = p.numbers === 'display' ? 'var(--font-display)' : p.numbers === 'mono' && p.mono ? 'var(--font-mono)' : 'var(--font-text)';
  const html = `<!doctype html><html><head><style>${p.css}
    * { margin: 0; box-sizing: border-box; }
    body { background: #f6f3ec; color: #1b1915; padding: 26px 30px; height: 400px; font-family: var(--font-text); }
    .k { font: 600 11px/1 ui-monospace, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; color: #77715f; }
    h1 { font-family: var(--font-display); font-size: 58px; line-height: 1; margin: 12px 0 14px; }
    p { font-size: 17px; line-height: 1.55; max-width: 34em; color: #3d3a33; }
    .n { font-family: ${num}; font-size: 30px; margin-top: 16px; font-variant-numeric: tabular-nums; }
    code { display: block; margin-top: 10px; font-family: var(--font-mono, ui-monospace); font-size: 14px; color: #5b564e; }
  </style></head><body>
    <div class="k">${esc(p.id)} · display ${esc(p.display?.family || '')} · text ${esc(p.text?.family || '')}</div>
    <h1>Twelve seats, folded fresh</h1>
    <p>Body copy sits in the text face at reading size. It should hold a long paragraph without strain, and still look like the same voice as the headline above it.</p>
    <div class="n">Rs 1,284.50 · 47.2% · 07:30</div>
    ${p.mono ? `<code>const order = await kitchen.fold("momo", 12);</code>` : ''}
  </body></html>`;
  return render(`pairing-${p.id}-${hash(p.css)}`, html, { fonts: true });
}

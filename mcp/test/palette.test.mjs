// The sampler against pages whose colours we know: draw them in Chromium, screenshot them, and read the roles back.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { samplePalette, closeSampler, hexToOklab, oklabDistance, contrastRatio } from '../src/palette.mjs';

let browser = null;
try {
  browser = await (await import('playwright')).chromium.launch();
} catch {
  browser = null;
}
const skip = browser ? false : 'Chromium cannot launch';

const light = `<!doctype html><html><body style="margin:0;background:#f6f3ec;color:#1b1915;font:700 96px/1.1 Arial,sans-serif;padding:48px">
  <div style="display:flex;gap:48px;align-items:flex-start">
    <div style="flex:1">
      <h1 style="margin:0 0 32px;font-size:120px">Fold</h1>
      <div style="background:#1b1915;height:60px;width:420px;margin-bottom:32px"></div>
      <span style="display:inline-block;background:#c9693b;color:#ffffff;font-size:40px;padding:28px 56px;border-radius:14px">Order</span>
    </div>
    <div style="flex:1;background:#ffffff;height:520px;border-radius:18px"></div>
  </div></body></html>`;

const dark = `<!doctype html><html><body style="margin:0;background:#0e0f12;color:#e8e6e1;font:700 120px/1.1 Arial,sans-serif;padding:48px">
  <h1 style="margin:0 0 32px">Night</h1>
  <div style="background:#e8e6e1;height:60px;width:520px;margin-bottom:32px"></div>
  <span style="display:inline-block;background:#3b82f6;width:360px;height:110px;border-radius:14px"></span>
  </body></html>`;

async function shot(html, type = 'png') {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  try {
    await page.setContent(html);
    return await page.screenshot({ type, ...(type === 'jpeg' ? { quality: 85 } : {}) });
  } finally {
    await page.close();
  }
}

const near = (got, want, label) => {
  assert.ok(got, `${label} is missing`);
  const d = oklabDistance(got, want);
  assert.ok(d < 0.04, `${label} ${got} is ${d.toFixed(3)} from ${want}`);
};

let lightPng, darkPng, lightJpg;
before(async () => {
  if (skip) return;
  [lightPng, darkPng, lightJpg] = [await shot(light), await shot(dark), await shot(light, 'jpeg')];
});

after(async () => {
  await closeSampler();
  await browser?.close();
});

test('helpers: OKLab and WCAG contrast', () => {
  const [L] = hexToOklab('#ffffff');
  assert.ok(Math.abs(L - 1) < 1e-3);
  assert.ok(Math.abs(hexToOklab('#000000')[0]) < 1e-6);
  assert.equal(oklabDistance('#c9693b', '#c9693b'), 0);
  assert.ok(Math.abs(contrastRatio('#000000', '#ffffff') - 21) < 1e-9);
  assert.ok(Math.abs(contrastRatio('#777777', '#ffffff') - 4.48) < 0.01);
});

test('light page: ground, card, ink and accent', { skip }, async () => {
  const out = await samplePalette(lightPng, 'image/png', { browser });
  assert.equal(out.width, 1280);
  assert.equal(out.height, 800);
  assert.equal(out.roles.mode, 'light');
  near(out.roles.bg, '#f6f3ec', 'bg');
  near(out.roles.surface, '#ffffff', 'surface');
  near(out.roles.ink, '#1b1915', 'ink');
  near(out.roles.accent, '#c9693b', 'accent');
  const shares = out.clusters.map((c) => c.share);
  assert.deepEqual(shares, [...shares].sort((a, b) => b - a));
  assert.ok(out.clusters.every((c) => /^#[0-9a-f]{6}$/.test(c.hex) && c.share >= 0.003));
});

test('dark page: ground, ink and accent', { skip }, async () => {
  const out = await samplePalette(darkPng, 'image/png', { browser });
  assert.equal(out.roles.mode, 'dark');
  near(out.roles.bg, '#0e0f12', 'bg');
  near(out.roles.ink, '#e8e6e1', 'ink');
  near(out.roles.accent, '#3b82f6', 'accent');
});

test('the same image gives the same answer', { skip }, async () => {
  const a = await samplePalette(lightPng, 'image/png', { browser });
  const b = await samplePalette(lightPng, 'image/png', { browser });
  assert.deepEqual(a, b);
});

test('a JPEG screenshot works too', { skip }, async () => {
  const out = await samplePalette(lightJpg, 'image/jpeg', { browser });
  assert.equal(out.roles.mode, 'light');
  near(out.roles.bg, '#f6f3ec', 'bg');
  near(out.roles.ink, '#1b1915', 'ink');
  near(out.roles.accent, '#c9693b', 'accent');
});

test('the sampler launches and closes its own browser when none is given', { skip }, async () => {
  const out = await samplePalette(darkPng, 'image/png');
  assert.equal(out.roles.mode, 'dark');
  await closeSampler();
});

// Renders public/favicon.svg into the PNG and ICO sizes browsers and search engines ask for.
// Run after changing the mark: node scripts/icons.mjs
import fs from 'node:fs';
import { chromium } from 'playwright';

const svg = fs.readFileSync('public/favicon.svg', 'utf8');
// Search results crop the icon to a circle, so the PNGs are full-bleed squares.
const square = svg.replace(/ rx="[\d.]+"/, '');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<canvas></canvas>');

const render = (source, size) =>
  page.evaluate(async ([s, n]) => {
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(s);
    await img.decode();
    const c = document.querySelector('canvas');
    c.width = n; c.height = n;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, n, n);
    ctx.drawImage(img, 0, 0, n, n);
    return c.toDataURL('image/png').split(',')[1];
  }, [source, size]).then((b64) => Buffer.from(b64, 'base64'));

const out = { 'favicon-48.png': 48, 'favicon-96.png': 96, 'icon-192.png': 192, 'icon-512.png': 512, 'apple-touch-icon.png': 180 };
for (const [name, size] of Object.entries(out)) fs.writeFileSync(`public/${name}`, await render(square, size));

const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => render(svg, s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e); header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8); header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
fs.writeFileSync('public/favicon.ico', Buffer.concat([header, ...pngs]));
await browser.close();
console.log('icons:', [...Object.keys(out), 'favicon.ico'].join(', '));

// Converts public/thumbs/*.jpg to .webp and removes the jpg, using headless Chromium's encoder.
// Run after scripts/thumbs.mjs: node scripts/webp.mjs
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const dir = path.resolve('public/thumbs');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jpg'));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<canvas></canvas>');
let before = 0, after = 0;
for (const f of files) {
  const jpg = fs.readFileSync(path.join(dir, f));
  const b64 = await page.evaluate(async (data) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${data}`;
    await img.decode();
    const c = document.querySelector('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/webp', 0.8).split(',')[1];
  }, jpg.toString('base64'));
  const webp = Buffer.from(b64, 'base64');
  fs.writeFileSync(path.join(dir, f.replace(/\.jpg$/, '.webp')), webp);
  fs.unlinkSync(path.join(dir, f));
  before += jpg.length; after += webp.length;
}
await browser.close();
console.log(`${files.length} thumbs: ${(before / 1024).toFixed(0)}KB jpg -> ${(after / 1024).toFixed(0)}KB webp`);

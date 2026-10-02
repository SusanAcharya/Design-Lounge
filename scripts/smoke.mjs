// Drives the built site in headless Chromium and checks the interactive parts work.
import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:4321';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push('console: ' + m.text()); });
let fails = 0;
const check = (name, ok, extra = '') => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${extra ? ' — ' + extra : ''}`); if (!ok) fails++; };

// home
await page.goto(base + '/', { waitUntil: 'networkidle' });
check('home renders hero', await page.locator('h1.display').count() === 1);
check('hero frames loaded', await page.locator('.hero-wall lounge-frame.loaded').count() >= 1);

// palette
await page.keyboard.press('Meta+K');
await page.waitForTimeout(300);
check('⌘K opens palette', await page.locator('#palette:not([hidden])').count() === 1);
await page.keyboard.type('sidebar');
await page.waitForTimeout(400);
const first = await page.locator('.pal-item').first().textContent();
check('palette finds sidebar', /sidebar/i.test(first || ''), first?.trim().slice(0, 60));
await page.keyboard.press('Enter');
await page.waitForURL(/\/p\//);
check('enter navigates to piece', /\/p\//.test(page.url()), page.url());

// piece page
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);
check('stage frame has size', await page.evaluate(() => { const f = document.querySelector('[data-stage] lounge-frame'); return f.clientHeight > 300; }));
check('stage frame loaded', await page.locator('[data-stage] lounge-frame.loaded').count() === 1);
await page.click('[data-copy-brief]');
await page.waitForTimeout(200);
const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => '');
check('copy brief puts markdown on clipboard', /^---\n/.test(clip) || /^# /.test(clip), (clip || '').slice(0, 40).replace(/\n/g, '⏎'));
await page.click('[data-tab="source"]');
check('source tab shows code', await page.locator('#tab-source:not([hidden]) pre').count() >= 1);
await page.keyboard.press(']');
await page.waitForTimeout(500);
check('] goes to next piece', /\/p\//.test(page.url()));

// theme
await page.goto(base + '/browse', { waitUntil: 'networkidle' });
const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
await page.click('[data-theme-toggle]');
await page.waitForTimeout(700);
const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
check('theme toggles', before !== after, `${before} → ${after}`);

// filters
const total = await page.locator('[data-grid] .card').count();
await page.click('.chip[data-f="platform"][data-v="web"]');
await page.waitForTimeout(200);
const shown = await page.locator('[data-grid] .card:not([hidden])').count();
check('platform filter narrows', shown < total && shown > 0, `${shown}/${total}`);
check('url carries filter', /platform=web/.test(page.url()), page.url());
await page.fill('[data-q]', 'sidebar');
await page.waitForTimeout(200);
const q = await page.locator('[data-grid] .card:not([hidden])').count();
check('text filter narrows further', q <= shown && q >= 1, String(q));
await page.click('[data-view="list"]');
check('list view toggles', await page.locator('[data-grid].list').count() === 1);
await page.click('[data-clear]:not([hidden])');
await page.waitForTimeout(200);
check('clear restores all', await page.locator('[data-grid] .card:not([hidden])').count() === total);

// random + 404
await page.goto(base + '/random');
await page.waitForURL(/\/p\//, { timeout: 5000 }).catch(() => {});
check('random redirects to a piece', /\/p\//.test(page.url()), page.url());
const r = await page.goto(base + '/p/does-not-exist');
check('404 page served', r.status() === 404 || (await page.locator('text=That seat is').count()) === 1, String(r.status()));
errors.length = 0; // the 404 above is expected

// mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + '/', { waitUntil: 'networkidle' });
check('no horizontal overflow on mobile home', await page.evaluate(() => document.documentElement.scrollWidth <= 391), await page.evaluate(() => document.documentElement.scrollWidth));
await page.click('[data-menu-toggle]');
check('mobile menu opens', await page.locator('#mobile-nav:not([hidden])').count() === 1);
await page.goto(base + '/browse', { waitUntil: 'networkidle' });
check('no horizontal overflow on mobile browse', await page.evaluate(() => document.documentElement.scrollWidth <= 391));

if (errors.length) { console.log('\nPage errors:'); console.log(errors.join('\n')); fails++; }
console.log(`\n${fails ? fails + ' failure(s)' : 'all checks passed'}`);
await browser.close();
process.exit(fails ? 1 : 0);

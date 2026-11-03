// Tell IndexNow engines (Bing, which feeds ChatGPT search and Copilot, plus Yandex, Seznam and Naver) which pages
// changed. Run after a deploy: node scripts/indexnow.mjs [base-ref]. With no ref it diffs HEAD~1..HEAD. A change to a
// piece brief or demo submits that piece's page; any other change under src/ submits the main pages. The key file
// lives at public/<key>.txt, which is how the engines check the site is ours.
import { execFileSync } from 'node:child_process';

const KEY = 'dab81e8b9d423644c73e7388ab80fe65';
const HOST = 'www.designlounge.live';
const MAIN = ['/', '/browse', '/start', '/sections', '/system', '/examples', '/benchmark', '/about', '/agents', '/llms.txt'];

const base = process.argv[2] || 'HEAD~1';
let changed = [];
try { changed = execFileSync('git', ['diff', '--name-only', base, 'HEAD'], { encoding: 'utf8' }).split('\n').filter(Boolean); }
catch { changed = ['src/']; }

const urls = new Set();
for (const f of changed) {
  const piece = f.match(/^src\/(?:content\/pieces|demos)\/(.+)\.(?:md|html)$/);
  if (piece) urls.add(`/p/${piece[1]}`);
  else if (f.startsWith('src/') || f.startsWith('public/built/')) MAIN.forEach((u) => urls.add(u));
}
if (!urls.size) { console.log('IndexNow: nothing to submit.'); process.exit(0); }

const urlList = [...urls].map((u) => `https://${HOST}${u}`);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
if (res.status >= 400 && res.status !== 429) process.exit(1);

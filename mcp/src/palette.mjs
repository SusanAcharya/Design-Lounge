// Read a screenshot of a website and name its colours: the page ground, a surface, the ink levels and the accents.
// Chromium decodes the image (PNG, JPEG or WebP, no image package needed); the clustering runs here in Node, in OKLab,
// so near colours are near to the eye and not just in RGB.

let browserPromise = null;
async function browser() {
  browserPromise ??= import('playwright').then((m) => m.chromium.launch()).catch(() => null);
  return browserPromise;
}

/** Close the sampler's own browser, if it launched one. A browser passed in by the caller is left alone. */
export async function closeSampler() {
  const b = await browserPromise?.catch(() => null);
  browserPromise = null;
  await b?.close().catch(() => {});
}

// sRGB to OKLab (Björn Ottosson). The 8-bit channel to linear light step is a table.
const LIN = new Float64Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  LIN[i] = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function rgbToOklab(r, g, b) {
  const lr = LIN[r], lg = LIN[g], lb = LIN[b];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

function parseHex(hex) {
  let h = String(hex).trim().replace(/^#/, '');
  if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  if (!/^[0-9a-f]{6}/i.test(h) || Number.isNaN(n)) throw new Error(`Not a hex colour: ${hex}`);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** A hex colour as OKLab [L, a, b], L from 0 to 1. */
export function hexToOklab(hex) {
  return rgbToOklab(...parseHex(hex));
}

/** Euclidean distance between two OKLab colours (arrays, or hex strings). About 0.02 is a just-visible step. */
export function oklabDistance(a, b) {
  const p = typeof a === 'string' ? hexToOklab(a) : a;
  const q = typeof b === 'string' ? hexToOklab(b) : b;
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

const luminance = (hex) => {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * LIN[r] + 0.7152 * LIN[g] + 0.0722 * LIN[b];
};

/** WCAG contrast ratio between two hex colours, from 1 to 21. */
export function contrastRatio(hexA, hexB) {
  const a = luminance(hexA), b = luminance(hexB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// A small seeded generator, so the same image always seeds k-means the same way.
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Draw the image on a canvas with the long side near `size` and hand back its pixels.
async function decode(b, buffer, mimeType, size) {
  const page = await b.newPage();
  try {
    await page.setContent('<!doctype html><html><body></body></html>');
    const url = `data:${mimeType || 'image/png'};base64,${Buffer.from(buffer).toString('base64')}`;
    return await page.evaluate(async ({ url, size }) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      const scale = Math.min(1, size / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      // Base64 keeps the transfer small; a plain array of 200k numbers is slow to serialise.
      const bytes = ctx.getImageData(0, 0, w, h).data;
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return { width: img.naturalWidth, height: img.naturalHeight, w, h, data: btoa(bin) };
    }, { url, size });
  } finally {
    await page.close().catch(() => {});
  }
}

// k-means in OKLab with k-means++ seeding. Returns a label per point and the centres.
function kmeans(pts, n, k, iterations, rand) {
  const centres = [];
  const first = Math.floor(rand() * n);
  centres.push([pts[first * 3], pts[first * 3 + 1], pts[first * 3 + 2]]);
  const d2 = new Float64Array(n).fill(Infinity);
  while (centres.length < k) {
    const c = centres[centres.length - 1];
    let total = 0;
    for (let i = 0; i < n; i++) {
      const dl = pts[i * 3] - c[0], da = pts[i * 3 + 1] - c[1], db = pts[i * 3 + 2] - c[2];
      const d = dl * dl + da * da + db * db;
      if (d < d2[i]) d2[i] = d;
      total += d2[i];
    }
    if (total === 0) break; // fewer distinct colours than k
    let r = rand() * total, pick = n - 1;
    for (let i = 0; i < n; i++) {
      r -= d2[i];
      if (r <= 0) { pick = i; break; }
    }
    centres.push([pts[pick * 3], pts[pick * 3 + 1], pts[pick * 3 + 2]]);
  }
  const labels = new Int32Array(n);
  for (let it = 0; it < iterations; it++) {
    const sum = centres.map(() => [0, 0, 0, 0]);
    let moved = 0;
    for (let i = 0; i < n; i++) {
      let best = 0, bestD = Infinity;
      for (let j = 0; j < centres.length; j++) {
        const c = centres[j];
        const dl = pts[i * 3] - c[0], da = pts[i * 3 + 1] - c[1], db = pts[i * 3 + 2] - c[2];
        const d = dl * dl + da * da + db * db;
        if (d < bestD) { bestD = d; best = j; }
      }
      if (labels[i] !== best) moved++;
      labels[i] = best;
      const s = sum[best];
      s[0] += pts[i * 3]; s[1] += pts[i * 3 + 1]; s[2] += pts[i * 3 + 2]; s[3]++;
    }
    sum.forEach((s, j) => { if (s[3]) centres[j] = [s[0] / s[3], s[1] / s[3], s[2] / s[3]]; });
    if (it > 0 && moved === 0) break;
  }
  return { labels, centres };
}

const LOW_CHROMA = 0.05;
const ACCENT_CHROMA = 0.06;

// Name the roles from the clusters. `edge` is each cluster's share of the border band.
function nameRoles(clusters) {
  if (!clusters.length) return { mode: 'light', bg: null, surface: null, ink: null, ink2: null, accent: null, accent2: null };
  const bg = clusters.reduce((a, c) => (c.edge > a.edge || (c.edge === a.edge && c.share > a.share) ? c : a));
  const neutral = (c) => c.chroma < LOW_CHROMA;
  const rest = clusters.filter((c) => c !== bg);

  const surface = rest
    .filter((c) => neutral(c) && c.share >= 0.02 && Math.abs(c.l - bg.l) < 0.12 && oklabDistance(c.lab, bg.lab) >= 0.02)
    .sort((a, b) => b.share - a.share)[0] || null;

  const texts = rest.filter((c) => c !== surface && neutral(c) && c.share >= 0.005)
    .map((c) => ({ c, cr: contrastRatio(c.hex, bg.hex) }))
    .sort((a, b) => b.cr - a.cr);
  const ink = texts[0] && texts[0].cr >= 3 ? texts[0] : null;
  const ink2 = ink && texts
    .filter((t) => t !== ink && t.cr >= 3 && t.cr < ink.cr * 0.8 && oklabDistance(t.c.lab, ink.c.lab) > 0.08)
    .sort((a, b) => b.c.share - a.c.share)[0];

  const chromatic = rest.filter((c) => c !== surface && c.chroma >= ACCENT_CHROMA && c.share >= 0.004)
    .sort((a, b) => b.chroma - a.chroma);
  const accent = chromatic[0] || null;
  const accent2 = accent && chromatic.find((c) => c !== accent && oklabDistance(c.lab, accent.lab) > 0.1);

  return {
    mode: bg.l < 0.5 ? 'dark' : 'light',
    bg: bg.hex,
    surface: surface?.hex ?? null,
    ink: ink?.c.hex ?? null,
    ink2: ink2?.c.hex ?? null,
    accent: accent?.hex ?? null,
    accent2: accent2?.hex ?? null,
  };
}

/**
 * Find the palette of a screenshot and the roles a designer would name. Returns { width, height, clusters, roles },
 * or null when Chromium is not available. Pass `browser` to reuse a Playwright browser you already have.
 */
export async function samplePalette(buffer, mimeType, { k = 8, size = 240, iterations = 15, seed = 0x5eed, browser: given } = {}) {
  const b = given || await browser();
  if (!b) return null;
  const img = await decode(b, buffer, mimeType, size);
  const rgba = Buffer.from(img.data, 'base64');
  const { w, h } = img;

  // Opaque pixels as OKLab, with their sRGB kept for the representative colour and a flag for the border band.
  const band = Math.max(2, Math.round(Math.min(w, h) * 0.04));
  const pts = new Float64Array(w * h * 3);
  const rgb = new Uint8Array(w * h * 3);
  const edge = new Uint8Array(w * h);
  let n = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      if (rgba[o + 3] === 0) continue;
      const lab = rgbToOklab(rgba[o], rgba[o + 1], rgba[o + 2]);
      pts.set(lab, n * 3);
      rgb.set([rgba[o], rgba[o + 1], rgba[o + 2]], n * 3);
      edge[n] = x < band || y < band || x >= w - band || y >= h - band ? 1 : 0;
      n++;
    }
  }
  const empty = { mode: 'light', bg: null, surface: null, ink: null, ink2: null, accent: null, accent2: null };
  if (!n) return { width: img.width, height: img.height, clusters: [], roles: empty };

  const { labels, centres } = kmeans(pts, n, Math.max(1, k), iterations, mulberry32(seed));

  // Merge clusters that sit almost on top of each other, by pointing one label at another.
  const count = new Float64Array(centres.length);
  for (let i = 0; i < n; i++) count[labels[i]]++;
  const root = centres.map((_, j) => j);
  const find = (j) => (root[j] === j ? j : (root[j] = find(root[j])));
  const order = centres.map((_, j) => j).sort((a, b) => count[b] - count[a]);
  for (let x = 0; x < order.length; x++) {
    for (let y = x + 1; y < order.length; y++) {
      const a = find(order[x]), c = find(order[y]);
      if (a !== c && count[order[y]] && oklabDistance(centres[order[x]], centres[order[y]]) < 0.03) root[c] = a;
    }
  }

  // Per merged cluster: share, border share, and a representative colour. The representative is the mean of the
  // fullest 5-bit RGB bin, so a flat fill reads as itself and not as a blend pulled by anti-aliased edges.
  const groups = new Map();
  let edgeTotal = 0;
  for (let i = 0; i < n; i++) {
    const g = find(labels[i]);
    let s = groups.get(g);
    if (!s) groups.set(g, (s = { count: 0, edge: 0, bins: new Map() }));
    s.count++;
    if (edge[i]) { s.edge++; edgeTotal++; }
    const r = rgb[i * 3], gr = rgb[i * 3 + 1], bl = rgb[i * 3 + 2];
    const key = ((r >> 3) << 10) | ((gr >> 3) << 5) | (bl >> 3);
    const bin = s.bins.get(key);
    if (bin) { bin[0] += r; bin[1] += gr; bin[2] += bl; bin[3]++; } else s.bins.set(key, [r, gr, bl, 1]);
  }

  const clusters = [];
  for (const s of groups.values()) {
    const share = s.count / n;
    if (share < 0.003) continue;
    let top = null;
    for (const bin of s.bins.values()) if (!top || bin[3] > top[3]) top = bin;
    const hex = toHex(top[0] / top[3], top[1] / top[3], top[2] / top[3]);
    const lab = hexToOklab(hex);
    clusters.push({ hex, share, l: lab[0], chroma: Math.hypot(lab[1], lab[2]), lab, edge: edgeTotal ? s.edge / edgeTotal : 0 });
  }
  clusters.sort((a, b) => b.share - a.share || (a.hex < b.hex ? -1 : 1));

  const roles = nameRoles(clusters);
  const r4 = (v) => Math.round(v * 10000) / 10000;
  return {
    width: img.width,
    height: img.height,
    clusters: clusters.map((c) => ({ hex: c.hex, share: r4(c.share), l: r4(c.l), chroma: r4(c.chroma) })),
    roles,
  };
}

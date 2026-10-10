/**
 * Sanzo Wada's A Dictionary of Color Combinations: 159 colours, 348 combinations.
 * The data is src/data/wada.json, built by scripts/wada.py. Shared by /wada, the themes, and the skill.
 */
import WADA from './wada.json' with { type: 'json' };

export interface WadaColour { n: number; name: string; slug: string; cmyk: number[]; hex: string }
export interface WadaCombination {
  id: number;
  colours: WadaColour[];
  /** Mean lightness of the set: light, mid, or dark. */
  tone: 'light' | 'mid' | 'dark';
  /** Mixed: strong warm and strong cool together, such as orange on blue. */
  temp: 'warm' | 'cool' | 'mixed' | 'neutral';
  /** The highest contrast ratio between any two of its colours. 4.5 or more means one can be text on another. */
  best: number;
}

export const WADA_COLOURS: WadaColour[] = WADA.colours;
export const WADA_META = { title: WADA.title, author: WADA.author, note: WADA.note, data: WADA.data };

function channels(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
}

function luminance(hex: string) {
  const [r, g, b] = channels(hex).map((s) => (s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function wadaContrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** CIE L*, 0 to 100. */
export function lightness(hex: string) {
  const y = luminance(hex);
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
}

/** Warm reds to yellows, cool greens to violets, weighted by saturation so greys do not vote. */
function temperature(hexes: string[]): WadaCombination['temp'] {
  let warm = 0;
  let cool = 0;
  for (const hex of hexes) {
    const [r, g, b] = channels(hex);
    const max = Math.max(r, g, b);
    const chroma = max - Math.min(r, g, b);
    if (chroma < 0.12) continue;
    let h = max === r ? ((g - b) / chroma) % 6 : max === g ? (b - r) / chroma + 2 : (r - g) / chroma + 4;
    h = (h * 60 + 360) % 360;
    if (h < 75 || h >= 330) warm += chroma;
    else if (h >= 150 && h < 290) cool += chroma;
  }
  if (warm >= 0.35 && cool >= 0.35) return 'mixed';
  if (warm - cool > 0.25) return 'warm';
  if (cool - warm > 0.25) return 'cool';
  return 'neutral';
}

export const WADA_COMBINATIONS: WadaCombination[] = WADA.combinations.map((ns, i) => {
  const colours = ns.map((n) => WADA_COLOURS[n - 1]);
  const hexes = colours.map((c) => c.hex);
  const mean = hexes.reduce((sum, h) => sum + lightness(h), 0) / hexes.length;
  let best = 1;
  for (const a of hexes) for (const b of hexes) best = Math.max(best, wadaContrast(a, b));
  return {
    id: i + 1,
    colours,
    tone: mean >= 72 ? 'light' : mean <= 45 ? 'dark' : 'mid',
    temp: temperature(hexes),
    best: Math.round(best * 10) / 10,
  };
});

export function wadaCombination(id: number) {
  return WADA_COMBINATIONS[id - 1];
}

/** Combinations that use this colour, by its number in the book. */
export function wadaUses(n: number) {
  return WADA_COMBINATIONS.filter((c) => c.colours.some((x) => x.n === n));
}

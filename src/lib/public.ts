import { readFileSync } from 'node:fs';
import path from 'node:path';

// A file in public/, for checks at build time. Astro runs the build from the project root, and the bundler moves
// compiled pages elsewhere, so a path relative to import.meta.url no longer points at public/.
export const publicFile = (rel: string) => path.join(process.cwd(), 'public', rel);

/** Width and height of a PNG, JPEG, or WebP in public/, read from its header. Null when it cannot be read. */
export function imageSize(url: string): { width: number; height: number } | null {
  let buf: Buffer;
  try { buf = readFileSync(publicFile(url.replace(/^\//, ''))); } catch { return null; }
  if (buf.length < 30) return null;
  if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const kind = buf.toString('ascii', 12, 16);
    if (kind === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (kind === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L') { const b = buf.readUInt32LE(21); return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 }; }
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

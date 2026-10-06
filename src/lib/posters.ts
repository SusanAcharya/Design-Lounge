import { existsSync } from 'node:fs';

const PHONE = new Set(['mobile-web', 'mobile-app', 'pwa']);
const has = (file: string) => existsSync(new URL(`../../public/thumbs/${file}`, import.meta.url));

// The image a library card shows: a crop around small pieces, the whole screen otherwise.
// Phone screens are tall, so the card shows them whole instead of cropping to the top.
export function cardPoster(id: string, platform: string): { src: string; tall: boolean } {
  if (has(`${id}-card.webp`)) return { src: `/thumbs/${id}-card.webp`, tall: false };
  if (has(`${id}.webp`)) return { src: `/thumbs/${id}.webp`, tall: PHONE.has(platform) };
  return { src: '', tall: false };
}

// The image a device frame shows while its demo loads: always the whole screen.
export function framePoster(id: string): string {
  return has(`${id}.webp`) ? `/thumbs/${id}.webp` : '';
}

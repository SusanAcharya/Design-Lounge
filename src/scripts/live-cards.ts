// Hovering a card on a desktop plays its live demo in place of the poster, so the library can be tried before it is opened.
// One demo at a time: it is made after a short rest on the card and removed when the pointer leaves.
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const still = matchMedia('(prefers-reduced-motion: reduce)');
const PHONE = new Set(['mobile-web', 'mobile-app', 'pwa']);
const VIEW: Record<string, [number, number]> = { web: [1280, 960], tablet: [1180, 885] };
const REST = 280;

let live: { card: HTMLElement; frame?: HTMLIFrameElement; timer: number } | null = null;

const slugOf = (card: HTMLElement) => card.dataset.slug || card.querySelector('a.cover')?.getAttribute('href')?.split('/p/')[1] || '';
const quiet = () => !fine.matches || still.matches || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

function place(plate: HTMLElement, frame: HTMLIFrameElement, w: number, h: number, phone: boolean) {
  const r = plate.getBoundingClientRect();
  const s = phone ? (r.height * 0.88) / h : r.width / w;
  frame.style.setProperty('--s', String(s));
  frame.style.left = `${(r.width - w * s) / 2}px`;
  frame.style.top = phone ? `${r.height * 0.06}px` : '0px';
  if (phone) frame.style.borderRadius = `${10 / s}px`;
}

function play(card: HTMLElement) {
  const slug = slugOf(card);
  const plate = card.querySelector<HTMLElement>('.plate');
  if (!slug || !plate) return;
  const platform = card.dataset.platform || 'web';
  const phone = PHONE.has(platform);
  const [w, h] = phone ? [390, 844] : VIEW[platform] || VIEW.web;
  const frame = document.createElement('iframe');
  frame.className = 'live';
  frame.title = 'Live demo';
  frame.tabIndex = -1;
  frame.setAttribute('aria-hidden', 'true');
  frame.width = String(w);
  frame.height = String(h);
  place(plate, frame, w, h, phone);
  frame.addEventListener('load', () => frame.classList.add('on'), { once: true });
  frame.src = import.meta.env.DEV ? `/demo/${slug}.html` : `/demo/${slug}`;
  plate.appendChild(frame);
  if (live?.card === card) live.frame = frame;
}

function stop() {
  if (!live) return;
  window.clearTimeout(live.timer);
  const frame = live.frame;
  live = null;
  if (!frame) return;
  frame.classList.remove('on');
  window.setTimeout(() => frame.remove(), 180);
}

document.addEventListener('pointerover', (e) => {
  if (quiet()) return;
  const card = (e.target as Element).closest<HTMLElement>('.card');
  if (!card || !card.querySelector('.plate') || card === live?.card) return;
  stop();
  live = { card, timer: window.setTimeout(() => play(card), REST) };
});

document.addEventListener('pointerout', (e) => {
  if (!live) return;
  const to = e.relatedTarget as Node | null;
  if (to && live.card.contains(to)) return;
  // Moving into the demo's own frame reports no target in some browsers; the pointer is still over the card.
  const r = live.card.getBoundingClientRect();
  if (!to && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) return;
  stop();
});

addEventListener('pagehide', stop);

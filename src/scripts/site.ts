// Site-wide behaviour: theme, mobile menu, keyboard shortcuts, copy buttons, random.
const root = document.documentElement;

function setTheme(t: 'day' | 'night', origin?: { x: number; y: number }) {
  const apply = () => { root.setAttribute('data-theme', t); try { localStorage.setItem('dl-theme', t); } catch {} };
  const d = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!d.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
  const vt = d.startViewTransition(apply);
  if (origin) {
    vt.ready.then(() => {
      const r = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
      root.animate({ clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${r}px at ${origin.x}px ${origin.y}px)`] },
        { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
  }
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
  b.addEventListener('click', (e) => {
    const next = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
    const r = b.getBoundingClientRect();
    setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    void e;
  });
});

const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.getElementById('mobile-nav');
menuBtn?.addEventListener('click', () => {
  const open = menu!.hasAttribute('hidden');
  if (open) menu!.removeAttribute('hidden'); else menu!.setAttribute('hidden', '');
  menuBtn.setAttribute('aria-expanded', String(open));
});

// Random piece: use the search index so the link works without a server.
async function randomPiece() {
  try {
    const res = await fetch('/search.json'); const list = await res.json();
    const cur = location.pathname.replace(/^\/p\//, '');
    const pool = list.filter((p: { id: string }) => p.id !== cur);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    location.href = '/p/' + pick.id;
  } catch { location.href = '/browse'; }
}
document.querySelectorAll('[data-random]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); randomPiece(); }));

// Copy buttons: data-copy="#id" copies that element's JSON/text payload
async function copyText(text: string, btn: HTMLElement) {
  try { await navigator.clipboard.writeText(text); } catch {
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  const label = btn.querySelector('[data-label]') || btn;
  const orig = label.textContent;
  btn.setAttribute('data-done', '');
  label.textContent = btn.dataset.doneLabel || 'Copied';
  setTimeout(() => { btn.removeAttribute('data-done'); label.textContent = orig; }, 1600);
}
export function payload(sel: string): string {
  const el = document.querySelector(sel);
  if (!el) return '';
  if (el.tagName === 'SCRIPT') { try { return JSON.parse(el.textContent || '""'); } catch { return el.textContent || ''; } }
  return el.textContent || '';
}
document.querySelectorAll<HTMLElement>('[data-copy]').forEach((b) => {
  b.addEventListener('click', () => copyText(payload(b.dataset.copy!), b));
});

// Global keys
addEventListener('keydown', (e) => {
  const tag = (e.target as HTMLElement).tagName;
  const typing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.dispatchEvent(new CustomEvent('palette:toggle')); return; }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === '/') { e.preventDefault(); document.dispatchEvent(new CustomEvent('palette:open')); }
  else if (e.key === 'r' && !e.shiftKey) { randomPiece(); }
  else if (e.key === 't' && !e.shiftKey) { setTheme(root.getAttribute('data-theme') === 'night' ? 'day' : 'night'); }
  else if (e.key === '[') { (document.querySelector('[data-prev]') as HTMLAnchorElement | null)?.click(); }
  else if (e.key === ']') { (document.querySelector('[data-next]') as HTMLAnchorElement | null)?.click(); }
  else if (e.key === 'c' && !e.shiftKey) { (document.querySelector('[data-copy-brief]') as HTMLButtonElement | null)?.click(); }
});

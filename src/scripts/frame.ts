// <lounge-frame>: scales a device mock (with its iframe) to fit its box, lazy-loads the demo,
// and lets web pieces switch between desktop, tablet and phone viewports.
type View = 'auto' | 'desktop' | 'tablet' | 'phone';
type Frame = 'web' | 'phone' | 'tablet';
type Geo = { frame: Frame; orient?: 'portrait' | 'landscape'; w: number; h: number; padX: number; padY: number };

const GEO: Record<string, Geo> = {
  desktop:            { frame: 'web',    w: 1280, h: 878,  padX: 0, padY: 0 },
  phone:              { frame: 'phone',  w: 414,  h: 868,  padX: 6, padY: 0 },
  'tablet-landscape': { frame: 'tablet', orient: 'landscape', w: 1216, h: 856,  padX: 0, padY: 0 },
  'tablet-portrait':  { frame: 'tablet', orient: 'portrait',  w: 856,  h: 1276, padX: 0, padY: 0 },
};
const VIEWS: View[] = ['auto', 'desktop', 'tablet', 'phone'];
const TINY = 0.3;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
// Demos start on the reader's first scroll, tap or key press, or after a quiet wait once the page has painted;
// the poster covers the wait. `load` fires long before first paint on a slow phone, and each demo pulls its own
// fonts, so waiting for `load` alone let four iframes and their font requests compete with the page's own first
// paint. The wait is a plain timer, not an idle callback: an idle callback fires at the same moment a browser
// (or Lighthouse) decides the page is settled and may leave it, and a frame mid-navigation at that moment keeps
// the page out of the back/forward cache. Only the page's own scroll counts as input: the piece rail scrolls
// itself to the current piece on load, and that element scroll reaches this capture listener before first paint.
const QUIET_WAIT = 7000;
const INPUT = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
const pageReady = new Promise<void>((res) => {
  let started = false;
  const start = (e?: Event) => {
    if (started || (e?.type === 'scroll' && e.target !== document && e.target !== window)) return;
    started = true;
    for (const t of INPUT) removeEventListener(t, start, true);
    res();
  };
  for (const t of INPUT) addEventListener(t, start, { capture: true, passive: true });
  const painted = () => setTimeout(() => start(), QUIET_WAIT);
  if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('paint')) {
    const po = new PerformanceObserver((list) => {
      if (list.getEntriesByName('first-contentful-paint').length) { po.disconnect(); painted(); }
    });
    po.observe({ type: 'paint', buffered: true });
  } else if (document.readyState === 'complete') painted();
  else addEventListener('load', painted, { once: true });
});

class LoungeFrame extends HTMLElement {
  static observedAttributes = ['data-view'];
  device!: HTMLElement;
  iframe!: HTMLIFrameElement;
  dw = 0; dh = 0;
  padX = 0; padY = 0;
  zoom = 1;
  view: View = 'auto';
  ro?: ResizeObserver;
  io?: IntersectionObserver;
  raf = 0;
  anim = 0;
  ready = false;
  wanted = false;

  get views(): View[] { return (this.dataset.views || this.dataset.native || 'desktop').split(',').map((v) => v.trim()) as View[]; }
  get nativeView(): View { return (this.dataset.native as View) || ({ web: 'desktop', phone: 'phone', tablet: 'tablet' } as const)[(this.dataset.frame as Frame) || 'web']; }

  connectedCallback() {
    this.device = this.querySelector('.lf-device') as HTMLElement;
    this.iframe = this.querySelector('iframe') as HTMLIFrameElement;
    this.ready = true;
    this.apply(this.resolve((this.dataset.view as View) || 'auto'));
    this.ro = new ResizeObserver(() => this.schedule());
    this.ro.observe(this);
    this.layout();
    this.iframe.addEventListener('load', this.onLoad);
    if (this.dataset.lazy !== 'true') this.load();
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) this.load();
          else this.unload();
        }
      }, { rootMargin: '800px 0px' });
      this.io.observe(this);
    } else if (this.dataset.lazy === 'true') {
      this.load();
    }
  }
  disconnectedCallback() { this.ro?.disconnect(); this.io?.disconnect(); cancelAnimationFrame(this.anim); }
  attributeChangedCallback(_n: string, _o: string | null, v: string | null) {
    if (this.ready && (v || 'auto') !== this.view) this.setView((v as View) || 'auto');
  }

  resolve(view: View): View {
    if (!VIEWS.includes(view) || (view !== 'auto' && !this.views.includes(view))) return this.view;
    return view;
  }
  geoFor(view: View): Geo {
    const v = view === 'auto' ? this.nativeView : view;
    if (v === 'tablet') return GEO[this.nativeView === 'tablet' ? 'tablet-landscape' : 'tablet-portrait'];
    return GEO[v] || GEO.desktop;
  }
  apply(view: View) {
    const g = this.geoFor(view);
    this.view = view;
    this.dataset.frame = g.frame;
    if (g.orient) this.dataset.orient = g.orient; else delete this.dataset.orient;
    this.dw = g.w; this.dh = g.h; this.padX = g.padX; this.padY = g.padY;
    this.device.style.width = g.w + 'px';
    this.device.style.height = g.h + 'px';
    if (view === 'auto') delete this.dataset.view; else if (this.dataset.view !== view) this.dataset.view = view;
  }

  /** Switch viewport. Returns the view now shown (unchanged if `view` is not allowed). */
  setView(view: View): View {
    const next = this.resolve(view);
    if (!this.ready) { if (next !== 'auto') this.dataset.view = next; return next; }
    const prev = this.view;
    const before = this.geoFor(prev), after = this.geoFor(next);
    if (next === prev) return prev;
    const done = () => {
      this.dispatchEvent(new CustomEvent('viewchange', { bubbles: true, detail: {
        view: next, previous: prev, frame: after.frame, orient: after.orient || null,
        width: this.iframe.offsetWidth, height: this.iframe.offsetHeight,
      } }));
    };
    if (before === after || reduced()) { this.apply(next); this.layout(); done(); return next; }
    cancelAnimationFrame(this.anim);
    this.tween(1, 0.96, 1, 0, 90, () => {
      this.apply(next);
      this.tween(0.97, 1, 0, 1, 170, () => { this.device.style.opacity = ''; done(); });
    });
    return next;
  }
  tween(z0: number, z1: number, o0: number, o1: number, ms: number, end: () => void) {
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      this.zoom = z0 + (z1 - z0) * e;
      this.device.style.opacity = String(o0 + (o1 - o0) * e);
      this.layout();
      if (p < 1) this.anim = requestAnimationFrame(step); else { this.zoom = 1; end(); }
    };
    this.anim = requestAnimationFrame(step);
  }

  schedule() { cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame(() => this.layout()); }
  layout() {
    const cw = this.clientWidth, ch = this.clientHeight;
    if (!cw || !ch || !this.dw) return;
    const fit = Math.min(cw / (this.dw + 2 * this.padX), ch / (this.dh + 2 * this.padY));
    const k = fit * this.zoom;
    const x = (cw - this.dw * k) / 2, y = (ch - this.dh * k) / 2;
    this.device.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${k.toFixed(4)})`;
    this.classList.toggle('lf-tiny', fit < TINY);
    this.classList.add('lf-ready');
  }
  loading = false;
  onLoad = () => { this.loading = false; if (this.iframe.getAttribute('src')) setTimeout(() => this.classList.add('loaded'), 250); };
  // Any demo frame with a document in it can keep the page out of the back/forward cache (a frame whose
  // navigation never settled, a frame still fetching). On pagehide every frame that has a src is swapped for a
  // fresh empty one. Not about:blank: that itself starts a navigation. On pageshow the wanted ones load again.
  // The frame is taken out of the document, not replaced: a new iframe would start its own initial navigation
  // at the worst moment. It goes back in the same place when the page is shown again.
  slot: { parent: ParentNode; next: Node | null } | null = null;
  rest() {
    if (!this.iframe.getAttribute('src') || !this.iframe.parentNode) return;
    this.slot = { parent: this.iframe.parentNode, next: this.iframe.nextSibling };
    // Same-origin frames can be told to stop first, so a navigation in flight ends before the frame goes.
    try { this.iframe.contentWindow?.stop(); } catch { /* cross-origin, nothing to stop */ }
    const fresh = this.iframe.cloneNode(false) as HTMLIFrameElement;
    fresh.removeAttribute('src');
    fresh.addEventListener('load', this.onLoad);
    this.iframe.remove();
    this.iframe = fresh; this.loading = false;
    this.classList.remove('loaded');
  }
  mount() {
    if (this.slot && !this.iframe.parentNode) { this.slot.parent.insertBefore(this.iframe, this.slot.next); this.slot = null; }
  }
  load() {
    this.wanted = true;
    pageReady.then(() => { if (this.wanted && !this.iframe.getAttribute('src')) { this.mount(); this.loading = true; this.iframe.src = this.dataset.src || ''; } });
  }
  unload() {
    this.wanted = false;
    if (this.iframe.getAttribute('src')) { this.iframe.removeAttribute('src'); this.loading = false; this.classList.remove('loaded'); }
  }
  reload() { this.classList.remove('loaded'); this.loading = true; this.iframe.src = (this.dataset.src || '') + '?r=' + Date.now(); }
}
if (!customElements.get('lounge-frame')) {
  customElements.define('lounge-frame', LoungeFrame);
  const frames = () => document.querySelectorAll<LoungeFrame>('lounge-frame');
  addEventListener('pagehide', () => frames().forEach((f) => f.rest()));
  addEventListener('pageshow', (e) => { if (e.persisted) frames().forEach((f) => { f.mount(); if (f.wanted) f.load(); }); });
}
export {};

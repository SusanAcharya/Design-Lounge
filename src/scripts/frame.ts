// <lounge-frame>: scales a device mock (with its iframe) to fit its box, lazy-loads the demo.
class LoungeFrame extends HTMLElement {
  device!: HTMLElement;
  iframe!: HTMLIFrameElement;
  dw = 0; dh = 0;
  ro?: ResizeObserver;
  io?: IntersectionObserver;
  raf = 0;

  connectedCallback() {
    this.device = this.querySelector('.lf-device') as HTMLElement;
    this.iframe = this.querySelector('iframe') as HTMLIFrameElement;
    this.dw = Number(this.dataset.dw); this.dh = Number(this.dataset.dh);
    this.ro = new ResizeObserver(() => this.schedule());
    this.ro.observe(this);
    this.layout();
    this.iframe.addEventListener('load', () => { if (this.iframe.getAttribute('src')) setTimeout(() => this.classList.add('loaded'), 250); });
    if (this.dataset.lazy === 'true' && 'IntersectionObserver' in window) {
      this.io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) this.load();
      }, { rootMargin: '400px 0px' });
      this.io.observe(this);
    } else {
      this.load();
    }
  }
  disconnectedCallback() { this.ro?.disconnect(); this.io?.disconnect(); }
  schedule() { cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame(() => this.layout()); }
  layout() {
    const cw = this.clientWidth, ch = this.clientHeight;
    if (!cw || !ch) return;
    const k = Math.min(cw / this.dw, ch / this.dh);
    const x = (cw - this.dw * k) / 2, y = (ch - this.dh * k) / 2;
    this.device.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${k.toFixed(4)})`;
  }
  load() { if (!this.iframe.getAttribute('src')) this.iframe.src = this.dataset.src || ''; }
  unload() { if (this.iframe.getAttribute('src')) { this.iframe.removeAttribute('src'); this.classList.remove('loaded'); } }
  reload() { this.classList.remove('loaded'); this.iframe.src = (this.dataset.src || '') + '?r=' + Date.now(); }
}
if (!customElements.get('lounge-frame')) customElements.define('lounge-frame', LoungeFrame);
export {};

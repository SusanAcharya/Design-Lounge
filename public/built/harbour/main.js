/* Harbour · example phone bank app · Designed using Design Lounge (https://designlounge.vercel.app) */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMq = matchMedia('(prefers-reduced-motion: reduce)');
  const RM = () => reduceMq.matches;
  const app = $('#app');
  const MINUS = '\u2212';
  const TODAY = '2026-10-04';
  const DAILY_LIMIT = 200000;
  const EXPO = 'cubic-bezier(.16,1,.3,1)';

  const nf2 = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nf0 = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
  const rs = n => 'Rs ' + nf2.format(Math.abs(n));
  const signed = n => (n < 0 ? MINUS : '+') + rs(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initials = name => name.replace(/[^A-Za-z ]/g, ' ').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const avClass = name => 'av-' + ([...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 4);
  const nowTime = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const parseDay = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const longDate = s => { const d = parseDay(s); return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
  const dayLabel = s => {
    if (s === TODAY) return 'Today';
    if (s === '2026-10-03') return 'Yesterday, 3 Oct';
    const d = parseDay(s); return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  };
  const scale = () => { const r = app.getBoundingClientRect(); return r.width / app.offsetWidth || 1; };
  let refSeq = 41104;
  const newRef = () => 'HB26100' + (refSeq++);

  /* ---------- example data ---------- */
  const payees = [
    { id: 'sita', name: 'Sita Gurung', acct: 'Harbour ••2210' },
    { id: 'bikash', name: 'Bikash Rai', acct: 'Other bank ••8812' },
    { id: 'anjali', name: 'Anjali Maharjan', acct: 'Harbour ••5074' },
    { id: 'prakash', name: 'Prakash Karki', acct: 'Other bank ••3391' },
    { id: 'nima', name: 'Nima Sherpa', acct: 'Harbour ••6620' },
    { id: 'rabin', name: 'Rabin Shakya', acct: 'Other bank ••1408' },
    { id: 'kabita', name: 'Kabita Joshi', acct: 'Harbour ••9157' },
    { id: 'dawa', name: 'Dawa Lama', acct: 'Other bank ••2783' }
  ];

  const state = {
    balance: 124580.50,
    creditDue: 18340,
    hidden: false,
    tx: [
      { id: 't1', name: 'Pipal Tree Café', meta: 'Card 4471', time: '09:12', day: TODAY, amount: -450, kind: 'card', category: 'Eating out', pending: true },
      { id: 't2', name: 'Mobile top up', meta: '98•• ••2210', time: '08:40', day: TODAY, amount: -500, kind: 'bill', category: 'Phone' },
      { id: 't3', name: 'Bagmati Grocers', meta: 'Card 4471', time: '08:05', day: TODAY, amount: -2340, kind: 'card', category: 'Groceries' },
      { id: 't4', name: 'Sita Gurung', meta: 'Transfer · Rent share', time: '19:30', day: '2026-10-03', amount: -12000, kind: 'transfer', payee: 'sita', note: 'Rent share', category: 'Transfers' },
      { id: 't5', name: 'Electricity bill', meta: 'Auto pay · Lalitpur', time: '07:00', day: '2026-10-03', amount: -1865, kind: 'bill', category: 'Bills' },
      { id: 't6', name: 'Himal Books', meta: 'Card 4471', time: '16:22', day: '2026-10-03', amount: -1200, kind: 'card', category: 'Shopping' },
      { id: 't7', name: 'Ridgeway Studio', meta: 'Salary, September', time: '10:00', day: '2026-10-01', amount: 85000, kind: 'salary', category: 'Income' },
      { id: 't8', name: 'Hamro Gym', meta: 'Card 4471 · Monthly', time: '06:15', day: '2026-10-01', amount: -3500, kind: 'card', category: 'Health' },
      { id: 't9', name: 'Interest', meta: 'Everyday, September', time: '00:01', day: '2026-10-01', amount: 412.6, kind: 'interest', category: 'Income' }
    ],
    scheduled: [],
    flow: null,
    lastTab: 'home'
  };
  let txSeq = 10;
  const incoming = [
    { name: 'Ram Thapa', meta: 'Transfer · Dinner', amount: 2500, kind: 'transfer', category: 'Transfers', note: 'Dinner' },
    { name: 'Jhamsikhel Pharmacy', meta: 'Card 4471', amount: -780, kind: 'card', category: 'Health' },
    { name: 'City taxi', meta: 'Card 4471', amount: -350, kind: 'card', category: 'Travel' }
  ];
  let incomingIdx = 0;

  const addTx = t => {
    const tx = Object.assign({ id: 't' + (txSeq++), day: TODAY, time: nowTime(), ref: newRef() }, t);
    state.tx.unshift(tx);
    state.balance = Math.round((state.balance + tx.amount) * 100) / 100;
    return tx;
  };
  state.tx.forEach(t => { if (!t.ref) t.ref = newRef(); });

  /* ---------- balance ---------- */
  function renderBalance() {
    const s = nf2.format(state.balance);
    const [i, d] = s.split('.');
    $$('[data-bal-int]').forEach(el => { el.textContent = i; });
    $$('[data-bal-dec]').forEach(el => { el.textContent = '.' + d; });
    $$('[data-bal-full]').forEach(el => { el.textContent = rs(state.balance); });
    const oct = state.tx.filter(t => t.day.startsWith('2026-10')).reduce((a, t) => a + t.amount, 0);
    const delta = $('#balDelta');
    delta.textContent = signed(oct);
    delta.parentElement.querySelector('use').setAttribute('href', oct < 0 ? '#i-arrow-down' : '#i-arrow-up');
    $('#creditFig').textContent = rs(state.creditDue) + ' due';
  }

  const bal = $('#bal'), eyeBtn = $('#eyeBtn');
  function setHidden(hide) {
    state.hidden = hide;
    bal.classList.toggle('hidden', hide);
    eyeBtn.setAttribute('aria-pressed', String(hide));
    eyeBtn.setAttribute('aria-label', hide ? 'Show balance' : 'Hide balance');
    $('#balAmt').setAttribute('aria-hidden', String(hide));
  }
  eyeBtn.addEventListener('click', () => setHidden(!state.hidden));

  /* ---------- activity ---------- */
  const activity = $('#activity');
  function rowHtml(t, isNew) {
    return `<button class="tx${t.pending ? ' pending' : ''}${isNew ? ' new' : ''}" type="button" data-tx="${t.id}">
      <span class="av ${avClass(t.name)}" aria-hidden="true">${esc(initials(t.name))}</span>
      <span class="t"><span class="n">${esc(t.name)}</span><span class="m">${t.pending ? 'Pending · ' : ''}${esc(t.meta)}${t.pending ? '' : ' · ' + t.time}</span></span>
      <span class="v num${t.amount > 0 ? ' in' : ''}">${signed(t.amount)}</span>
    </button>`;
  }
  function renderActivity(newId) {
    const days = [];
    state.tx.forEach(t => {
      let g = days.find(d => d.day === t.day);
      if (!g) { g = { day: t.day, items: [] }; days.push(g); }
      g.items.push(t);
    });
    days.sort((a, b) => (a.day < b.day ? 1 : -1));
    activity.innerHTML = days.map(g => {
      const net = g.items.reduce((a, t) => a + t.amount, 0);
      return `<div class="day"><span>${dayLabel(g.day)}</span><span class="num">${signed(net)}</span></div>
        <div class="group">${g.items.map(t => rowHtml(t, t.id === newId)).join('')}</div>`;
    }).join('');
  }
  activity.addEventListener('animationend', e => { if (e.target.classList.contains('new') && e.animationName === 'tx-glow') e.target.classList.remove('new'); });

  /* ---------- pull to refresh · ios-pull-to-refresh ---------- */
  const homeS = $('#s-home'), feed = $('#homeFeed');
  let pull = 0, busy = false, mDrag = false, mMoved = false, startY = 0, tStart = null;
  function setPull(v, snap) {
    pull = v;
    homeS.classList.toggle('snap', !!snap);
    homeS.classList.toggle('pulling', !snap && v > 0);
    homeS.style.setProperty('--pp', Math.min(1, v / 80).toFixed(3));
    feed.style.transform = v ? `translateY(${v}px)` : '';
  }
  function refresh() {
    if (busy) return;
    busy = true;
    setPull(64, true);
    homeS.classList.add('loading');
    feed.setAttribute('aria-busy', 'true');
    setTimeout(() => {
      const t = addTx(Object.assign({}, incoming[incomingIdx % incoming.length]));
      incomingIdx++;
      renderActivity(t.id);
      renderBalance();
      homeS.classList.remove('loading');
      setPull(0, true);
      feed.setAttribute('aria-busy', 'false');
      busy = false;
    }, 1200);
  }
  feed.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0 || busy || feed.scrollTop > 0) return;
    mDrag = true; mMoved = false; startY = e.clientY;
  });
  window.addEventListener('pointermove', e => {
    if (!mDrag) return;
    const dy = (e.clientY - startY) / scale();
    if (!mMoved && Math.abs(dy) > 6) mMoved = true;
    if (mMoved) setPull(dy <= 0 ? 0 : Math.min(120, dy * 0.55), false);
  });
  window.addEventListener('pointerup', () => {
    if (!mDrag) return;
    mDrag = false;
    if (!mMoved) return;
    if (pull >= 80) refresh(); else setPull(0, true);
    setTimeout(() => { mMoved = false; }, 0);
  });
  feed.addEventListener('click', e => {
    if (mMoved) { e.stopPropagation(); e.preventDefault(); mMoved = false; }
  }, true);
  feed.addEventListener('touchstart', e => {
    tStart = (busy || feed.scrollTop > 0) ? null : e.touches[0].clientY;
  }, { passive: true });
  feed.addEventListener('touchmove', e => {
    if (tStart == null) return;
    const dy = (e.touches[0].clientY - tStart) / scale();
    if (dy > 0 && feed.scrollTop <= 0) {
      e.preventDefault();
      setPull(Math.min(120, dy * 0.55), false);
    } else if (pull > 0) {
      setPull(0, false);
    }
  }, { passive: false });
  feed.addEventListener('touchend', () => {
    if (tStart == null) return;
    tStart = null;
    if (pull >= 80) refresh(); else if (pull > 0) setPull(0, true);
  });
  $('#refreshBtn').addEventListener('click', () => {
    feed.scrollTo({ top: 0, behavior: RM() ? 'auto' : 'smooth' });
    setTimeout(refresh, feed.scrollTop > 0 && !RM() ? 260 : 0);
  });

  /* ---------- transaction detail · shared-element-expand ---------- */
  const txd = $('#txd'), txdClose = $('#txdClose'), txdPrimary = $('#txdPrimary');
  let txAnim = null, txSrcId = null, txCurrent = null;

  function balanceAfter(id) {
    let b = state.balance;
    for (const t of state.tx) { if (t.id === id) return b; b -= t.amount; }
    return b;
  }
  function fillTxd(t) {
    txCurrent = t;
    const av = $('#txdAv');
    av.className = 'av av-lg ' + avClass(t.name);
    av.textContent = initials(t.name);
    $('#txdName').textContent = t.name;
    $('#txdMeta').textContent = `${longDate(t.day)} · ${t.time}`;
    const amt = $('#txdAmt');
    amt.textContent = signed(t.amount);
    amt.classList.toggle('in', t.amount > 0);
    const flag = $('#txdFlag');
    flag.className = 'flag ' + (t.pending ? 'wait' : 'ok');
    flag.textContent = t.pending ? 'Pending, settles in 1 to 2 days' : 'Completed';
    const from = t.kind === 'card' ? 'Harbour Debit ••4471' : 'Everyday ••4471';
    const rows = [
      ['Category', esc(t.category)],
      [t.amount > 0 ? 'Paid into' : 'Paid from', from],
      t.note ? ['Note', esc(t.note)] : null,
      ['Reference', `<span class="num">${t.ref}</span>`],
      ['Balance after', `<span class="num">${rs(balanceAfter(t.id))}</span>`]
    ].filter(Boolean);
    $('#txdFacts').innerHTML = rows.map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    const payee = t.payee && payees.find(p => p.id === t.payee);
    if (payee && t.amount < 0) {
      txdPrimary.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-send"/></svg>Send again';
      txdPrimary.dataset.action = 'again';
    } else {
      txdPrimary.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-download"/></svg>Save receipt';
      txdPrimary.dataset.action = 'receipt';
    }
  }
  function flipFrames(from, to, c1, c2) {
    const sx = from.width / to.width, sy = from.height / to.height;
    return [
      { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${sx}, ${sy})`, borderRadius: `${8 / sx}px / ${8 / sy}px`, backgroundColor: c1 },
      { transform: 'none', borderRadius: '0px', backgroundColor: c2 }
    ];
  }
  function localRect(el) {
    const S = scale(), a = app.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { left: (r.left - a.left) / S, top: (r.top - a.top) / S, width: r.width / S, height: r.height / S };
  }
  const cssVar = n => getComputedStyle(app).getPropertyValue(n).trim();
  function openTx(src) {
    if (txAnim || !txd.hidden) return;
    const t = state.tx.find(x => x.id === src.dataset.tx);
    if (!t) return;
    fillTxd(t);
    txSrcId = t.id;
    const from = localRect(src);
    txd.hidden = false;
    const to = { left: 0, top: 0, width: app.clientWidth, height: app.clientHeight };
    src.classList.add('src');
    app.classList.add('tx-open');
    txAnim = txd.animate(flipFrames(from, to, cssVar('--surface'), cssVar('--bg')), { duration: RM() ? 1 : 420, easing: EASE_OR(EXPO), fill: 'forwards' });
    txAnim.onfinish = () => { txAnim = null; txdClose.focus(); };
  }
  function EASE_OR(e) { return RM() ? 'linear' : e; }
  function closeTx(instant) {
    if (txAnim || txd.hidden) return;
    const src = activity.querySelector(`[data-tx="${txSrcId}"]`);
    app.classList.remove('tx-open');
    const finish = () => {
      txd.getAnimations().forEach(a => a.cancel());
      txd.hidden = true;
      txAnim = null;
      if (src) { src.classList.remove('src'); if (!instant) src.focus({ preventScroll: true }); }
      txSrcId = null;
    };
    if (instant || !src) { finish(); return; }
    const to = { left: 0, top: 0, width: app.clientWidth, height: app.clientHeight };
    const from = localRect(src);
    txAnim = txd.animate(flipFrames(from, to, cssVar('--surface'), cssVar('--bg')).reverse(), { duration: RM() ? 1 : 420, easing: EASE_OR(EXPO), fill: 'forwards' });
    txAnim.onfinish = finish;
  }
  activity.addEventListener('click', e => {
    const b = e.target.closest('.tx');
    if (b) openTx(b);
  });
  txdClose.addEventListener('click', () => closeTx(false));
  txdPrimary.addEventListener('click', () => {
    const t = txCurrent;
    if (!t) return;
    if (txdPrimary.dataset.action === 'again') {
      const p = payees.find(x => x.id === t.payee);
      closeTx(true);
      startFlow({ payee: p, amount: String(Math.abs(t.amount)), note: t.note || '' });
      go('#/send/amount');
    } else {
      saveReceipt({ title: t.amount > 0 ? 'Money in' : 'Payment', name: t.name, amount: t.amount, day: t.day, time: t.time, ref: t.ref, from: t.kind === 'card' ? 'Harbour Debit ••4471' : 'Everyday ••4471', note: t.note });
    }
  });

  function saveReceipt(r) {
    const lines = [
      'Harbour Bank receipt (example app, not a real payment)',
      '',
      `${r.title}: ${r.name}`,
      `Amount: ${signed(r.amount).replace(MINUS, '-')}`,
      `Date: ${longDate(r.day)}, ${r.time}`,
      `Account: ${r.from}`,
      r.note ? `Note: ${r.note}` : null,
      `Reference: ${r.ref}`,
      '',
      'Designed using Design Lounge, designlounge.vercel.app'
    ].filter(l => l !== null);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `harbour-receipt-${r.ref}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  /* ---------- request sheet ---------- */
  const scrim = $('#scrim'), sheet = $('#reqSheet');
  let sheetReturn = null;
  function openSheet() {
    sheetReturn = document.activeElement;
    scrim.hidden = false; sheet.hidden = false;
    $('#reqStatus').textContent = '';
    $('#reqCopy span').textContent = 'Copy details';
    requestAnimationFrame(() => requestAnimationFrame(() => { scrim.classList.add('on'); sheet.classList.add('up'); }));
    setTimeout(() => $('#reqClose').focus(), RM() ? 0 : 200);
  }
  function closeSheet() {
    if (sheet.hidden) return;
    scrim.classList.remove('on'); sheet.classList.remove('up');
    setTimeout(() => { scrim.hidden = true; sheet.hidden = true; if (sheetReturn) sheetReturn.focus(); }, RM() ? 0 : 400);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) { return false; }
  }
  $('#requestBtn').addEventListener('click', openSheet);
  $('#reqClose').addEventListener('click', closeSheet);
  scrim.addEventListener('click', closeSheet);
  $('#reqCopy').addEventListener('click', async () => {
    const ok = await copyText('Aarati Shrestha\nHarbour Bank, Lalitpur\nAccount 0107 2210 4471');
    $('#reqCopy span').textContent = ok ? 'Copied' : 'Copy details';
    $('#reqStatus').textContent = ok ? 'Account details copied. Paste them into a message.' : 'This browser blocked copying. The details are above.';
  });

  /* ---------- wallet · phone-wallet-cards ---------- */
  const cardsS = $('#s-cards'), stack = $('#wStack'), wCards = $$('.wcard'), wDetail = $('#wDetail'), wPay = $('#wPay'), wBar = $('#wBar'), wDone = $('#wDone'), wTitle = $('#cards-title');
  const wPayStatus = $('#wPayStatus'), wPaySub = $('#wPaySub'), wPayBtn = $('#wPayBtn');
  const cardData = [
    { title: 'Debit', name: 'Harbour Debit', end: '4471', label: 'Available', pay: true },
    { title: 'Credit', name: 'Harbour Credit', end: '9032', label: 'Due 20 Oct', pay: true },
    { title: 'Online', name: 'Online card', end: '7716', label: 'Left this month', pay: false }
  ];
  const creditRows = [
    { name: 'Tribeni Hardware', meta: '2 Oct · 14:10', amount: -6400 },
    { name: 'Airline ticket', meta: '28 Sep · 21:02', amount: -11940 },
    { name: 'Payment received', meta: '20 Sep · 09:00', amount: 22500 }
  ];
  const onlineRows = [
    { name: 'Streaming plan', meta: '1 Oct · Monthly', amount: -799 },
    { name: 'Online store order', meta: '27 Sep · 22:48', amount: -3450 },
    { name: 'Refund, store order', meta: '24 Sep · 11:20', amount: 1200 }
  ];
  let sel = -1, mode = 'closed', payTimer = null;

  function wRow(r) {
    return `<div class="w-row"><span class="tt"><span class="tn">${esc(r.name)}</span><span class="tm">${esc(r.meta)}</span></span><span class="tv num${r.amount > 0 ? ' in' : ''}">${signed(r.amount)}</span></div>`;
  }
  function debitRows() {
    return state.tx.filter(t => t.kind === 'card').slice(0, 3).map(t => ({ name: t.name, meta: `${dayLabel(t.day)} · ${t.time}`, amount: t.amount }));
  }
  function renderWBar() {
    const last = state.tx.find(t => t.kind === 'card');
    $('#wRows').innerHTML =
      wRow({ name: last.name, meta: 'Last payment · Debit · ' + last.time, amount: last.amount }) +
      `<div class="w-row"><span class="tt"><span class="tn">Credit bill</span><span class="tm">Due Tue, 20 Oct</span></span><span class="tv num">${rs(state.creditDue)}</span></div>`;
  }
  function fillWDetail(i) {
    const c = cardData[i];
    let amt, rows;
    if (i === 0) { amt = rs(state.balance); rows = debitRows(); }
    else if (i === 1) { amt = rs(state.creditDue); rows = creditRows; }
    else { amt = rs(25000 - 799 - 3450 + 1200); rows = onlineRows; }
    const btn = c.pay
      ? `<button class="btn btn-primary btn-block" type="button" data-wpay><svg class="ic" aria-hidden="true"><use href="#i-contactless"/></svg>Pay with this card</button>`
      : `<button class="btn btn-primary btn-block" type="button" data-wcopy><svg class="ic" aria-hidden="true"><use href="#i-copy"/></svg>Copy card number</button><p class="wd-status" role="status"></p>`;
    wDetail.innerHTML = `<p class="wd-label">${c.label}</p><p class="wd-amt num">${amt}</p>${rows.map(wRow).join('')}${btn}`;
  }
  function wLayout() {
    const ch = wCards[0].offsetHeight, H = stack.clientHeight;
    let k = 0;
    wDetail.style.top = wPay.style.top = (ch + 18) + 'px';
    wCards.forEach((c, i) => {
      let y, s = 1, o = 1;
      if (sel < 0) y = i * 56;
      else if (i === sel) y = 0;
      else { y = mode === 'pay' ? H + 24 : H - 44 + k * 12; s = 0.94; o = mode === 'pay' ? 0 : 1; k++; }
      c.style.transform = `translateY(${y}px) scale(${s})`;
      c.style.opacity = o;
      c.style.zIndex = i === sel ? 10 : i;
      c.setAttribute('aria-expanded', String(i === sel));
      c.tabIndex = (mode === 'pay' && i !== sel) ? -1 : 0;
    });
    cardsS.dataset.mode = mode;
    wBar.inert = mode !== 'closed';
    wDetail.inert = mode !== 'open';
    wPay.inert = mode !== 'pay';
  }
  function openCard(i) {
    clearTimeout(payTimer);
    sel = i; mode = 'open';
    fillWDetail(i);
    wTitle.textContent = cardData[i].title;
    wDone.hidden = false;
    wPay.dataset.s = 'idle';
    wLayout();
  }
  function closeCard() {
    if (sel < 0) return;
    clearTimeout(payTimer);
    const prev = wCards[sel];
    sel = -1; mode = 'closed';
    wTitle.textContent = 'Cards';
    wDone.hidden = true;
    wPay.dataset.s = 'idle';
    renderWBar();
    wLayout();
    prev.focus({ preventScroll: true });
  }
  function startPay() {
    const c = cardData[sel];
    mode = 'pay';
    wPay.dataset.s = 'hold';
    wPayStatus.textContent = 'Hold near reader';
    wPaySub.textContent = `${c.name} ••${c.end}`;
    wPayBtn.textContent = 'Cancel';
    wLayout();
    payTimer = setTimeout(() => {
      const t = nowTime();
      if (sel === 0) addTx({ name: 'Kumari Bakery', meta: 'Card 4471', amount: -450, kind: 'card', category: 'Eating out', pending: true });
      else state.creditDue += 450;
      renderBalance(); renderActivity();
      wPay.dataset.s = 'done';
      wPayStatus.textContent = 'Paid Rs 450.00';
      wPaySub.textContent = `Kumari Bakery · ${t}`;
      wPayBtn.textContent = 'Done';
      wPayBtn.focus();
    }, 2600);
  }
  function endPay() {
    clearTimeout(payTimer);
    mode = 'open';
    wPay.dataset.s = 'idle';
    fillWDetail(sel);
    wLayout();
  }
  wCards.forEach((c, i) => c.addEventListener('click', () => {
    if (mode === 'pay') return;
    if (sel === i) closeCard(); else openCard(i);
  }));
  wDone.addEventListener('click', closeCard);
  wPayBtn.addEventListener('click', endPay);
  wDetail.addEventListener('click', async e => {
    if (e.target.closest('[data-wpay]')) startPay();
    const cp = e.target.closest('[data-wcopy]');
    if (cp) {
      const ok = await copyText('4111 0000 0000 7716');
      wDetail.querySelector('.wd-status').textContent = ok ? 'Card number copied. It works for online payments only.' : 'This browser blocked copying.';
    }
  });
  $('#wPayDefault').addEventListener('click', () => { openCard(0); startPay(); });
  window.addEventListener('resize', () => { wLayout(); fitDevice(); });

  /* ---------- payees (Pay tab + flow) ---------- */
  function personRow(p, tag) {
    return `<${tag} class="row link person" ${tag === 'a' ? `href="#/send/amount" data-payee="${p.id}"` : `type="button" data-payee="${p.id}"`}>
      <span class="av ${avClass(p.name)}" aria-hidden="true">${esc(initials(p.name))}</span>
      <span class="row-text"><span class="nm">${esc(p.name)}</span><span class="ac">${esc(p.acct)}</span></span>
      <svg class="chev" aria-hidden="true"><use href="#i-chevron-right"/></svg>
    </${tag}>`;
  }
  function filterPayees(q) {
    q = q.trim().toLowerCase();
    return payees.filter(p => !q || p.name.toLowerCase().includes(q) || p.acct.toLowerCase().includes(q));
  }
  function renderPayees(listEl, emptyEl, q, tag) {
    const list = filterPayees(q);
    listEl.innerHTML = list.map(p => personRow(p, tag)).join('');
    listEl.hidden = !list.length;
    emptyEl.hidden = !!list.length;
    if (!list.length) emptyEl.textContent = `No saved person matches "${q.trim()}". Check the spelling, or ask them for their account number.`;
  }
  const payeeSearch = $('#payeeSearch'), toSearch = $('#toSearch');
  payeeSearch.addEventListener('input', () => renderPayees($('#payeeList'), $('#payeeEmpty'), payeeSearch.value, 'a'));
  toSearch.addEventListener('input', () => renderPayees($('#toList'), $('#toEmpty'), toSearch.value, 'button'));
  $('#payeeList').addEventListener('click', e => {
    const r = e.target.closest('[data-payee]');
    if (!r) return;
    e.preventDefault();
    startFlow({ payee: payees.find(p => p.id === r.dataset.payee) });
    go('#/send/amount');
  });
  $('#toList').addEventListener('click', e => {
    const r = e.target.closest('[data-payee]');
    if (!r) return;
    state.flow.payee = payees.find(p => p.id === r.dataset.payee);
    go('#/send/amount');
  });

  /* ---------- scheduled · mobile-list-empty ---------- */
  function renderScheduled() {
    const n = state.scheduled.length;
    $('#schedEmpty').hidden = n > 0;
    $('#schedList').hidden = n === 0;
    $$('[data-sched-count]').forEach(el => { el.textContent = n ? String(n) : 'None'; });
    const title = $('#s-scheduled');
    if (n) {
      $('#schedCountH').textContent = n === 1 ? '1 payment coming up' : `${n} payments coming up`;
      $('#schedRows').innerHTML = state.scheduled.map(s => `<div class="row person">
        <span class="av ${avClass(s.payee.name)}" aria-hidden="true">${esc(initials(s.payee.name))}</span>
        <span class="row-text"><span class="nm">${esc(s.payee.name)}</span><span class="ac">${esc(longDate(s.date))}</span></span>
        <span class="row-val num">${rs(s.amount)}</span></div>`).join('');
      title.setAttribute('aria-labelledby', 'schedCountH');
    } else {
      title.setAttribute('aria-labelledby', 'sched-title');
    }
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-when="later"]');
    if (a) { e.preventDefault(); startFlow({ when: 'later' }); go('#/send'); }
  });

  /* ---------- send flow ---------- */
  const flow = $('#flow'), flowTitle = $('#flowTitle'), flowBack = $('#flowBack'), flowBackLabel = $('#flowBackLabel');
  const steps = { to: 'Send to', amount: 'Amount', review: 'Review', done: '' };
  function startFlow(opts) {
    state.flow = Object.assign({ payee: null, amount: '', note: '', when: 'now', date: '', result: null, fresh: true, pendingErr: '' }, opts || {});
  }
  const flowAmount = () => parseFloat(state.flow && state.flow.amount) || 0;

  function amountError() {
    const a = flowAmount();
    if (!a) return 'Enter an amount to send.';
    if (a < 10) return 'The smallest transfer is Rs 10.';
    if (a > DAILY_LIMIT) return 'Your daily send limit is Rs 2,00,000. Enter less, or send the rest tomorrow.';
    if (state.flow.when === 'now' && a > state.balance) return `You have ${rs(state.balance)} in Everyday. Enter that or less.`;
    return '';
  }
  function renderAmount() {
    const f = state.flow, p = f.payee;
    const av = $('#amtAv');
    av.className = 'av ' + avClass(p.name);
    av.textContent = initials(p.name);
    $('#amtName').textContent = p.name;
    $('#amtAcct').textContent = p.acct;
    const raw = f.amount;
    let shown = '0';
    if (raw) {
      const [i, d] = raw.split('.');
      shown = nf0.format(Number(i || 0)) + (d !== undefined ? '.' + d : '');
    }
    $('#amtVal').textContent = shown;
    $('#amtBig').classList.toggle('empty', !raw);
    $('#amtBig').setAttribute('aria-label', 'Amount, Rs ' + shown);
    $('#amtHint').innerHTML = `<span class="num">${rs(state.balance)}</span> in Everyday`;
    $('#noteIn').value = f.note;
  }
  function showAmtError(msg) {
    const el = $('#amtErr');
    el.hidden = !msg;
    el.innerHTML = msg ? `<svg class="ic" aria-hidden="true"><use href="#i-alert"/></svg><span>${esc(msg)}</span>` : '';
    $('#amtHint').hidden = !!msg;
  }
  function keyIn(k) {
    const f = state.flow;
    let v = f.amount;
    if (k === 'del') v = v.slice(0, -1);
    else if (k === '.') { if (!v.includes('.')) v = (v || '0') + '.'; }
    else {
      const [i, d] = v.split('.');
      if (d !== undefined && d.length >= 2) return;
      if (d === undefined && (i || '').replace(/^0+/, '').length >= 7) return;
      v = (v === '0' ? '' : v) + k;
    }
    f.amount = v;
    if (!$('#amtErr').hidden) showAmtError('');
    renderAmount();
  }
  $('.keypad').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) keyIn(b.dataset.k); });
  $('#noteIn').addEventListener('input', e => { state.flow.note = e.target.value; });
  $('#toReview').addEventListener('click', () => {
    const err = amountError();
    if (err) { showAmtError(err); return; }
    go('#/send/review');
  });
  document.addEventListener('keydown', e => {
    if (!state.flow || currentStep !== 'amount' || e.target.matches('input')) return;
    if (/^[0-9]$/.test(e.key)) { keyIn(e.key); e.preventDefault(); }
    else if (e.key === '.' ) { keyIn('.'); e.preventDefault(); }
    else if (e.key === 'Backspace') { keyIn('del'); e.preventDefault(); }
    else if (e.key === 'Enter' && !e.target.closest('button, a')) { $('#toReview').click(); e.preventDefault(); }
  });

  const dateIn = $('#whenDate'), dateErr = $('#dateErr');
  function renderReview() {
    const f = state.flow, a = flowAmount();
    $('#revAmt').textContent = rs(a);
    $('#revFacts').innerHTML = [
      ['To', `${esc(f.payee.name)}<span class="sub num">${esc(f.payee.acct)}</span>`],
      ['From', `Everyday ••4471<span class="sub num">${rs(state.balance)}</span>`],
      f.note ? ['Note', esc(f.note)] : null,
      ['Fee', '<span class="num">Rs 0.00</span>']
    ].filter(Boolean).map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $$('input[name="when"]').forEach(r => { r.checked = r.value === f.when; });
    $('#dateField').hidden = f.when !== 'later';
    dateIn.value = f.date;
    setDateError('');
    updateConfirm();
  }
  function updateConfirm() {
    const f = state.flow, a = rs(flowAmount());
    const later = f.when === 'later';
    $('#confirmSend').textContent = (later ? 'Schedule ' : 'Send ') + a;
    $('#revArrive').textContent = later
      ? (f.date ? `Leaves Everyday on the morning of ${longDate(f.date)}. No fee.` : 'Pick the day it should leave. No fee.')
      : (f.payee.acct.startsWith('Harbour') ? 'Arrives in a few seconds. No fee.' : 'Arrives in about 2 minutes through the national payment switch. No fee.');
  }
  function setDateError(msg) {
    dateErr.hidden = !msg;
    dateErr.innerHTML = msg ? `<svg class="ic" aria-hidden="true"><use href="#i-alert"/></svg><span>${esc(msg)}</span>` : '';
    dateIn.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function dateError() {
    const v = dateIn.value;
    if (!v) return 'Pick a date from tomorrow on.';
    if (v <= TODAY) return 'Pick a date after today. To send today, choose Now.';
    if (v > dateIn.max) return 'Harbour schedules up to 6 months ahead. Pick a date before 4 Apr 2027.';
    return '';
  }
  $$('input[name="when"]').forEach(r => r.addEventListener('change', () => {
    state.flow.when = r.value;
    $('#dateField').hidden = r.value !== 'later';
    setDateError('');
    updateConfirm();
  }));
  dateIn.addEventListener('change', () => {
    state.flow.date = dateIn.value;
    if (!dateErr.hidden) setDateError(dateError());
    updateConfirm();
  });
  dateIn.addEventListener('blur', () => { if (dateIn.value) setDateError(dateError()); });

  const confirmBtn = $('#confirmSend');
  confirmBtn.addEventListener('click', () => {
    const f = state.flow;
    if (f.when === 'later') {
      const err = dateError();
      if (err) { setDateError(err); dateIn.focus(); return; }
    }
    const err = amountError();
    if (err) { f.pendingErr = err; go('#/send/amount'); return; }
    confirmBtn.disabled = true;
    confirmBtn.textContent = f.when === 'later' ? 'Scheduling…' : 'Sending…';
    setTimeout(() => {
      confirmBtn.disabled = false;
      const a = flowAmount();
      if (f.when === 'later') {
        state.scheduled.push({ payee: f.payee, amount: a, date: f.date, note: f.note });
        state.scheduled.sort((x, y) => (x.date < y.date ? -1 : 1));
        f.result = { kind: 'later', amount: a, ref: newRef(), day: f.date, time: '07:00' };
        renderScheduled();
      } else {
        const tx = addTx({ name: f.payee.name, meta: 'Transfer' + (f.note ? ' · ' + f.note : ''), amount: -a, kind: 'transfer', payee: f.payee.id, note: f.note, category: 'Transfers' });
        f.result = { kind: 'now', amount: a, ref: tx.ref, day: tx.day, time: tx.time, txId: tx.id };
        renderBalance(); renderActivity(tx.id); renderWBar();
      }
      go('#/send/done', true);
    }, RM() ? 300 : 900);
  });

  function renderDone() {
    const f = state.flow, r = f.result, later = r.kind === 'later';
    const flag = $('#doneFlag');
    flag.className = 'flag ' + (later ? 'info' : 'ok');
    flag.innerHTML = `<svg class="ic" aria-hidden="true"><use href="#i-${later ? 'calendar' : 'check'}"/></svg>${later ? 'Scheduled' : 'Sent'}`;
    $('#doneRef').textContent = 'Reference ' + r.ref;
    $('#doneAmt').textContent = rs(r.amount);
    const fast = f.payee.acct.startsWith('Harbour') ? 'in a few seconds' : 'in about 2 minutes';
    $('#doneLead').textContent = later
      ? `${f.payee.name} gets it on ${longDate(r.day)}. You can see it under Scheduled payments until then.`
      : `${f.payee.name} gets it ${fast}. Everyday now holds ${rs(state.balance)}.`;
    $('#doneFacts').innerHTML = [
      ['To', `${esc(f.payee.name)}<span class="sub num">${esc(f.payee.acct)}</span>`],
      ['From', 'Everyday ••4471'],
      f.note ? ['Note', esc(f.note)] : null,
      [later ? 'Leaves on' : 'Sent', later ? longDate(r.day) : `Today, ${r.time}`]
    ].filter(Boolean).map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('#doneHome').textContent = later ? 'See scheduled payments' : 'Back to Home';
    $('#doneHome').setAttribute('href', later ? '#/pay/scheduled' : '#/home');
  }
  $('#doneReceipt').addEventListener('click', () => {
    const f = state.flow, r = f.result;
    saveReceipt({ title: r.kind === 'later' ? 'Scheduled transfer' : 'Transfer', name: f.payee.name, amount: -r.amount, day: r.day, time: r.time, ref: r.ref, from: 'Everyday ••4471', note: f.note });
  });

  let currentStep = null;
  function openFlow(step) {
    if (flow.hidden) {
      flow.hidden = false;
      app.querySelector('.tabs').inert = true;
      $$('.screen').forEach(s => { s.inert = true; });
      requestAnimationFrame(() => requestAnimationFrame(() => flow.classList.add('up')));
    }
    currentStep = step;
    $$('.flow-step').forEach(s => { s.hidden = s.dataset.step !== step; });
    flowTitle.textContent = steps[step];
    flowBack.hidden = step === 'done';
    flowBackLabel.textContent = step === 'to' ? 'Cancel' : 'Back';
    flowBack.querySelector('.ic').style.display = step === 'to' ? 'none' : '';
    if (step === 'to') {
      toSearch.value = '';
      renderPayees($('#toList'), $('#toEmpty'), '', 'button');
    } else if (step === 'amount') {
      showAmtError(state.flow.pendingErr || '');
      state.flow.pendingErr = '';
      renderAmount();
    } else if (step === 'review') {
      renderReview();
    } else if (step === 'done') {
      renderDone();
      setTimeout(() => $('#doneAmt').focus({ preventScroll: true }), RM() ? 0 : 220);
    }
  }
  function closeFlow() {
    if (flow.hidden) return;
    currentStep = null;
    flow.classList.remove('up');
    app.querySelector('.tabs').inert = false;
    $$('.screen').forEach(s => { s.inert = false; });
    setTimeout(() => { if (!flow.classList.contains('up')) flow.hidden = true; }, RM() ? 0 : 400);
  }
  flowBack.addEventListener('click', () => {
    if (currentStep === 'to') go('#/' + (state.lastTab === 'scheduled' ? 'pay/scheduled' : state.lastTab));
    else if (currentStep === 'amount') go('#/send');
    else if (currentStep === 'review') go('#/send/amount');
  });

  /* ---------- large title collapse · ios-large-title-collapse ---------- */
  $$('.lt').forEach(screen => {
    const sc = screen.querySelector('.lt-scroll');
    let ticking = false;
    const update = () => {
      ticking = false;
      const p = Math.min(1, Math.max(0, sc.scrollTop / 52));
      screen.style.setProperty('--p', p.toFixed(3));
      const s = screen.querySelector('.lt-head .search input');
      if (s) s.tabIndex = p >= 1 ? -1 : 0;
    };
    sc.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  });

  /* ---------- settings ---------- */
  const store = {
    get: k => { try { return localStorage.getItem('harbour-' + k); } catch (_) { return null; } },
    set: (k, v) => { try { localStorage.setItem('harbour-' + k, v); } catch (_) { /* private mode */ } }
  };
  const darkTog = $('#darkTog');
  function setTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'night' : 'ledger';
    darkTog.setAttribute('aria-checked', String(dark));
    $('meta[name="theme-color"]').setAttribute('content', dark ? '#121820' : '#f4efe4');
  }
  $$('.tog').forEach(t => {
    t.addEventListener('click', e => {
      e.stopPropagation();
      const on = t.getAttribute('aria-checked') !== 'true';
      t.setAttribute('aria-checked', String(on));
      if (t === darkTog) { setTheme(on); store.set('theme', on ? 'night' : 'ledger'); }
      if (t.dataset.key === 'hideOnOpen') { store.set('hideOnOpen', on ? '1' : '0'); setHidden(on); }
    });
    const row = t.closest('.row');
    row.addEventListener('click', e => { if (e.target !== t) t.click(); });
  });
  const savedTheme = store.get('theme');
  setTheme(savedTheme ? savedTheme === 'night' : matchMedia('(prefers-color-scheme: dark)').matches);
  if (store.get('hideOnOpen') === '1') {
    $('[data-key="hideOnOpen"]').setAttribute('aria-checked', 'true');
    setHidden(true);
  }
  $('#copyAcct').addEventListener('click', async () => {
    const ok = await copyText('0107 2210 4471');
    const v = $('#copyAcctVal');
    v.textContent = ok ? 'Copied' : '0107 2210 4471';
    setTimeout(() => { v.textContent = '0107 2210 4471'; }, 1600);
  });

  /* ---------- router ---------- */
  const TABS = ['home', 'cards', 'pay', 'settings'];
  let currentScreen = 'home';
  function go(hash, replace) {
    if (replace) { history.replaceState(null, '', hash); route(); }
    else if (location.hash === hash) route();
    else location.hash = hash;
  }
  function showScreen(name) {
    const prev = currentScreen;
    $$('.screen').forEach(s => { s.hidden = s.dataset.screen !== name; });
    const tab = name === 'scheduled' ? 'pay' : name;
    $$('.tab').forEach(t => {
      if (t.dataset.tab === tab) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    const sch = $('#s-scheduled');
    sch.classList.remove('slide-in');
    if (name === 'scheduled' && prev === 'pay' && !RM()) { void sch.offsetWidth; sch.classList.add('slide-in'); }
    if (name !== 'cards' && sel >= 0) { sel = -1; mode = 'closed'; wTitle.textContent = 'Cards'; wDone.hidden = true; clearTimeout(payTimer); }
    if (name !== 'home' && !txd.hidden) closeTx(true);
    if (name === 'cards') { renderWBar(); requestAnimationFrame(wLayout); }
    currentScreen = name;
    state.lastTab = name;
  }
  function route() {
    const h = location.hash.replace(/^#\/?/, '') || 'home';
    const parts = h.split('/');
    if (parts[0] === 'send') {
      const step = steps[parts[1]] !== undefined ? parts[1] : 'to';
      if (state.flow && state.flow.result && step !== 'done') {
        state.flow = null;
        return go('#/' + (state.lastTab === 'scheduled' ? 'pay/scheduled' : state.lastTab), true);
      }
      if (!state.flow || (flow.hidden && !state.flow.fresh)) startFlow();
      const f = state.flow;
      if (step !== 'to' && !f.payee) return go('#/send', true);
      if (step === 'review' && amountError()) return go('#/send/amount', true);
      if (step === 'done' && !f.result) return go('#/' + state.lastTab, true);
      openFlow(step);
      f.fresh = false;
      return;
    }
    if (state.flow && state.flow.result) state.flow = null;
    closeFlow();
    let name = parts[0];
    if (name === 'pay' && parts[1] === 'scheduled') name = 'scheduled';
    if (!TABS.includes(name) && name !== 'scheduled') name = 'home';
    showScreen(name);
  }
  window.addEventListener('hashchange', route);

  /* ---------- escape ---------- */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!sheet.hidden) { closeSheet(); return; }
    if (!txd.hidden) { closeTx(false); return; }
    if (!flow.hidden) { if (currentStep === 'done') go($('#doneHome').getAttribute('href')); else flowBack.click(); return; }
    if (currentScreen === 'cards' && sel >= 0) { if (mode === 'pay') endPay(); else closeCard(); }
  });

  /* ---------- desktop frame fit ---------- */
  const deviceWrap = $('#deviceWrap');
  const frameMq = matchMedia('(min-width: 700px)');
  function fitDevice() {
    if (!frameMq.matches) { deviceWrap.style.removeProperty('--fs'); return; }
    const fs = Math.min(1, (window.innerHeight - 96) / 868, (window.innerWidth - 48) / 414);
    deviceWrap.style.setProperty('--fs', Math.max(0.5, fs).toFixed(4));
  }
  frameMq.addEventListener('change', () => { fitDevice(); wLayout(); });

  /* ---------- boot ---------- */
  renderBalance();
  renderActivity();
  renderPayees($('#payeeList'), $('#payeeEmpty'), '', 'a');
  renderScheduled();
  renderWBar();
  fitDevice();
  route();
  wLayout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(wLayout);
})();

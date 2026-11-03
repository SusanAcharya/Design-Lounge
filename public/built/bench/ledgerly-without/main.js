(function () {
  // Mobile navigation
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        btn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  // Billing period toggle
  var togs = document.querySelectorAll('.tog');
  var prices = document.querySelectorAll('.price .mono');
  togs.forEach(function (t) {
    t.addEventListener('click', function () {
      var period = t.getAttribute('data-period');
      togs.forEach(function (o) {
        var on = o === t;
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-pressed', String(on));
      });
      prices.forEach(function (p) {
        p.textContent = '£' + p.getAttribute('data-' + period);
      });
    });
  });

  // Replay the audit trail once when the specimen first comes into view
  var trail = document.getElementById('trail');
  var status = document.getElementById('invStatus');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (trail && status && !reduce && 'IntersectionObserver' in window) {
    var items = Array.prototype.slice.call(trail.children);
    var played = false;
    var io = new IntersectionObserver(function (entries) {
      if (played || !entries[0].isIntersecting) return;
      played = true;
      io.disconnect();
      items.forEach(function (li, i) { if (i > 1) li.classList.add("is-pending"); });
      status.dataset.state = 'sent';
      status.textContent = 'Sent';
      items.slice(2).forEach(function (li, i) {
        setTimeout(function () {
          li.classList.remove("is-pending");
          li.classList.add('is-new');
          if (i === 0) { status.dataset.state = 'paid'; status.textContent = 'Paid'; }
        }, 700 + i * 650);
      });
    }, { threshold: 0.5 });
    io.observe(trail);
  }

  // Walkthrough form (demo only, nothing is sent)
  var form = document.getElementById('ctaForm');
  var msg = document.getElementById('formMsg');
  if (form && msg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.className = 'form-msg err';
        msg.textContent = 'Please enter a work email address, like you@yourfirm.co.uk.';
        form.email.focus();
        return;
      }
      msg.className = 'form-msg ok';
      msg.textContent = 'Thank you. A specialist will email ' + email + ' within one working day to arrange a time.';
      form.reset();
    });
  }
})();

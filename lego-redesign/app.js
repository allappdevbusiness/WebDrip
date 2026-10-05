// LEGO homepage concept by WebDrip. Unofficial concept redesign. Not affiliated with LEGO.
// In-page only: filters, quick view, menu sheet and smooth anchor scrolling. No network requests.
(function () {
  'use strict';
  window.__wdReady = true;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reduced() { return reduceMq.matches; }
  // The recorder slows page time; JS-driven motion follows the same clock.
  function ms(n) { return n / (window.__wdTimeScale || 1); }

  var topBar = document.querySelector('.wd-top');
  var root = document.documentElement;
  function syncTop() { root.style.setProperty('--top-h', topBar.offsetHeight + 'px'); }
  syncTop();
  window.addEventListener('resize', syncTop);

  var PRODUCTS = {
    'game-boy': { name: 'Game Boy™', price: '$59.99', interest: 'Gaming', img: 'assets/product-game-boy.webp', photo: false, alt: 'LEGO Game Boy set' },
    'mario-kart': { name: 'Mario Kart™ – Mario & Standard Kart', price: '$169.99', interest: 'Gaming', img: 'assets/product-mario-kart.webp', photo: false, alt: 'LEGO Mario Kart Mario and Standard Kart set' },
    'book-nook': { name: 'Bookstore: Book Nook', price: '$149.99', interest: 'Display', img: 'assets/product-book-nook.webp', photo: false, alt: 'LEGO Bookstore Book Nook set' },
    'golden-pothos': { name: 'Hanging Golden Pothos', price: '$59.99', interest: 'Display', img: 'assets/lifestyle-golden-pothos.webp', photo: true, alt: 'LEGO Hanging Golden Pothos set' },
    'downton-abbey': { name: 'Downton Abbey', price: '$349.99', interest: 'Display', img: 'assets/lifestyle-downton-abbey.webp', photo: true, alt: 'LEGO Downton Abbey set' },
    'bikini-bottom': { name: 'SpongeBob SquarePants: Bikini Bottom', price: '$219.99', interest: 'Display', img: 'assets/lifestyle-bikini-bottom.webp', photo: true, alt: 'LEGO SpongeBob SquarePants Bikini Bottom set' },
    'holiday-house': { name: 'Holiday House', price: '$119.99', interest: 'Seasonal', img: 'assets/product-holiday-house.webp', photo: false, alt: 'LEGO Holiday House set' },
    'home-alone': { name: 'LEGO® Ideas Home Alone', price: '$299.99', interest: 'Seasonal', img: 'assets/lifestyle-home-alone.webp', photo: true, alt: 'LEGO Ideas Home Alone set' }
  };

  /* ---------- Smooth anchor scrolling (500ms, header offset) ---------- */
  var scrollRaf = 0;
  function targetY(id) {
    if (id === 'top') return 0;
    var el = document.getElementById(id);
    if (!el) return null;
    var y = el.getBoundingClientRect().top + window.scrollY - topBar.offsetHeight;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(max, Math.round(y)));
  }
  function scrollToId(id, focusTarget) {
    var to = targetY(id);
    if (to === null) return;
    cancelAnimationFrame(scrollRaf);
    var done = function () {
      if (focusTarget) {
        var heading = id === 'top' ? null : document.querySelector('#' + id + ' [tabindex="-1"]');
        if (heading) heading.focus({ preventScroll: true });
      }
    };
    if (reduced()) { window.scrollTo(0, to); done(); return; }
    // One clock for the whole animation: requestAnimationFrame timestamps.
    var from = window.scrollY, dur = 500, t0 = null;
    var step = function (now) {
      if (t0 === null) t0 = now;
      var t = Math.min(1, (now - t0) / dur);
      var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, from + (to - from) * e);
      if (t < 1) scrollRaf = requestAnimationFrame(step); else done();
    };
    scrollRaf = requestAnimationFrame(step);
  }
  document.addEventListener('click', function (ev) {
    var link = ev.target.closest('[data-scroll]');
    if (!link) return;
    ev.preventDefault();
    var id = link.getAttribute('data-scroll');
    if (menu.isOpen()) menu.close(false);
    scrollToId(id, true);
  });

  /* ---------- Interest filters ---------- */
  var grid = document.getElementById('setGrid');
  var countEl = document.getElementById('setCount');
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.wd-filter'));
  var cards = Array.prototype.slice.call(grid.children);

  function setFilter(filter) {
    var before = new Map();
    cards.forEach(function (c) { if (!c.hidden) before.set(c, c.getBoundingClientRect()); });
    var shown = cards.filter(function (c) { return filter === 'all' || c.dataset.interest === filter; });
    cards.forEach(function (c) {
      c.hidden = shown.indexOf(c) === -1;
      c.classList.add('is-done'); c.classList.remove('is-in');
      c.getAnimations().forEach(function (a) { a.cancel(); });
    });
    grid.dataset.count = String(shown.length);
    grid.dataset.filter = filter;
    filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === filter)); });
    countEl.textContent = shown.length + ' sets in this concept';
    if (reduced() || !grid.animate) return;
    shown.forEach(function (c, i) {
      var a = before.get(c), b = c.getBoundingClientRect();
      if (a) {
        var dx = a.left - b.left, dy = a.top - b.top;
        if (dx || dy) c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' });
      } else {
        c.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 240, delay: i * 20, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      }
    });
  }
  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () { setFilter(b.dataset.filter); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-show-all]'), function (b) {
    b.addEventListener('click', function () { setFilter('all'); scrollToId('sets', true); });
  });

  /* ---------- Focus trap helper ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trap(container, ev) {
    if (ev.key !== 'Tab') return;
    var items = Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    else if (!container.contains(document.activeElement)) { ev.preventDefault(); first.focus(); }
  }

  // Open/close a layer with a CSS transition; hidden is set again once it ends.
  function layer(el, panel) {
    var timer = 0;
    return {
      open: function () {
        clearTimeout(timer);
        el.hidden = false;
        void el.offsetWidth;
        el.classList.add('is-open');
      },
      close: function () {
        el.classList.remove('is-open');
        if (reduced()) { el.hidden = true; return; }
        clearTimeout(timer);
        var finish = function () { if (!el.classList.contains('is-open')) el.hidden = true; panel.removeEventListener('transitionend', onEnd); };
        var onEnd = function (e) { if (e.target === panel) finish(); };
        panel.addEventListener('transitionend', onEnd);
        timer = setTimeout(finish, ms(400));
      }
    };
  }

  /* ---------- Quick view ---------- */
  var qv = document.getElementById('quickView');
  var qvPanel = qv.querySelector('.wd-qv__panel');
  var qvLayer = layer(qv, qvPanel);
  var qvTrigger = null;
  function openQuick(id, trigger) {
    var p = PRODUCTS[id];
    if (!p) return;
    qvTrigger = trigger;
    document.getElementById('qvName').textContent = p.name;
    document.getElementById('qvPrice').textContent = p.price;
    document.getElementById('qvInterest').textContent = p.interest;
    var img = document.getElementById('qvImg');
    img.src = p.img; img.alt = p.alt;
    document.getElementById('qvMedia').classList.toggle('is-photo', p.photo);
    root.classList.add('wd-lock');
    qvLayer.open();
    qvPanel.querySelector('.wd-close').focus({ preventScroll: true });
  }
  function closeQuick() {
    if (qv.hidden) return;
    qvLayer.close();
    root.classList.remove('wd-lock');
    if (qvTrigger) qvTrigger.focus({ preventScroll: true });
    qvTrigger = null;
  }
  grid.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-quick]');
    if (b) openQuick(b.dataset.quick, b);
  });
  Array.prototype.forEach.call(qv.querySelectorAll('[data-qv-close]'), function (b) { b.addEventListener('click', closeQuick); });

  /* ---------- Menu sheet ---------- */
  var sheet = document.getElementById('menuSheet');
  var sheetPanel = sheet.querySelector('.wd-sheet__panel');
  var menuBtn = document.getElementById('menuBtn');
  var sheetLayer = layer(sheet, sheetPanel);
  var menu = {
    isOpen: function () { return !sheet.hidden && sheet.classList.contains('is-open'); },
    open: function () {
      sheetLayer.open();
      menuBtn.setAttribute('aria-expanded', 'true');
      sheet.querySelector('.wd-close').focus({ preventScroll: true });
    },
    close: function (restore) {
      sheetLayer.close();
      menuBtn.setAttribute('aria-expanded', 'false');
      if (restore) menuBtn.focus({ preventScroll: true });
    }
  };
  menuBtn.addEventListener('click', function () { if (menu.isOpen()) menu.close(true); else menu.open(); });
  Array.prototype.forEach.call(sheet.querySelectorAll('[data-menu-close]'), function (b) {
    b.addEventListener('click', function () { menu.close(true); });
  });

  document.addEventListener('keydown', function (ev) {
    if (!qv.hidden && qv.classList.contains('is-open')) {
      if (ev.key === 'Escape') { ev.preventDefault(); closeQuick(); return; }
      trap(qvPanel, ev);
    } else if (menu.isOpen()) {
      if (ev.key === 'Escape') { ev.preventDefault(); menu.close(true); return; }
      trap(sheetPanel, ev);
    }
  });
  window.addEventListener('resize', function () {
    if (menu.isOpen() && window.matchMedia('(min-width: 1101px)').matches) menu.close(false);
  });

  /* ---------- Building-block assembly (hero) ---------- */
  // Blocks wait (paused at their first keyframe) until the page's images are ready, then drop in one by one.
  // Once the last product image has popped in, the animation classes come off so hover effects work normally.
  if (root.classList.contains('wd-anim')) {
    var go = function () {
      root.classList.add('wd-go');
      var imgs = document.querySelectorAll('.wd-bento .wd-tile2__img');
      var last = imgs[imgs.length - 1];
      var finish = function () { root.classList.remove('wd-anim', 'wd-go'); root.classList.add('wd-built'); };
      if (last) last.addEventListener('animationend', finish, { once: true }); else finish();
    };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
  }

  /* ---------- Hero tiles jump to their interest ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-jump]'), function (a) {
    a.addEventListener('click', function (ev) { ev.preventDefault(); setFilter(a.dataset.jump); scrollToId('sets', true); });
  });

  /* ---------- Entrance motion (later sections assemble as they scroll in) ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.wd-reveal'));
  function done(el) { el.classList.add('is-done'); el.classList.remove('is-in'); }
  function show(el) {
    if (reduced()) { done(el); return; }
    el.addEventListener('animationend', function () { done(el); }, { once: true });
    el.classList.add('is-in');
  }
  if (reduced() || !('IntersectionObserver' in window)) {
    reveals.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; }).map(function (e) { return e.target; });
      batch.forEach(function (el, i) { el.style.setProperty('--d', (i * 100) + 'ms'); show(el); io.unobserve(el); });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.01 });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();

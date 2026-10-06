// DOM effects that run after hydration. All scroll/frame work goes through the one
// shared rAF loop in motion.js and writes styles directly; React never re-renders on scroll.
import { state, subscribe, startMotion, approach, clamp, kick } from './motion.js';

let started = false;

export function initEffects() {
  if (started) return;
  started = true;
  startMotion();
  const fine = window.matchMedia('(pointer: fine)').matches && !state.reduced;

  reveals();
  counters();
  navAndProgress();
  parallax();
  hero();
  story();
  hscroll();
  if (fine) {
    tilt();
    magnetic();
    glow();
  }
  pageLinks();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
  }
}

function reveals() {
  const els = [...document.querySelectorAll('[data-reveal]')];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
  );
  els.forEach((el) => io.observe(el));
  // Anything the reader has scrolled past (fast scroll, anchor jump) is revealed too.
  let n = 0;
  subscribe(() => {
    if (++n % 10) return false;
    for (const el of els) {
      if (el.classList.contains('in')) continue;
      const r = el.getBoundingClientRect();
      if (r.top < state.vh - 20) {
        el.classList.add('in');
        io.unobserve(el);
      }
    }
    return false;
  });
}

function counters() {
  const els = [...document.querySelectorAll('[data-count]')];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target;
        const to = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        if (state.reduced) return;
        let t0 = 0;
        const off = subscribe((dt, t) => {
          if (!t0) t0 = t;
          const p = clamp((t - t0) / 1600);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(to * eased).toLocaleString('en-US') + suffix;
          if (p >= 1) {
            off();
            return false;
          }
          return true;
        });
      });
    },
    { threshold: 0.4 }
  );
  els.forEach((el) => io.observe(el));
}

function navAndProgress() {
  const nav = document.getElementById('nav');
  const bar = document.getElementById('wdProgress');
  let shrunk = false;
  let shown = 0;
  subscribe((dt) => {
    const s = state.y > 40;
    if (s !== shrunk && nav) {
      shrunk = s;
      nav.classList.toggle('wd-shrunk', s);
    }
    const max = document.documentElement.scrollHeight - state.vh;
    const target = max > 0 ? clamp(state.y / max) : 0;
    shown = approach(shown, target, dt, 90);
    if (bar) bar.style.transform = `scaleX(${shown.toFixed(4)})`;
    return shown !== target;
  });
}

function measureTops(els) {
  return els.map((el) => {
    const r = el.getBoundingClientRect();
    return { el, top: r.top + window.scrollY, h: r.height, f: Number(el.dataset.parallax) || 0.15, cur: 0 };
  });
}

function parallax() {
  if (state.reduced) return;
  let items = measureTops([...document.querySelectorAll('[data-parallax]')]);
  const remeasure = () => {
    items.forEach((i) => (i.el.style.transform = ''));
    items = measureTops(items.map((i) => i.el));
    kick();
  };
  window.addEventListener('resize', remeasure);
  window.addEventListener('load', remeasure);
  subscribe((dt) => {
    let busy = false;
    for (const i of items) {
      const center = i.top + i.h / 2 - (state.y + state.vh / 2);
      if (Math.abs(center) > state.vh * 1.6) continue;
      const target = -center * i.f;
      i.cur = approach(i.cur, target, dt, 80);
      if (i.cur !== target) busy = true;
      i.el.style.transform = `translate3d(0, ${i.cur.toFixed(2)}px, 0)`;
    }
    return busy;
  });
}

function hero() {
  const img = document.getElementById('heroImg');
  const stage = document.querySelector('.wd-hero-stage');
  if (!img || !stage) return;
  const layers = [...document.querySelectorAll('[data-depth]')];
  let p = 0;
  let hidden = false;
  subscribe((dt) => {
    const target = clamp(state.y / state.vh, 0, 1.4);
    p = state.reduced ? target : approach(p, target, dt, 120);
    const e = p * p * (3 - 2 * Math.min(p, 1));
    if (!state.reduced) {
      // camera dolly: push in, tilt back in perspective and drift sideways
      img.style.transform = `translate3d(${(-e * 3).toFixed(3)}%, ${(-e * 6).toFixed(3)}%, 0) scale(${(1.08 + e * 0.32).toFixed(4)}) rotateX(${(e * 9).toFixed(3)}deg) rotateZ(${(e * -1.5).toFixed(3)}deg)`;
      for (const l of layers) {
        const d = Number(l.dataset.depth);
        l.style.transform = `translate3d(0, ${(-state.y * d).toFixed(1)}px, 0)`;
      }
    }
    stage.style.opacity = String(clamp(1.35 - p).toFixed(3));
    const h = state.y > state.vh * 1.5;
    if (h !== hidden) {
      hidden = h;
      stage.style.visibility = h ? 'hidden' : 'visible';
    }
    return p !== target;
  });
}

function story() {
  const box = document.querySelector('[data-story]');
  if (!box) return;
  const steps = [...box.querySelectorAll('.wd-story-step')];
  const imgs = [...box.querySelectorAll('.wd-story-img')];
  let active = -1;
  subscribe(() => {
    const r = box.getBoundingClientRect();
    const total = r.height - state.vh;
    const p = total > 0 ? clamp(-r.top / total) : 1;
    const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
    if (idx !== active) {
      active = idx;
      steps.forEach((s, i) => s.classList.toggle('wd-active', i === idx));
      imgs.forEach((s, i) => s.classList.toggle('wd-active', i === idx));
      const bar = box.querySelector('[data-story-bar]');
      if (bar) bar.style.transform = `scaleY(${(idx + 1) / steps.length})`;
    }
    return false;
  });
}

function hscroll() {
  const box = document.querySelector('[data-hscroll]');
  if (!box) return;
  const track = box.querySelector('.wd-hs-track');
  let cur = 0;
  subscribe((dt) => {
    // below the lg breakpoint the strip is a native swipe row instead
    if (state.vw < 1024) {
      if (cur) track.style.transform = '';
      cur = 0;
      return false;
    }
    const r = box.getBoundingClientRect();
    const total = r.height - state.vh;
    const p = total > 0 ? clamp(-r.top / total) : 0;
    const dist = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
    const target = -p * dist;
    cur = state.reduced ? target : approach(cur, target, dt, 70);
    track.style.transform = `translate3d(${cur.toFixed(1)}px, 0, 0)`;
    return cur !== target;
  });
}

// Delegated pointer effects, so cards re-rendered by filters keep working.
function hoverEffect(selector, apply) {
  let cur = null;
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest(selector);
    if (cur && cur !== el) cur.style.transform = '';
    cur = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = apply(e, r);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    if (cur) cur.style.transform = '';
    cur = null;
  });
}

function tilt() {
  hoverEffect('[data-tilt]', (e, r) => {
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    return `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-6px)`;
  });
}

function magnetic() {
  hoverEffect('[data-magnetic]', (e, r) => {
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    return `translate3d(${(x * 0.25).toFixed(1)}px, ${(y * 0.35).toFixed(1)}px, 0)`;
  });
}

function glow() {
  const g = document.getElementById('wdGlow');
  if (!g) return;
  let tx = -600, ty = -600, x = -600, y = -600;
  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (x < -500) { x = tx; y = ty; }
    kick();
  }, { passive: true });
  subscribe((dt) => {
    x = approach(x, tx, dt, 90);
    y = approach(y, ty, dt, 90);
    g.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    return x !== tx || y !== ty;
  });
}

// Quick fade between pages when the browser has no cross-document view transitions.
function pageLinks() {
  if ('CSSViewTransitionRule' in window || state.reduced) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href$=".html"]');
    if (!a || e.metaKey || e.ctrlKey || a.target) return;
    e.preventDefault();
    document.documentElement.classList.add('wd-leaving');
    setTimeout(() => (location.href = a.href), 170);
  });
  window.addEventListener('pageshow', () => document.documentElement.classList.remove('wd-leaving'));
}

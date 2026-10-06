// Page-wide motion that lives outside React rendering: scroll reveals, count-ups,
// parallax, tilt, magnetic buttons, cursor glow, progress bar and the shrinking nav.
// Everything writes styles straight to elements from the shared rAF loop in motion.js.
import { subscribe, startMotion, state, approach, clamp, docRect, cached } from './motion.js';

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function reveals() {
  const els = [...document.querySelectorAll('[data-reveal]')];
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
  );
  els.forEach((el) => io.observe(el));
}

function countUps() {
  const els = [...document.querySelectorAll('[data-count]')];
  if (!els.length) return;
  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const suffix = el.dataset.suffix || '';
    if (state.reduced) return;
    let t = 0;
    const dur = 1400;
    el.textContent = (0).toFixed(decimals) + suffix;
    const off = subscribe((dt) => {
      t = Math.min(dur, t + dt);
      const k = 1 - Math.pow(1 - t / dur, 3);
      el.textContent = (target * k).toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (t >= dur) {
        off();
        return false;
      }
      return true;
    });
  };
  // keep the prerendered final number until the element is actually on screen
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        io.unobserve(e.target);
        run(e.target);
      }
    });
  }, { threshold: 0.4 });
  els.forEach((el) => io.observe(el));
}

function parallax() {
  const els = [...document.querySelectorAll('[data-parallax]')].map((el) => ({ el, k: parseFloat(el.dataset.parallax) || 0.1, cur: 0 }));
  if (!els.length) return;
  subscribe((dt) => {
    if (state.reduced) return false;
    let busy = false;
    els.forEach((p) => {
      const g = docRect(p.el.parentElement);
      const top = g.top - state.y;
      if (top + g.height < -200 || top > state.vh + 200) return;
      const center = top + g.height / 2 - state.vh / 2;
      const target = -center * p.k;
      p.cur = approach(p.cur, target, dt, 90);
      if (p.cur !== target) busy = true;
      const v = p.cur.toFixed(1);
      if (v !== p.v) {
        p.el.style.transform = `translate3d(0, ${v}px, 0)`;
        p.v = v;
      }
    });
    return busy;
  });
}

function tilt() {
  if (!finePointer()) return;
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (state.reduced) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-4px)`;
      el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

function magnetic() {
  if (!finePointer()) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (state.reduced) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${(x * 0.22).toFixed(1)}px, ${(y * 0.3).toFixed(1)}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

function cursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  if (!finePointer()) {
    glow.style.display = "none";
    return;
  }
  const pos = { x: state.vw / 2, y: state.vh / 3, tx: state.vw / 2, ty: state.vh / 3 };
  window.addEventListener('pointermove', (e) => {
    pos.tx = e.clientX;
    pos.ty = e.clientY;
    glow.classList.add('wd-on');
    kickGlow();
  }, { passive: true });
  let off = null;
  function kickGlow() {
    if (off) return;
    off = subscribe((dt) => {
      pos.x = approach(pos.x, pos.tx, dt, 110);
      pos.y = approach(pos.y, pos.ty, dt, 110);
      glow.style.transform = `translate3d(${(pos.x - 200).toFixed(1)}px, ${(pos.y - 200).toFixed(1)}px, 0)`;
      if (pos.x === pos.tx && pos.y === pos.ty) {
        off();
        off = null;
        return false;
      }
      return true;
    });
  }
}

function chrome() {
  const bar = document.getElementById('progress');
  const nav = document.getElementById('nav');
  let shrunk = null;
  let last = '';
  subscribe(() => {
    const root = document.documentElement;
    const max = Math.max(1, cached(root, 'sh', () => root.scrollHeight) - state.vh);
    const v = clamp(state.y / max).toFixed(3);
    if (bar && v !== last) {
      bar.style.transform = `scaleX(${v})`;
      last = v;
    }
    const s = state.y > 40;
    if (nav && s !== shrunk) {
      nav.classList.toggle('wd-shrunk', s);
      shrunk = s;
    }
    return false;
  });
}

// Ambient loops (marquees, spinning rings, blobs, sheen) pause while their section is off-screen.
function idleSections() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('wd-idle', !e.isIntersecting));
  }, { rootMargin: '120px 0px' });
  document.querySelectorAll('main > section, footer').forEach((el) => io.observe(el));
}

export function startEffects() {
  startMotion();
  reveals();
  countUps();
  parallax();
  tilt();
  magnetic();
  cursorGlow();
  chrome();
  idleSections();
  window.__wdReady = true;
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
  }
}

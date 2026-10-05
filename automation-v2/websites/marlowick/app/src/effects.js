// Page-wide effects started once after hydration: reveals, count-ups,
// parallax, nav shrink and the scroll-progress bar. All run outside React.
import { subscribe, kick, state, approach, clamp } from './motion.js';

export function startReveals() {
  const els = [...document.querySelectorAll('[data-reveal]')];
  if (state.reduced || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return () => {};
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
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

export function startCounts() {
  const els = [...document.querySelectorAll('[data-count]')];
  if (state.reduced) return () => {};
  const runs = new Map();
  // numbers keep their final (prerendered) value until they scroll into view, then count up from 0
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting || runs.has(e.target)) return;
        e.target.textContent = format(e.target, 0);
        runs.set(e.target, 0);
        kick();
        io.unobserve(e.target);
      });
    },
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
  const off = subscribe((dt) => {
    let busy = false;
    runs.forEach((elapsed, el) => {
      if (elapsed >= 1) return;
      const next = Math.min(1, elapsed + dt / 1100);
      runs.set(el, next);
      const eased = 1 - Math.pow(1 - next, 3);
      el.textContent = format(el, Math.round(Number(el.dataset.count) * eased));
      busy = true;
    });
    return busy;
  });
  return () => {
    io.disconnect();
    off();
  };
}

function format(el, n) {
  return (el.dataset.prefix || '') + n + (el.dataset.suffix || '');
}

export function startParallax() {
  const els = [...document.querySelectorAll('[data-speed]')];
  const cur = new Map(els.map((el) => [el, 0]));
  return subscribe((dt) => {
    if (state.reduced) return false;
    let busy = false;
    els.forEach((el) => {
      const host = el.parentElement.getBoundingClientRect();
      if (host.bottom < -200 || host.top > state.vh + 200) return;
      const center = host.top + host.height / 2 - state.vh / 2;
      const target = -center * (Number(el.dataset.speed) - 1) * 0.35;
      const v = approach(cur.get(el), target, dt, 90);
      if (v !== cur.get(el)) busy = true;
      cur.set(el, v);
      el.style.transform = `translate3d(0, ${v.toFixed(2)}px, 0)`;
    });
    return busy;
  });
}

export function startChrome(nav, bar) {
  let p = 0;
  return subscribe((dt) => {
    const max = Math.max(1, document.documentElement.scrollHeight - state.vh);
    const target = clamp(state.y / max);
    p = approach(p, target, dt, 60);
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    if (nav) nav.classList.toggle('wd-shrunk', state.y > 40);
    return p !== target;
  });
}

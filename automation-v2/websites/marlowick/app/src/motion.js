// One shared requestAnimationFrame loop for every scroll and frame animation.
// Subscribers write styles straight to elements; React never re-renders on scroll.
// Timing uses rAF timestamps only, so slowed-down recordings stay in sync.

const subs = new Set();
let running = false;
let last = 0;
let idleFrames = 0;

export const state = { y: 0, vh: 1, vw: 1, reduced: false };

function measure() {
  state.y = window.scrollY;
  state.vh = window.innerHeight;
  state.vw = window.innerWidth;
}

function frame(t) {
  const dt = last ? Math.min(64, t - last) : 16;
  last = t;
  measure();
  let busy = false;
  subs.forEach((fn) => {
    if (fn(dt, t)) busy = true;
  });
  idleFrames = busy ? 0 : idleFrames + 1;
  // keep running a little after the last change so eased values settle
  if (idleFrames < 30) requestAnimationFrame(frame);
  else {
    running = false;
    last = 0;
  }
}

export function kick() {
  idleFrames = 0;
  if (!running) {
    running = true;
    requestAnimationFrame(frame);
  }
}

export function subscribe(fn) {
  subs.add(fn);
  kick();
  return () => subs.delete(fn);
}

export function startMotion() {
  state.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  measure();
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick);
  kick();
}

// Ease toward a target over time (frame-rate independent).
export function approach(current, target, dt, ms = 140) {
  const k = 1 - Math.exp(-dt / ms);
  const next = current + (target - current) * k;
  return Math.abs(target - next) < 0.0005 ? target : next;
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

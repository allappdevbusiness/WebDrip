// Time-based (seconds) motion helpers. Everything is a pure function of t so scenes stay deterministic.
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

export const ease = {
  linear: (x: number) => x,
  outCubic: (x: number) => 1 - Math.pow(1 - x, 3),
  inCubic: (x: number) => x * x * x,
  inOutCubic: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outExpo: (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inExpo: (x: number) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
  inOutExpo: (x: number) =>
    x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  outBack: (x: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  outQuint: (x: number) => 1 - Math.pow(1 - x, 5),
  inQuart: (x: number) => x * x * x * x,
};
export type Ease = (x: number) => number;

// eased progress between a and b
export const ep = (t: number, a: number, b: number, e: Ease = ease.outCubic) => e(prog(t, a, b));

// keyframes: [[time, value, easeIntoThisKey?], ...]
export type Key = [number, number, Ease?];
export const kf = (t: number, keys: Key[]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (t <= t1) return lerp(v0, v1, (e ?? ease.inOutCubic)(prog(t, t0, t1)));
  }
  return keys[keys.length - 1][1];
};

// "slam": arrives from `from` scale and lands exactly at `at` (1.0), tiny settle after
export const slam = (t: number, at: number, from = 2.2, pre = 0.1) => {
  if (t < at - pre) return from;
  if (t < at) return lerp(from, 1, ease.inQuart(prog(t, at - pre, at)));
  const k = t - at;
  return 1 + 0.045 * Math.exp(-k * 18) * Math.cos(k * 40);
};

// decaying impulse at `at`: 1 → 0 over `dur`
export const impulse = (t: number, at: number, dur = 0.3) => (t < at || t > at + dur ? 0 : Math.pow(1 - (t - at) / dur, 2));

// pseudo-random but deterministic
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// camera shake from a list of impacts
export type Impact = { t: number; amp: number; dur?: number };
export const shake = (t: number, impacts: Impact[]) => {
  let x = 0, y = 0, r = 0, s = 0;
  for (const im of impacts) {
    const d = im.dur ?? 0.35;
    if (t < im.t || t > im.t + d) continue;
    const k = (t - im.t) / d;
    const a = im.amp * Math.pow(1 - k, 2);
    x += Math.sin(t * 91 + im.t * 7) * 22 * a;
    y += Math.cos(t * 77 + im.t * 3) * 22 * a;
    r += Math.sin(t * 63 + im.t) * 0.9 * a;
    s += 0.035 * a * (1 - k);
  }
  return { x, y, r, s };
};

// visible only while a <= t < b
export const within = (t: number, a: number, b: number) => t >= a && t < b;

// "hit": for hard cuts — appears ON the beat oversized and snaps down to 1 just after
export const hit = (t: number, at: number, from = 1.6, dur = 0.14) => {
  if (t < at) return from;
  if (t < at + dur) return lerp(from, 1, ease.outExpo((t - at) / dur));
  const k = t - at - dur;
  return 1 + 0.02 * Math.exp(-k * 14) * Math.cos(k * 34);
};

import { Easing, interpolate } from 'remotion';

// Marlowick source palette (automation-v2/websites/marlowick/app/src/index.css)
export const C = {
  ivory: '#FAF7F0',
  cobalt: '#2747D6',
  deep: '#1B32A3',
  camel: '#C08A4E',
  sky: '#E9F0FF',
  ink: '#121826',
  white: '#FFFFFF',
  sand: '#F0D2AC',
};
export const SANS = 'Inter, system-ui, sans-serif';
export const MONO = '"JetBrains Mono", ui-monospace, monospace';
// Working area for essential text on the 1080 x 1920 canvas (TikTok UI clearance)
export const SAFE = { x0: 90, x1: 870, y0: 220, y1: 1480 };

export const E = {
  snap: Easing.bezier(0.16, 1, 0.3, 1), // fast attack, long settle
  accel: Easing.bezier(0.7, 0, 0.84, 0), // anticipation: speeds up into the beat
  whip: Easing.bezier(0.85, 0, 0.15, 1), // camera whip: slow - very fast - slow
  glide: Easing.bezier(0.45, 0, 0.55, 1),
  land: Easing.spring({ damping: 14, mass: 0.6 }), // one controlled overshoot for slams
  soft: Easing.spring({ damping: 200 }),
};

// clamped keyframe helper (one easing per segment, or one for all)
export const k = (f: number, input: number[], output: number[], easing: ((t: number) => number) | ((t: number) => number)[] = E.snap) =>
  interpolate(f, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

// decaying shake after an impact frame: deterministic (no randomness), amplitude in px
export const shake = (f: number, at: number, amp = 18, len = 14) => {
  const t = f - at;
  if (t < 0 || t > len) return { x: 0, y: 0 };
  const d = Math.pow(1 - t / len, 2);
  return { x: Math.sin(t * 2.7) * amp * d, y: Math.cos(t * 3.9) * amp * 0.7 * d };
};

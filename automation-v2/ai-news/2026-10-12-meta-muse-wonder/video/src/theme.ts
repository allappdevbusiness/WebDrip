// Muse Wonder news short: shared timing grid, palette, type and motion maths.
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1800; // 60.0 s

// Music: "Come 2gether (House Remix)" by Ooyy, 122.0 BPM. Video beat 0 = first kick of the source.
export const BEAT = 60 / 122;
export const BAR = BEAT * 4;
export const b = (n: number) => n * BEAT;
export const DROP = 8 * BAR; // 15.738 s: ACTIVE MEMORY lands on the drop

// TikTok safe area: x 120-960, y 150-1520; below y 900 keep clear of the button column (x > 940).
export const SAFE = { x: 120, y: 150, w: 840, h: 1370 };
export const CAPTION_Y = 1425; // centre of the caption lane

export const C = {
  ink: '#0B0B0C',
  ink2: '#17171A',
  paper: '#F2EFE8',
  paper2: '#E6E2D8',
  white: '#FFFFFF',
  blue: '#0866FF', // flat Meta blue, used only for Meta-specific marks
  yellow: '#FFE14D', // highlighter
  red: '#FF3B30',
  amber: '#FFB020',
  green: '#22C55E',
  grey: '#8A8A93',
  line: 'rgba(255,255,255,.14)',
};

export const F = {
  display: 'Anton, Impact, sans-serif',
  ui: '"Inter Tight", Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  hand: 'Caveat, cursive',
};

export const FONTS = [
  { family: 'Inter Tight', file: 'inter-tight-latin-500-normal.woff2', weight: '500' },
  { family: 'Inter Tight', file: 'inter-tight-latin-600-normal.woff2', weight: '600' },
  { family: 'Inter Tight', file: 'inter-tight-latin-700-normal.woff2', weight: '700' },
  { family: 'Inter Tight', file: 'inter-tight-latin-800-normal.woff2', weight: '800' },
  { family: 'Inter Tight', file: 'inter-tight-latin-900-normal.woff2', weight: '900' },
  { family: 'Anton', file: 'anton-latin-400-normal.woff2', weight: '400' },
  { family: 'JetBrains Mono', file: 'jetbrains-mono-latin-500-normal.woff2', weight: '500' },
  { family: 'JetBrains Mono', file: 'jetbrains-mono-latin-700-normal.woff2', weight: '700' },
  { family: 'Caveat', file: 'caveat-latin-700-normal.woff2', weight: '700' },
];

// ---------- motion ----------
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const prog = (s: number, start: number, dur: number) => clamp((s - start) / dur);
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)));
export const easeIn = (t: number) => Math.pow(clamp(t), 3);
export const easeInOut = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
// small single overshoot, settles exactly at 1
export const backOut = (t: number, k = 1.6) => { t = clamp(t); const c3 = k + 1; return 1 + c3 * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2); };
// deterministic handheld drift (px) from time in seconds
export const shake = (s: number, amp = 1, seed = 0) => ({
  x: amp * (Math.sin(s * 1.7 + seed) * 5 + Math.sin(s * 4.3 + seed * 2) * 2 + Math.sin(s * 9.1 + seed * 3) * 0.8),
  y: amp * (Math.cos(s * 1.3 + seed) * 4 + Math.sin(s * 3.9 + seed * 5) * 2 + Math.cos(s * 8.3 + seed) * 0.8),
  r: amp * (Math.sin(s * 1.1 + seed) * 0.35 + Math.sin(s * 3.3 + seed) * 0.12),
});
// quick reaction punch-in: fast 0.3 s zoom that lands and keeps easing
export const punch = (s: number, at: number, amount = 0.18) => {
  if (s < at) return 1;
  const p = (s - at) / 0.3;
  return 1 + amount * (p < 1 ? easeOutExpo(p) : 1) + 0.02 * clamp((s - at - 0.3) / 1.5);
};
export const inWin = (s: number, a: number, bb: number) => s >= a && s < bb;

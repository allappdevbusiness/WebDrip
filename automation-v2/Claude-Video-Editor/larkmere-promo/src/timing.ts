// Every scene boundary below comes from music-map.json (measured on the licensed WAVs, not guessed).
// video = song - 72.5553 s for the vocal segment; drums enter at song 77.612 = frame 152.
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const TOTAL = 900; // exactly 30.000 s

export const BEAT = 18.948; // frames per beat at 95 BPM (0.6316 s)
export const F = {
  musicIn: 76,     // bar 28 downbeat: breath bar, guitar only
  pullBack: 130,   // instrument dip before the drums
  pickup: 145,     // vocal "So"
  drums: 152,      // bar 29: drums enter for the first time + "slow"  -> LARKMERE reveal
  bar30: 228,      // "hold you in my arms"
  bar31: 304,      // "won't let go"
  bar32: 379,      // "The world around could pass us by"
  bar33: 455,      // "a thunderstorm, a lightning strike" (rise)
  thunder: 472,
  lightning: 502,
  bar34: 531,      // "as we hold each other"
  tight: 607,      // bar 35: "...tight" resolves -> ribbon pulls tight
  breath: 633,     // vocal rest begins
  bar36: 683,
  stop: 739,       // one-beat drum stop under "You're the"
  rose: 758,       // bar 37: "ROSE" + drums return
  garden: 781,
  resolve: 834,    // bar 38: "garden" lands on the tonic -> final chord (instrumental 196.371 s)
  end: 900,
};
export const beat = (from: number, k: number) => Math.round(from + k * BEAT);

// Hook slot. The official Gatsby clip could not be downloaded in this environment (network policy).
// Drop an authorised clip at public/hook/gatsby.mp4 and set src to 'hook/gatsby.mp4'; inFrame is the
// first frame of the moment you want (in the clip's own 30 fps frames), focusX the horizontal crop.
export const HOOK: { src: string | null; inFrame: number; focusX: number; credit: string } = {
  src: null,
  inFrame: 0,
  focusX: 50,
  credit: 'The Great Gatsby (2013) · Warner Bros. Pictures',
};

export const C = {
  paper: '#FBF6F0', card: '#FFFFFF', petal: '#F6E4E0', linen: '#F3ECE1', rose: '#A8325A', roseSoft: '#F2C6D1',
  violet: '#6B4FA0', lilac: '#E9E2F4', moss: '#3E5B3F', sage: '#E3EADB', ink: '#221A20', muted: '#5E5359', drip: '#0075DE',
};
export const FONT = { display: '"Abril Fatface", Georgia, serif', sans: 'Inter, system-ui, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace' };

// Every scene boundary below comes from music-map.json (measured on the licensed WAVs, not guessed).
// video = song - 67.512 s for the vocal segment: frame 0 is the bar-25 downbeat, drums enter at song 77.612 = frame 303.
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const TOTAL = 1050; // exactly 35.000 s

export const BEAT = 18.948; // frames per beat at 95 BPM (0.6316 s)
export const F = {
  intro: 0,        // bar 25: airy "ooh" tail, no drums -> the template being overgrown
  you: 72,         // vocal "You" pickup into bar 26
  bar26: 76,
  bar27: 152,
  hook2: 227,      // bar 28 downbeat: breath bar, guitar only -> "A FLOWER SHOP SHOULD FEEL LIKE THIS."
  pullBack: 281,   // instrument dip before the drums
  pickup: 296,     // vocal "So"
  drums: 303,      // bar 29: drums enter for the first time + "slow"  -> LARKMERE reveal
  bar30: 379,      // "hold you in my arms"
  bar31: 455,      // "won't let go"
  bar32: 530,      // "The world around could pass us by"
  bar33: 606,      // "a thunderstorm, a lightning strike" (rise)
  bar34: 682,      // "as we hold each other"
  tight: 758,      // bar 35: "...tight" resolves -> ribbon pulls tight
  bar36: 834,
  stop: 890,       // one-beat drum stop under "You're the"
  rose: 909,       // bar 37: "ROSE" + drums return
  resolve: 985,    // bar 38: "garden" lands on the tonic -> final chord (instrumental 196.371 s)
  end: 1050,
};
export const beat = (from: number, k: number) => Math.round(from + k * BEAT);

export const C = {
  paper: '#FBF6F0', card: '#FFFFFF', petal: '#F6E4E0', linen: '#F3ECE1', rose: '#A8325A', roseSoft: '#F2C6D1',
  violet: '#6B4FA0', lilac: '#E9E2F4', moss: '#3E5B3F', sage: '#E3EADB', ink: '#221A20', muted: '#5E5359', drip: '#0075DE',
};
export const FONT = { display: '"Abril Fatface", Georgia, serif', sans: 'Inter, system-ui, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace' };

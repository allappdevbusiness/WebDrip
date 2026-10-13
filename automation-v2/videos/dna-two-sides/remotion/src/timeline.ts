// Master timeline in video seconds. Every overlay, clip remap and sound cue reads from here,
// so the edit, the captions and the mix stay locked to the same numbers.
export const FPS = 30;
export const DUR = 75.0;

// voiceover line starts (word offsets come from whisper; see captions.json)
export const VO: Record<string, number> = {
  l01: 0.6, l02: 3.7, l03: 6.55, l04: 10.95, l05: 13.4, l06: 15.75, l07: 20.75, l08: 22.9, l09: 24.85,
  l10: 26.6, l11: 28.6, l12: 33.2, l13: 39.2, l14: 47.3, l15: 50.0, l16: 56.3, l17: 58.8, l18: 63.1, l19: 66.8, l20: 71.3,
};

// key beats (seconds) derived from VO word times
export const T = {
  virginia: 0.45, richmond: 1.5, y1987: VO.l01 + 1.44,
  slam: [VO.l03, VO.l03 + 0.84, VO.l03 + 1.56, VO.l03 + 2.32],
  dates: [VO.l04, VO.l04 + 0.86, VO.l04 + 1.5],
  samePattern: VO.l05 + 1.08,
  pins: [VO.l06, VO.l06 + 0.34, VO.l06 + 1.76], connect: VO.l06 + 2.8, stop: 20.4,
  printStrike: 24.0, sketchStrike: 25.7, dark: 26.45,
  dna: VO.l10 + 0.28, match: VO.l11 + 1.42, spencer: VO.l11 + 3.16, through: 32.4,
  y1988: VO.l12 + 0.1, first: VO.l12 + 2.68, admit: VO.l12 + 4.1,
  names: [41.4, 42.3, 43.2, 44.1], four: 45.0,
  paper: 49.2, y1984: VO.l15 + 0.08, vasquez: VO.l15 + 4.52, y35: VO.l16 + 0.98, served: VO.l17 + 0.32, reopened: VO.l17 + 2.5,
  doorOpen: 62.8, pardoned: VO.l18 + 2.12,
  convict: VO.l19 + 1.08, exonerate: VO.l19 + 2.62, oneTech: VO.l20, twoLives: VO.l20 + 1.24, fade: 74.3,
};

// scene windows
export const SC = {
  map: [0, 4.0], street: [4.0, 6.1], desk: [6.1, 10.7], timeline: [10.7, 15.5], board: [15.5, 22.6], print: [22.6, 26.64],
  dna: [26.88, 34.3], court: [34.3, 39.0], cases: [39.0, 47.0], interrupt: [47.0, 51.0], vasquez: [51.0, 62.8],
  pardon: [62.8, 66.6], final: [66.6, 75.0],
} as const;

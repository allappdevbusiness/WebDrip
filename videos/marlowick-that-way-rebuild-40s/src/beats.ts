// Beat map for "That Way" (Nbhd Nick), section 01:21.088 -> 02:01.088 (continuous, no edits).
// Measured from the licensed full mix and drum stem: 137.00 BPM, kick on beat 1, half-time snare on beat 3.
// Video frame 0 = song 01:21.088. The drop's first kick (song 01:24.088) lands on frame 180.
// beat(n) uses the song's absolute beat index n (beat 192 = the drop), so no rounding accumulates.

export const FPS = 60;
export const W = 1080;
export const H = 1920;
export const DURATION = 2400;
export const SONG_START_S = 81.088;
export const BEAT_S = 60 / 137;
export const beat = (n: number) => Math.round(180 + (n - 192) * BEAT_S * FPS);

// Scene boundaries (all on measured musical events)
export const SCENES = {
  hook: { from: 0, to: beat(192) },             // 0.000  drumless breakdown, vocal "...proud of me"
  explode: { from: beat(192), to: beat(208) },  // 3.000  DROP -> hook lines 1-2
  collection: { from: beat(208), to: beat(224) }, // 10.007 hook lines 3-4
  mobile: { from: beat(224), to: beat(240) },   // 17.015 chorus starts
  payoff: { from: beat(240), to: beat(248) },   // 24.022 chorus, second half
  montage: { from: beat(248), to: beat(256) },  // 27.526 chorus end, fastest cutting
  hold: { from: beat(256), to: beat(260) },     // 31.029 drums drop out (break)
  hero: { from: beat(260), to: beat(264) },     // 32.781 bass returns - hero moment
  cta: { from: beat(264), to: DURATION },       // 34.533 lighter verse - CTA
} as const;

export const EV = {
  // hook (drumless): words land on the breakdown's quarter notes
  hookPaid: beat(186),
  hookCountStart: beat(187),
  hookCountLand: beat(188),
  hookFor: beat(190),
  hookThis: beat(191),
  drop: beat(192),
  // explode
  tagA: beat(194),
  tagB: beat(195),
  tagC: beat(196),
  explode: beat(197),
  notTemplate: beat(200),
  dolly: beat(202),
  rebuildStart: beat(206),
  rebuild: beat(207),
  buttonPush: beat(207),
  // collection
  corridor: beat(208),
  macro1: beat(212),
  macro2: beat(213),
  macro3: beat(214),
  macro4: beat(214.5),
  gridLand: beat(216),
  breath: beat(221),
  fall1: beat(222),
  fall2: beat(222.5),
  fall3: beat(223),
  fall4: beat(223.5),
  // mobile
  phoneSlam: beat(224),
  tapBook: beat(229),
  travelStart: beat(229) + 6,
  arrive: beat(232),
  occasionPress: beat(236),
  occasionSelect: beat(236.5),
  phoneExit: beat(239),
  // payoff
  plan2: beat(240),
  plan1: beat(240.5),
  plan3: beat(242),
  priceMacro: beat(243),
  split: beat(245),
  splitPunch: beat(246.5),
  // montage, hold, hero, cta
  montage: beat(248),
  montageFast: beat(254.5),
  hold: beat(256),
  holdWorth: beat(257),
  holdPrice: beat(258),
  hero: beat(260),
  heroShine: beat(262),
  cta: beat(264),
  ctaComment: beat(265),
  ctaPrompt: beat(266),
  ctaDm: beat(267),
  ctaFollow: beat(268),
} as const;

import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import meta from './sfx-meta.json';
import { riff, CYCLE, DRUMS_IN, VOCALS_IN, RELEASE, PRECHORUS, beatsAfter, frames, FPS, DURATION } from './timing';
import { Impact } from './lib/motion';
import { HOOK_END } from './scenes/Hook';
import { PAYOFF_TIMES } from './scenes/Payoff';

// Licensed Epidemic Sound SFX. `at` is the musical/visual event; each file is shifted so its
// measured transient peak (sfx-meta.json) lands exactly on `at` (or `lead` seconds before it).
type Name = keyof typeof meta;
type Cue = { at: number; s: Name; v: number; shake?: number; lead?: number };
const r = riff;

export const CUES: Cue[] = [
  // HOOK
  { at: 0, s: 'impact_heavy', v: 0.9, shake: 1 },
  { at: 0, s: 'impact_deep_boom', v: 0.55 },
  { at: r(0, 'E2'), s: 'stamp', v: 0.42, shake: 0.35 },
  { at: r(0, 'G'), s: 'stamp', v: 0.46, shake: 0.4 },
  { at: r(0, 'E3'), s: 'stamp', v: 0.5, shake: 0.45 },
  { at: r(0, 'D'), s: 'stamp', v: 0.56, shake: 0.5 },
  { at: r(0, 'C'), s: 'kaching', v: 0.5 },
  { at: r(0, 'C'), s: 'thud', v: 0.5, shake: 0.4 },
  { at: HOOK_END, s: 'whoosh_deep', v: 0.6 }, // dive through the 0
  // TEASE
  { at: r(1, 'E') + 0.25, s: 'swish2', v: 0.35 }, // marquee band whip
  { at: r(1, 'E2'), s: 'swipe', v: 0.4 },
  { at: r(1, 'E3'), s: 'swipe', v: 0.4 },
  { at: r(1, 'D'), s: 'sizzle', v: 0.45 },
  { at: r(1, 'C') + 0.1, s: 'swish1', v: 0.4 }, // strips whip in
  { at: r(1, 'B') + 0.3, s: 'paper', v: 0.35 }, // strips lock into the page
  { at: DRUMS_IN, s: 'riser', v: 0.5 },
  // REVEAL
  { at: DRUMS_IN, s: 'impact_deep_boom', v: 0.85, shake: 1 },
  { at: DRUMS_IN, s: 'impact_heavy', v: 0.6 },
  { at: r(2, 'E2'), s: 'swish1', v: 0.25 },
  { at: r(2, 'E3'), s: 'swish2', v: 0.25 },
  { at: r(2, 'C'), s: 'whoosh_wide', v: 0.9 }, // desktop swings in
  { at: r(2, 'C'), s: 'paper', v: 0.4, shake: 0.3 },
  { at: r(2, 'B'), s: 'paper', v: 0.4, shake: 0.3 },
  { at: CYCLE[3], s: 'swish2', v: 0.4, lead: 0.03 }, // push through the phone
  // MENU RAIN
  { at: r(3, 'E'), s: 'thud', v: 0.45 },
  { at: r(3, 'E2'), s: 'thud', v: 0.4 },
  { at: r(3, 'G'), s: 'thud', v: 0.4 },
  { at: r(3, 'E3'), s: 'thud', v: 0.4 },
  { at: r(3, 'D'), s: 'thud', v: 0.4 },
  { at: r(3, 'C'), s: 'whoosh_wide', v: 0.8 },
  { at: r(3, 'B'), s: 'stamp', v: 0.45, shake: 0.4 },
  { at: CYCLE[4], s: 'swish1', v: 0.4, lead: 0.03 }, // whip out on the vocal pickup
  // FOOD → UI
  { at: r(4, 'C') + 0.25, s: 'whoosh_wide', v: 0.7 },
  // TACO CHAPTER
  { at: r(5, 'E'), s: 'paper', v: 0.3 },
  { at: r(5, 'G'), s: 'paper', v: 0.3 },
  { at: r(5, 'C'), s: 'paper', v: 0.3 },
  { at: r(5, 'B') + 0.2, s: 'swish2', v: 0.3 },
  // FLYOVER
  { at: r(6, 'E'), s: 'whoosh_deep', v: 0.4, lead: -0.2 },
  { at: r(6, 'G'), s: 'pop', v: 0.22 },
  { at: r(6, 'D'), s: 'pop', v: 0.22 },
  { at: r(6, 'C'), s: 'pop', v: 0.22 },
  { at: r(6, 'B'), s: 'kaching', v: 0.45 },
  { at: r(6, 'B'), s: 'stamp', v: 0.5, shake: 0.6 },
  // INTERACT
  { at: r(7, 'E2'), s: 'click', v: 0.8 },
  { at: r(7, 'G'), s: 'click', v: 0.8 },
  { at: r(7, 'E3'), s: 'click', v: 0.8 },
  { at: r(7, 'D'), s: 'click', v: 0.8 },
  { at: r(7, 'C') + 0.1, s: 'swish1', v: 0.3 },
  { at: r(7, 'B') + 0.12, s: 'click', v: 0.9 },
  { at: beatsAfter(r(7, 'B'), 1), s: 'success', v: 0.3 },
  // OWNER CONTROL
  { at: CYCLE[8], s: 'impact_heavy', v: 0.7, shake: 0.8 },
  { at: r(8, 'E2'), s: 'stamp', v: 0.5, shake: 0.5 },
  { at: r(8, 'G'), s: 'swish1', v: 0.3 },
  { at: r(8, 'E3'), s: 'click', v: 0.9 },
  { at: r(8, 'D'), s: 'confirm', v: 0.55 },
  { at: r(8, 'C'), s: 'swish2', v: 0.3 },
  { at: beatsAfter(r(8, 'C'), 1), s: 'click', v: 0.9 },
  { at: r(8, 'B'), s: 'confirm', v: 0.55 },
  { at: r(9, 'E'), s: 'swish1', v: 0.3 },
  { at: r(9, 'E2'), s: 'shutter', v: 0.5 },
  { at: r(9, 'G'), s: 'confirm', v: 0.55 },
  { at: r(9, 'C'), s: 'stamp', v: 0.55, shake: 0.6 },
  { at: r(9, 'B'), s: 'impact_heavy', v: 0.75, shake: 0.9 },
  // ESCALATE
  { at: r(10, 'E'), s: 'swish2', v: 0.35, lead: 0.02 },
  { at: r(10, 'E2'), s: 'sizzle', v: 0.3 },
  { at: r(10, 'D'), s: 'stamp', v: 0.45, shake: 0.4 },
  { at: r(10, 'C'), s: 'whoosh_wide', v: 0.7 },
  { at: r(10, 'B'), s: 'paper', v: 0.35 },
  { at: r(11, 'E'), s: 'thud', v: 0.45, shake: 0.25 },
  { at: r(11, 'E2'), s: 'thud', v: 0.45, shake: 0.25 },
  { at: r(11, 'G'), s: 'thud', v: 0.45, shake: 0.25 },
  { at: r(11, 'E3'), s: 'thud', v: 0.45, shake: 0.25 },
  { at: r(11, 'D'), s: 'thud', v: 0.45, shake: 0.25 },
  { at: r(11, 'C'), s: 'thud', v: 0.5, shake: 0.3 },
  { at: RELEASE, s: 'riser', v: 0.6 },
  // PAYOFF
  { at: RELEASE, s: 'boom_final', v: 0.95, shake: 1.1 },
  { at: RELEASE, s: 'impact_heavy', v: 0.6 },
  { at: PRECHORUS, s: 'stamp', v: 0.55, shake: 0.6 },
  { at: PAYOFF_TIMES.BTN, s: 'paper', v: 0.4, shake: 0.35 },
  { at: PAYOFF_TIMES.PRESS, s: 'click', v: 1 },
  { at: PAYOFF_TIMES.FINAL, s: 'impact_deep_boom', v: 0.8, shake: 0.7 },
];

export const IMPACTS: Impact[] = CUES.filter((c) => c.shake).map((c) => ({ t: c.at, amp: c.shake! }));

export const SoundDesign: React.FC = () => (
  <>
    {CUES.map((c, i) => {
      const start = c.at - (c.lead ?? 0) - meta[c.s].peak;
      const from = frames(Math.max(0, start));
      const trim = start < 0 ? Math.round(-start * FPS) : 0;
      const len = Math.min(frames(meta[c.s].dur) - trim, DURATION * FPS - from);
      if (len <= 0) return null;
      // short fade on anything still sounding at the very last frame (no click on the hard end)
      const tailFade = from + len >= DURATION * FPS - 1;
      return (
        <Sequence key={i} from={from} durationInFrames={len} layout="none">
          <Audio
            src={staticFile(`sfx/${c.s}.wav`)}
            startFrom={trim}
            volume={(f) => (tailFade ? c.v * Math.min(1, (len - f) / 9) : c.v)}
          />
        </Sequence>
      );
    })}
  </>
);

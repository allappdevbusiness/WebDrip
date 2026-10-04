// This run's story timeline — REPLACE everything here from the creative brief (briefs/<slug>.md).
// The toolkit ships no scene order, pacing or edit style: only this contract, which Promo.tsx and check.mjs rely on.
import { Fmt } from './kit';

export const DURATION = 1350;          // 45 s at 30 fps
export const X = 8;                     // half transition length in frames
// one entry per act/scene of the brief's shot list, boundaries snapped to the track's beats
export const ACTS = [{ id: 'replace-me', start: 0, end: DURATION }] as const;
export type ActId = typeof ACTS[number]['id'];
export const actStart = (i: number) => Math.max(0, ACTS[i].start - (i === 0 ? 0 : X));
export const actEnd = (i: number) => Math.min(DURATION, ACTS[i].end + (i === ACTS.length - 1 ? 0 : X));
export const LOGO_HIT = 1170;           // strongest late music hit (frame) for the WebDrip logo

// largest 3D rotation (deg) applied to any element at frame t — every resting hold must read 0
export function tiltAt(_f: Fmt, _t: number): number { return 0; }

// frames check.mjs samples: resting holds (settled, flat, centred, inside the safe area) and transition midpoints
export function checkFrames(): { f: number; kind: 'rest' | 'transition'; act: string }[] {
  const out: { f: number; kind: 'rest' | 'transition'; act: string }[] = [];
  ACTS.forEach((a, i) => {
    const s = a.start + (i === 0 ? 30 : X + 18), e = a.end - (i === ACTS.length - 1 ? 1 : X + 2);
    out.push({ f: s, kind: 'rest', act: a.id }, { f: Math.round((s + e) / 2), kind: 'rest', act: a.id }, { f: e, kind: 'rest', act: a.id });
    if (i > 0) out.push({ f: a.start, kind: 'transition', act: a.id });
  });
  return out;
}

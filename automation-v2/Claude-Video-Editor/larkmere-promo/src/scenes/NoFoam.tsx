import React, { useMemo } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { C, FONT, W } from '../timing';
import { Photo, measure, outQuart, ramp } from '../lib';

// frames 379–455 (bar 32, "The world around could pass us by"). The site's own promise, one beat per claim:
// "No foam, no plastic, no flowers flown halfway round the world." Hard cuts on the beat, macro petals behind.
type Panel = { photo: string; pos?: string; lines: string[]; ink: string; scrim: string; dur: number };
const PANELS: Panel[] = [
  { photo: 'photos/macro-pink-droplets.jpg', pos: '50% 50%', lines: ['No', 'foam.'], ink: C.ink, scrim: 'rgba(251,246,240,.28)', dur: 19 },
  { photo: 'photos/macro-peony-black.jpg', pos: '42% 50%', lines: ['No', 'plastic.'], ink: C.paper, scrim: 'rgba(20,12,16,.30)', dur: 19 },
  { photo: 'photos/macro-dusty-rose.jpg', pos: '50% 40%', lines: ['No flowers', 'flown halfway', 'round the', 'world.'], ink: C.paper, scrim: 'rgba(30,18,24,.38)', dur: 38 },
];

const Stack: React.FC<{ lines: string[]; color: string; t: number; step: number }> = ({ lines, color, t, step }) => {
  const L = useMemo(() => {
    const width = 860;
    return lines.map((s) => { const m = measure(s, FONT.display, 400, 100); const size = Math.min(330, (100 * width) / m.w); return { s, size, cap: (m.cap * size) / 100, w: (m.w * size) / 100 }; });
  }, [lines]);
  const total = L.reduce((a, l) => a + l.cap * 1.32, 0);
  let y = 960 - total / 2;
  return <>{L.map((l, i) => {
    const p = outQuart(ramp(t, i * step, i * step + 8));
    const top = y; y += l.cap * 1.32;
    return <div key={i} style={{ position: 'absolute', left: (W - l.w) / 2, top: top - l.cap * 0.32, height: l.cap * 1.4, overflow: 'hidden' }}>
      <div style={{ fontFamily: FONT.display, fontSize: l.size, lineHeight: `${l.cap * 1.4}px`, color, whiteSpace: 'nowrap', transform: `translateY(${(1 - p) * 105}%)`,
        textShadow: color === C.paper ? '0 4px 30px rgba(0,0,0,.25)' : '0 2px 24px rgba(251,246,240,.5)' }}>{l.s}</div>
    </div>;
  })}</>;
};

export const NoFoam: React.FC = () => {
  let from = 0;
  return <AbsoluteFill style={{ background: C.ink }}>
    {PANELS.map((p, i) => {
      const at = from; from += p.dur;
      return <Sequence key={i} from={at} durationInFrames={p.dur} layout="none"><PanelView p={p} /></Sequence>;
    })}
  </AbsoluteFill>;
};
const PanelView: React.FC<{ p: Panel }> = ({ p }) => {
  const t = useCurrentFrame();
  return <AbsoluteFill>
    <Photo src={p.photo} t={t} dur={p.dur} from={1.16} to={1.08} pos={p.pos} />
    <AbsoluteFill style={{ background: p.scrim }} />
    <Stack lines={p.lines} color={p.ink} t={t} step={p.lines.length > 2 ? 4 : 3} />
  </AbsoluteFill>;
};

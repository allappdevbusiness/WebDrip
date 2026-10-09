import React from 'react';
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, W } from '../timing';
import { Phone, Rec, clamp, lerp, outCubic, outQuart, ramp, sine } from '../lib';

// frames 739–758: the one-beat drum stop under "You're the…". Silence gets a single still rose.
export const RoseStop: React.FC = () => {
  const t = useCurrentFrame();
  return <AbsoluteFill style={{ background: '#1a0d10', overflow: 'hidden' }}>
    <Img src={staticFile('photos/macro-red-rose.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 45%',
      transform: `scale(${lerp(1.22, 1.3, t / 19)})` }} />
    <AbsoluteFill style={{ background: 'radial-gradient(70% 55% at 50% 45%, transparent 40%, rgba(20,8,12,.55) 100%)' }} />
  </AbsoluteFill>;
};

// frames 758–834: "ROSE" + drums return. The real desktop hero (its own 3D-tilt scroll) full-bleed,
// then the phone rises with the real workshop card and the same-day delivery line.
const DK = 1920 / 900;           // desktop capture scaled so its 900 css px fill the height
const SCREEN_W = 560;
export const RoseHit: React.FC = () => {
  const t = useCurrentFrame();
  const phoneIn = outCubic(ramp(t, 36, 48));
  const blur = lerp(0, 14, ramp(t, 36, 48));
  const label = t < 57 ? 'Saturday workshops' : 'Same-day delivery';
  const labelAt = t < 57 ? 40 : 57;
  const lp = outQuart(ramp(t, labelAt, labelAt + 8));
  return <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
    <AbsoluteFill style={{ filter: blur ? `blur(${blur}px)` : undefined, transform: `scale(${lerp(1.0, 1.04, sine(ramp(t, 0, 76)))})` }}>
      {/* css x 840 at the left edge: the florist's roses and the site's glass "story so far" card */}
      <Rec src="rec/d-hero.mp4" cssW={1440} cssH={900} scale={DK} cx={840} cy={0} x={0} y={0} trimBefore={36} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: `rgba(251,246,240,${0.45 * ramp(t, 36, 48)})` }} />
    {t >= 36 && <>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 196, display: 'flex', justifyContent: 'center', opacity: phoneIn }}>
        <div style={{ overflow: 'hidden', borderRadius: 999 }}>
          <div style={{ transform: `translateY(${(1 - lp) * 110}%)`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 44, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#fff', background: C.rose, borderRadius: 999, padding: '14px 34px' }}>{label}</div>
        </div>
      </div>
      <div style={{ transform: `translateY(${(1 - phoneIn) * 700}px)` }}>
        <Phone x={(W - SCREEN_W) / 2 - 13} y={300} screenW={SCREEN_W}>
          {/* jump-cut inside the phone on beat 4: workshops card -> the order section's same-day line */}
          <Sequence from={36} durationInFrames={21} layout="none"><Rec src="rec/m-wsorder.mp4" cssW={390} cssH={844} scale={SCREEN_W / 390} cx={0} cy={0} x={0} y={0} trimBefore={14} /></Sequence>
          <Sequence from={57} layout="none"><Rec src="rec/m-wsorder.mp4" cssW={390} cssH={844} scale={SCREEN_W / 390} cx={0} cy={0} x={0} y={0} trimBefore={100} /></Sequence>
        </Phone>
      </div>
    </>}
  </AbsoluteFill>;
};

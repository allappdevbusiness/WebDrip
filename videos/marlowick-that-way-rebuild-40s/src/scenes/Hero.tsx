// 32.781-34.533  The bass comes back: the real desktop homepage flies out of the dark as a giant tilted
// billboard and lands on the hit, then the camera sweeps across it like it was filmed on set. A light sweep
// crosses the headline on the snare (33.66 s).
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { EV, SCENES } from '../beats';
import { C, E, k, shake } from '../theme';
import { SceneRoot } from '../components/kit';

const S = SCENES.hero.from;
export const BILL = { w: 1720, h: 1075 }; // desk-hero capture (1440 x 900 css) at 1.194

// shared with the CTA so the billboard continues behind the call to action
export const Billboard: React.FC<{ f: number; dim?: number }> = ({ f, dim = 0 }) => {
  const z = k(f, [EV.hero - 1, EV.hero], [-2600, 0], E.accel);
  const ry = k(f, [EV.hero, EV.cta + 330], [30, -14], E.glide);
  const rx = k(f, [EV.hero, EV.cta + 330], [6, 2], E.glide);
  const sh = shake(f, EV.hero, 30, 18);
  const shine = k(f, [EV.heroShine, EV.heroShine + 22], [-0.4, 1.4], E.glide);
  return (
    <AbsoluteFill style={{ perspective: 1500, translate: `${sh.x}px ${sh.y}px` }}>
      <div style={{ position: 'absolute', left: 540 - BILL.w / 2, top: 900 - BILL.h / 2, width: BILL.w, height: BILL.h, borderRadius: 28, overflow: 'hidden',
        transform: `translateZ(${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`, boxShadow: '0 80px 160px -40px rgba(0,0,0,.7)' }}>
        <Img src={staticFile('cap/desk-hero.png')} style={{ width: '100%', height: '100%', maxWidth: 'none' }} />
        {f >= EV.heroShine && f < EV.heroShine + 24 && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(105deg, transparent ${shine * 100 - 12}%, rgba(255,255,255,.75) ${shine * 100}%, transparent ${shine * 100 + 12}%)` }} />}
        <div style={{ position: 'absolute', inset: 0, background: C.ink, opacity: dim }} />
      </div>
    </AbsoluteFill>
  );
};

export const Hero: React.FC = () => {
  const f = useCurrentFrame() + S;
  const flash = k(f, [EV.hero, EV.hero + 6], [0.8, 0], E.snap);
  return (
    <SceneRoot bg={C.ink}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 45%, rgba(39,71,214,.55), transparent 70%)` }} />
      <Billboard f={f} />
      <AbsoluteFill style={{ background: C.white, opacity: flash }} />
    </SceneRoot>
  );
};

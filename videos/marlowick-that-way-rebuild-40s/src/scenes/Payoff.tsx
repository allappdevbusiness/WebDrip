// 24.022-27.526  "Black tie" was just picked on the phone - smash to the real Black tie hire plan on the
// downbeat, the other two plans fan in on the double kick and the snare, the camera punches into the
// $120 price, then the same site appears on desktop and phone together on the kick at 26.22 s.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { EV, SCENES } from '../beats';
import { C, E, k, shake } from '../theme';
import { KineticText, Node3D, SceneRoot, Stage3D, UILayer } from '../components/kit';

const S = SCENES.payoff.from;

export const Payoff: React.FC = () => {
  const f = useCurrentFrame() + S;
  const sh = shake(f, EV.plan2, 18, 12);
  const sh2 = shake(f, EV.split, 14, 10);
  const inP = (at: number) => k(f, [at - 3, at + 6], [0, 1], E.snap);
  // camera push into the $120 price (plan 2 title/price at layer css ~ (150, 147))
  const push = k(f, [EV.priceMacro, EV.priceMacro + 14, EV.split - 2], [1, 1.85, 1.95], [E.snap, E.glide]);
  const split = f >= EV.split;
  const sp = k(f, [EV.split - 5, EV.split + 4], [0, 1], E.snap);
  const punch = k(f, [EV.splitPunch, EV.splitPunch + 8], [1.04, 1], E.snap);
  const whip = k(f, [SCENES.payoff.to - 12, SCENES.payoff.to], [0, 1], E.accel);
  return (
    <SceneRoot>
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 60%, #fff, ${C.ivory} 80%)` }} />
      {!split && (
        <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px`, transformOrigin: '423px 836px', scale: String(push) }}>
          <Stage3D cam={{ rx: 4 }} perspective={1700}>
            <Node3D x={-370 + (1 - inP(EV.plan1)) * -700} z={-320} ry={30} opacity={inP(EV.plan1)}>
              <UILayer id="plan1" s={1.75} x={540} y={1080} />
            </Node3D>
            <Node3D x={370 + (1 - inP(EV.plan3)) * 700} z={-320} ry={-30} opacity={inP(EV.plan3)}>
              <UILayer id="plan3" s={1.75} x={540} y={1080} />
            </Node3D>
            <Node3D z={(1 - inP(EV.plan2)) * 500}>
              <UILayer id="plan2" s={1.85} x={540} y={1050} />
            </Node3D>
          </Stage3D>
        </AbsoluteFill>
      )}
      {split && (
        <AbsoluteFill style={{ translate: `${sh2.x - whip * 1400}px ${sh2.y}px`, scale: String(punch), perspective: 1800 }}>
          {/* real desktop capture and real mobile capture of the same hero */}
          <div style={{ position: 'absolute', left: 60, top: 560, width: 900, height: 562, borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 90px -30px rgba(27,50,163,.5)', transform: `translateX(${(1 - sp) * -900}px) rotateY(16deg)`, transformOrigin: '0 50%' }}>
            <Img src={staticFile('cap/desk-hero.png')} style={{ width: '100%', height: '100%', maxWidth: 'none' }} />
          </div>
          <div style={{ position: 'absolute', left: 560, top: 860, width: 360, height: 779, borderRadius: 46, background: C.ink, padding: 12, boxShadow: '0 40px 90px -30px rgba(27,50,163,.6)', transform: `translateX(${(1 - sp) * 900}px) rotateY(-18deg)` }}>
            <Img src={staticFile('cap/mob-hero.png')} style={{ width: '100%', height: '100%', borderRadius: 36, maxWidth: 'none' }} />
          </div>
        </AbsoluteFill>
      )}
      <KineticText name="PRICES UP FRONT." from={EV.plan1 - S} durationInFrames={EV.priceMacro - EV.plan1} mode="slam" color={C.ink} size={112} y={240} out={EV.priceMacro - EV.plan1 - 7}>Prices up front.</KineticText>
      <KineticText name="SAME SITE. EVERY SCREEN." from={EV.split - S} durationInFrames={SCENES.payoff.to - EV.split} mode="slam" color={C.ink} size={90} y={240} out={SCENES.payoff.to - EV.split - 9}>Same site. Every screen.</KineticText>
    </SceneRoot>
  );
};

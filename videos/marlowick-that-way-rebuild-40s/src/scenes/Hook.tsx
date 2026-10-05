// 0.000-3.000  Drumless breakdown. Frame 0 is already a composed image: a macro of the site's own
// headline drifting behind "A CLIENT". Words land on the breakdown's quarter notes, $300 rolls in like
// a slot counter, then the camera pulls back out of the macro letters while every hero piece flies in
// and converges exactly on the drop (frame 180).
import React from 'react';
import { AbsoluteFill, Interactive, useCurrentFrame } from 'remotion';
import { EV, SCENES } from '../beats';
import { C, E, SANS, k } from '../theme';
import { KineticText, SceneRoot, Stage3D, UILayer } from '../components/kit';
import { HeroAssembly, PIECES } from '../components/HeroAssembly';

const S = SCENES.hook.from;

const Digit: React.FC<{ f: number; target: number; spins: number; size: number }> = ({ f, target, spins, size }) => {
  const p = k(f, [EV.hookCountStart, EV.hookCountLand], [0, 1], E.snap);
  const pos = (spins * 10 + target) * p; // digits scroll upward, landing on target
  return <span style={{ display: 'inline-block', height: size * 0.98, overflow: 'hidden', verticalAlign: 'top' }}>
    <span style={{ display: 'block', translate: `0 ${-(pos % 10) * size * 0.98}px` }}>
      {Array.from({ length: 11 }, (_, i) => <span key={i} style={{ display: 'block', height: size * 0.98 }}>{i % 10}</span>)}
    </span>
  </span>;
};

export const Hook: React.FC = () => {
  const f = useCurrentFrame() + S;
  const pull = k(f, [148, 180], [0, 1], E.accel); // camera pulls out of the macro, accelerating into the drop
  const s = 5.2 + (PIECES.heroLine2.s - 5.2) * pull;
  const mx = k(f, [0, 148], [1180, 1010], E.glide) * (1 - pull) + PIECES.heroLine2.x * pull;
  const my = 960 * (1 - pull) + PIECES.heroLine2.y * pull;
  const exit = k(f, [160, 179], [0, 1], E.accel);
  const land = k(f, [EV.hookCountLand, EV.hookCountLand + 10], [1.14, 1], E.snap);
  return (
    <SceneRoot bg={C.ink}>
      {/* macro of the real headline "fitted properly." - the same layer becomes the hero headline on the drop */}
      <AbsoluteFill style={{ opacity: 0.32 + 0.68 * pull, filter: `blur(${(1 - pull) * 2.5}px)` }}>
        <UILayer id="heroLine2" s={s} x={mx} y={my} />
      </AbsoluteFill>
      {/* the other hero pieces converge from depth during the last 18 frames */}
      {f >= 154 && <Stage3D cam={{}}>
        <HeroAssembly assemble={k(f, [154, 180], [0, 1], E.accel)} explode={0} tags={[0, 0, 0]} skipLine2 />
      </Stage3D>}
      <Interactive.Div name="Hook words" style={{ position: 'absolute', inset: 0, translate: `0 ${-exit * 260}px`, scale: String(1 + exit * 0.25), opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 14}px)` : undefined }}>
        <KineticText name="A CLIENT" from={-12} mode="rise" color={C.ivory} size={150} y={430}>A client</KineticText>
        <KineticText name="PAID ME" from={EV.hookPaid - S} mode="rise" color={C.ivory} size={150} y={580}>paid me</KineticText>
        {f >= EV.hookCountStart && <div style={{ position: 'absolute', left: 90, top: 740, fontFamily: SANS, fontWeight: 900, fontSize: 300, lineHeight: 0.98, letterSpacing: '-0.05em', color: C.camel, transformOrigin: 'left center', scale: String(land), opacity: k(f, [EV.hookCountStart, EV.hookCountStart + 4], [0, 1]) }}>
          $<Digit f={f} target={3} spins={1} size={300} /><Digit f={f} target={0} spins={2} size={300} /><Digit f={f} target={0} spins={3} size={300} />
        </div>}
        <KineticText name="FOR" from={EV.hookFor - S} mode="slam" color={C.ivory} size={150} y={1080}>for</KineticText>
        <KineticText name="THIS." from={EV.hookThis - S} mode="slam" color={C.ivory} size={150} y={1236} highlight={C.cobalt}>this.</KineticText>
      </Interactive.Div>
    </SceneRoot>
  );
};

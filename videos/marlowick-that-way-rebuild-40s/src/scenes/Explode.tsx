// 3.000-10.007  THE DROP. Lights on: the rebuilt hero lands with a flash and shake. Price tags pop on the
// hats, then on the next kick the page explodes along Z and the camera orbits through its layers.
// "NOT A TEMPLATE." slams in, the camera dollies through the pieces, everything snaps back together on the
// kick+snare at 9.57 s, and the camera pushes straight through the real "See the suits" button.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { EV, SCENES } from '../beats';
import { C, E, k, shake } from '../theme';
import { KineticText, SceneRoot, Stage3D } from '../components/kit';
import { HeroAssembly, PIECES } from '../components/HeroAssembly';

const S = SCENES.explode.from;
const BTN = PIECES.btnSuits;

const World: React.FC = () => {
  const f = useCurrentFrame() + S;
  // explode amount: anticipation 4 frames before the kick, full by ~0.5 s, collapses back on the rebuild hit
  const explode = f < EV.rebuildStart
    ? k(f, [EV.explode - 4, EV.explode + 28], [0, 1], E.snap)
    : k(f, [EV.rebuildStart, EV.rebuild], [1, 0], E.whip);
  const orbit = f < EV.dolly
    ? { ry: k(f, [S, EV.explode - 4, EV.explode + 50], [5, -6, -26], [E.glide, E.snap]), rx: k(f, [EV.explode - 4, EV.explode + 50], [0, 9], E.snap), z: k(f, [EV.explode - 4, EV.explode + 50], [0, -220], E.snap) }
    : f < EV.rebuildStart
      ? { ry: k(f, [EV.dolly, EV.rebuildStart], [-26, 18], E.glide), rx: k(f, [EV.dolly, EV.rebuildStart], [9, -4], E.glide), z: k(f, [EV.dolly, EV.rebuildStart], [-220, 1250], E.whip) }
      : { ry: k(f, [EV.rebuildStart, EV.rebuild], [18, 0], E.whip), rx: k(f, [EV.rebuildStart, EV.rebuild], [-4, 0], E.whip), z: k(f, [EV.rebuildStart, EV.rebuild], [1250, 0], E.whip) };
  const beatPunch = [EV.tagA, EV.tagB, EV.tagC].reduce((acc, at) => acc + k(f, [at, at + 1, at + 10], [0, 0.025, 0], E.snap), 0);
  const push = k(f, [S, EV.explode - 4], [1, 1.06], E.glide) + beatPunch;
  const sh1 = shake(f, EV.drop, 26, 16);
  const sh2 = shake(f, EV.rebuild, 20, 12);
  const pop = (at: number) => k(f, [at, at + 9], [0, 1], E.snap);
  return (
    <AbsoluteFill style={{ translate: `${sh1.x + sh2.x}px ${sh1.y + sh2.y}px` }}>
      <Stage3D cam={{ ...orbit, s: push }} perspective={1500}>
        <HeroAssembly assemble={1} explode={explode} tags={[pop(EV.tagA), pop(EV.tagB), pop(EV.tagC)]} camZ={orbit.z} />
      </Stage3D>
    </AbsoluteFill>
  );
};

export const Explode: React.FC = () => {
  const f = useCurrentFrame() + S;
  // push through the real "See the suits" button into the collection (accelerates into the next downbeat)
  const through = k(f, [EV.buttonPush, SCENES.explode.to], [1, 15], E.accel);
  const flash = k(f, [EV.drop, EV.drop + 5], [0.75, 0], E.snap);
  const fast = (f > EV.explode - 4 && f < EV.explode + 22) || (f > EV.dolly && f < EV.rebuild + 2) || f > EV.buttonPush;
  return (
    <SceneRoot>
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 0%, #fff 0%, transparent 70%), linear-gradient(180deg, ${C.ivory} 0%, ${C.sky} 100%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(40% 25% at 12% 62%, rgba(39,71,214,.16), transparent 70%), radial-gradient(35% 22% at 92% 30%, rgba(192,138,78,.18), transparent 70%)' }} />
      <AbsoluteFill style={{ transformOrigin: `${BTN.x}px ${BTN.y - 28}px`, scale: String(through) }}>
        {fast ? <CameraMotionBlur shutterAngle={180} samples={6}><World /></CameraMotionBlur> : <World />}
      </AbsoluteFill>
      <KineticText name="NOT A TEMPLATE." from={EV.notTemplate - S} durationInFrames={80} mode="slam" color={C.ivory} size={128} y={820} highlight={C.cobalt} out={62}>Not a template.</KineticText>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: 'none' }} />
    </SceneRoot>
  );
};

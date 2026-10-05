// 10.007-17.015  We came through the button into the collection: the camera flies down a corridor of the
// real product cards (one card per half-bar), smash-cuts to macro shots of four product names and prices
// on the kicks, then all six cards fly into a grid that lands on the bar. One beat of stillness on the
// breath in the track (15.70 s), then the cards drop away on the fill into the chorus.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { EV, SCENES } from '../beats';
import { C, E, k, shake } from '../theme';
import { KineticText, LayerId, Node3D, SceneRoot, Stage3D, UILayer } from '../components/kit';

const S = SCENES.collection.from;
const CARDS: LayerId[] = ['suit1', 'suit2', 'suit3', 'suit4', 'suit5', 'suit6'];

// corridor: camera Z keyframes, one burst per half bar
const CZ_T = [S, S + 27, S + 53, S + 80, EV.macro1];
const CZ_V = [0, 760, 1560, 2360, 3150];

const Corridor: React.FC = () => {
  const f = useCurrentFrame() + S;
  const camZ = k(f, CZ_T, CZ_V, E.whip);
  const sway = Math.sin((f - S) / 20) * 3;
  return (
    <Stage3D cam={{ z: camZ, ry: sway, rx: -2 }} perspective={1100}>
      {CARDS.slice(0, 5).map((id, i) => {
        const z = -380 - i * 800;
        const side = i % 2 === 0 ? -1 : 1;
        const vis = Math.max(0, Math.min(1, (950 - (z + camZ)) / 260)) * Math.min(1, (z + camZ + 3600) / 600);
        return <Node3D key={id} x={side * 250} z={z} ry={-side * 32} opacity={vis}>
          <UILayer id={id} s={1.85} x={540} y={980} />
        </Node3D>;
      })}
    </Stage3D>
  );
};

// macro: the card's title row (product name + price) filling the frame
const MACROS: { id: LayerId; at: number; dir: number }[] = [
  { id: 'suit1', at: EV.macro1, dir: 1 },
  { id: 'suit2', at: EV.macro2, dir: -1 },
  { id: 'suit3', at: EV.macro3, dir: 1 },
  { id: 'suit4', at: EV.macro4, dir: -1 },
  { id: 'suit6', at: EV.macro4 + 13, dir: 1 },
];
const Macro: React.FC<{ f: number }> = ({ f }) => {
  let cur = MACROS[0];
  for (const m of MACROS) if (f >= m.at) cur = m;
  const t = f - cur.at;
  const s = 3.4 + t * 0.006;
  const jolt = k(f, [cur.at, cur.at + 5], [cur.dir * 46, 0], E.snap);
  // title row centre in layer css: (213.5, 335) -> canvas (540, 960)
  return <UILayer id={cur.id} s={s} x={540 + jolt} y={960 + (247.4 - 335) * s} />;
};

// grid: 2 x 3, landing on the bar at 13.51 s
const GRID = { s: 0.84, cols: [338, 742], rows: [655, 1030, 1405] };
export const Collection: React.FC = () => {
  const f = useCurrentFrame() + S;
  const inMacro = f >= EV.macro1 && f < EV.gridLand - 12;
  const g = k(f, [EV.gridLand - 12, EV.gridLand], [0, 1], E.accel);
  const sh = shake(f, EV.gridLand, 16, 12);
  const tilt = k(f, [EV.gridLand, EV.breath], [14, 3], E.glide);
  const sweep = k(f, [EV.gridLand, EV.breath], [-10, 9], E.glide);
  const drift = k(f, [EV.gridLand, EV.breath], [1, 1.035], E.glide);
  const fallAt = [EV.fall1, EV.fall2, EV.fall3];
  return (
    <SceneRoot>
      <AbsoluteFill style={{ background: `radial-gradient(80% 50% at 50% 50%, #fff 0%, transparent 75%), linear-gradient(180deg, ${C.ivory}, ${C.sky})` }} />
      {f < EV.macro1 && <CameraMotionBlur shutterAngle={140} samples={6}><Corridor /></CameraMotionBlur>}
      {inMacro && <AbsoluteFill style={{ background: C.white }}><Macro f={f} /></AbsoluteFill>}
      {f >= EV.gridLand - 12 && (
        <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px`, perspective: 1600 }}>
          <AbsoluteFill style={{ transform: `rotateX(${tilt}deg) rotateY(${sweep}deg) scale(${drift})`, transformOrigin: '540px 1000px' }}>
            {CARDS.map((id, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              const tx = GRID.cols[col], ty = GRID.rows[row];
              const fall = k(f, [fallAt[row], fallAt[row] + 22], [0, 1], E.accel);
              const hAt = EV.gridLand + 13 + i * 13; // one card per half-beat, like a cursor passing over them
              const lift = f < EV.breath ? k(f, [hAt, hAt + 6, hAt + 20], [0, 1, 0], E.snap) : 0;
              const x = 540 + (tx - 540) * g, y = 960 + (ty - 960) * g + fall * 1500 - lift * 6 * 3.4 * GRID.s;
              return <UILayer key={id} id={id} s={3.4 + (GRID.s - 3.4) * g} x={x} y={y} style={{ rotate: `${fall * (col ? 24 : -24)}deg`, filter: lift > 0 ? `drop-shadow(0 ${24 * lift}px ${30 * lift}px rgba(27,50,163,${0.35 * lift}))` : undefined }} />;
            })}
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <KineticText name="FITTING INCLUDED." from={EV.gridLand - S} durationInFrames={EV.fall4 - EV.gridLand + 10} mode="slam" color={C.ink} size={112} y={250} out={EV.fall4 - EV.gridLand}>Fitting included.</KineticText>
    </SceneRoot>
  );
};

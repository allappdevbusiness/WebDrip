// 34.533-40.000  The billboard drifts on behind a dark scrim while the call to action builds on the beats:
// WebDrip mark, COMMENT, the PROMPT pill (snare at 35.41 s), the DM line, then follow + URL. Complete by
// 36.29 s and held, fixed, to the last frame. The ink background loops cleanly into the ink hook.
import React from 'react';
import { AbsoluteFill, Interactive, useCurrentFrame } from 'remotion';
import { EV, SCENES } from '../beats';
import { C, E, MONO, SANS, k, shake } from '../theme';
import { KineticText, SceneRoot, WebDripMark } from '../components/kit';
import { Billboard } from './Hero';

const S = SCENES.cta.from;

export const Cta: React.FC = () => {
  const f = useCurrentFrame() + S;
  const dim = k(f, [S, S + 14], [0, 1], E.snap);
  const sh = shake(f, EV.ctaPrompt, 14, 10);
  const rise = (at: number) => ({ opacity: k(f, [at, at + 6], [0, 1]), translate: `0 ${k(f, [at, at + 10], [40, 0], E.snap)}px` });
  const shine = k(f, [EV.ctaPrompt + 120, EV.ctaPrompt + 150], [-0.3, 1.3], E.glide);
  return (
    <SceneRoot bg={C.ink}>
      <AbsoluteFill style={{ filter: `blur(${dim * 10}px)`, scale: String(1 + dim * 0.05) }}>
        <Billboard f={f} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(18,24,38,${0.55 + dim * 0.3}), rgba(18,24,38,${0.5 + dim * 0.3}))` }} />
      <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px`, fontFamily: SANS }}>
        <Interactive.Div name="WebDrip mark" style={{ position: 'absolute', left: 96, top: 300, display: 'flex', alignItems: 'center', gap: 20, ...rise(EV.cta) }}>
          <WebDripMark size={72} />
          <div style={{ fontWeight: 900, fontSize: 56, letterSpacing: '0.14em', color: C.ivory }}>WEBDRIP</div>
        </Interactive.Div>
        <KineticText name="COMMENT" from={EV.ctaComment - S} mode="slam" color={C.ivory} size={150} y={440}>Comment</KineticText>
        <KineticText name="PROMPT" from={EV.ctaPrompt - S} mode="slam" color={C.ivory} size={172} y={610} highlight={C.cobalt}>Prompt</KineticText>
        {f >= EV.ctaPrompt + 120 && f < EV.ctaPrompt + 152 && <div style={{ position: 'absolute', left: 96, top: 610, width: 740, height: 175, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(105deg, transparent ${shine * 100 - 10}%, rgba(255,255,255,.45) ${shine * 100}%, transparent ${shine * 100 + 10}%)` }} />
        </div>}
        <Interactive.Div name="DM line" style={{ position: 'absolute', left: 96, top: 850, fontWeight: 700, fontSize: 58, letterSpacing: '-0.02em', color: C.ivory, ...rise(EV.ctaDm) }}>We’ll DM you the prompt.</Interactive.Div>
        <Interactive.Div name="Rule" style={{ position: 'absolute', left: 96, top: 960, width: 720, height: 5, background: `repeating-linear-gradient(90deg, ${C.camel} 0 20px, transparent 20px 32px)`, ...rise(EV.ctaDm + 6) }} />
        <Interactive.Div name="Follow" style={{ position: 'absolute', left: 96, top: 1000, fontWeight: 700, fontSize: 50, color: C.ivory, ...rise(EV.ctaFollow) }}>Follow WebDrip</Interactive.Div>
        <Interactive.Div name="URL" style={{ position: 'absolute', left: 96, top: 1075, fontFamily: MONO, fontWeight: 500, fontSize: 50, color: '#AFC2FF', ...rise(EV.ctaFollow + 5) }}>getwebdrip.com</Interactive.Div>
      </AbsoluteFill>
    </SceneRoot>
  );
};

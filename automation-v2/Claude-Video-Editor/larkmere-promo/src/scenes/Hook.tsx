import React from 'react';
import { AbsoluteFill, OffthreadVideo, getInputProps, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, HOOK } from '../timing';
import { lerp, ramp } from '../lib';

// 0:00–0:02.53 — movie hook. Hard cut out on the music's first downbeat (frame 76).
export const Hook: React.FC = () => {
  const t = useCurrentFrame();
  // tools/render.sh passes the clip as props: { hookSrc: 'hook/gatsby.mp4', hookIn: <first frame>, hookFocusX: 50 }
  const props = getInputProps() as { hookSrc?: string; hookIn?: number; hookFocusX?: number };
  const src = props.hookSrc ?? HOOK.src;
  const inFrame = props.hookIn ?? HOOK.inFrame;
  const focusX = props.hookFocusX ?? HOOK.focusX;
  if (src) {
    const s = lerp(1.0, 1.06, ramp(t, 0, 76)); // slow push so the room of flowers feels like it keeps going
    return <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        <OffthreadVideo src={staticFile(src)} trimBefore={inFrame} muted style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focusX}% 50%` }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 120, bottom: 430, fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.06em', color: 'rgba(255,255,255,.72)' }}>{HOOK.credit}</div>
    </AbsoluteFill>;
  }
  // slot placeholder: clearly a slate, never a stand-in shot
  return <AbsoluteFill style={{ background: '#0E0B0D', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 820, textAlign: 'center', color: '#F3ECE1' }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 30, letterSpacing: '0.12em', color: C.roseSoft }}>HOOK SLOT · 0:00 – 0:02.5</div>
      <div style={{ fontFamily: FONT.display, fontSize: 92, lineHeight: 1.04, marginTop: 34 }}>The Great Gatsby<br />(2013)</div>
      <div style={{ fontFamily: FONT.sans, fontSize: 40, lineHeight: 1.35, marginTop: 34, color: 'rgba(243,236,225,.86)' }}>Flower-filled tea room:<br />“You think it’s too much?”</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 24, lineHeight: 1.6, marginTop: 50, color: 'rgba(243,236,225,.55)' }}>official clip not reachable from this environment<br />drop it in public/hook/gatsby.mp4</div>
    </div>
  </AbsoluteFill>;
};

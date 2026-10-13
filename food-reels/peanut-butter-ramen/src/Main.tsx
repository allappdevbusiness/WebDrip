import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Captions} from './Captions';
import {Cuts, easeOut, GOLD, Grade, heroText, INK, Photo, pill, Steam, useFonts, W} from './lib';

const img = (n: string) => staticFile(`img/${n}.jpg`);
const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Scene boundaries (seconds), snapped to the voiceover and the music's accent grid
const T = {
  hook: 0, impact: 1.25, doubt: 4.25, ingr: 8.45, sauce: 16.0, glossy: 24.3, boil: 27.27, toss: 31.98,
  garnish: 37.86, tease: 43.75, stop: 45.5, back: 48.0, pull: 51.0, cta: 55.5, end: 60.0,
};

// ---------- 01 hook: peanut butter ribbon, camera follows the drip down ----------
const Drop: React.FC = () => (
  <Photo
    src={img('s1')}
    keys={[
      {t: 0, x: 0.5, y: 0.3, s: 1.3},
      {t: 1.25, x: 0.46, y: 0.62, s: 1.5},
    ]}
  />
);

// ---------- 02-03 impact + "stay with me" ----------
const Impact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Photo
        src={img('s2')}
        keys={[
          {t: 0, x: 0.52, y: 0.5, s: 1.45},
          {t: 0.35, x: 0.52, y: 0.5, s: 1.12},
          {t: 3.0, x: 0.52, y: 0.48, s: 1.22},
        ]}
        shake={{at: 0, px: 26, dur: 0.3}}
      />
      <Steam x={560} y={820} spread={300} rise={700} opacity={0.28} seed="imp" />
      {/* warm flash on impact */}
      <AbsoluteFill style={{background: '#FFE7B8', opacity: interpolate(frame, [0, 3], [0.85, 0], C)}} />
      {/* IN RAMEN? slam */}
      <div
        style={{
          ...heroText,
          position: 'absolute',
          left: 120,
          width: 840,
          top: 230,
          fontSize: 200,
          opacity: interpolate(frame, [0.15 * fps, 0.2 * fps, 2.9 * fps, 3.0 * fps], [0, 1, 1, 0], C),
          scale: `${interpolate(frame, [0.15 * fps, 0.4 * fps], [1.7, 1], {...C, easing: easeOut})}`,
          rotate: '-3deg',
        }}
      >
        IN RAMEN<span style={{color: GOLD}}>?</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 04 midnight ----------
const Midnight: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = interpolate(frame, [3.95 * fps, 4.2 * fps], [0, 1], {...C, easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Photo
        src={img('s3')}
        keys={[
          {t: 0, x: 0.5, y: 0.56, s: 1.0},
          {t: 3.95, x: 0.5, y: 0.7, s: 1.32},
          {t: 4.2, x: 0.5, y: 0.73, s: 2.6},
        ]}
        filter={`blur(${out * 14}px)`}
      />
      <Steam x={540} y={1380} spread={160} rise={520} size={260} opacity={0.2} seed="mid" />
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 210,
          fontFamily: 'Montserrat',
          fontWeight: 600,
          fontSize: 56,
          color: '#FFD9A0',
          letterSpacing: 4,
          textShadow: '0 0 24px rgba(255,190,90,0.55)',
          opacity: interpolate(frame, [0.6 * fps, 0.9 * fps], [0, 0.95], C) * (1 - out),
        }}
      >
        12<span style={{opacity: Math.floor(frame / 15) % 2 ? 0.25 : 1}}>:</span>04 AM
      </div>
      <AbsoluteFill style={{background: '#FFF4E2', opacity: interpolate(frame, [4.05 * fps, 4.2 * fps], [0, 0.9], C)}} />
    </AbsoluteFill>
  );
};

// ---------- 05 ingredients: camera visits each item on its word ----------
const ITEMS = [
  {at: 1.46, y: 0.145, name: 'INSTANT RAMEN', qty: '1 pack'},
  {at: 3.34, y: 0.31, name: 'PEANUT BUTTER', qty: '2 big spoons'},
  {at: 4.32, y: 0.46, name: 'SOY SAUCE', qty: '1 tbsp'},
  {at: 5.32, y: 0.6, name: 'HONEY', qty: '1 tsp'},
  {at: 5.9, y: 0.74, name: 'GARLIC', qty: '1 clove'},
  {at: 6.48, y: 0.875, name: 'CHILI CRISP', qty: 'to taste'},
];
const Ingredients: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const keys = [
    {t: 0, x: 0.49, y: 0.5, s: 1.25},
    {t: 0.25, x: 0.49, y: 0.5, s: 1.0},
    ...ITEMS.flatMap((it, i) => [
      {t: it.at - 0.32, x: 0.49, y: it.y, s: i === 5 ? 2.9 : 2.15},
      {t: it.at + 0.25, x: 0.49, y: it.y, s: i === 5 ? 3.0 : 2.25},
    ]),
    {t: 7.25, x: 0.49, y: 0.875, s: 3.0},
    {t: 7.55, x: 0.49, y: 0.875, s: 4.6},
  ];
  // de-duplicate overlapping key times (garlic/chili are close together)
  const sorted = keys.filter((k, i) => i === 0 || k.t > keys[i - 1].t);
  const cur = [...ITEMS].reverse().find((it) => t >= it.at - 0.05);
  const idx = cur ? ITEMS.indexOf(cur) : -1;
  return (
    <AbsoluteFill style={{background: '#16130f'}}>
      <Photo src={img('s4')} keys={sorted} />
      {cur && (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 210,
            display: 'flex',
            justifyContent: 'center',
            opacity: interpolate(t, [cur.at - 0.05, cur.at + 0.05, 7.3, 7.45], [0, 1, 1, 0], C),
            translate: `0px ${interpolate(t, [cur.at - 0.05, cur.at + 0.2], [26, 0], {...C, easing: easeOut})}px`,
          }}
        >
          <div style={pill}>
            <span style={{width: 22, height: 22, borderRadius: 11, background: GOLD, boxShadow: `0 0 0 6px rgba(255,196,71,0.3)`}} />
            {cur.name}
            <span style={{fontWeight: 600, fontSize: 34, color: '#7A5A2E'}}>{cur.qty}</span>
            <span style={{fontWeight: 800, fontSize: 30, color: '#B08850'}}>{idx + 1}/6</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 06-07 sauce: paste, then spiral swirl into glossy ----------
const Sauce: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sw = T.glossy - T.sauce; // swirl start, local seconds
  const ang = interpolate(t, [sw, sw + 0.75], [0, 360], {...C, easing: Easing.bezier(0.5, 0, 0.3, 1)});
  const splash = 4.15; // "splash" (sauce VO 16.30 + 3.86)
  return (
    <AbsoluteFill style={{background: '#16130f'}}>
      {/* iris in from the round chili-crisp jar */}
      <AbsoluteFill
        style={{
          clipPath: `circle(${interpolate(t, [0, 0.35], [8, 120], {...C, easing: easeOut})}% at 50% 50%)`,
        }}
      >
        <Cuts
          cuts={[
            {from: 0, to: 1.44, src: img('s5'), punch: false, keys: [{t: 0, x: 0.49, y: 0.49, s: 1.5, r: -4}, {t: 1.44, x: 0.49, y: 0.49, s: 1.3, r: -1}]},
            // soy / honey / garlic on their words (sauce VO 16.30 + word times)
            {from: 1.44, to: 2.2, src: img('s5'), keys: [{t: 0, x: 0.37, y: 0.55, s: 2.0}, {t: 0.76, x: 0.36, y: 0.56, s: 2.1}]},
            {from: 2.2, to: 2.6, src: img('s5'), keys: [{t: 0, x: 0.56, y: 0.46, s: 2.1}, {t: 0.4, x: 0.56, y: 0.46, s: 2.15}]},
            {from: 2.6, to: 4.4, src: img('s5'), keys: [{t: 0, x: 0.58, y: 0.41, s: 2.5}, {t: 0.9, x: 0.56, y: 0.43, s: 2.6}, {t: 1.8, x: 0.5, y: 0.49, s: 1.35}]},
            // "hot noodle water": the boiling pot
            {from: 4.4, to: 5.6, src: img('s7'), keys: [{t: 0, x: 0.75, y: 0.44, s: 2.3}, {t: 1.2, x: 0.72, y: 0.46, s: 2.5}]},
            // "watch it go from thick paste": texture macro, slow push
            {from: 5.6, to: sw + 1, src: img('s5'), keys: [{t: 0, x: 0.5, y: 0.47, s: 1.7, r: 2}, {t: sw + 1 - 5.6, x: 0.5, y: 0.47, s: 2.2, r: 6}]},
          ]}
        />
        <AbsoluteFill
          style={{
            maskImage: `conic-gradient(from 0deg at 50% 46%, black ${ang}deg, transparent ${ang + 30}deg)`,
            WebkitMaskImage: `conic-gradient(from 0deg at 50% 46%, black ${ang}deg, transparent ${ang + 30}deg)`,
            opacity: t >= sw ? 1 : 0,
          }}
        >
          <Photo
            src={img('s6')}
            keys={[
              {t: sw, x: 0.5, y: 0.42, s: 1.3},
              {t: T.boil - T.sauce, x: 0.5, y: 0.5, s: 1.12},
            ]}
          />
        </AbsoluteFill>
        <Steam
          x={540}
          y={1000}
          spread={240}
          rise={600}
          opacity={interpolate(t, [splash - 0.1, splash + 0.2, splash + 1.6], [0, 0.55, 0.15], C)}
          seed="splash"
        />
      </AbsoluteFill>
      {/* steam whiteout into the pot */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 60%, rgba(255,250,242,1) 0%, rgba(255,250,242,0.85) 50%, rgba(255,250,242,0.6) 100%)',
          opacity: interpolate(t, [T.boil - T.sauce - 0.3, T.boil - T.sauce], [0, 1], {...C, easing: Easing.in(Easing.quad)}),
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- 08 boil: timer ring + seasoning packet strike ----------
const Boil: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const skip = 27.45 + 2.24 - T.boil; // "Skip"
  const ring = interpolate(t, [0.5, 2.0], [0, 1], {...C, easing: Easing.inOut(Easing.quad)});
  const dur = T.toss - T.boil;
  return (
    <AbsoluteFill style={{background: '#16130f'}}>
      <Photo
        src={img('s7')}
        keys={[
          {t: 0, x: 0.5, y: 0.48, s: 1.05},
          {t: dur, x: 0.5, y: 0.47, s: 1.28},
        ]}
        style={{translate: `${interpolate(t, [dur - 0.27, dur], [0, -900], {...C, easing: Easing.in(Easing.cubic)})}px 0px`}}
        filter={`blur(${interpolate(t, [dur - 0.27, dur], [0, 18], C)}px)`}
      />
      <Steam x={540} y={1100} spread={420} rise={900} count={12} size={460} opacity={0.32} seed="boil" />
      <AbsoluteFill
        style={{
          background: 'rgb(255,250,242)',
          opacity: interpolate(t, [0, 0.35], [1, 0], {...C, easing: Easing.out(Easing.quad)}),
        }}
      />
      {/* 3-minute ring */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 200,
          width: 200,
          height: 200,
          opacity: interpolate(t, [0.4, 0.6, dur - 0.4, dur - 0.25], [0, 1, 1, 0], C),
        }}
      >
        <svg width={200} height={200} viewBox="0 0 200 200">
          <circle cx={100} cy={100} r={84} fill="rgba(18,12,8,0.72)" stroke="rgba(255,255,255,0.18)" strokeWidth={12} />
          <circle
            cx={100}
            cy={100}
            r={84}
            fill="none"
            stroke={GOLD}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 84}
            strokeDashoffset={2 * Math.PI * 84 * (1 - ring)}
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'Anton',
            fontSize: 70,
            lineHeight: 0.9,
          }}
        >
          {Math.round(ring * 3)}
          <span style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 24, letterSpacing: 3}}>MIN</span>
        </div>
      </div>
      {/* seasoning packet: struck out */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1140,
          display: 'flex',
          justifyContent: 'center',
          opacity: interpolate(t, [skip - 0.1, skip, dur - 0.4, dur - 0.25], [0, 1, 1, 0], C),
          scale: `${interpolate(t, [skip - 0.1, skip + 0.15], [0.8, 1], {...C, easing: easeOut})}`,
        }}
      >
        <div style={{...pill, position: 'relative', background: 'rgba(255,248,236,0.96)'}}>
          <span style={{color: '#C0392B', fontSize: 48, lineHeight: 1}}>✕</span>
          SEASONING PACKET
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: '50%',
              height: 8,
              borderRadius: 4,
              background: '#C0392B',
              width: `${interpolate(t, [skip + 0.4, skip + 0.75], [0, 92], {...C, easing: easeOut})}%`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 09 toss ----------
const Toss: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const dur = T.garnish - T.toss;
  return (
    <AbsoluteFill style={{background: '#16130f'}}>
      <Cuts
        cuts={[
          {from: 0, to: 1.42, src: img('s8'), punch: false, keys: [{t: 0, x: 0.5, y: 0.5, s: 1.3, r: -2}, {t: 1.42, x: 0.49, y: 0.48, s: 1.22, r: 0}]},
          // "toss": up on the chopsticks lift
          {from: 1.42, to: 2.85, src: img('s8'), keys: [{t: 0, x: 0.56, y: 0.36, s: 1.75, r: 1.5}, {t: 1.43, x: 0.55, y: 0.33, s: 1.9, r: -1}]},
          // "every single strand": macro on the coated strands
          {from: 2.85, to: 4.35, src: img('s8'), keys: [{t: 0, x: 0.42, y: 0.58, s: 2.4}, {t: 1.5, x: 0.46, y: 0.56, s: 2.6}]},
          {from: 4.35, to: dur, src: img('s8'), keys: [{t: 0, x: 0.5, y: 0.5, s: 1.2, r: 1}, {t: dur - 4.35, x: 0.51, y: 0.47, s: 1.4, r: -1}]},
        ]}
        style={(c, lt) => (c.from === 0 ? {translate: `${interpolate(lt, [0, 0.27], [900, 0], {...C, easing: Easing.out(Easing.cubic)})}px 0px`} : {})}
        filter={(c, lt) => (c.from === 0 ? `blur(${interpolate(lt, [0, 0.27], [18, 0], C)}px)` : '')}
      />
      <Steam x={600} y={760} spread={260} rise={640} opacity={0.24} seed="toss" />
    </AbsoluteFill>
  );
};

// ---------- 10 garnish: three blob reveals of the topped bowl ----------
const GARNISH = [
  {at: 0.61, x: 0.72, y: 0.47, label: 'CHILI CRISP'},
  {at: 1.55, x: 0.34, y: 0.47, label: 'GREEN ONION'},
  {at: 2.39, x: 0.53, y: 0.49, label: 'CRUSHED PEANUTS'},
];
const Garnish: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const dur = T.tease - T.garnish;
  const keys = [
    {t: 0, x: 0.5, y: 0.49, s: 1.14},
    {t: 2.9, x: 0.5, y: 0.49, s: 1.2},
    {t: dur, x: 0.53, y: 0.48, s: 1.75},
  ];
  const masks = GARNISH.map((g, i) => {
    const r = interpolate(t, [g.at - 0.05, g.at + 0.45], [0, i === 2 ? 95 : 42], {...C, easing: easeOut});
    return `radial-gradient(circle at ${g.x * 100}% ${g.y * 100}%, black ${r * 0.7}%, transparent ${r}%)`;
  });
  const cur = [...GARNISH].reverse().find((g) => t >= g.at - 0.05);
  return (
    <AbsoluteFill style={{background: '#16130f'}}>
      <Photo src={img('s9')} keys={keys} />
      <AbsoluteFill style={{maskImage: masks.join(', '), WebkitMaskImage: masks.join(', ')}}>
        <Photo src={img('s10')} keys={keys} />
      </AbsoluteFill>
      {cur && (
        <div
          key={cur.label}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1140,
            display: 'flex',
            justifyContent: 'center',
            opacity: interpolate(t, [cur.at - 0.05, cur.at + 0.05, dur - 1.4, dur - 1.2], [0, 1, 1, 0], C),
            translate: `0px ${interpolate(t, [cur.at - 0.05, cur.at + 0.2], [26, 0], {...C, easing: easeOut})}px`,
          }}
        >
          <div style={pill}>
            <span style={{width: 22, height: 22, borderRadius: 11, background: GOLD}} />
            {cur.label}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 11-12 tease + the silent pull ----------
const Tease: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const stop = T.stop - T.tease;
  const dur = T.back - T.tease;
  const fadeIn = interpolate(t, [0, 0.27], [0, 1], C);
  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <Sequence durationInFrames={Math.round(stop * fps)} premountFor={fps}>
        <Photo
          src={img('s12')}
          keys={[
            {t: 0, x: 0.5, y: 0.5, s: 1.08},
            {t: stop, x: 0.5, y: 0.52, s: 1.2},
          ]}
          // the picture "slows" with the tape stop
          filter={`saturate(${interpolate(t, [stop - 0.6, stop], [1, 0.35], C)}) brightness(${interpolate(t, [stop - 0.6, stop], [1, 0.75], C)})`}
        />
      </Sequence>
      <Sequence from={Math.round(stop * fps)} premountFor={fps}>
        <Photo
          src={img('s11')}
          keys={[
            {t: 0, x: 0.42, y: 0.62, s: 1.35},
            {t: dur - stop, x: 0.42, y: 0.4, s: 1.25},
          ]}
        />
        <Steam x={460} y={1240} spread={240} rise={760} opacity={0.3} seed="pull" />
      </Sequence>
      <div
        style={{
          ...heroText,
          position: 'absolute',
          left: 120,
          width: 840,
          top: 300,
          fontSize: 150,
          opacity: interpolate(t, [0.1, 0.25, dur - 0.6, dur - 0.3], [0, 1, 1, 0], C),
          scale: `${interpolate(t, [0.1, 0.4], [0.85, 1], {...C, easing: easeOut})}`,
        }}
      >
        IS IT ACTUALLY
        <br />
        <span style={{color: GOLD}}>GOOD?</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 13 verdict: four flavour punch-ins ----------
const FLAVOURS = [
  {from: 0, word: 'CREAMY', src: 's6', x: 0.5, y: 0.6, s: 1.35},
  {from: 0.7, word: 'SALTY', src: 's8', x: 0.5, y: 0.52, s: 1.6},
  {from: 1.4, word: 'SWEET', src: 's4', x: 0.49, y: 0.6, s: 2.3},
  {from: 1.86, word: 'SPICY', src: 's10', x: 0.7, y: 0.47, s: 2.2},
];
const Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const dur = T.pull - T.back;
  return (
    <AbsoluteFill style={{background: '#16130f'}}>
      {FLAVOURS.map((f, i) => {
        const to = FLAVOURS[i + 1]?.from ?? dur;
        const lt = t - f.from;
        return (
          <Sequence key={f.word} from={Math.round(f.from * fps)} durationInFrames={Math.round((to - f.from) * fps)} premountFor={fps}>
            <Photo
              src={img(f.src)}
              keys={[
                {t: 0, x: f.x, y: f.y, s: f.s * 1.12},
                {t: 0.18, x: f.x, y: f.y, s: f.s},
                {t: to - f.from, x: f.x, y: f.y, s: f.s * 1.05},
              ]}
            />
            <AbsoluteFill style={{background: 'white', opacity: interpolate(lt, [0, 0.07], [i === 0 ? 0.7 : 0.25, 0], C)}} />
            <div
              style={{
                ...heroText,
                position: 'absolute',
                left: 0,
                right: 0,
                top: 760,
                fontSize: 210,
                color: i === 3 ? '#FF6B3D' : 'white',
                scale: `${interpolate(lt, [0, 0.16], [1.5, 1], {...C, easing: easeOut})}`,
                opacity: interpolate(lt, [0, 0.05], [0, 1], C),
              }}
            >
              {f.word}
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 14 hero pull + 5 MIN badge ----------
const Pull: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const dur = T.cta - T.pull;
  const badge = 52.02 - T.pull; // "5-minute"
  return (
    <AbsoluteFill style={{background: '#16130f'}}>
      <Photo
        src={img('s10')}
        keys={[
          {t: 0, x: 0.5, y: 0.49, s: 1.55, r: -14},
          {t: dur, x: 0.5, y: 0.49, s: 1.75, r: 10},
        ]}
        style={{translate: `${interpolate(t, [0, 0.25], [-900, 0], {...C, easing: Easing.out(Easing.cubic)})}px 0px`}}
        filter={`blur(${interpolate(t, [0, 0.25], [18, 0], C)}px)`}
      />
      <Steam x={540} y={1100} spread={320} rise={800} opacity={0.26} seed="hero" />
      <div
        style={{
          position: 'absolute',
          right: 150,
          top: 230,
          width: 230,
          height: 230,
          borderRadius: '50%',
          background: GOLD,
          color: INK,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Anton',
          fontSize: 100,
          lineHeight: 0.85,
          rotate: `${interpolate(t, [badge, badge + 0.3], [-30, 10], {...C, easing: easeOut})}deg`,
          scale: `${interpolate(t, [badge, badge + 0.25], [0, 1], {...C, easing: Easing.bezier(0.34, 1.56, 0.64, 1)})}`,
          boxShadow: '0 16px 50px rgba(0,0,0,0.45)',
        }}
      >
        5
        <span style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 30, letterSpacing: 4}}>MIN</span>
      </div>
      <AbsoluteFill style={{background: 'black', opacity: interpolate(t, [dur - 0.3, dur], [0, 0.6], C)}} />
    </AbsoluteFill>
  );
};

// ---------- 15 CTA ----------
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{background: '#16130f', opacity: interpolate(t, [0, 0.3], [0, 1], C)}}>
      <Photo
        src={img('s13')}
        keys={[
          {t: 0, x: 0.55, y: 0.52, s: 1.18},
          {t: 4.5, x: 0.58, y: 0.55, s: 1.3},
        ]}
      />
      <Steam x={640} y={1180} spread={220} rise={620} opacity={0.26} seed="cta" />
      <div
        style={{
          ...heroText,
          position: 'absolute',
          left: 120,
          width: 840,
          top: 250,
          fontSize: 170,
          opacity: interpolate(t, [0, 0.2], [0, 1], C),
          translate: `0px ${interpolate(t, [0, 0.4], [40, 0], {...C, easing: easeOut})}px`,
        }}
      >
        WOULD YOU
        <br />
        <span style={{color: GOLD}}>TRY IT?</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1180,
          display: 'flex',
          justifyContent: 'center',
          gap: 28,
          opacity: interpolate(t, [0.9, 1.1], [0, 1], C),
          translate: `0px ${interpolate(t, [0.9, 1.2], [30, 0], {...C, easing: easeOut})}px`,
        }}
      >
        <div style={{...pill, background: GOLD}}>YES, OBVIOUSLY</div>
        <div style={pill}>NO WAY</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1330,
          textAlign: 'center',
          fontFamily: 'Montserrat',
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: 6,
          color: 'white',
          opacity: interpolate(t, [1.4, 1.6], [0, 0.9], C),
        }}
      >
        TELL ME IN THE COMMENTS
      </div>
    </AbsoluteFill>
  );
};

const s = (sec: number, fps: number) => Math.round(sec * fps);

export const Main: React.FC = () => {
  useFonts();
  const {fps} = useVideoConfig();
  const seq = (a: number, b: number) => ({from: s(a, fps), durationInFrames: s(b, fps) - s(a, fps), premountFor: fps});
  return (
    <AbsoluteFill style={{background: '#16130f'}}>
      <Sequence name="01 Drop" {...seq(T.hook, T.impact)}>
        <Drop />
      </Sequence>
      <Sequence name="02 Impact" {...seq(T.impact, T.doubt)}>
        <Impact />
      </Sequence>
      <Sequence name="04 Midnight" {...seq(T.doubt, T.ingr)}>
        <Midnight />
      </Sequence>
      <Sequence name="05 Ingredients" {...seq(T.ingr, T.sauce)}>
        <Ingredients />
      </Sequence>
      <Sequence name="06 Sauce" {...seq(T.sauce, T.boil)}>
        <Sauce />
      </Sequence>
      <Sequence name="08 Boil" {...seq(T.boil, T.toss)}>
        <Boil />
      </Sequence>
      <Sequence name="09 Toss" {...seq(T.toss, T.garnish)}>
        <Toss />
      </Sequence>
      <Sequence name="10 Garnish" {...seq(T.garnish, T.tease)}>
        <Garnish />
      </Sequence>
      <Sequence name="11 Tease" {...seq(T.tease, T.back)}>
        <Tease />
      </Sequence>
      <Sequence name="13 Verdict" {...seq(T.back, T.pull)}>
        <Verdict />
      </Sequence>
      <Sequence name="14 Pull" {...seq(T.pull, T.cta)}>
        <Pull />
      </Sequence>
      <Sequence name="15 CTA" {...seq(T.cta, T.end)}>
        <Cta />
      </Sequence>
      <Grade />
      <Captions />
      <Audio src={staticFile('mix.wav')} />
    </AbsoluteFill>
  );
};

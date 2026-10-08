import React from 'react';
import { AbsoluteFill, Composition, Easing, interpolate, registerRoot, spring, useCurrentFrame, useVideoConfig } from 'remotion';

type Fmt = 'tiktok' | 'feed';
const FPS = 30;
const DURATION = 300; // 10 s

const ORANGE = '#D97757';
const ORANGE2 = '#F2A07B';
const INK = '#0B0B0F';

// same layout numbers as the still; TikTok keeps the middle/lower block <= 780 px wide (clear of the button column)
const L = {
  feed:   { h: 1350, top: 70,  h1: 96,  gap: 44, logo: 150, proof: 50, cta: 38, vsw: 940, verdict: 34, brand: 44, model: 30, cardpad: 30, vsTop: 150 },
  tiktok: { h: 1920, top: 190, h1: 104, gap: 80, logo: 160, proof: 54, cta: 40, vsw: 780, verdict: 30, brand: 42, model: 28, cardpad: 22, vsTop: 150 },
};

const OPENAI = 'M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z';
const CLAUDE = 'M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z';

// ---------- timing (frames) ----------
const T = {
  pill: 2,
  line1: [6, 10, 14], line2: [20, 24, 28],
  strike: 36, slam: 52,
  cardL: 70, cardR: 78, vs: 90,
  playFrom: 100, playTo: 190,
  loseVerdict: 196, winVerdict: 204,
  proof1: 222, proof2: 230, underline: 240,
  cta: 252,
};
const BEATS = [0.04, 0.29, 0.54, 0.79];
const CUTS = { on: BEATS, off: [0.04, 0.37, 0.48, 0.86] };
const AMP = [.35, .9, .4, .55, 1, .45, .3, .85, .5, .6, .95, .4, .35, .8, .45, .7, 1, .4, .3, .9, .5, .55, .85, .4];

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ramp = (f: number, a: number, b: number, ease = Easing.out(Easing.cubic)) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });

const useSp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, cfg: Partial<{ damping: number; stiffness: number; mass: number }> = {}) =>
    spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 170, mass: 0.7, ...cfg } });
};

// a word that pops up into place
const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const sp = useSp();
  const s = sp(at);
  return <span style={{ display: 'inline-block', opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 70}px) scale(${0.6 + 0.4 * s})`, ...style }}>{children}</span>;
};

// waveform + beat markers + clip cuts, with a playhead that reveals the edit
const Track: React.FC<{ mode: 'on' | 'off' }> = ({ mode }) => {
  const f = useCurrentFrame();
  const win = mode === 'on';
  const ph = ramp(f, T.playFrom, T.playTo, Easing.linear);
  const phOpacity = f < T.playFrom ? 0 : 1 - ramp(f, T.playTo, T.playTo + 10);
  const beatPulse = Math.exp(-(((f - T.playFrom) % 15 + 15) % 15) / 5); // 120 bpm
  const cuts = CUTS[mode];
  return (
    <div style={{ marginTop: 26, width: '100%', height: 86, borderRadius: 16, background: 'rgba(0,0,0,.35)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 10, right: 10, top: 0, bottom: 0 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 10, height: 34, display: 'flex', alignItems: 'center', gap: 4 }}>
          {AMP.map((a, i) => {
            const live = f >= T.playFrom ? 0.6 + 0.4 * beatPulse * (i % 3 === 0 ? 1 : 0.7) : 1;
            return <i key={i} style={{ flex: 1, height: `${a * 100 * live}%`, borderRadius: 2, background: win ? 'rgba(242,160,123,.8)' : 'rgba(255,255,255,.35)' }} />;
          })}
        </div>
        {cuts.map((c, i) => {
          const end = (cuts[i + 1] ?? 1) - 0.012;
          const w = Math.max(0, Math.min(end, ph) - c);
          return <b key={i} style={{ position: 'absolute', bottom: 10, height: 26, left: `${c * 100}%`, width: `${w * 100}%`, borderRadius: 6, background: win ? ORANGE : '#6b6b75' }} />;
        })}
        {BEATS.map((b) => {
          const crossAt = T.playFrom + b * (T.playTo - T.playFrom);
          const flash = f >= crossAt ? Math.exp(-(f - crossAt) / 6) : 0;
          const col = win ? '#2BD67B' : '#ff4d4d';
          return <div key={b} style={{ position: 'absolute', top: 6, bottom: 6, width: 3, left: `${b * 100}%`, borderRadius: 2,
            background: flash > 0.05 ? col : '#fff', opacity: win ? 0.9 : 0.55 + 0.45 * flash,
            boxShadow: `0 0 ${18 * flash}px ${6 * flash}px ${col}`, transform: `scaleX(${1 + flash * 1.5})` }} />;
        })}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${ph * 100}%`, width: 4, marginLeft: -2, background: '#fff', opacity: phOpacity, boxShadow: '0 0 14px rgba(255,255,255,.9)' }} />
      </div>
    </div>
  );
};

const Sparks: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 26);
  if (f < at || p >= 1) return null;
  return <>{Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + 0.2;
    const d = 40 + p * (i % 2 ? 170 : 130);
    return <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, borderRadius: 6, background: i % 3 ? ORANGE2 : '#fff',
      transform: `translate(${Math.cos(a) * d - 6}px, ${Math.sin(a) * d - 6}px) scale(${1 - p})`, opacity: 1 - p }} />;
  })}</>;
};

const Video: React.FC<{ fmt: Fmt }> = ({ fmt }) => {
  const f = useCurrentFrame();
  const sp = useSp();
  const S = L[fmt];

  // camera: slow push + shake on the "Claude crushed it" slam
  const shakeAmp = f >= T.slam + 2 ? 12 * Math.exp(-(f - T.slam - 2) / 4) : 0;
  const camX = Math.sin(f * 2.1) * shakeAmp;
  const camY = Math.cos(f * 1.7) * shakeAmp;
  const push = 1 + (fmt === 'feed' ? 0.012 : 0.02) * ramp(f, 0, DURATION, Easing.inOut(Easing.quad));

  const strikeP = ramp(f, T.strike, T.strike + 10);
  const greyP = ramp(f, T.strike + 4, T.strike + 14);
  const slam = sp(T.slam, { damping: 15, stiffness: 240, mass: 0.9 });

  const cardL = sp(T.cardL, { damping: 15 });
  const cardR = sp(T.cardR, { damping: 15 });
  const vs = sp(T.vs, { damping: 9, stiffness: 200 });
  const decided = ramp(f, T.loseVerdict, T.winVerdict + 10);
  const loseV = sp(T.loseVerdict, { damping: 10 });
  const loseShake = f >= T.loseVerdict ? Math.sin((f - T.loseVerdict) * 1.6) * 10 * Math.exp(-(f - T.loseVerdict) / 6) : 0;
  const winV = sp(T.winVerdict, { damping: 9, stiffness: 200 });
  const beatPulse = f >= T.playFrom ? Math.exp(-(((f - T.playFrom) % 15) + 0) / 6) : 0;
  const glow = 0.35 + 0.35 * decided + 0.15 * beatPulse;

  const proof1 = sp(T.proof1);
  const proof2 = sp(T.proof2);
  const underline = ramp(f, T.underline, T.underline + 12);
  const cta = sp(T.cta, { damping: 10, stiffness: 180 });
  const bob = f > T.cta + 15 ? Math.sin((f - T.cta) / 7) * 5 : 0;
  const wiggle = f > T.cta + 10 ? Math.sin((f - T.cta) / 3) * 14 : 0;
  const dotOn = Math.floor(f / 12) % 2 === 0;
  const bgIn = ramp(f, 0, 12);

  const logoBox = (bg: string, extra: React.CSSProperties = {}): React.CSSProperties => ({ width: S.logo, height: S.logo, borderRadius: 30, display: 'grid', placeItems: 'center', background: bg, ...extra });

  return (
    <AbsoluteFill style={{ background: INK, fontFamily: "'Inter Display', 'Inter', 'Noto Color Emoji', sans-serif", color: '#fff', overflow: 'hidden' }}>
      <AbsoluteFill style={{ opacity: bgIn, background: `radial-gradient(900px 700px at ${78 - 4 * (1 - decided)}% 52%, rgba(217,119,87,${glow}), transparent 60%), radial-gradient(700px 600px at 18% 50%, rgba(255,255,255,.06), transparent 60%), linear-gradient(180deg, #121218 0%, #0B0B0F 45%, #160D0A 100%)` }} />
      <AbsoluteFill style={{ opacity: 0.07, backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 3px)', mixBlendMode: 'overlay' }} />

      <AbsoluteFill style={{ transform: `translate(${camX}px, ${camY}px) scale(${push})`, transformOrigin: '50% 45%' }}>
        <div style={{ position: 'absolute', inset: 0, padding: `${S.top}px 70px 0`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* pill */}
          <Pop at={T.pill}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 26px', borderRadius: 999, background: 'rgba(255,255,255,.08)', border: '1.5px solid rgba(255,255,255,.18)',
              font: "700 30px 'Inter'", letterSpacing: '.06em', textTransform: 'uppercase', color: '#ffd9c9' }}>
              <span style={{ width: 14, height: 14, borderRadius: 7, background: '#ff4d4d', boxShadow: dotOn ? '0 0 14px #ff4d4d' : 'none', opacity: dotOn ? 1 : 0.35 }} />AI video editing test
            </div>
          </Pop>

          {/* headline */}
          <div style={{ marginTop: 34, textAlign: 'center', font: `900 ${S.h1}px/0.98 'Inter Display'`, letterSpacing: '-0.035em' }}>
            <div>
              <Pop at={T.line1[0]}>I</Pop>{' '}<Pop at={T.line1[1]}>tried</Pop>{' '}
              <Pop at={T.line1[2]} style={{ position: 'relative', color: `rgba(255,255,255,${1 - 0.45 * greyP})` }}>
                ChatGPT
                <span style={{ position: 'absolute', left: '-4%', right: '-4%', top: '52%', height: 10, background: '#ff4d4d', borderRadius: 6, transform: `rotate(-4deg) scaleX(${strikeP})`, transformOrigin: 'left center' }} />
              </Pop>
            </div>
            <div><Pop at={T.line2[0]}>for</Pop>{' '}<Pop at={T.line2[1]}>my</Pop>{' '}<Pop at={T.line2[2]}>edits.</Pop></div>
            <div style={{ display: 'inline-block', opacity: Math.min(1, slam * 3), transform: `scale(${2.2 - 1.2 * slam})` }}>
              <span style={{ color: ORANGE }}>Claude</span> crushed it.
            </div>
          </div>

          {/* versus cards */}
          <div style={{ position: 'relative', marginTop: S.gap, width: S.vsw, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div style={{ position: 'absolute', left: '50%', top: S.vsTop, width: 104, height: 104, borderRadius: 52, background: INK, border: '4px solid #fff', display: 'grid', placeItems: 'center',
              font: "italic 900 40px/1 'Inter Display'", zIndex: 2, transform: `translate(-50%, -50%) scale(${vs}) rotate(${(1 - vs) * -180}deg)` }}>VS</div>

            {/* ChatGPT */}
            <div style={{ position: 'relative', borderRadius: 34, padding: `40px ${S.cardpad}px 34px`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              background: 'rgba(255,255,255,.05)', border: '2px solid rgba(255,255,255,.12)', filter: `saturate(${1 - 0.5 * decided})`,
              opacity: Math.min(1, cardL * 1.5) * (1 - 0.2 * decided), transform: `translate(${loseShake}px, ${(1 - cardL) * 160}px) scale(${1 - 0.03 * decided})` }}>
              <div style={logoBox('#fff')}><svg viewBox="0 0 24 24" style={{ width: '64%', height: '64%' }}><path d={OPENAI} fill="#000" fillRule="evenodd" /></svg></div>
              <div style={{ marginTop: 22, font: `800 ${S.brand}px/1 'Inter Display'`, letterSpacing: '-.02em' }}>ChatGPT</div>
              <div style={{ marginTop: 10, font: `600 ${S.model}px/1.1 'Inter'`, color: 'rgba(255,255,255,.7)' }}>GPT Astra Medium</div>
              <Track mode="off" />
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, font: `800 ${S.verdict}px/1.1 'Inter Display'`, opacity: Math.min(1, loseV * 2), transform: `scale(${0.5 + 0.5 * loseV})` }}>
                <span style={{ width: 52, height: 52, borderRadius: 26, display: 'grid', placeItems: 'center', background: '#ff4d4d', font: "900 34px/1 'Inter'" }}>✕</span>Off the beat
              </div>
            </div>

            {/* Claude */}
            <div style={{ position: 'relative', borderRadius: 34, padding: `40px ${S.cardpad}px 34px`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              background: 'linear-gradient(180deg, rgba(217,119,87,.28), rgba(217,119,87,.10))', border: `3px solid ${ORANGE}`,
              boxShadow: `0 0 0 ${8 + 4 * beatPulse * decided}px rgba(217,119,87,${0.12 + 0.1 * decided}), 0 30px ${60 + 50 * decided}px rgba(217,119,87,${0.3 + 0.25 * decided})`,
              opacity: Math.min(1, cardR * 1.5), transform: `translateY(${(1 - cardR) * 160}px) scale(${1 + 0.04 * decided + 0.01 * beatPulse * decided})` }}>
              <div style={{ position: 'relative' }}>
                <div style={logoBox('#F6EEE6', { boxShadow: `0 0 ${40 + 40 * beatPulse}px rgba(217,119,87,.6)` })}>
                  <svg viewBox="0 0 24 24" style={{ width: '64%', height: '64%', transform: `rotate(${f * 0.8}deg) scale(${1 + 0.08 * beatPulse})` }}><path d={CLAUDE} fill={ORANGE} /></svg>
                </div>
                <Sparks at={T.winVerdict} />
              </div>
              <div style={{ marginTop: 22, font: `800 ${S.brand}px/1 'Inter Display'`, letterSpacing: '-.02em' }}>Claude</div>
              <div style={{ marginTop: 10, font: `600 ${S.model}px/1.1 'Inter'`, color: ORANGE2 }}>Opus 5.5</div>
              <Track mode="on" />
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, font: `800 ${S.verdict}px/1.1 'Inter Display'`, opacity: Math.min(1, winV * 2), transform: `scale(${0.4 + 0.6 * winV})` }}>
                <span style={{ width: 52, height: 52, borderRadius: 26, display: 'grid', placeItems: 'center', background: '#2BD67B', color: INK, font: "900 34px/1 'Inter'" }}>✓</span>Hits every beat
              </div>
            </div>
          </div>

          {/* proof + CTA */}
          <div style={{ marginTop: S.gap, textAlign: 'center', font: `800 ${S.proof}px/1.12 'Inter Display'`, letterSpacing: '-.02em' }}>
            <div style={{ opacity: proof1, transform: `translateY(${(1 - proof1) * 40}px)` }}>Every video on my profile</div>
            <div style={{ opacity: proof2, transform: `translateY(${(1 - proof2) * 40}px)` }}>
              was edited with{' '}
              <span style={{ position: 'relative', color: ORANGE }}>Opus 5.5
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: -4, height: 6, borderRadius: 3, background: ORANGE, transform: `scaleX(${underline})`, transformOrigin: 'left' }} />
              </span>{' '}🎧
            </div>
          </div>
          <div style={{ marginTop: 30, display: 'inline-flex', alignItems: 'center', gap: 16, padding: '24px 40px', borderRadius: 999, background: '#fff', color: INK,
            font: `900 ${S.cta}px/1 'Inter Display'`, letterSpacing: '-.01em', boxShadow: '0 16px 50px rgba(0,0,0,.5)',
            opacity: Math.min(1, cta * 2), transform: `translateY(${bob}px) scale(${0.3 + 0.7 * cta})` }}>
            Agree? Tell me in the comments <span style={{ display: 'inline-block', transform: `rotate(${wiggle}deg) translateY(${Math.abs(wiggle) * 0.3}px)` }}>👇</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Root: React.FC = () => (
  <>
    <Composition id="TikTok" component={Video} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ fmt: 'tiktok' as Fmt }} />
    <Composition id="Feed" component={Video} durationInFrames={DURATION} fps={FPS} width={1080} height={1350} defaultProps={{ fmt: 'feed' as Fmt }} />
  </>
);

registerRoot(Root);

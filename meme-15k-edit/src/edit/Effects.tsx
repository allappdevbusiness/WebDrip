import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, easeX, jitter, pop, springs, stepped, tween, wiggle} from '../lib/motion';
import {Cue, cue} from '../lib/score';
import {ACCENT, C, FONT, MONO, NOTE} from '../theme';
import {BOTTOM, FULL, PICK, Rect, SHOTS, TOP, f, facesAt, gregCropAt, mapPoint} from './data';
import {Cutout, TORN_H, View, gregView, torn} from './Footage';
import {TitleBar} from './Insert';

const at = (name: Cue) => f(cue(name));

/** Window of `dur` frames starting on a cue; children read the local frame and get the absolute start. */
const At: React.FC<{name: Cue; dur: number; shift?: number; children: (start: number) => React.ReactNode}> = ({name, dur, shift = 0, children}) => {
	const start = at(name) + shift;
	return (
		<Sequence from={start} durationInFrames={dur} name={name}>
			{children(start)}
		</Sequence>
	);
};

// ---------- SVG filters (x-ray threshold, deep fry) ----------
const Filters: React.FC<{seed: number}> = ({seed}) => (
	<svg width={0} height={0} style={{position: 'absolute'}}>
		<filter id="xray" colorInterpolationFilters="sRGB">
			{/* inverted luminance, hard threshold, tinted neon cyan, glow */}
			<feColorMatrix type="matrix" values="-0.3 -0.59 -0.11 0 1  -0.3 -0.59 -0.11 0 1  -0.3 -0.59 -0.11 0 1  0 0 0 1 0" />
			<feComponentTransfer>
				<feFuncR type="discrete" tableValues="0 0 1 1" />
				<feFuncG type="discrete" tableValues="0 0 1 1" />
				<feFuncB type="discrete" tableValues="0 0 1 1" />
			</feComponentTransfer>
			<feColorMatrix type="matrix" values="0.18 0 0 0 0  0 0.83 0 0 0  0 0 0.88 0 0  0 0 0 1 0" result="neon" />
			<feGaussianBlur in="neon" stdDeviation="7" result="glow" />
			<feMerge>
				<feMergeNode in="glow" />
				<feMergeNode in="neon" />
			</feMerge>
		</filter>
		<filter id="deepfry" colorInterpolationFilters="sRGB">
			<feColorMatrix type="saturate" values="5" />
			<feComponentTransfer>
				<feFuncR type="linear" slope="2.4" intercept="-0.5" />
				<feFuncG type="linear" slope="2.4" intercept="-0.55" />
				<feFuncB type="linear" slope="2.0" intercept="-0.6" />
			</feComponentTransfer>
			<feComponentTransfer result="fried">
				<feFuncR type="discrete" tableValues="0 0.35 0.7 1" />
				<feFuncG type="discrete" tableValues="0 0.3 0.65 1" />
				<feFuncB type="discrete" tableValues="0 0.4 1" />
			</feComponentTransfer>
			<feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="1" seed={seed} result="n" />
			<feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 0.85  0 0 0 0 0.2  1.6 0 0 0 -0.75" result="specks" />
			<feComposite in="specks" in2="SourceAlpha" operator="in" result="specksIn" />
			<feMerge>
				<feMergeNode in="fried" />
				<feMergeNode in="specksIn" />
			</feMerge>
		</filter>
	</svg>
);

// ---------- hook: headline in the torn band between the stacked hosts ----------
export const HookHeadline: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const outAt = at('hosts_cut') - 6;
	const out = tween(frame, outAt, 6, 0, 1, ease.exit);
	const slamA = tween(frame, 2, 5, 1.9, 1, easeX.overshoot);
	const slamB = pop(frame, fps, 9, springs.snappy);
	return (
		<AbsoluteFill style={{opacity: 1 - out, translate: `0px ${-60 * out}px`}}>
			<div data-decor style={{position: 'absolute', left: -20, top: 700, width: 1120, height: 285, background: C.paper, clipPath: TORN_H}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 712, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.ink}}>
				&gt; risk_that_didnt_work_out.exe
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 748,
					textAlign: 'center',
					fontFamily: ACCENT,
					fontStyle: 'italic',
					fontWeight: 900,
					fontSize: 126,
					lineHeight: 1,
					color: C.red,
					textShadow: `8px 8px 0 ${C.ink}`,
					scale: String(slamA),
					opacity: frame >= 2 ? 1 : 0,
				}}
			>
				$15,000
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 892, display: 'flex', justifyContent: 'center', opacity: frame >= 9 ? 1 : 0}}>
				<div style={{background: C.ink, color: C.white, fontFamily: FONT, fontSize: 64, lineHeight: 1.1, padding: '4px 20px 0', rotate: '-2deg', scale: String(0.6 + 0.4 * slamB)}}>
					ON MEME PAGES
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------- 5. bad acting teleport: 2-frame white strobe over the jump ----------
const Teleport: React.FC = () => (
	<At name="teleport" dur={2} shift={-1}>
		{() => <AbsoluteFill style={{background: C.winLight}} />}
	</At>
);

// ---------- 6. dynamic text slam behind the head ----------
const TextSlam: React.FC = () => {
	const len = at('slam_end') - at('slam');
	return (
		<At name="slam" dur={len}>
			{(start) => <SlamInner start={start} len={len} />}
		</At>
	);
};
const SlamInner: React.FC<{start: number; len: number}> = ({start, len}) => {
	const local = useCurrentFrame();
	const frame = start + local;
	const s = tween(local, 0, 5, 2.2, 1, easeX.overshoot);
	const shake = local < 8 ? jitter('slam', local, 1, 10) : 0;
	const out = tween(local, len - 5, 5, 0, 1, ease.exit);
	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 150,
					textAlign: 'center',
					fontFamily: FONT,
					fontSize: 300,
					lineHeight: 1,
					color: C.white,
					textShadow: `12px 12px 0 ${C.red}, 24px 24px 0 ${C.ink}`,
					scale: String(s * (1 - 0.35 * out)),
					opacity: 1 - out,
					rotate: '-4deg',
					translate: `${shake}px ${shake * 0.6}px`,
				}}
			>
				$15,000
			</div>
			<Cutout set="slam" frame={frame} crop={gregView(frame)} />
		</AbsoluteFill>
	);
};

// ---------- 4. intrusive thought pop-up: Greg's own live face in a devil bubble ----------
const D = 280;
const Devil: React.FC = () => {
	const len = at('devil_out') - at('devil_in');
	return <At name="devil_in" dur={len}>{(start) => <DevilInner start={start} len={len} />}</At>;
};
const smoothFace = (frame: number) => {
	let x = 0;
	let y = 0;
	let w = 0;
	let n = 0;
	for (let i = frame - 3; i <= frame + 3; i++) {
		const fc = facesAt(i)[0];
		if (fc) {
			x += fc.x;
			y += fc.y;
			w += fc.w;
			n++;
		}
	}
	return n ? {x: x / n, y: y / n, w: w / n} : {x: 900, y: 290, w: 225};
};
const DevilInner: React.FC<{start: number; len: number}> = ({start, len}) => {
	const local = useCurrentFrame();
	const {fps} = useVideoConfig();
	const fc = smoothFace(start + local);
	const side = fc.w * 1.55;
	const crop: Rect = {x: fc.x - side / 2, y: fc.y - side * 0.5, w: side, h: side};
	const inS = pop(local, fps, 0, springs.bouncy);
	const outS = tween(local, len - 6, 6, 1, 0, ease.exit);
	const sway = wiggle('devil', local, 0.08, 4);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 80, top: 400, width: D, height: D, scale: String(inS * outS), rotate: `${sway}deg`, transformOrigin: '50% 60%'}}>
				{/* horns */}
				<svg data-decor width={D} height={D} style={{position: 'absolute', left: 0, top: -58, overflow: 'visible'}}>
					<path d={`M ${D * 0.16} 72 C ${D * 0.08} 20, ${D * 0.2} -6, ${D * 0.3} 0 C ${D * 0.26} 26, ${D * 0.3} 50, ${D * 0.36} 66 Z`} fill={C.red} stroke={C.ink} strokeWidth={6} />
					<path d={`M ${D * 0.84} 72 C ${D * 0.92} 20, ${D * 0.8} -6, ${D * 0.7} 0 C ${D * 0.74} 26, ${D * 0.7} 50, ${D * 0.64} 66 Z`} fill={C.red} stroke={C.ink} strokeWidth={6} />
				</svg>
				<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: `8px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.red}`, background: C.ink}}>
					<View crop={crop} box={{x: 0, y: 0, w: D, h: D}} trimBefore={start} filter="saturate(1.4) contrast(1.15) sepia(0.35) hue-rotate(-25deg)" />
					<AbsoluteFill style={{background: C.red, mixBlendMode: 'multiply', opacity: 0.35}} />
				</div>
				<div style={{position: 'absolute', left: 0, top: D + 18, background: C.ink, color: C.acid, fontFamily: MONO, fontWeight: 700, fontSize: 32, padding: '4px 10px', lineHeight: 1.15}}>
					intrusive_
					<br />
					thought.exe
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------- 7. freeze-frame x-ray glitch: 5 frames, subject inverted with a neon threshold ----------
const XRay: React.FC = () => (
	<At name="xray" dur={5}>
		{(start) => <XRayInner start={start} />}
	</At>
);
const XRayInner: React.FC<{start: number}> = ({start}) => {
	const local = useCurrentFrame();
	const crop = gregView(start);
	const off = [10, -14, 8, -6, 12][local % 5];
	return (
		<AbsoluteFill style={{background: C.ink}}>
			<View crop={crop} box={FULL} trimBefore={start} freeze filter="grayscale(1) brightness(0.25) contrast(1.4)" />
			<AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(0deg, rgba(47,211,224,.16) 0 3px, transparent 3px 9px)`}} />
			<Cutout set="xray" frame={start} crop={crop} style={{filter: 'url(#xray)', translate: `${off}px 0px`, mixBlendMode: 'screen'}} />
			<Cutout set="xray" frame={start} crop={crop} style={{filter: 'url(#xray) hue-rotate(110deg)', translate: `${-off}px 0px`, mixBlendMode: 'screen', opacity: 0.8}} />
		</AbsoluteFill>
	);
};

// ---------- 3. rapid face zoom flicker: single frames, wide <-> hyper-zoom on eyes / mouth ----------
const Flicker: React.FC = () => (
	<At name="flicker" dur={10}>
		{(start) => <FlickerInner start={start} />}
	</At>
);
const FlickerInner: React.FC<{start: number}> = ({start}) => {
	const local = useCurrentFrame();
	if (local % 2 === 0) return null; // wide frames: the base shot shows through
	const fc = facesAt(start + local)[0] ?? facesAt(start)[0];
	if (!fc) return null;
	const target = local % 4 === 1 ? {x: (fc.eyes[0][0] + fc.eyes[1][0]) / 2, y: (fc.eyes[0][1] + fc.eyes[1][1]) / 2} : {x: fc.mouth[0], y: fc.mouth[1]};
	const w = fc.w * 0.9;
	const h = (w * 16) / 9;
	const crop: Rect = {x: target.x - w / 2, y: target.y - h / 2, w, h};
	return <View crop={crop} box={FULL} trimBefore={start} filter="contrast(1.25) saturate(1.3)" />;
};

// ---------- 8. eye-flash laser strobe: 3 frames of white glowing eyes on both hosts ----------
const EyeFlash: React.FC = () => (
	<At name="eyes" dur={3}>
		{(start) => <EyeFlashInner start={start} />}
	</At>
);
const EyeFlashInner: React.FC<{start: number}> = ({start}) => {
	const local = useCurrentFrame();
	const shot = SHOTS.find((s) => s.kind === 'hosts' && start >= s.from && start < s.to);
	if (!shot || shot.kind !== 'hosts') return null;
	const faces = facesAt(start + local);
	if (faces.length < 2) return null;
	const boxes = [TOP, BOTTOM];
	return (
		<AbsoluteFill>
			{faces.slice(0, 2).flatMap((fc, side) =>
				fc.eyes.map((e, i) => {
					const p = mapPoint({x: e[0], y: e[1]}, shot.crops[side], boxes[side]);
					const r = (fc.w * (boxes[side].w / shot.crops[side].w)) * 0.11;
					return (
						<div
							key={`${side}-${i}`}
							style={{
								position: 'absolute',
								left: p.x - r,
								top: p.y - r,
								width: r * 2,
								height: r * 2,
								borderRadius: '50%',
								background: C.winLight,
								boxShadow: `0 0 ${r * 1.2}px ${r * 0.8}px ${C.winLight}, 0 0 ${r * 3}px ${r * 1.6}px ${C.cyan}`,
							}}
						/>
					);
				}),
			)}
		</AbsoluteFill>
	);
};

// ---------- 2. sudden background shift: subject stays, background swaps to a chaotic pop-up wall ----------
const COMMENTS = [
	['comentario.exe', '¡Qué bueno!'],
	['comentário.exe', 'Muito bom demais'],
	['commentaire.exe', 'Trop bien !!'],
	['komentar.exe', 'Mantap sekali'],
	['kommentar.exe', 'Sehr gut!'],
	['yorum.exe', 'Harika olmuş'],
	['komentarz.exe', 'Świetnie!!'],
	['komento.exe', 'Ang galing!'],
	['commento.exe', 'Bellissimo'],
	['opmerking.exe', 'Heel mooi'],
	['kommentti.exe', 'Tosi hyvä'],
	['bình luận.exe', 'Quá đẹp'],
];
const BgShift: React.FC = () => {
	const len = at('bgshift_end') - at('bgshift') + 1;
	return <At name="bgshift" dur={len}>{(start) => <BgShiftInner start={start} />}</At>;
};
const BgShiftInner: React.FC<{start: number}> = ({start}) => {
	const local = useCurrentFrame();
	const frame = start + local;
	const step = stepped(local, 2);
	return (
		<AbsoluteFill style={{background: C.pink, overflow: 'hidden'}}>
			<AbsoluteFill
				data-decor
				style={{
					backgroundImage: `repeating-conic-gradient(from ${step * 9}deg at 50% 30%, ${C.pink} 0 12deg, ${C.cyan} 12deg 18deg, ${C.ink} 18deg 30deg)`,
					backgroundSize: '100% 100%',
					opacity: 0.85,
				}}
			/>
			<AbsoluteFill style={{backgroundImage: `linear-gradient(45deg, ${C.ink} 25%, transparent 25% 75%, ${C.ink} 75%), linear-gradient(45deg, ${C.ink} 25%, transparent 25% 75%, ${C.ink} 75%)`, backgroundSize: '90px 90px', backgroundPosition: '0 0, 45px 45px', opacity: 0.18}} />
			{COMMENTS.map(([title, text], i) => {
				const appear = i * 3;
				if (local < appear) return null;
				// two columns hugging the frame edges so the wall frames him instead of hiding behind him
				const x = (i % 2 === 0 ? 20 + ((i * 37) % 30) : 570 + ((i * 53) % 30)) + jitter(`c${i}`, local, 2, 8);
				const y = 140 + Math.floor(i / 2) * 270 + ((i * 41) % 60) + jitter(`d${i}`, local, 2, 8);
				const s = tween(local, appear, 4, 0.6, 1, ease.sharp);
				return (
					<div key={title} data-decor style={{position: 'absolute', left: x, top: y, width: 420, background: C.win, padding: 3, boxShadow: `inset -3px -3px 0 ${C.winShadow}, inset 3px 3px 0 ${C.winLight}, 8px 8px 0 ${C.ink}`, scale: String(s), rotate: `${((i % 5) - 2) * 3}deg`}}>
						<TitleBar title={title} width={414} height={34} />
						<div style={{padding: '14px 16px', fontFamily: NOTE, fontSize: 38, color: C.ink, background: C.winLight}}>{text}</div>
					</div>
				);
			})}
			<Cutout set="bgshift" frame={frame} crop={gregView(frame)} />
		</AbsoluteFill>
	);
};

// ---------- 10. deep fried panic: subject flickers saturated, contrasty and noisy ----------
const DeepFry: React.FC = () => (
	<At name="fried" dur={10}>
		{(start) => <DeepFryInner start={start} />}
	</At>
);
const DeepFryInner: React.FC<{start: number}> = ({start}) => {
	const local = useCurrentFrame();
	const frame = start + local;
	const hot = local % 2 === 0;
	return (
		<AbsoluteFill>
			<Filters seed={frame} />
			<Cutout set="fried" frame={frame} crop={gregView(frame)} style={{filter: hot ? 'url(#deepfry)' : 'saturate(2.2) contrast(1.6)', scale: hot ? '1.03' : '1'}} />
		</AbsoluteFill>
	);
};

// ---------- payoff slam: the line the whole story pays off, readable with the sound off ----------
const PayoffSlam: React.FC = () => {
	const len = at('soul') - at('fried');
	return <At name="fried" dur={len}>{(start) => <PayoffInner start={start} />}</At>;
};
const PayoffInner: React.FC<{start: number}> = ({start}) => {
	const local = useCurrentFrame();
	const word = (name: Cue) => at(name) - start;
	const slam = (from: number) => (local >= from ? tween(local, from, 4, 1.25, 1, easeX.overshoot) : 0);
	const strip: React.CSSProperties = {fontSize: 150, lineHeight: 1.05, padding: '10px 26px 2px', whiteSpace: 'nowrap', clipPath: torn('payoff', 12, 24)};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
				<div style={{display: 'flex', gap: 18, rotate: '-2deg'}}>
					<span style={{...strip, background: C.ink, color: C.white, fontFamily: FONT, scale: String(slam(0)), opacity: local >= 0 ? 1 : 0}}>NO</span>
					<span style={{...strip, background: C.ink, color: C.white, fontFamily: FONT, scale: String(slam(word('shopify'))), opacity: local >= word('shopify') ? 1 : 0}}>SHOPIFY</span>
				</div>
				<span style={{...strip, background: C.paper, color: C.red, fontFamily: ACCENT, fontStyle: 'italic', fontWeight: 900, rotate: '1.5deg', scale: String(slam(word('traffic'))), opacity: local >= word('traffic') ? 1 : 0}}>traffic.</span>
			</div>
		</AbsoluteFill>
	);
};

// ---------- 1. soul leaving the body: freeze on the defeated frame, ghost copy floats up into a torn-open sky ----------
const Soul: React.FC = () => {
	const len = at('soul_end') - at('soul');
	return <At name="soul" dur={len}>{() => <SoulInner len={len} />}</At>;
};
const SoulInner: React.FC<{len: number}> = ({len}) => {
	const local = useCurrentFrame();
	const n = PICK.defeated;
	const crop = gregCropAt(n);
	const open = tween(local, 0, 5, 0, 1, ease.enter);
	const rise = tween(local, 3, len - 3, 0, 1, ease.move);
	return (
		<AbsoluteFill style={{background: C.ink}}>
			<View crop={crop} box={FULL} trimBefore={n} freeze filter="grayscale(1) contrast(1.15) brightness(0.9)" />
			{/* the sky tears open across the top */}
			<div style={{position: 'absolute', left: -20, top: -40, width: 1120, height: 760 * open, overflow: 'hidden', clipPath: TORN_H}}>
				<AbsoluteFill style={{background: `linear-gradient(${C.winBlue}, ${C.sky} 70%, ${C.white})`}} />
				{[
					[80, 160, 220],
					[640, 110, 260],
					[360, 380, 300],
					[820, 470, 180],
				].map(([x, y, w]) => (
					<div key={`${x}-${y}`} style={{position: 'absolute', left: x + wiggle(`cl${x}`, local, 0.05, 10), top: y, width: w, height: w * 0.32, background: C.white, boxShadow: `${w * 0.18}px ${-w * 0.1}px 0 ${C.white}, ${-w * 0.2}px ${w * 0.05}px 0 ${C.white}`, imageRendering: 'pixelated'}} />
				))}
			</div>
			<Cutout set="soul" frame={n} crop={crop} style={{filter: 'grayscale(1) contrast(1.15) brightness(0.9)'}} />
			<Cutout
				set="soul"
				frame={n}
				crop={crop}
				style={{
					opacity: 0.55 * (1 - 0.6 * rise),
					translate: `${wiggle('soul', local, 0.12, 22)}px ${-980 * rise}px`,
					scale: String(1 + 0.06 * rise),
					filter: `grayscale(1) brightness(1.9) drop-shadow(0 0 18px ${C.winLight})`,
				}}
			/>
		</AbsoluteFill>
	);
};

// ---------- 9. parallel reality flop: every 2 frames, smiling <-> miserable ----------
const Flop: React.FC = () => (
	<At name="flop" dur={10}>
		{() => <FlopInner />}
	</At>
);
const FlopInner: React.FC = () => {
	const local = useCurrentFrame();
	const n = Math.floor(local / 2) % 2 === 0 ? PICK.smiling : PICK.miserable;
	return <View crop={gregCropAt(n)} box={FULL} trimBefore={n} freeze />;
};

/** All timed effects, in stacking order above the base footage. */
export const Effects: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<>
			<Filters seed={frame % 97} />
			<Sequence from={0} durationInFrames={at('hosts_cut')} name="hook headline">
				<HookHeadline />
			</Sequence>
			<Teleport />
			<TextSlam />
			<Devil />
			<XRay />
			<Flicker />
			<EyeFlash />
			<BgShift />
			<DeepFry />
			<PayoffSlam />
			<Soul />
			<Flop />
		</>
	);
};

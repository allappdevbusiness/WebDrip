import React from 'react';
import {AbsoluteFill, Freeze, Img, Sequence, random, staticFile, useCurrentFrame} from 'remotion';
import {Video} from '@remotion/media';
import {ease, keys, tween} from '../lib/motion';
import {cue} from '../lib/score';
import {C} from '../theme';
import {BOTTOM, FULL, INSERT_H, INSERT_W, Rect, SHOTS, SRC, TOP, f, facesAt, gregCropAt, pad5} from './data';
import {InsertWindow} from './Insert';

const SRC_FILE = 'footage30.mp4';

/** Draws the `crop` region of the 30 fps footage into `box`. `trimBefore` = the absolute frame shown at local 0. */
export const View: React.FC<{crop: Rect; box: Rect; trimBefore: number; freeze?: boolean; filter?: string; style?: React.CSSProperties}> = ({
	crop,
	box,
	trimBefore,
	freeze,
	filter,
	style,
}) => {
	const k = box.w / crop.w;
	const video = (
		<Video
			src={staticFile(SRC_FILE)}
			trimBefore={trimBefore}
			muted
			style={{position: 'absolute', left: -crop.x * k, top: -crop.y * k, width: SRC.w * k, height: SRC.h * k, filter}}
		/>
	);
	return (
		<div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden', ...style}}>
			{freeze ? <Freeze frame={0}>{video}</Freeze> : video}
		</div>
	);
};

/** One rembg cutout (full 1920x1080 RGBA) drawn with the same crop as the footage under it. */
export const Cutout: React.FC<{set: string; frame: number; crop: Rect; box?: Rect; style?: React.CSSProperties}> = ({set, frame, crop, box = FULL, style}) => {
	const k = box.w / crop.w;
	return (
		<div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden', ...style}}>
			<Img
				src={staticFile(`roto/${set}/frame_${pad5(frame)}.png`)}
				style={{position: 'absolute', left: -crop.x * k, top: -crop.y * k, width: SRC.w * k, height: SRC.h * k}}
			/>
		</div>
	);
};

/** Shrinks `crop` by `z` around the tracked face (kept inside the source), for motivated punch-ins. */
const zoomed = (crop: Rect, z: number, frame: number): Rect => {
	if (z <= 1.0001) return crop;
	const face = facesAt(frame)[0];
	const cx = face ? face.x : crop.x + crop.w / 2;
	const w = crop.w / z;
	const h = crop.h / z;
	const x = Math.min(Math.max(cx - w / 2, crop.x), crop.x + crop.w - w);
	const y = Math.min(Math.max((face ? face.y : h / 2) - h * 0.42, 0), crop.h - h);
	return {x, y, w, h};
};

/** Greg's framing at an absolute frame: the plan crop, the teleport jump and the punch-ins. */
export const gregView = (frame: number): Rect => {
	const crop = gregCropAt(frame);
	const tp = f(cue('teleport'));
	const shifted = frame >= tp && frame < f(cue('profile_in')) ? {...crop, x: crop.x - 100} : crop;
	// Punch-ins on the words that carry the point; each one ends at the next cut.
	const z1 = frame >= f(cue('bloom')) && frame < f(cue('memes_in')) ? keys(frame, [f(cue('bloom')), f(cue('bloom')) + 6, f(cue('long_game')), f(cue('memes_in'))], [1, 1.12, 1.12, 1.18], [ease.sharp, ease.linear, ease.move]) : 1;
	const z2 = frame >= f(cue('went_all_in')) && frame < f(cue('hosts_in')) ? keys(frame, [f(cue('went_all_in')), f(cue('went_all_in')) + 6, f(cue('followers')), f(cue('hosts_in'))], [1, 1.1, 1.1, 1.2], [ease.sharp, ease.linear, ease.move]) : 1;
	return zoomed(shifted, Math.max(z1, z2), frame);
};

const GregShot: React.FC<{from: number}> = ({from}) => {
	const frame = useCurrentFrame() + from;
	return <View crop={gregView(frame)} box={FULL} trimBefore={from} />;
};

/** Torn strip between the stacked hosts. */
export const TornDivider: React.FC<{y: number; height?: number; color?: string}> = ({y, height = 34, color = C.paper}) => (
	<div
		data-decor
		style={{
			position: 'absolute',
			left: -20,
			width: 1120,
			top: y - height / 2,
			height,
			background: color,
			clipPath: TORN_H,
			boxShadow: '0 6px 0 rgba(0,0,0,.35)',
		}}
	/>
);
// Jagged top and bottom edge in px (depth stays the same whatever the strip's height); seeded, so every frame matches.
export const torn = (seed: string, depth = 16, teeth = 30) => {
	const top: string[] = [];
	const bottom: string[] = [];
	for (let i = 0; i <= teeth; i++) {
		const x = ((i / teeth) * 100).toFixed(2);
		top.push(`${x}% ${(random(`${seed}t${i}`) * depth).toFixed(1)}px`);
		bottom.unshift(`${x}% calc(100% - ${(random(`${seed}b${i}`) * depth).toFixed(1)}px)`);
	}
	return `polygon(${[...top, ...bottom].join(', ')})`;
};
export const TORN_H = torn('strip');

const HostsShot: React.FC<{from: number; crops: [Rect, Rect]}> = ({from, crops}) => {
	const local = useCurrentFrame();
	const open = tween(local, 0, 5, 0, 1, ease.sharp);
	return (
		<AbsoluteFill style={{background: C.ink}}>
			<View crop={crops[0]} box={TOP} trimBefore={from} />
			<View crop={crops[1]} box={BOTTOM} trimBefore={from} />
			<div style={{position: 'absolute', inset: 0, scale: String(0.98 + 0.02 * open)}}>
				<TornDivider y={TOP.h} />
			</div>
		</AbsoluteFill>
	);
};

/** The base picture: every shot of the source in order, in its own 9:16 layout. */
export const BaseFootage: React.FC = () => (
	<>
		{SHOTS.map((s) => (
			<Sequence key={s.from} from={s.from} durationInFrames={s.to - s.from} name={`${s.kind} ${s.from}-${s.to}`}>
				{s.kind === 'greg' ? <GregShot from={s.from} /> : null}
				{s.kind === 'hosts' ? <HostsShot from={s.from} crops={s.crops} /> : null}
				{s.kind === 'insert' ? (
					<InsertWindow title={s.title} tag={s.tag}>
						<View crop={{x: 0, y: 0, w: SRC.w, h: SRC.h}} box={{x: 0, y: 0, w: INSERT_W, h: INSERT_H}} trimBefore={s.from} />
					</InsertWindow>
				) : null}
			</Sequence>
		))}
	</>
);

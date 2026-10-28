import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, springs, wiggle} from '../lib/motion';
import {C, FONT, MONO, NOTE} from '../theme';
import {INSERT_H, INSERT_W} from './data';

const WIN_TOP = 500;
const BAR = 50;
const WIN_X = (1080 - INSERT_W) / 2;

/** Win95 title bar with the three window buttons. */
export const TitleBar: React.FC<{title: string; width: number; height?: number}> = ({title, width, height = BAR}) => (
	<div
		style={{
			width,
			height,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 6px 0 14px',
			boxSizing: 'border-box',
			background: `linear-gradient(90deg, ${C.winBlue}, ${C.winBlue} 60%, ${C.cyan})`,
			fontFamily: MONO,
			fontWeight: 700,
			fontSize: height * 0.6,
			color: C.winLight,
			whiteSpace: 'nowrap',
		}}
	>
		<span>{title}</span>
		<span data-decor style={{display: 'flex', gap: 4}}>
			{['_', '□', '×'].map((g) => (
				<span
					key={g}
					style={{
						width: height * 0.72,
						height: height * 0.62,
						background: C.win,
						color: C.ink,
						fontSize: height * 0.48,
						lineHeight: `${height * 0.62}px`,
						textAlign: 'center',
						boxShadow: `inset -2px -2px 0 ${C.winShadow}, inset 2px 2px 0 ${C.winLight}`,
					}}
				>
					{g}
				</span>
			))}
		</span>
	</div>
);

const Tape: React.FC<{x: number; y: number; rot: number}> = ({x, y, rot}) => (
	<div
		data-decor
		style={{position: 'absolute', left: x, top: y, width: 170, height: 46, background: C.tape, opacity: 0.85, rotate: `${rot}deg`, boxShadow: '0 2px 0 rgba(0,0,0,.2)'}}
	/>
);

/** Paper collage behind the inserts: halftone, grid, a giant faint word. */
export const PaperBackdrop: React.FC<{word: string}> = ({word}) => (
	<AbsoluteFill style={{background: C.paper}}>
		<AbsoluteFill
			style={{
				backgroundImage: `radial-gradient(circle, ${C.ink} 2px, transparent 2.6px)`,
				backgroundSize: '18px 18px',
				opacity: 0.09,
			}}
		/>
		<AbsoluteFill
			style={{
				backgroundImage: `linear-gradient(${C.paperDark} 2px, transparent 2px), linear-gradient(90deg, ${C.paperDark} 2px, transparent 2px)`,
				backgroundSize: '135px 135px',
				opacity: 0.55,
			}}
		/>
		<div
			data-decor
			style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', top: 1420, fontFamily: FONT, fontSize: 300, lineHeight: 0.86, color: C.ink, opacity: 0.07, whiteSpace: 'nowrap', letterSpacing: '-0.02em'}}
		>
			{word}
		</div>
	</AbsoluteFill>
);

/** An insert from the source shown whole (never cropped) inside a Win95 window. */
export const InsertWindow: React.FC<{title: string; tag: string; children: React.ReactNode}> = ({title, tag, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, 0, springs.snappy);
	const drift = wiggle(title, frame, 0.04, 3);
	return (
		<AbsoluteFill>
			<PaperBackdrop word={tag.split(/[._]/)[0].toUpperCase()} />
			<div style={{position: 'absolute', left: WIN_X, top: WIN_TOP - 70, fontFamily: NOTE, fontSize: 34, color: C.ink}}>
				&gt; open {tag}
			</div>
			<div
				style={{
					position: 'absolute',
					left: WIN_X - 4,
					top: WIN_TOP,
					width: INSERT_W + 8,
					background: C.win,
					padding: 4,
					boxShadow: `inset -3px -3px 0 ${C.winShadow}, inset 3px 3px 0 ${C.winLight}, 14px 14px 0 ${C.ink}`,
					scale: String(0.9 + 0.1 * s),
					translate: `0px ${drift}px`,
					transformOrigin: '50% 40%',
				}}
			>
				<TitleBar title={title} width={INSERT_W} />
				<div style={{position: 'relative', width: INSERT_W, height: INSERT_H, overflow: 'hidden', background: C.ink}}>{children}</div>
			</div>
			<Tape x={WIN_X - 70} y={WIN_TOP + 150} rot={-14} />
			<Tape x={WIN_X + INSERT_W - 130} y={WIN_TOP + INSERT_H + 24} rot={-10} />
		</AbsoluteFill>
	);
};

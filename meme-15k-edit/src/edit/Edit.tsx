import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {Grain} from '../components/Fx';
import {Probe} from '../components/Probe';
import {C} from '../theme';
import {shotAt} from './data';
import {Captions} from './Captions';
import {Effects} from './Effects';
import {BaseFootage, TORN_H} from './Footage';

/** Torn paper edges over the top and bottom UI zones of the single shots: the collage frame. */
const PaperEdges: React.FC = () => {
	const frame = useCurrentFrame();
	if (shotAt(frame).kind !== 'greg') return null;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div data-decor style={{position: 'absolute', left: -20, top: -60, width: 1120, height: 150, background: C.paper, clipPath: TORN_H, boxShadow: '0 6px 0 rgba(0,0,0,.3)'}} />
			<div data-decor style={{position: 'absolute', left: -20, top: 1830, width: 1120, height: 150, background: C.paper, clipPath: TORN_H}} />
			<div data-decor style={{position: 'absolute', left: -20, top: 1818, width: 1120, height: 16, background: C.red, clipPath: TORN_H, opacity: 0.9}} />
		</AbsoluteFill>
	);
};

export const Edit: React.FC = () => (
	<AbsoluteFill style={{background: C.ink}}>
		<BaseFootage />
		<Effects />
		<PaperEdges />
		<Captions />
		<Grain opacity={0.05} vignette={0.22} />
		{/* untouched footage voice + music bed (tools/mix_bed.py); the master gets the same file */}
		<Audio src={staticFile('audio/mix.wav')} />
		<Probe />
	</AbsoluteFill>
);

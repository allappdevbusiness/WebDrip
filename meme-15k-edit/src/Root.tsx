import React from 'react';
import {Composition} from 'remotion';
import timeline from '../public/timeline.json';
import {Edit} from './edit/Edit';

// timeline.json é a partitura: duração, cenas, narração, trilha e loudness (scripts/score.py a partir do roteiro.json).
export const RemotionRoot: React.FC = () => (
	<Composition
		id="Meme15k"
		component={Edit}
		durationInFrames={Math.round(timeline.duration * timeline.fps)}
		fps={timeline.fps}
		width={timeline.width}
		height={timeline.height}
		defaultProps={{probe: false}}
	/>
);

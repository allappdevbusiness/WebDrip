import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, tween} from '../lib/motion';
import {WORDS, Word, cue} from '../lib/score';
import {ACCENT, C, FONT} from '../theme';
import {FPS, shotAt} from './data';

// Torn caption strip: small jags top and bottom, straight-ish sides.
const TORN_STRIP =
	'polygon(0% 6%, 8% 0%, 17% 5%, 27% 1%, 38% 6%, 49% 0%, 60% 5%, 71% 1%, 82% 6%, 92% 0%, 100% 4%, 99% 50%, 100% 95%, 91% 100%, 81% 94%, 70% 99%, 59% 95%, 48% 100%, 37% 94%, 26% 99%, 15% 95%, 6% 100%, 0% 96%, 1% 50%)';

type Page = {lines: Word[][]; start: number; end: number};
const chars = (ws: Word[]) => ws.reduce((n, w) => n + w.word.length, 0) + Math.max(0, ws.length - 1);

// paginate() is the extreme-motion-design Captions block's pager (assets/template/src/blocks/Captions.tsx),
// unchanged except for the types: pages close at sentence ends, long pauses or when full.
const paginate = (words: Word[], perLine: number, maxLines = 2, gap = 0.6): Page[] => {
	const pages: Page[] = [];
	let cur: Word[] = [];
	const flush = () => {
		if (!cur.length) return;
		let lines: Word[][] = [cur];
		if (chars(cur) > perLine && maxLines > 1) {
			let best = 1;
			let score = Infinity;
			for (let i = 1; i < cur.length; i++) {
				const a = chars(cur.slice(0, i));
				const b = chars(cur.slice(i));
				if (a <= perLine && b <= perLine && Math.abs(a - b) < score) {
					best = i;
					score = Math.abs(a - b);
				}
			}
			lines = [cur.slice(0, best), cur.slice(best)];
		}
		pages.push({lines, start: cur[0].start, end: cur[cur.length - 1].end});
		cur = [];
	};
	const fits = (ws: Word[]) => {
		let used = 1;
		let n = 0;
		for (const w of ws) {
			const add = (n ? 1 : 0) + w.word.length;
			if (n && n + add > perLine) {
				used++;
				n = w.word.length;
			} else {
				n += add;
			}
		}
		return used <= maxLines;
	};
	words.forEach((w, i) => {
		if (cur.length && !fits([...cur, w])) {
			const comma = cur.map((c) => /[,;:]$/.test(c.word)).lastIndexOf(true);
			const rest = comma >= 0 && comma < cur.length - 1 ? cur.slice(comma + 1) : [];
			if (rest.length) cur = cur.slice(0, comma + 1);
			flush();
			cur = rest;
		}
		cur.push(w);
		const next = words[i + 1];
		if (!next || /[.!?…]$/.test(w.word) || next.start - w.end > gap) flush();
	});
	return pages;
};

// Short-form pages: at most ~5 words (shorts recipe), each page on screen until the next one, >= 20 frames.
const PAGES = (() => {
	const ps = paginate(WORDS, 13, 2, 0.45);
	return ps.map((p, i) => {
		const next = ps[i + 1];
		const end = next ? Math.max(next.start, p.start + 20 / FPS) : p.end + 0.3;
		return {...p, end};
	});
})();

// The word that carries each idea gets the red serif accent (one per page at most).
const KEYS = new Set(
	['risk', 'career', 'marketing', 'follow', 'Bloom', 'community', 'long', 'meme', '$15,000', 'all', 'massive', 'campaign', 'perfect', 'portfolio', '24', 'followers', 'Indian', 'comments', 'languages', 'Shopify', 'zero'].map((w) => w.toLowerCase()),
);
const bare = (w: string) => w.replace(/[^\w$,']/g, '').replace(/,$/, '').toLowerCase();

const yFor = (frame: number) => {
	const s = shotAt(frame);
	if (s.kind === 'insert') return 1270;
	if (s.kind === 'hosts') return s.from === 0 ? 1120 : 1010;
	return 1230;
};

export const Captions: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / FPS;
	const page = PAGES.find((p) => t >= p.start && t < p.end);
	// the payoff line is carried by its own slam (Effects.tsx), so the caption steps aside
	if (!page || (t >= cue('fried') && t < cue('soul'))) return null;
	let accentUsed = false;
	const y = yFor(frame);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 90, right: 90, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, translate: '0px -50%'}}>
				{page.lines.map((line, li) => (
					<div key={li} style={{display: 'flex', flexWrap: 'nowrap', gap: 14, justifyContent: 'center', rotate: `${li % 2 ? 1.2 : -1.2}deg`}}>
						{line.map((w) => {
							const shown = t >= w.start - 1 / FPS;
							const lf = frame - Math.round(w.start * FPS);
							const isKey = !accentUsed && KEYS.has(bare(w.word));
							if (isKey) accentUsed = true;
							const scale = shown ? tween(lf, 0, 4, 1.25, 1, ease.sharp) : 1;
							return (
								<span
									key={`${w.start}-${w.word}`}
									style={{opacity: shown ? 1 : 0, scale: String(scale), filter: `drop-shadow(6px 6px 0 ${isKey ? C.ink : C.red})`}}
								>
									<span
										style={{
											display: 'block',
											padding: isKey ? '8px 18px 4px' : '8px 16px 2px',
											background: isKey ? C.paper : C.ink,
											color: isKey ? C.red : C.white,
											fontFamily: isKey ? ACCENT : FONT,
											fontStyle: isKey ? 'italic' : 'normal',
											fontWeight: isKey ? 900 : 400,
											fontSize: isKey ? 84 : 92,
											lineHeight: 1.12,
											textTransform: isKey ? 'none' : 'uppercase',
											clipPath: TORN_STRIP,
											whiteSpace: 'nowrap',
										}}
									>
										{w.word.replace(/[.,?]$/, '')}
									</span>
								</span>
							);
						})}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

// Shots, crops and tracked faces for the 9:16 edit. Times come from the score (cues.json); crops come from
// the video-to-shorts vertical plan that passed vertical_plan.py; faces from tools/faces.py (YuNet).
import plan from '../../cac/work/shorts/short-001/vertical-agent/vertical_plan.json';
import facesRaw from './faces.json';
import {cue} from '../lib/score';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const SRC = {w: 1920, h: 1080};
export const f = (t: number) => Math.round(t * FPS);

export type Rect = {x: number; y: number; w: number; h: number};
export type Face = {x: number; y: number; w: number; h: number; eyes: number[][]; mouth: number[]};
const FACES = facesRaw as Record<string, Face[]>;
export const facesAt = (frame: number): Face[] => FACES[String(frame)] ?? [];

type PlanSeg = {start_time: number; strategy: string; crop_x?: number; crop_width?: number};
const segs = (plan as {segments: PlanSeg[]}).segments;
const planCrop = (t: number): Rect => {
	const s = segs.find((x) => Math.abs(x.start_time - t) < 0.05 && x.strategy === 'SCENE_CROP');
	if (!s || s.crop_x === undefined) throw new Error(`no presenter crop at ${t}`);
	return {x: s.crop_x, y: 0, w: 608, h: 1080};
};

// Host crops for the stacked two-shots: 1080x960 halves (9:8). The top face sits at 40% of its half and the
// bottom face at 70%, which opens a ~650 px band in the middle for the headline and captions.
const HALF = {w: 630, h: 560};
const meanFace = (from: number, to: number, side: 0 | 1) => {
	let x = 0;
	let y = 0;
	let n = 0;
	for (let i = from; i < to; i++) {
		const fs = facesAt(i);
		if (fs.length === 2) {
			x += fs[side].x;
			y += fs[side].y;
			n++;
		}
	}
	return {x: x / n, y: y / n};
};
const hostCrop = (from: number, to: number, side: 0 | 1): Rect => {
	const c = meanFace(from, to, side);
	const anchor = side === 0 ? 0.4 : 0.7;
	const x = Math.min(SRC.w - HALF.w, Math.max(0, c.x - HALF.w / 2));
	const y = Math.min(SRC.h - HALF.h, Math.max(0, c.y - HALF.h * anchor));
	return {x, y, w: HALF.w, h: HALF.h};
};

export type Shot =
	| {kind: 'greg'; from: number; to: number; crop: Rect}
	| {kind: 'hosts'; from: number; to: number; crops: [Rect, Rect]}
	| {kind: 'insert'; from: number; to: number; title: string; tag: string};

const end = f(55.1667);
const a = f(cue('hosts_cut'));
const b = f(cue('profile_in'));
const c = f(cue('profile_out'));
const d = f(cue('memes_in'));
const e = f(cue('memes_out'));
const g = f(cue('hosts_in'));
const h = f(cue('hosts_out'));

export const SHOTS: Shot[] = [
	{kind: 'hosts', from: 0, to: a, crops: [hostCrop(0, a, 0), hostCrop(0, a, 1)]},
	{kind: 'greg', from: a, to: b, crop: planCrop(2.002)},
	{kind: 'insert', from: b, to: c, title: 'Instagram — marillewellyn', tag: 'founder_profile.jpg'},
	{kind: 'greg', from: c, to: d, crop: planCrop(11.778)},
	{kind: 'insert', from: d, to: e, title: 'meme_page_portfolio.exe', tag: 'meme_pages.zip'},
	{kind: 'greg', from: e, to: g, crop: planCrop(26.426)},
	{kind: 'hosts', from: g, to: h, crops: [hostCrop(g, h, 0), hostCrop(g, h, 1)]},
	{kind: 'greg', from: h, to: end, crop: planCrop(45.912)},
];
export const shotAt = (frame: number) => SHOTS.find((s) => frame >= s.from && frame < s.to) ?? SHOTS[SHOTS.length - 1];
export const gregCropAt = (frame: number): Rect => {
	const s = SHOTS.find((x) => x.kind === 'greg' && frame >= x.from && frame < x.to);
	return s && s.kind === 'greg' ? s.crop : planCrop(45.912);
};

// Boxes on the 1080x1920 canvas.
export const FULL: Rect = {x: 0, y: 0, w: W, h: H};
export const TOP: Rect = {x: 0, y: 0, w: W, h: H / 2};
export const BOTTOM: Rect = {x: 0, y: H / 2, w: W, h: H / 2};
export const INSERT_W = 940;
export const INSERT_H = (INSERT_W * SRC.h) / SRC.w;

/** Where a source pixel lands when `crop` is drawn into `box`. */
export const mapPoint = (p: {x: number; y: number}, crop: Rect, box: Rect) => {
	const k = box.w / crop.w;
	return {x: box.x + (p.x - crop.x) * k, y: box.y + (p.y - crop.y) * k};
};

// Frames picked by eye for the freeze effects (source = 30 fps copy, so source frame == output frame).
export const PICK = {
	defeated: f(29.1), // eyes closed, head bowed: soul leaving the body
	miserable: f(32.9), // teeth-bared grimace: parallel reality flop
	smiling: f(53.8), // broad smile: parallel reality flop
};

export const pad5 = (n: number) => String(n).padStart(5, '0');

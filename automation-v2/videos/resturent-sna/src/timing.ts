// Every time in the edit comes from the beat map measured on the reference MP3 (analysis/*.py).
// Times are VIDEO seconds; song time = video + OFFSET.
import bm from './beatmap.json';

export const FPS = 60;
export const DURATION = 50; // seconds, exact
export const OFFSET = bm.offset_song_s;
export const frames = (t: number) => Math.round(t * FPS);

export const BEATS: number[] = bm.beats;

// Riff notes: cycle 0 = first riff (guitar alone). Each cycle is E · E G E D · C(long) · B(long).
const NOTES: number[] = bm.riffNotes.map((n) => n.t);
export const NOTE_NAMES = ['E', 'E2', 'G', 'E3', 'D', 'C', 'B'] as const;
export type NoteName = (typeof NOTE_NAMES)[number];
export const riff = (cycle: number, note: NoteName | number) => {
  const i = typeof note === 'number' ? note : NOTE_NAMES.indexOf(note);
  return NOTES[cycle * 7 + i];
};
export const CYCLE: number[] = bm.riffCycles; // start of each riff cycle

const section = (id: string) => bm.sections.find((s) => s.id === id)!.t;
export const DRUMS_IN = section('DRUMS_IN'); // 8.069
export const VOCALS_IN = section('VOCALS_IN'); // 15.453
export const RELEASE = section('RELEASE'); // 46.208
export const PRECHORUS = section('PRECHORUS'); // 46.673

// nearest beat index at/after t
export const beatAt = (t: number) => BEATS.findIndex((b) => b >= t - 0.02);
export const beat = (i: number) => BEATS[i];
// time of the beat n beats after t
export const beatsAfter = (t: number, n: number) => BEATS[beatAt(t) + n];

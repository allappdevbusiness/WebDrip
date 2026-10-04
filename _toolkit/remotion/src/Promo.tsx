// Promo composition skeleton. Design every act from this run's brief: scenes, layouts, transitions and look
// are written fresh each run (see briefs/<slug>.md). The building blocks live in kit.ts and frames.tsx.
// Rules the blocks assume: tag measurable elements with data-box / data-kind ('frame' | 'phone' | 'tile' | 'text' |
// 'logo' | 'button'), add data-offset="1" to pieces of a deliberately off-centre group, and wrap each act in an
// element with data-scene="<act id>" so check.mjs can group boxes per scene.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Fmt } from './kit';
import { CapWord, Guides, Subtitles, chunkCaptions, useBoxLogger, useFonts } from './frames';
import { ACTS, actEnd, actStart } from './story';
import captions from './captions.json';

const FONTS = [{ family: 'Inter', file: 'Inter-700.woff2', weight: '400 800' }]; // download .woff2 files into public/
const CHUNKS = chunkCaptions(captions as { words: CapWord[] }[]);
const SUBS = { font: 'Inter, sans-serif', weight: 800, size: { feed: 44, tiktok: 48 }, text: '#FFFFFF', active: '#FFD25A', bg: 'rgba(20,33,58,.9)' };

export const Promo: React.FC<{ fmt: Fmt; showGuides?: boolean; logBoxes?: boolean }> = ({ fmt, showGuides, logBoxes }) => {
  useFonts(FONTS);
  useBoxLogger(logBoxes);
  const t = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <AbsoluteFill style={{ background: '#FFFFFF' }}>
    {ACTS.map((a, i) => (
      <Sequence key={a.id} from={actStart(i)} durationInFrames={actEnd(i) - actStart(i)} premountFor={fps} name={a.id}>
        <AbsoluteFill data-scene={a.id}>{/* this act's scene, designed from the brief */}</AbsoluteFill>
      </Sequence>
    ))}
    <Subtitles f={fmt} t={t} chunks={CHUNKS} theme={SUBS} />
    <Audio src={staticFile('mix.wav')} />
    {showGuides && <Guides f={fmt} />}
  </AbsoluteFill>;
};

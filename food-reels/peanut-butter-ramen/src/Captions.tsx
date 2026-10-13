import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import captions from './captions.json';
import {GOLD} from './lib';

type Word = {line: string; text: string; start: number; end: number};
type Page = {words: Word[]; start: number; end: number};

// lines carried by hero text instead of captions, and single words stamped on screen
const HIDE_LINES = new Set(['hookB', 'tease', 'cta']);
const HIDE_WORDS = new Set(["It's", 'creamy,', 'salty,', 'a', 'little', 'sweet,', 'and', 'spicy.']);

const buildPages = (): Page[] => {
  const words = (captions as Word[]).filter(
    (w) => !HIDE_LINES.has(w.line) && !(w.line === 'verdict' && w.start < 51.5 && HIDE_WORDS.has(w.text)),
  );
  const byLine = new Map<string, Word[]>();
  words.forEach((w) => byLine.set(w.line, [...(byLine.get(w.line) ?? []), w]));
  const lineStarts = [...new Set((captions as Word[]).map((w) => w.line))].map(
    (l) => (captions as Word[]).find((w) => w.line === l)!.start,
  );
  const pages: Page[] = [];
  byLine.forEach((ws) => {
    let cur: Word[] = [];
    const flush = () => {
      if (cur.length) pages.push({words: cur, start: cur[0].start - 0.05, end: 0});
      cur = [];
    };
    ws.forEach((w) => {
      cur.push(w);
      const chars = cur.reduce((n, x) => n + x.text.length + 1, 0);
      if (/[.,?]$/.test(w.text) || cur.length >= 3 || chars > 16) flush();
    });
    flush();
  });
  pages.sort((a, b) => a.start - b.start);
  pages.forEach((p, i) => {
    const last = p.words[p.words.length - 1].end;
    const nextLine = lineStarts.find((s) => s > p.words[0].start + 0.01) ?? 999;
    const next = pages[i + 1]?.start ?? 999;
    p.end = Math.min(next, Math.min(last + 0.45, nextLine));
  });
  return pages;
};

const PAGES = buildPages();

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const page = PAGES.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const local = t - page.start;
  return (
    <div
      style={{
        position: 'absolute',
        left: 160,
        width: 760,
        top: 1360,
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0 18px',
        scale: `${interpolate(local, [0, 0.16], [0.86, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        })}`,
        opacity: interpolate(local, [0, 0.08], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}
    >
      {page.words.map((w, i) => {
        const active = t >= w.start && t < (page.words[i + 1]?.start ?? page.end);
        const spoken = t >= w.start;
        return (
          <span
            key={i}
            style={{
              fontFamily: 'Montserrat',
              fontWeight: 800,
              fontSize: 66,
              lineHeight: 1.12,
              color: active ? GOLD : spoken ? 'white' : 'rgba(255,255,255,0.72)',
              WebkitTextStroke: '10px rgba(0,0,0,0.85)',
              paintOrder: 'stroke fill',
              textShadow: '0 6px 18px rgba(0,0,0,0.55)',
              scale: active ? '1.06' : '1',
              display: 'inline-block',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

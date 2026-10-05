// Private review overlay: essential-text working area + approximate TikTok UI zones. Not in the export.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SAFE } from './theme';
export const Guides: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: SAFE.x0, top: SAFE.y0, width: SAFE.x1 - SAFE.x0, height: SAFE.y1 - SAFE.y0, outline: '3px dashed rgba(0,190,120,.95)' }} />
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 150, background: 'rgba(255,0,80,.22)' }} />
    <div style={{ position: 'absolute', left: 930, top: 880, width: 150, height: 760, background: 'rgba(255,0,80,.22)' }} />
    <div style={{ position: 'absolute', left: 0, top: 1540, width: 1080, height: 380, background: 'rgba(255,0,80,.22)' }} />
  </AbsoluteFill>
);

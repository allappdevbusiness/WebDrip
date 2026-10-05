import React from 'react';
import { Composition } from 'remotion';
import T from './timeline.json';
import { MarlowickVideo } from './Video';

export const Root: React.FC = () => (
  <>
    <Composition id="MarlowickThatWayTikTok40" component={MarlowickVideo} width={1080} height={1920} fps={T.fps} durationInFrames={T.durationInFrames} defaultProps={{ showGuides: false }} />
    {/* private review copy with the working-area / TikTok-UI guides; not part of the export */}
    <Composition id="MarlowickThatWayTikTok40Guides" component={MarlowickVideo} width={1080} height={1920} fps={T.fps} durationInFrames={T.durationInFrames} defaultProps={{ showGuides: true }} />
  </>
);

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FPS } from './timing';
import { shake } from './lib/motion';
import { IMPACTS, SoundDesign } from './sfx';
import { Fonts, Grain } from './components/base';
import { Hook } from './scenes/Hook';
import { Tease } from './scenes/Tease';
import { Reveal } from './scenes/Reveal';
import { MenuRain } from './scenes/MenuRain';
import { FoodMatch } from './scenes/FoodMatch';
import { TacoChapter } from './scenes/TacoChapter';
import { Flyover } from './scenes/Flyover';
import { Interact } from './scenes/Interact';
import { Control } from './scenes/Control';
import { Escalate } from './scenes/Escalate';
import { Payoff } from './scenes/Payoff';

export const Main: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const sh = shake(t, IMPACTS);
  return (
    <AbsoluteFill style={{ background: '#FFFCF5', overflow: 'hidden' }}>
      <Fonts />
      <SoundDesign />
      <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg) scale(${1 + sh.s})` }}>
      <Hook t={t} />
      <Tease t={t} />
      <Reveal t={t} />
      <MenuRain t={t} />
      <FoodMatch t={t} />
      <TacoChapter t={t} />
      <Flyover t={t} />
      <Interact t={t} />
      <Control t={t} />
      <Escalate t={t} />
      <Payoff t={t} />
      </AbsoluteFill>
      <Grain t={t} />
    </AbsoluteFill>
  );
};

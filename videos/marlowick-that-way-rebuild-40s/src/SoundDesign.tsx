// Every sound effect is its own node so it can be moved or re-levelled in Studio.
// `at` is the frame its transient (align="onset") or loudest point (align="peak") should hit.
// All effects are licensed Epidemic Sound assets (IDs in edit-notes.md).
import React from 'react';
import { Sequence } from 'remotion';
import { EV, beat } from './beats';
import { Sfx } from './components/kit';

export const SoundDesign: React.FC = () => (
  <Sequence name="Sound design" layout="none">
    {/* hook: words land on the breakdown's quarter notes; ticks ride the $300 counter */}
    <Sfx name="pop - PAID ME" file="pop-low-zap.wav" at={EV.hookPaid} db={-6} />
    <Sfx name="tick - counter 1" file="ui-click-hard-short.wav" at={EV.hookCountStart + 4} db={-20} maxS={0.12} />
    <Sfx name="tick - counter 2" file="ui-click-hard-short.wav" at={EV.hookCountStart + 9} db={-19} maxS={0.12} />
    <Sfx name="tick - counter 3" file="ui-click-hard-short.wav" at={EV.hookCountStart + 14} db={-18} maxS={0.12} />
    <Sfx name="tick - counter 4" file="ui-click-hard-short.wav" at={EV.hookCountStart + 19} db={-17} maxS={0.12} />
    <Sfx name="impact - $300 lands" file="impact-fast-scifi-02.wav" at={EV.hookCountLand} db={-15} align="peak" />
    <Sfx name="pop - FOR" file="pop-low-zap.wav" at={EV.hookFor} db={-6} />
    <Sfx name="pop - THIS." file="pop-low-zap.wav" at={EV.hookThis} db={-4} />
    <Sfx name="reverse suck into the drop" file="whoosh-deep-reversed.wav" at={EV.drop} db={-9} align="peak" />
    {/* the drop */}
    <Sfx name="impact - drop" file="impact-heavy-percussive.wav" at={EV.drop} db={-13} />
    <Sfx name="boom - drop" file="boom-low-hit.wav" at={EV.drop} db={-16} maxS={1.6} />
    <Sfx name="pop - tag A" file="pop-low-zap.wav" at={EV.tagA} db={-10} />
    <Sfx name="pop - tag B" file="pop-low-zap.wav" at={EV.tagB} db={-10} />
    <Sfx name="pop - tag C" file="pop-low-zap.wav" at={EV.tagC} db={-10} />
    <Sfx name="whoosh - explode" file="swish-air-fast-01.wav" at={EV.explode} db={-12} align="peak" />
    <Sfx name="impact - NOT A TEMPLATE" file="impact-fast-scifi-02.wav" at={EV.notTemplate} db={-11} align="peak" />
    <Sfx name="flyby - dolly through layers" file="flyby-bright-fast.wav" at={EV.dolly + 30} db={-12} align="peak" />
    <Sfx name="impact - rebuild" file="impact-heavy-percussive.wav" at={EV.rebuild} db={-11} />
    <Sfx name="reverse suck - through the button" file="whoosh-deep-reversed.wav" at={beat(208)} db={-11} align="peak" />
    {/* collection */}
    <Sfx name="swish - card 1" file="swipe-through-air-01.wav" at={beat(208) + 27} db={-16} align="peak" />
    <Sfx name="swish - card 2" file="swish-air-fast-03.wav" at={beat(208) + 53} db={-16} align="peak" />
    <Sfx name="swish - card 3" file="swipe-through-air-01.wav" at={beat(208) + 80} db={-16} align="peak" />
    <Sfx name="shutter - macro 1" file="camera-shutter-panasonic.wav" at={EV.macro1} db={-12} />
    <Sfx name="tick - macro 2" file="ui-click-hard-short.wav" at={EV.macro2} db={-15} maxS={0.15} />
    <Sfx name="tick - macro 3" file="ui-click-hard-short.wav" at={EV.macro3} db={-15} maxS={0.15} />
    <Sfx name="tick - macro 4" file="ui-click-hard-short.wav" at={EV.macro4} db={-15} maxS={0.15} />
    <Sfx name="tick - macro 5" file="ui-click-hard-short.wav" at={EV.macro4 + 13} db={-15} maxS={0.15} />
    <Sfx name="impact - grid lands" file="impact-fast-scifi-02.wav" at={EV.gridLand} db={-11} align="peak" />
    <Sfx name="swish - cards fall" file="swish-air-fast-01.wav" at={EV.fall1 + 6} db={-15} align="peak" />
    <Sfx name="riser into the chorus" file="riser-short-fast.wav" at={beat(224)} db={-13} align="peak" maxS={2.6} />
    {/* mobile */}
    <Sfx name="impact - phone slam" file="impact-heavy-percussive.wav" at={EV.phoneSlam} db={-8} />
    <Sfx name="boom - phone slam" file="boom-low-hit.wav" at={EV.phoneSlam} db={-15} maxS={1.2} />
    <Sfx name="tap - Book a fitting" file="touchscreen-tap-hard-02.wav" at={EV.tapBook} db={-7} />
    <Sfx name="whoosh - page travel" file="swish-air-fast-03.wav" at={EV.travelStart + 10} db={-13} align="peak" />
    <Sfx name="pop - arrive at form" file="pop-low-zap.wav" at={EV.arrive} db={-8} />
    <Sfx name="tap - occasion" file="touchscreen-tap-hard-02.wav" at={EV.occasionPress} db={-10} />
    <Sfx name="tick - Black tie selected" file="ui-click-onoff-small-03.wav" at={EV.occasionSelect} db={-10} maxS={0.35} />
    <Sfx name="whip - phone exits" file="swipe-through-air-01.wav" at={EV.phoneExit + 10} db={-11} align="peak" />
    {/* payoff */}
    <Sfx name="impact - Black tie plan" file="impact-fast-scifi-02.wav" at={EV.plan2} db={-11} align="peak" />
    <Sfx name="pop - plan 1" file="pop-low-zap.wav" at={EV.plan1} db={-9} />
    <Sfx name="pop - plan 3" file="pop-low-zap.wav" at={EV.plan3} db={-9} />
    <Sfx name="swish - price push" file="swish-air-fast-01.wav" at={EV.priceMacro + 4} db={-15} align="peak" />
    <Sfx name="whoosh - split screen" file="swish-air-fast-03.wav" at={EV.split} db={-12} align="peak" />
    <Sfx name="whip - into montage" file="swipe-through-air-01.wav" at={beat(248)} db={-12} align="peak" />
    {/* montage: the track drives the cuts; three shutters and a glitch mark the run */}
    <Sfx name="shutter - montage 1" file="camera-shutter-panasonic.wav" at={beat(248)} db={-14} />
    <Sfx name="shutter - montage 2" file="camera-shutter-panasonic.wav" at={beat(250)} db={-15} />
    <Sfx name="shutter - montage 3" file="camera-shutter-panasonic.wav" at={beat(252)} db={-15} />
    <Sfx name="glitch - quarter-beat run" file="glitch-short-circuit-04.wav" at={beat(254.5)} db={-15} maxS={0.55} />
    {/* hold: near silence, then the suck into the bass return */}
    <Sfx name="tick - $300?" file="ui-click-hard-short.wav" at={EV.holdPrice} db={-12} maxS={0.2} />
    <Sfx name="reverse suck into the hero" file="whoosh-deep-reversed.wav" at={EV.hero} db={-11} align="peak" />
    {/* hero */}
    <Sfx name="stinger - billboard lands" file="stinger-whoosh-to-impact.wav" at={EV.hero} db={-15} align="peak" />
    <Sfx name="boom - hero" file="boom-low-hit.wav" at={EV.hero} db={-16} maxS={1.7} />
    <Sfx name="swish - light sweep" file="swish-air-fast-03.wav" at={EV.heroShine + 8} db={-17} align="peak" />
    {/* CTA */}
    <Sfx name="whoosh - CTA in" file="swish-air-fast-01.wav" at={EV.cta} db={-14} align="peak" />
    <Sfx name="pop - COMMENT" file="pop-low-zap.wav" at={EV.ctaComment} db={-7} />
    <Sfx name="impact - PROMPT" file="impact-fast-scifi-02.wav" at={EV.ctaPrompt} db={-10} align="peak" />
    <Sfx name="pop - DM line" file="pop-low-zap.wav" at={EV.ctaDm} db={-10} />
    <Sfx name="pop - follow" file="pop-low-zap.wav" at={EV.ctaFollow} db={-11} />
  </Sequence>
);

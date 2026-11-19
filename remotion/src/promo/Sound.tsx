import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS} from './ui';
import {at, endOf, seq, VO_END} from './words';

// ---- sound design (rules: no whoosh; soft clicks, a clean high-tech ding; music corporate upbeat and quiet) ----
export const SFX = {click: 'promo/audio/click.mp3', thock: 'promo/audio/thock.mp3', ding: 'promo/audio/ding.mp3', pop: 'promo/audio/pop.mp3'};
export const VOL = {music: 0.13, click: 0.55, thock: 0.28, ding: 0.42, pop: 0.3};

/** One sound at an absolute time (seconds). Used at the top level, so frames are absolute. */
const Hit: React.FC<{t: number; src: string; vol: number; rate?: number}> = ({t, src, vol, rate = 1}) => (
  <Sequence from={Math.max(0, Math.round(t * FPS))} durationInFrames={Math.ceil(1.5 * FPS)} layout="none">
    <Audio src={staticFile(src)} volume={vol} playbackRate={rate} />
  </Sequence>
);

/** A sound inside a scene (any nesting): `t` is absolute seconds, `start` the scene clock's absolute start; mounts only while its section is on screen. */
export const useSceneStart = (abs: number) => abs - useCurrentFrame() / FPS;
export const SceneHit: React.FC<{t: number; start: number; src: string; vol: number; rate?: number}> = ({t, start, src, vol, rate = 1}) => (
  <Sequence from={Math.max(0, Math.round((t - start) * FPS))} durationInFrames={Math.ceil(1.5 * FPS)} layout="none">
    <Audio src={staticFile(src)} volume={vol} playbackRate={rate} />
  </Sequence>
);

export const Music: React.FC<{total: number}> = ({total}) => (
  <Audio
    src={staticFile('promo/audio/music.mp3')}
    volume={(f) => {
      const s = f / FPS;
      const fin = Math.min(1, s / 1.5);
      const fout = Math.min(1, Math.max(0, (total - s) / 3));
      return VOL.music * fin * fout;
    }}
  />
);

export const Cues: React.FC = () => {
  const m1 = at('you tell them');
  const m2 = at('make it a little faster');
  const marks = [at('the ums'), at('the repeats'), at('the false starts')];
  const pops: number[] = [
    m1, m1 + 1.1, m2, m2 + 1.2,
    at('powered by ai'),
    at('the cuts'), at('the captions'), at('the graphics'), at('and the sound'),
    at('im busy'),
    ...marks,
    ...[0, 1, 2, 3, 4].map((i) => at('you pick from') + i * 0.18),
    at('it adds captions'), at('moving words'), at('it adds music'),
    at('and it makes the right'), at('wide for youtube'),
    at('every project gets') + 0.3, at('or press magic') + 0.1, at('press create project') + 0.1,
    at('or press suggest') + 0.1, at('press preview edits') + 0.1, at('you can even paste') + 0.2, at('each note sticks'),
    ...[0, 1, 2].map((i) => at('add as many as you want') + i * 0.3),
    ...seq('start script instructions editing gallery').map((s) => s.t),
  ];
  const dings: number[] = [
    at('that is boss studio'), at('choosing one'), at('you stay the boss'), at('takes them out') + 0.5,
    at('when you have your notes'), at('step four') - 0.35, at('full quality'), at('boss studio your vision'),
  ];
  return (
    <>
      {pops.map((t, i) => <Hit key={'p' + i} t={t} src={SFX.pop} vol={VOL.pop} />)}
      {dings.map((t, i) => <Hit key={'d' + i} t={t} src={SFX.ding} vol={VOL.ding} />)}
      <Hit t={at('start creating')} src={SFX.click} vol={VOL.click} />
      <Hit t={at('render final version') + 0.85} src={SFX.click} vol={VOL.click} />
    </>
  );
};
export {endOf, VO_END};

import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS} from './ui';
import {at, GAPS, VO_END} from './words';
import {Cues, Music} from './Sound';
import {Adds, Boss, Busy, Cleanup, Close, Formats, Hook, Record, Sc, Styles, Title, TourEditing, TourGallery, TourInstr, TourNew, TourProjects, TourScript} from './scenes';

// Product explainer for BOSS Studio, 1920x1080. The voiceover (Krista Mashore) drives the timeline: every scene starts on the word it illustrates.
export const PROMO_END = VO_END + 1.6;
export const DURATION_PROMO = Math.round(PROMO_END * FPS);

export const BossPromo: React.FC = () => {
  const tour = at('lets take a quick tour');
  const nw = at('start a project');
  const s1 = at('step one');
  const s2 = at('step two');
  const s3 = at('step three');
  const s4 = at('step four');
  const cl = at('thats it');
  const ov = 0.2; // scenes overlap a hair so cross-fades never flash
  return (
    <>
      <Sc a={0} b={at('that is boss studio') + ov}><Hook /></Sc>
      <Sc a={at('that is boss studio')} b={at('you record the video') + ov}><Title /></Sc>
      <Sc a={at('you record the video')} b={at('think of it as') + ov}><Record /></Sc>
      <Sc a={at('think of it as')} b={at('here is what boss') + ov}><Busy /></Sc>
      <Sc a={at('here is what boss')} b={at('it gives your video') + ov}><Cleanup /></Sc>
      <Sc a={at('it gives your video')} b={at('it adds captions') + ov}><Styles /></Sc>
      <Sc a={at('it adds captions')} b={at('and it makes the right') + ov}><Adds /></Sc>
      <Sc a={at('and it makes the right')} b={at('the best part') + ov}><Formats /></Sc>
      <Sc a={at('the best part')} b={tour + ov}><Boss /></Sc>
      <Sc a={tour} b={nw + ov}><TourProjects a={tour} /></Sc>
      <Sc a={nw} b={s1 + ov}><TourNew a={nw} b={s1 + ov} /></Sc>
      <Sc a={s1} b={s2 + ov}><TourScript a={s1} b={s2 + ov} /></Sc>
      <Sc a={s2} b={s3 + ov}><TourInstr a={s2} b={s3 + ov} /></Sc>
      <Sc a={s3} b={s4 + ov}><TourEditing a={s3} b={s4 + ov} /></Sc>
      <Sc a={s4} b={cl + ov}><TourGallery a={s4} b={cl + ov} /></Sc>
      <Sc a={cl} b={PROMO_END}><Close a={cl} end={PROMO_END} /></Sc>
      {/* the voiceover in pieces, with the GAPS (words.ts) opened between them */}
      {[0, ...GAPS.map((g) => g.src)].map((src, k) => {
        const next = GAPS[k]?.src;
        const out = k === 0 ? 0 : GAPS[k - 1].at + GAPS[k - 1].dur;
        return (
          <Sequence key={k} from={Math.round(out * FPS)} durationInFrames={next === undefined ? undefined : Math.round((next - src) * FPS)}>
            <Audio src={staticFile('promo/vo.mp3')} trimBefore={Math.round(src * FPS)} />
          </Sequence>
        );
      })}
      <Music total={PROMO_END} />
      <Cues />
    </>
  );
};

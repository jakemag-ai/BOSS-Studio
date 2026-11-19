// Word timings of the voiceover (ElevenLabs, Krista Mashore), so every graphic can be tied to the exact word it illustrates.
import vo from './vo.json';

type W = {text: string; start: number; end: number};
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Pauses opened in the voiceover so a screen can hold a little longer. `src` is a silence measured in vo.mp3 (seconds),
// `after` the two words just before it; every word after it moves later by `dur`.
//  - after "pick a style": hold the style picker 1 s (revision v4 note 2)
//  - after "delete them": a breather before "or press suggest cleanup" (v4 note 3)
//  - after "full quality video.": the finished video plays (v2 note 9)
const raw = (vo as {words: W[]}).words;
const GAP_DEFS: {after: [string, string]; src: number; dur: number}[] = [
  {after: ['a', 'style'], src: 61.9, dur: 1.0},
  {after: ['delete', 'them'], src: 78.88, dur: 1.0},
  {after: ['quality', 'video'], src: 147.76, dur: 2.6},
];
/** Each gap with `at` = where it starts on the output timeline (earlier gaps included) and `idx` = first word after it. */
export const GAPS = GAP_DEFS.map((g, k) => {
  const i = raw.findIndex((w, j) => j > 0 && norm(raw[j - 1].text) === g.after[0] && norm(w.text) === g.after[1] && Math.abs(w.end - g.src) < 1.5);
  if (i < 0) throw new Error('voiceover gap word not found: ' + g.after.join(' '));
  return {...g, idx: i + 1, at: g.src + GAP_DEFS.slice(0, k).reduce((s, x) => s + x.dur, 0)};
});
const words: W[] = raw.map((w, i) => {
  const gs = GAPS.filter((g) => i >= g.idx);
  const shift = gs.reduce((s, g) => s + g.dur, 0);
  const floor = Math.max(0, ...gs.map((g) => g.src)); // transcript timings can overlap the silence; never before it
  return {...w, start: Math.max(w.start, floor) + shift, end: Math.max(w.end, floor) + shift};
});const toks = words.map((w) => norm(w.text));
/** The last gap (the final video playing) on the output timeline. */
export const GAP_AT = GAPS[GAPS.length - 1].at;
export const GAP = GAPS[GAPS.length - 1].dur;

/** Index of the first word of `phrase` (or its nth match). Throws, so a script change never silently breaks a sync. */
const idx = (phrase: string, nth = 0): number => {
  const q = phrase.split(/\s+/).map(norm).filter(Boolean);
  let seen = 0;
  for (let i = 0; i + q.length <= toks.length; i++) {
    if (q.every((x, k) => toks[i + k] === x) && seen++ === nth) return i;
  }
  throw new Error('voiceover phrase not found: ' + phrase);
};

/** Start time (seconds) of the first word of `phrase`. */
export const at = (phrase: string, nth = 0) => words[idx(phrase, nth)].start;
/** End time of the last word of `phrase`. */
export const endOf = (phrase: string, nth = 0) => {
  const n = phrase.split(/\s+/).filter(Boolean).length;
  return words[idx(phrase, nth) + n - 1].end;
};
/** The words of `phrase` with their own start times (kinetic text that follows the voice). */
export const seq = (phrase: string, nth = 0) => {
  const i = idx(phrase, nth);
  return phrase.split(/\s+/).filter(Boolean).map((_, k) => ({w: words[i + k].text, t: words[i + k].start}));
};
export const VO_END = vo.audio_duration_secs + GAPS.reduce((s, g) => s + g.dur, 0);

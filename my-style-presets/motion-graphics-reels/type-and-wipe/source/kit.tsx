import React, {createContext, useContext, useId} from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

// ---- BOSS style (my-style.md): warm off-white, near-black, orange-red accent ----
export const C = {
  bg: '#FBFAF8',
  ink: '#14110F',
  muted: '#6B645C',
  accent: '#DC2E0A',
  line: '#E8E2D9',
  star: '#E3DDD3',
  green: '#1E9E5A',
};

const m = loadMontserrat('normal', {weights: ['700', '800'], subsets: ['latin']});
const p = loadPlayfair('italic', {weights: ['700'], subsets: ['latin']});
const j = loadMono('normal', {weights: ['700'], subsets: ['latin']});
export const F = {sans: m.fontFamily, serif: p.fontFamily, mono: j.fontFamily};

export const FPS = 30;

// ---- time: every scene knows its absolute start (seconds), so timings read like the script ----
const TCtx = createContext(0);
export const useAbs = () => {
  const start = useContext(TCtx);
  const f = useCurrentFrame();
  return start + f / FPS;
};

type Cfg = {damping: number; stiffness: number; mass: number};
export const BOUNCE: Cfg = {damping: 9, stiffness: 150, mass: 0.7};
export const POP: Cfg = {damping: 7, stiffness: 170, mass: 0.6};
export const ELASTIC: Cfg = {damping: 6, stiffness: 130, mass: 0.6};

/** Spring that starts at `at` (absolute seconds). 0 before, settles at 1 (overshoots on the way). */
export const sp = (abs: number, at: number, cfg: Cfg = BOUNCE) =>
  abs < at ? 0 : spring({frame: (abs - at) * FPS, fps: FPS, config: cfg});

/** 0..1 ramp between two absolute times. */
export const ramp = (abs: number, a: number, b: number, easing: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(abs, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const fadeIn = (abs: number, at: number, dur = 0.4) => ramp(abs, at, at + dur, Easing.out(Easing.quad));

/** Bouncy entrance: scale from `from`, slide from (x,y), fade in. */
export const enter = (abs: number, at: number, o: {from?: number; x?: number; y?: number; cfg?: Cfg} = {}): React.CSSProperties => {
  const {from = 0.6, x = 0, y = 0, cfg = BOUNCE} = o;
  const s = sp(abs, at, cfg);
  const op = fadeIn(abs, at, 0.25);
  return {
    opacity: op,
    transform: `translate(${x * (1 - s)}px, ${y * (1 - s)}px) scale(${from + (1 - from) * s})`,
  };
};

// ---- scene wrapper: own clock + slow zoom-in push ----
/** Gives everything inside the scene's absolute start time (seconds). Wrap each scene in it. */
export const Clock: React.FC<{start: number; children: React.ReactNode}> = ({start, children}) => (
  <TCtx.Provider value={start}>{children}</TCtx.Provider>
);
/**
 * `shrink` scales the scene's content toward the top of the safe area to free a corner pocket.
 * `pip` is drawn on top, outside the zoom push, so a picture-in-picture stays put.
 */
export const Scene: React.FC<{start: number; dur: number; shrink?: number; pip?: React.ReactNode; children: React.ReactNode}> = ({
  dur,
  shrink = 1,
  pip,
  children,
}) => {
  return (
    <>
      <ZoomPush dur={dur} shrink={shrink}>
        {children}
      </ZoomPush>
      {pip}
    </>
  );
};
const ZoomPush: React.FC<{dur: number; shrink: number; children: React.ReactNode}> = ({dur, shrink, children}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur * FPS], [1, 1.04], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg, transform: `scale(${s})`}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 90% 0%, rgba(220,46,10,.06), transparent 55%)',
        }}
      />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${shrink})`, transformOrigin: '50% 200px'}}>{children}</div>
    </div>
  );
};

// ---- text pieces ----
export const Acc: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span
    style={{
      fontFamily: F.serif,
      fontStyle: 'italic',
      fontWeight: 700,
      color: C.accent,
      letterSpacing: -2,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

/** Centered headline for the section screens. The text types itself out (pick a variant per section). */
export const Head: React.FC<{at: number; variant?: TypeVariant; cps?: number; children: React.ReactNode}> = ({
  at,
  variant = 'caret',
  cps = 20,
  children,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 250,
        padding: '0 50px',
        textAlign: 'center',
        fontFamily: F.sans,
        fontWeight: 800,
        fontSize: 124,
        lineHeight: 1.05,
        letterSpacing: -3,
        textTransform: 'lowercase',
        color: C.ink,
      }}
    >
      <Typed at={at} variant={variant} cps={cps}>
        {children}
      </Typed>
    </div>
  );
};

export const Meta: React.FC<{n: string; at: number}> = ({n, at}) => {
  const abs = useAbs();
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        top: 205,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: 4,
        textTransform: 'uppercase',
        color: C.muted,
        opacity: fadeIn(abs, at, 0.5),
      }}
    >
      <span>why reviews matter</span>
      <span>{n} / 04</span>
    </div>
  );
};

export const Mono: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({
  children,
  size = 26,
  style,
}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 4,
      textTransform: 'uppercase',
      color: C.muted,
      ...style,
    }}
  >
    {children}
  </div>
);

// ---- stars: gray base + orange overlay that pops in (partial fill supported) ----
const STAR = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z';

const OneStar: React.FC<{size: number; frac: number; pop: number; rot: number}> = ({size, frac, pop, rot}) => {
  const id = useId().replace(/:/g, '');
  return (
    <span style={{position: 'relative', display: 'block', width: size, height: size}}>
      <svg viewBox="0 0 24 24" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <path d={STAR} fill={C.star} />
      </svg>
      {frac > 0 ? (
        <svg
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${pop}) rotate(${rot}deg)`,
            opacity: Math.min(1, pop * 2),
          }}
        >
          <defs>
            <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
              <stop offset={frac} stopColor={C.accent} />
              <stop offset={frac} stopColor={C.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={STAR} fill={frac < 1 ? `url(#${id})` : C.accent} />
        </svg>
      ) : null}
    </span>
  );
};

/** `at`: absolute seconds when the first star pops (omit for static). */
export const Stars: React.FC<{val: number; size: number; gap?: number; at?: number; stagger?: number; spin?: boolean}> = ({
  val,
  size,
  gap = 6,
  at,
  stagger = 0.12,
  spin = false,
}) => {
  const abs = useAbs();
  return (
    <div style={{display: 'flex', gap, justifyContent: 'center'}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const pop = at === undefined ? 1 : sp(abs, at + i * stagger, POP);
        const frac = Math.max(0, Math.min(1, val - i));
        if (spin) {
          // whole star pops in with a little spin (hook / outro)
          return (
            <div key={i} style={{transform: `scale(${pop}) rotate(${-40 * (1 - pop)}deg)`, opacity: Math.min(1, pop * 2)}}>
              <OneStar size={size} frac={frac} pop={1} rot={0} />
            </div>
          );
        }
        return <OneStar key={i} size={size} frac={frac} pop={pop} rot={0} />;
      })}
    </div>
  );
};

export const AccentFx = {Easing};

// ---------------------------------------------------------------- typewriter text effects
export type TypeVariant = 'caret' | 'block' | 'word' | 'fall';

type Ch = {c: string; acc: boolean; i: number};
type Tok = {chars: Ch[]; acc: boolean};

/**
 * Types its children out. Variations:
 *  - caret: letters appear one by one, followed by a blinking orange line cursor
 *  - block: same, with a solid block cursor that runs ahead of the text
 *  - word : words pop in one at a time, like fast typing
 *  - fall : each letter drops in with a small bounce, like keystrokes
 * Children can be plain text and <Acc>…</Acc>. Layout never jumps: unwritten letters are just invisible.
 */
export const Typed: React.FC<{at: number; variant?: TypeVariant; cps?: number; children: React.ReactNode}> = ({
  at,
  variant = 'caret',
  cps = 20,
  children,
}) => {
  const abs = useAbs();

  // flatten children into tokens (words, and accent groups kept together)
  const toks: Tok[] = [];
  const seps: boolean[] = []; // is there a space before token n
  let idx = 0;
  let pendingSpace = false;
  React.Children.toArray(children).forEach((ch) => {
    if (typeof ch === 'string' || typeof ch === 'number') {
      const str = String(ch);
      const words = str.split(/(\s+)/);
      words.forEach((w) => {
        if (w === '') return;
        if (/^\s+$/.test(w)) {
          pendingSpace = true;
          return;
        }
        seps.push(pendingSpace && toks.length > 0);
        pendingSpace = false;
        toks.push({acc: false, chars: w.split('').map((c) => ({c, acc: false, i: idx++}))});
      });
    } else if (React.isValidElement(ch)) {
      const inner = String((ch.props as {children?: React.ReactNode}).children ?? '');
      seps.push(pendingSpace && toks.length > 0);
      pendingSpace = false;
      toks.push({acc: true, chars: inner.split('').map((c) => ({c, acc: true, i: idx++}))});
    }
  });
  const total = idx;
  const count = abs < at ? 0 : Math.min(total, Math.floor((abs - at) * cps) + 1);
  const doneAt = at + total / cps;
  const typing = abs >= at - 0.1 && abs < doneAt;
  const hold = abs >= doneAt && abs < doneAt + 0.7;
  const blink = Math.floor(abs * 3.2) % 2 === 0;
  const cursorOn = typing || (hold && blink);

  const charStyle = (ch: Ch): React.CSSProperties =>
    ch.acc ? {fontFamily: F.serif, fontStyle: 'italic', fontWeight: 700, color: C.accent, letterSpacing: -2} : {};

  let wordNo = -1;
  return (
    <>
      {toks.map((t, ti) => {
        wordNo++;
        const wordPop = variant === 'word' ? sp(abs, at + wordNo * 0.2, BOUNCE) : 1;
        return (
          <React.Fragment key={ti}>
            {seps[ti] ? ' ' : null}
            <span
              style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                ...(variant === 'word'
                  ? {opacity: Math.min(1, wordPop * 2), transform: `translateY(${22 * (1 - wordPop)}px) scale(${0.6 + 0.4 * wordPop})`}
                  : {}),
              }}
            >
              {t.chars.map((ch) => {
                const shown = variant === 'word' || variant === 'fall' ? true : ch.i < count;
                let style: React.CSSProperties = {...charStyle(ch), display: 'inline-block', whiteSpace: 'pre', position: 'relative'};
                if (variant === 'fall') {
                  const k = sp(abs, at + ch.i / cps, {damping: 11, stiffness: 220, mass: 0.5});
                  style = {...style, opacity: Math.min(1, k * 3), transform: `translateY(${-46 * (1 - k)}px)`};
                } else if (variant !== 'word') {
                  }
                const caretHere = variant === 'caret' && cursorOn && ch.i === Math.max(0, count - 1);
                const blockHere = variant === 'block' && cursorOn && ch.i === Math.min(total - 1, count);
                return (
                  <span key={ch.i} style={style}>
                    <span style={{opacity: variant === 'caret' || variant === 'block' ? (shown ? 1 : 0) : 1}}>{ch.c}</span>
                    {caretHere ? (
                      <i
                        style={{
                          position: 'absolute',
                          right: count === 0 ? 'auto' : '-0.1em',
                          left: count === 0 ? '-0.1em' : 'auto',
                          top: '0.1em',
                          width: '0.07em',
                          height: '0.88em',
                          background: C.accent,
                          borderRadius: 2,
                        }}
                      />
                    ) : null}
                    {blockHere ? (
                      <i
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: '0.12em',
                          height: '0.86em',
                          background: C.accent,
                          opacity: 0.92,
                          borderRadius: 4,
                        }}
                      />
                    ) : null}
                  </span>
                );
              })}
            </span>
          </React.Fragment>
        );
      })}
    </>
  );
};

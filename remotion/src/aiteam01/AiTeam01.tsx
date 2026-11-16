import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Acc, Typed, BOUNCE, C, Clock, F, FPS, POP, Scene, enter, ramp, sp, useAbs} from '../reviews/kit';
import type {TypeVariant} from '../reviews/kit';

/**
 * "How I'd build my first AI team" remade in BOSS Motion Graphics - 01
 * (warm off-white, near-black, orange-red accent, Montserrat + italic Playfair accent word,
 *  typewriter headlines, orange iris wipes with HUGE slates, bouncy white cards, the boss01 sound set).
 * All times are absolute seconds in the voiceover (voiceover.json word times).
 */
export const DURATION_01 = 3760;
const sec = (s: number) => Math.round(s * FPS);
const SAFE_TOP = 200;
const SAFE_H = 1380;
const ink = C.ink;

// ---------------------------------------------------------------- building blocks
const Title: React.FC<{at: number; variant?: TypeVariant; size?: number; top?: number; cps?: number; children: React.ReactNode}> = ({
  at,
  variant = 'caret',
  size = 108,
  top = 240,
  cps = 22,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top,
      padding: '0 50px',
      textAlign: 'center',
      fontFamily: F.sans,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.05,
      letterSpacing: -3,
      textTransform: 'lowercase',
      color: ink,
    }}
  >
    <Typed at={at} variant={variant} cps={cps}>
      {children}
    </Typed>
  </div>
);

/** plain centred text line that pops in */
const Line: React.FC<{at: number; top: number; size?: number; weight?: number; color?: string; out?: number; children: React.ReactNode}> = ({
  at,
  top,
  size = 54,
  weight = 700,
  color = ink,
  out,
  children,
}) => {
  const abs = useAbs();
  const e = enter(abs, at, {from: 0.8, y: 30});
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        padding: '0 60px',
        textAlign: 'center',
        fontFamily: F.sans,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: -1,
        textTransform: 'lowercase',
        color,
        ...e,
        opacity: (e.opacity as number) * (out === undefined ? 1 : 1 - ramp(abs, out, out + 0.4)),
      }}
    >
      {children}
    </div>
  );
};

/** white card with thin coloured top bar and soft shadow */
const Box: React.FC<{
  top: number;
  at: number;
  h: number;
  w?: number;
  bar?: string;
  bg?: string;
  x?: number;
  y?: number;
  out?: number;
  dimAt?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({top, at, h, w = 900, bar = C.accent, bg = '#fff', x = 0, y = 60, out, dimAt, style, children}) => {
  const abs = useAbs();
  const e = enter(abs, at, {from: 0.8, x, y});
  return (
    <div
      style={{
        position: 'absolute',
        left: (1080 - w) / 2,
        top,
        width: w,
        height: h,
        background: bg,
        borderRadius: 34,
        boxShadow: '0 22px 50px rgba(20,17,15,.26), 0 3px 8px rgba(20,17,15,.14)',
        border: bg === '#fff' ? '3px solid rgba(20,17,15,.14)' : 'none',
        overflow: 'hidden',
        ...style,
        ...e,
        opacity: (e.opacity as number) * (out === undefined ? 1 : 1 - ramp(abs, out, out + 0.4)) * (dimAt === undefined ? 1 : 1 - 0.55 * ramp(abs, dimAt, dimAt + 0.4)),
      }}
    >
      {bar ? <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 12, background: bar}} /> : null}
      {children}
    </div>
  );
};

const Tick: React.FC<{at: number; size?: number}> = ({at, size = 48}) => {
  const abs = useAbs();
  const k = sp(abs, at, POP);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: C.green,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: F.sans,
        fontWeight: 800,
        fontSize: size * 0.62,
        transform: `scale(${k})`,
        flexShrink: 0,
      }}
    >
      ✓
    </div>
  );
};

const Pill: React.FC<{at: number; top: number; tone?: 'accent' | 'dark' | 'white'; size?: number; left?: number; out?: number; children: React.ReactNode}> = ({
  at,
  top,
  tone = 'accent',
  size = 50,
  left,
  out,
  children,
}) => {
  const abs = useAbs();
  const outOp = out === undefined ? 1 : 1 - ramp(abs, out, out + 0.3);
  const bg = tone === 'accent' ? C.accent : tone === 'dark' ? ink : '#fff';
  const col = tone === 'white' ? ink : '#fff';
  const inner = (
    <div
      style={{
        display: 'inline-block',
        background: bg,
        color: col,
        borderRadius: 999,
        padding: `${size * 0.36}px ${size * 0.9}px`,
        fontFamily: F.sans,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: -1,
        textTransform: 'lowercase',
        whiteSpace: 'nowrap',
        boxShadow: tone === 'white' ? '0 12px 30px rgba(20,17,15,.26)' : '0 8px 20px rgba(20,17,15,.2)',
        ...enter(abs, at, {from: 0.6, y: 30}),
      }}
    >
      {children}
    </div>
  );
  if (left !== undefined) return <div style={{position: 'absolute', left, top, opacity: outOp}}>{inner}</div>;
  return <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', opacity: outOp}}>{inner}</div>;
};

/** list row: white card with the text and an optional right-side element */
const Row: React.FC<{top: number; at: number; h?: number; sel?: number; dimAt?: number; right?: React.ReactNode; children: React.ReactNode}> = ({
  top,
  at,
  h = 110,
  sel,
  dimAt,
  right,
  children,
}) => {
  const abs = useAbs();
  const picked = sel !== undefined && abs >= sel;
  return (
    <Box top={top} at={at} h={h} bar="" dimAt={dimAt} style={{outline: picked ? `6px solid ${C.accent}` : 'none', outlineOffset: -6}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 38px',
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 50,
          letterSpacing: -1,
          textTransform: 'lowercase',
          color: ink,
        }}
      >
        <span>{children}</span>
        {right}
      </div>
    </Box>
  );
};

const Badge: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const abs = useAbs();
  return (
    <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 44, color: C.accent, display: 'inline-block', transform: `scale(${sp(abs, at, POP)})`}}>{children}</span>
  );
};

/** hand-drawn loop that draws itself; path is in pixels of the box it sits in */
const Encircle: React.FC<{at: number; w: number; h: number; d: string; dur?: number}> = ({at, w, h, d, dur = 0.7}) => {
  const abs = useAbs();
  const k = ramp(abs, at, at + dur, Easing.inOut(Easing.cubic));
  if (k <= 0) return null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={d} pathLength={1} fill="none" stroke={C.accent} strokeWidth={9} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - k} />
    </svg>
  );
};

const Sweep: React.FC<{at: number; left: number; top: number; w: number; h: number}> = ({at, left, top, w, h}) => {
  const abs = useAbs();
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: w,
        height: h,
        background: C.accent,
        opacity: 0.2,
        borderRadius: 10,
        transformOrigin: 'left center',
        transform: `scaleX(${ramp(abs, at, at + 0.5, Easing.inOut(Easing.cubic))})`,
      }}
    />
  );
};

/** mouse pointer that glides to a spot and clicks */
const Cursor: React.FC<{from: [number, number]; to: [number, number]; start: number; click: number}> = ({from, to, start, click}) => {
  const abs = useAbs();
  const k = ramp(abs, start, click, Easing.inOut(Easing.cubic));
  const x = from[0] + (to[0] - from[0]) * k;
  const y = from[1] + (to[1] - from[1]) * k;
  const press = abs > click && abs < click + 0.25 ? 0.82 : 1;
  const ring = ramp(abs, click, click + 0.5);
  if (abs < start) return null;
  return (
    <>
      {abs >= click && ring < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: to[0] - 60,
            top: to[1] - 60,
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: `6px solid ${C.accent}`,
            transform: `scale(${0.3 + ring})`,
            opacity: 1 - ring,
          }}
        />
      ) : null}
      <svg width="90" height="110" viewBox="0 0 24 28" style={{position: 'absolute', left: x, top: y, transform: `scale(${press})`, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.3))'}}>
        <path d="M3 2 L3 22 L8.5 17 L12 26 L16 24.5 L12.5 16 L20 16 Z" fill={ink} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** shrinks its text to fit inside maxW so nothing is ever cut off at the frame edge */
const FitText: React.FC<{maxW: number; style: React.CSSProperties; children: React.ReactNode}> = ({maxW, style, children}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.scrollWidth;
    setK(w > maxW ? maxW / w : 1);
  });
  return (
    <div ref={ref} style={{...style, display: 'inline-block', whiteSpace: 'nowrap', transform: `scale(${k})`, transformOrigin: 'center center'}}>
      {children}
    </div>
  );
};

// a slightly darker warm background so the white cards stand out instead of washing out
const BG_TINT = '#EDE6D9';
const Fill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: BG_TINT}} />
    {children}
  </AbsoluteFill>
);

// ---------------------------------------------------------------- scene: hook + title (0 to 11.2)
/** one full-screen hook beat: it punches in, holds, then scales away */
const Beat: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const abs = useAbs();
  if (abs < from - 0.02 || abs > to + 0.4) return null;
  const out = ramp(abs, to, to + 0.3, Easing.in(Easing.cubic));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: SAFE_TOP,
        height: SAFE_H,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - out,
        transform: `scale(${1 + 0.18 * out})`,
      }}
    >
      {children}
    </div>
  );
};

/** big number that counts up with a punch ring behind it */
const BigNum: React.FC<{at: number; to: number; count: number; size: number}> = ({at, to, count, size}) => {
  const abs = useAbs();
  const n = Math.round(to * ramp(abs, at, at + count, Easing.out(Easing.cubic)));
  const k = sp(abs, at, POP);
  const ring = ramp(abs, at, at + 0.7);
  return (
    <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {abs >= at ? (
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            border: `14px solid ${C.accent}`,
            transform: `scale(${0.3 + 1.7 * ring})`,
            opacity: 0.55 * (1 - ring),
          }}
        />
      ) : null}
      <FitText maxW={940} style={{fontFamily: F.sans, fontWeight: 800, fontSize: size, lineHeight: 0.95, letterSpacing: -16, color: C.accent, opacity: Math.min(1, k * 2), scale: String(0.4 + 0.6 * k)}}>
        {n}
      </FitText>
    </div>
  );
};

const HookText: React.FC<{at: number; size: number; variant?: TypeVariant; cps?: number; children: React.ReactNode}> = ({at, size, variant = 'fall', cps = 26, children}) => (
  <FitText maxW={940} style={{fontFamily: F.sans, fontWeight: 800, fontSize: size, lineHeight: 1.0, letterSpacing: -5, textTransform: 'lowercase', color: ink}}>
    <Typed at={at} variant={variant} cps={cps}>
      {children}
    </Typed>
  </FitText>
);

/** small lead-in line that sits in the flow above the big text */
const IntroLine: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const abs = useAbs();
  return (
    <div style={{marginBottom: 70, ...enter(abs, at, {from: 0.8, y: 30})}}>
      <FitText maxW={940} style={{fontFamily: F.sans, fontWeight: 700, fontSize: 80, letterSpacing: -2, textTransform: 'lowercase', color: C.muted}}>
        {children}
      </FitText>
    </div>
  );
};

const SceneHook: React.FC = () => {
  return (
    <Fill>
      {/* beat 1: 16 */}
      <Beat from={0} to={2.25}>
        <BigNum at={0.12} to={16} count={0.8} size={640} />
        <div style={{height: 10}} />
        <HookText at={0.9} size={170}>
          ai managers.
        </HookText>
      </Beat>
      {/* beat 2: 145 */}
      <Beat from={2.25} to={4.9}>
        <BigNum at={2.4} to={145} count={1.2} size={640} />
        <div style={{height: 10}} />
        <HookText at={3.5} size={170}>
          ai team
        </HookText>
        <HookText at={3.9} size={170}>
          members.
        </HookText>
      </Beat>
      {/* beat 3: the turn */}
      <Beat from={4.9} to={8.0}>
        <IntroLine at={5.0}>if i started over today…</IntroLine>
        <HookText at={6.9} size={190} variant="fall" cps={24}>
          i’d never
        </HookText>
        <HookText at={7.35} size={190} variant="fall" cps={24}>
          start <Acc>there.</Acc>
        </HookText>
      </Beat>

      {/* title card */}
      <div style={{position: 'absolute', left: 0, right: 0, top: SAFE_TOP, height: SAFE_H, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 40}}>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 124, lineHeight: 1.04, letterSpacing: -4, wordSpacing: '0.18em', textTransform: 'lowercase', color: ink, textAlign: 'center', padding: '0 40px'}}>
          <Typed at={8.5} variant="word" cps={20}>
            {"how i’d build my "}
            <Acc>first ai team</Acc>
          </Typed>
        </div>
        <Line at={10.0} top={1090} size={56} weight={700} color={C.muted}>
          if i started over today
        </Line>
      </div>
    </Fill>
  );
};

// ---------------------------------------------------------------- scene: the point (11.2 to 22.7)  [split: presenter below]
const ScenePoint: React.FC = () => {
  const abs = useAbs();
  const n = abs < 13.4 ? 145 : Math.max(1, Math.round(145 - 144 * ramp(abs, 13.4, 14.6, Easing.out(Easing.cubic))));
  const isOne = abs >= 14.5;
  const strike = ramp(abs, 12.1, 12.5);
  const numPop = isOne ? sp(abs, 14.5, POP) : 1;
  return (
    <Fill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 245, textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 96, letterSpacing: -3, textTransform: 'lowercase', color: ink, padding: '0 40px'}}>
        <Typed at={11.3} variant="caret" cps={22}>
          {"you don’t need "}
          <Acc>145.</Acc>
        </Typed>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', fontFamily: F.sans, fontWeight: 800, fontSize: 340, lineHeight: 1, letterSpacing: -12, color: abs >= 13.4 ? C.accent : ink, ...enter(abs, 11.6, {from: 0.5, y: 50}), transform: `scale(${(0.5 + 0.5 * sp(abs, 11.6, POP)) * (isOne ? 1 + 0.12 * (1 - numPop) : 1)})`}}>
          {n}
          {abs < 13.4 ? <div style={{position: 'absolute', left: -20, top: '52%', height: 30, width: `${strike * 108}%`, background: C.accent, borderRadius: 15, transform: 'rotate(-5deg)'}} /> : null}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 730, textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 88, letterSpacing: -3, textTransform: 'lowercase', color: ink}}>
        <Typed at={13.4} variant="block" cps={20}>
          {'you need '}
          <Acc>one.</Acc>
        </Typed>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: 50, letterSpacing: -1, textTransform: 'lowercase', color: ink, padding: '0 50px'}}>
        <Typed at={15.5} variant="word">
          one ai. one job. done really well.
        </Typed>
      </div>
      <Pill at={18.4} top={945} size={46} out={20.5}>
        5 steps, in order
      </Pill>
      <Line at={20.7} top={955} size={48} weight={700}>
        {'works for '}
        <Acc>any</Acc>
        {' business.'}
      </Line>
    </Fill>
  );
};

// ---------------------------------------------------------------- step 1: teach it your business (22.7 to 47.5)
const Step1: React.FC = () => (
  <Fill>
    <Title at={23.6} variant="caret" cps={22}>
      {'teach it '}
      <Acc>your business</Acc>
    </Title>
    <Row top={540} at={25.7} h={105} right={<Tick at={28.0} />}>your voice</Row>
    <Row top={662} at={26.3} h={105} right={<Tick at={28.3} />}>what you sell</Row>
    <Row top={784} at={27.1} h={105} right={<Tick at={28.6} />}>who you serve</Row>

    {/* onboarding analogy */}
    <Box top={930} at={29.3} h={230} bar={C.accent} out={36.2} x={-200} y={0}>
      <div style={{position: 'absolute', inset: 0, padding: '46px 40px 0', fontFamily: F.sans, textTransform: 'lowercase'}}>
        <div style={{fontWeight: 800, fontSize: 52, color: C.accent, letterSpacing: -1}}>a new hire</div>
        <div style={{fontWeight: 700, fontSize: 40, color: ink, marginTop: 8, lineHeight: 1.15}}>needs to be told how your business runs</div>
      </div>
    </Box>
    <Box top={1190} at={33.1} h={200} bar={ink} out={36.2} x={200} y={0}>
      <div style={{position: 'absolute', inset: 0, padding: '46px 40px 0', fontFamily: F.sans, textTransform: 'lowercase'}}>
        <div style={{fontWeight: 800, fontSize: 52, color: ink, letterSpacing: -1}}>your ai</div>
        <div style={{fontWeight: 700, fontSize: 40, color: C.accent, marginTop: 8}}>exactly the same</div>
      </div>
    </Box>

    {/* the voice rules file */}
    <Box top={930} at={36.9} h={380} bar={C.accent}>
      <div style={{position: 'absolute', left: 40, top: 40, fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: C.muted}}>07-voice-rules.md</div>
      <div style={{position: 'absolute', left: 40, top: 92, fontFamily: F.sans, fontWeight: 800, fontSize: 52, letterSpacing: -1, color: ink, textTransform: 'lowercase'}}>how you sound</div>
      <Sweep at={37.9} left={28} top={186} w={820} h={60} />
      <Sweep at={40.7} left={28} top={262} w={820} h={60} />
      <div style={{position: 'absolute', left: 40, top: 190, fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: ink, textTransform: 'lowercase', whiteSpace: 'nowrap'}}>
        <b style={{fontWeight: 800}}>direct</b> — say the thing. no throat-clearing.
      </div>
      <div style={{position: 'absolute', left: 40, top: 266, fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: ink, textTransform: 'lowercase', whiteSpace: 'nowrap'}}>
        <b style={{fontWeight: 800}}>plain-spoken</b> — a 7th-grader can read it.
      </div>
      <Encircle at={42.7} w={900} h={380} d="M 22 222 C 18 168 220 160 450 160 C 700 160 884 172 880 244 C 876 332 700 344 450 344 C 200 344 14 336 18 262 C 20 226 130 178 220 172" />
    </Box>
    <Pill at={45.2} top={1340} tone="dark" size={46}>
      skip it and it all sounds <span style={{color: C.accent}}>generic</span>
    </Pill>
  </Fill>
);

// ---------------------------------------------------------------- step 2: hire for the job you repeat (47.5 to 65.3)  [split]
const SwapPill: React.FC<{top: number; size?: number; items: {at: number; text: string; tone: 'accent' | 'dark'}[]}> = ({top, size = 46, items}) => {
  const abs = useAbs();
  const cur = [...items].reverse().find((i) => abs >= i.at);
  if (!cur) return null;
  return (
    <Pill key={cur.at} at={cur.at} top={top} tone={cur.tone} size={size}>
      {cur.text}
    </Pill>
  );
};
const Step2: React.FC = () => (
  <Fill>
    <Title at={48.4} variant="block" size={100} top={245} cps={22}>
      {'hire the job '}
      <Acc>you repeat</Acc>
    </Title>
    <Line at={51.0} top={490} size={40} weight={700} color={C.muted}>what you did by hand this week</Line>
    <Row top={555} at={52.9} h={108} sel={61.0} dimAt={undefined} right={<Badge at={58.3}>×5</Badge>}>write captions</Row>
    <Row top={678} at={54.9} h={108} dimAt={61.0} right={<Badge at={58.65}>×5</Badge>}>answer the same dms</Row>
    <Row top={801} at={56.9} h={108} dimAt={61.0} right={<Badge at={59.0}>×5</Badge>}>follow up with leads</Row>
    <Cursor from={[760, 1010]} to={[640, 610]} start={59.2} click={61.0} />
    <SwapPill
      top={940}
      items={[
        {at: 58.4, text: 'pick the one you repeat', tone: 'dark'},
        {at: 61.8, text: 'your first hire', tone: 'accent'},
        {at: 63.0, text: 'not the biggest job', tone: 'dark'},
        {at: 63.9, text: 'the most repeated one', tone: 'accent'},
      ]}
    />
  </Fill>
);

// ---------------------------------------------------------------- step 3: write it a job description (65.3 to 85.2)
const Step3: React.FC = () => (
  <Fill>
    <Title at={66.2} variant="fall" cps={22}>
      {'write it a '}
      <Acc>job description</Acc>
    </Title>
    {[
      {at: 69.7, top: 560, t: 'what it does', bar: ink},
      {at: 71.8, top: 790, t: 'what good looks like', bar: ink},
      {at: 73.2, top: 1020, t: 'what it never does without you', bar: C.accent},
    ].map((c) => (
      <Box key={c.t} top={c.top} at={c.at} h={190} bar={c.bar} out={74.6}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 50px', fontFamily: F.sans, fontWeight: 800, fontSize: 56, letterSpacing: -1, lineHeight: 1.08, textTransform: 'lowercase', color: c.bar === C.accent ? C.accent : ink}}>
          {c.t}
        </div>
      </Box>
    ))}
    <Box top={560} at={74.9} h={800} bar={C.accent}>
      <div style={{position: 'absolute', left: 44, top: 50, display: 'flex', alignItems: 'center', gap: 20, fontFamily: F.sans, fontWeight: 800, fontSize: 62, letterSpacing: -1, textTransform: 'lowercase', color: ink}}>
        <span style={{width: 26, height: 26, borderRadius: '50%', background: C.green, display: 'inline-block'}} />
        daily briefing
      </div>
      <div style={{position: 'absolute', left: 44, right: 44, top: 140, fontFamily: F.sans, fontWeight: 600, fontSize: 40, lineHeight: 1.25, color: C.muted, textTransform: 'lowercase'}}>
        every morning: calendar, inbox highlights, pipeline, and one top-priority next move.
      </div>
      {[
        {at: 77.5, tick: 82.9, t: 'calendar', x: 44, y: 340},
        {at: 78.4, tick: 83.2, t: 'inbox', x: 470, y: 340},
        {at: 79.6, tick: 83.5, t: 'pipeline', x: 44, y: 540},
        {at: 80.5, tick: 83.8, t: 'top move', x: 470, y: 540},
      ].map((g) => (
        <GridItem key={g.t} {...g} />
      ))}
    </Box>
  </Fill>
);
const GridItem: React.FC<{at: number; tick: number; t: string; x: number; y: number}> = ({at, tick, t, x, y}) => {
  const abs = useAbs();
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 386,
        height: 170,
        borderRadius: 26,
        background: C.bg,
        border: `4px solid rgba(20,17,15,.16)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        fontFamily: F.sans,
        fontWeight: 800,
        fontSize: 48,
        letterSpacing: -1,
        textTransform: 'lowercase',
        color: ink,
        ...enter(abs, at, {from: 0.6, y: 40}),
      }}
    >
      {t}
      <Tick at={tick} size={52} />
    </div>
  );
};

// ---------------------------------------------------------------- step 4: correct it like a new hire (85.2 to 102.3)
const LoopRing: React.FC = () => {
  const abs = useAbs();
  const r = 175;
  const cx = 540;
  const cy = 730;
  const k = ramp(abs, 88.4, 92.4, Easing.inOut(Easing.cubic));
  const pills = [
    {at: 88.8, t: 'wrong', a: -90, tone: ink},
    {at: 90.1, t: 'why', a: 30, tone: ink},
    {at: 91.4, t: 'fix', a: 150, tone: C.accent},
  ];
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.accent} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} transform={`rotate(-90 ${cx} ${cy})`} />
      </svg>
      {pills.map((p) => {
        const x = cx + r * Math.cos((p.a * Math.PI) / 180);
        const y = cy + r * Math.sin((p.a * Math.PI) / 180);
        const e = enter(abs, p.at, {from: 0.5, y: 20});
        return (
          <div
            key={p.t}
            style={{
              position: 'absolute',
              left: x - 95,
              top: y - 42,
              width: 190,
              height: 84,
              borderRadius: 999,
              background: p.tone,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: F.sans,
              fontWeight: 800,
              fontSize: 46,
              textTransform: 'lowercase',
              ...e,
            }}
          >
            {p.t}
          </div>
        );
      })}
    </>
  );
};
const Step4: React.FC = () => (
  <Fill>
    <Title at={86.1} variant="word" size={104}>
      {'correct it like '}
      <Acc>a new hire</Acc>
    </Title>
    <LoopRing />
    <Box top={930} at={93.6} h={400} bar={C.accent}>
      <div style={{position: 'absolute', left: 40, top: 46, display: 'flex', alignItems: 'center', gap: 18, fontFamily: F.sans, fontWeight: 800, fontSize: 52, letterSpacing: -1, textTransform: 'lowercase', color: ink}}>
        <span style={{width: 24, height: 24, borderRadius: '50%', background: C.green, display: 'inline-block'}} />
        correction postmortem
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 128, fontFamily: F.sans, fontWeight: 600, fontSize: 36, lineHeight: 1.25, color: C.muted, textTransform: 'lowercase'}}>
        runs a root-cause check whenever you correct your ai, then logs and applies the fix.
      </div>
      <Pill at={97.4} top={290} left={40} tone="dark" size={40}>root cause</Pill>
      <Pill at={98.7} top={290} left={340} tone="dark" size={40}>logged</Pill>
      <Pill at={99.4} top={290} left={560} tone="accent" size={40}>fixed</Pill>
    </Box>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1360, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20}}>
      <Tick at={100.5} size={56} />
      <Line at={100.5} top={1366} size={50} weight={800}>
        never happens twice
      </Line>
    </div>
  </Fill>
);

// ---------------------------------------------------------------- step 5: hire the next one (102.3 to 115.9)  [split]
const Step5: React.FC = () => {
  const abs = useAbs();
  const mgr = Math.round(16 * ramp(abs, 112.9, 114.6, Easing.out(Easing.cubic)));
  const rowOut = 1 - ramp(abs, 112.6, 112.9);
  return (
    <Fill>
      <Title at={103.2} variant="caret" size={112} top={245}>
        {'hire '}
        <Acc>the next one</Acc>
      </Title>
      <div style={{position: 'absolute', left: 0, right: 0, top: 410, display: 'flex', justifyContent: 'center', gap: 32, opacity: rowOut}}>
        {[104.6, 105.5, 106.5].map((a, i) => {
          const e = enter(abs, a, {from: 0.4, y: 40});
          return (
            <div key={i} style={{width: 140, height: 140, borderRadius: '50%', background: C.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 84, boxShadow: '0 12px 28px rgba(20,17,15,.25)', ...e}}>
              ✓
            </div>
          );
        })}
      </div>
      <div style={{opacity: rowOut}}>
        <Line at={106.9} top={575} size={48} weight={800}>
          jobs running <Acc>on their own</Acc>
        </Line>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 24, ...enter(abs, 112.9, {from: 0.7, y: 30})}}>
        <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 200, letterSpacing: -8, color: C.accent, lineHeight: 1}}>{mgr}</span>
        <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 70, letterSpacing: -2, color: ink, textTransform: 'lowercase'}}>managers</span>
      </div>
      <Box top={650} at={108.9} h={333} w={720} bar="">
        <Img src={staticFile('first-ai-team/img/managers.png')} style={{position: 'absolute', left: 0, top: 0, width: 720, height: 333, objectFit: 'cover'}} />
      </Box>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1003, display: 'flex', justifyContent: 'center', gap: 16}}>
        {[
          {at: 110.5, t: 'content'},
          {at: 111.0, t: 'leads'},
          {at: 111.5, t: 'follow-up'},
        ].map((p) => (
          <div key={p.t} style={{background: ink, color: '#fff', borderRadius: 999, padding: '14px 34px', fontFamily: F.sans, fontWeight: 800, fontSize: 40, textTransform: 'lowercase', ...enter(abs, p.at, {from: 0.6, y: 30})}}>
            {p.t}
          </div>
        ))}
      </div>
    </Fill>
  );
};

// ---------------------------------------------------------------- call to action (115.9 to 125.3)  [split]
const SceneCta: React.FC = () => {
  const abs = useAbs();
  const pulse = 1 + 0.02 * Math.sin(abs * 6);
  return (
    <Fill>
      <Title at={116.9} variant="block" size={104} top={245} cps={24}>
        {'your team starts with '}
        <Acc>one hire.</Acc>
      </Title>
      <Line at={118.3} top={490} size={48} weight={700}>pick your first job tonight.</Line>
      <Box top={575} at={120.0} h={340} bar="" bg={C.accent}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, color: '#fff', textAlign: 'center', transform: `scale(${pulse})`}}>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 92, letterSpacing: -3, textTransform: 'lowercase', lineHeight: 1, whiteSpace: 'nowrap'}}>
            comment <span style={{background: ink, padding: '0 20px', borderRadius: 16, textTransform: 'uppercase'}}>TEAM</span>
          </div>
          <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 42, letterSpacing: -1, textTransform: 'lowercase', padding: '0 40px', lineHeight: 1.15}}>
            i’ll send you the 5 steps + the prompts
          </div>
        </div>
      </Box>
      <Line at={123.0} top={950} size={44} weight={800} color={C.muted}>
        @kristamashore
      </Line>
    </Fill>
  );
};

// ---------------------------------------------------------------- orange iris wipes with HUGE words
const SLATES = [
  {T: 22.7, n: '01', size: 420, lines: ['teach']},
  {T: 47.5, n: '02', size: 330, lines: ['repeat']},
  {T: 65.3, n: '03', size: 420, lines: ['write']},
  {T: 85.2, n: '04', size: 300, lines: ['correct']},
  {T: 102.3, n: '05', size: 420, lines: ['grow']},
  {T: 115.9, n: 'NOW', size: 330, lines: ['your', 'turn']},
];
const Wipes: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const s = SLATES.find((x) => t >= x.T - 0.45 && t < x.T + 1.0);
  if (!s) return null;
  const scale = ramp(t, s.T - 0.45, s.T, Easing.in(Easing.cubic));
  const discOp = t < s.T + 0.55 ? 1 : 1 - ramp(t, s.T + 0.55, s.T + 0.95, Easing.inOut(Easing.quad));
  const textIn = ramp(t, s.T - 0.15, s.T + 0.2);
  const textOut = ramp(t, s.T + 0.5, s.T + 0.8, Easing.in(Easing.quad));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 540 - 1300,
          top: 960 - 1300,
          width: 2600,
          height: 2600,
          borderRadius: '50%',
          background: C.accent,
          backgroundImage: 'radial-gradient(circle, rgba(20,17,15,.16) 4px, transparent 5px)',
          backgroundSize: '34px 34px',
          transform: `scale(${scale})`,
          opacity: discOp,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: SAFE_TOP,
          height: SAFE_H,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          opacity: textIn * (1 - textOut),
          transform: `translateY(${30 * (1 - textIn)}px)`,
        }}
      >
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 64, letterSpacing: 14, marginBottom: 20}}>{s.n}</div>
        {s.lines.map((l, i) => (
          <FitText
            key={l}
            maxW={940}
            style={{
              fontFamily: i === 1 ? F.serif : F.sans,
              fontStyle: i === 1 ? 'italic' : 'normal',
              fontWeight: i === 1 ? 700 : 800,
              fontSize: s.size,
              lineHeight: 0.98,
              letterSpacing: i === 1 ? -4 : -9,
              textTransform: 'lowercase',
            }}
          >
            {l}
          </FitText>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- presenter: rounded video at the bottom + a cut-out of her on top
// The same clip is shown twice, perfectly aligned: once inside a rounded box, once as a transparent cut-out
// that is NOT clipped, so her hair and head rise above the box and sit in front of the graphics.
const PS = 0.9; // source pixels to screen pixels
const CROP = {x: 460, y: 130, w: 1000, h: 950}; // region of the 1920x1080 clip that was cut out
const BOTTOM = 1925; // screen y of the bottom of the clip
const CUT_TOP = BOTTOM - CROP.h * PS; // screen y of the top of the cut-out layer

type PresWin = {in: number; out: number; slideIn: number; dir: string; frames: number; exit: boolean};
// frames are baked by tools/matte/bake-presenter.sh: one aligned 900x855 image per frame at 30 fps
const WINDOWS: PresWin[] = [
  {in: 11.2, out: 22.7, slideIn: 11.45, dir: 'f-point', frames: 346, exit: true},
  {in: 47.5, out: 65.3, slideIn: 48.5, dir: 'f-step2', frames: 533, exit: true},
  {in: 102.3, out: 124.2, slideIn: 103.3, dir: 'f-end', frames: 658, exit: false},
];

const Presenter: React.FC<{w: PresWin}> = ({w}) => {
  const abs = useAbs();
  const local = useCurrentFrame();
  const idx = Math.max(0, Math.min(w.frames - 1, local));
  const up = sp(abs, w.slideIn, BOUNCE);
  const down = w.exit ? ramp(abs, w.out - 0.5, w.out - 0.05, Easing.in(Easing.cubic)) : 0;
  const dy = 1000 * (1 - up) + 1000 * down;
  return (
    <AbsoluteFill style={{transform: `translateY(${dy}px)`, pointerEvents: 'none'}}>
      <Img
        src={staticFile(`first-ai-team/pres/${w.dir}/${String(idx).padStart(5, '0')}.webp`)}
        style={{position: 'absolute', left: 90, top: CUT_TOP, width: 900, height: 855, filter: 'drop-shadow(0 -8px 28px rgba(20,17,15,.28))'}}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- audio: voice, music bed, boss01 sound set
type Fx = {src: string; at: number; vol: number; rate?: number; dur?: number};
const Snd: React.FC<Fx> = ({src, at, vol, rate = 1, dur}) => (
  <Sequence from={sec(at)} durationInFrames={dur === undefined ? undefined : Math.max(1, sec(dur))} layout="none">
    <Audio src={staticFile(src)} volume={vol} playbackRate={rate} />
  </Sequence>
);
const sfx = (name: string) => `reviews/sfx/boss01-${name}.wav`;
const BASIC = (name: string) => `reviews/${name}.wav`;

// every text that types itself: [start, characters, characters per second]
const TYPING: Array<[number, number, number]> = [
  [0.9, 12, 26], // ai managers.
  [3.5, 16, 26], // ai team members.
  [6.9, 17, 24], // i'd never start there.
  [11.3, 18, 22], // you don't need 145.
  [13.4, 12, 20], // you need one.
  [23.6, 22, 22], // teach it your business
  [48.4, 22, 22], // hire the job you repeat
  [66.2, 26, 22], // write it a job description
  [103.2, 18, 22], // hire the next one
  [116.9, 30, 24], // your team starts with one hire.
];
const WORD_POPS: Array<[number, number]> = [
  [8.5, 5], // how i'd build my first ai team
  [15.5, 7], // one ai. one job. done really well.
  [86.1, 6], // correct it like a new hire
];
const WIPES = SLATES.map((s) => s.T);

const buildFx = (): Fx[] => {
  const fx: Fx[] = [];
  TYPING.forEach(([at, chars, cps]) => fx.push({src: sfx('type-run'), at, vol: 0.13, rate: cps / 24, dur: chars / cps}));
  WORD_POPS.forEach(([at, n]) => {
    for (let i = 0; i < n; i++) fx.push({src: BASIC('pop'), at: at + i * 0.2, vol: 0.22});
  });
  WIPES.forEach((T) => {
    fx.push({src: sfx('riser'), at: T - 1.95, vol: 0.17});
    fx.push({src: sfx('click'), at: T - 0.5, vol: 0.45});
    fx.push({src: 'first-ai-team/audio/hitech.mp3', at: T - 0.05, vol: 0.32});
  });
  // no whoosh or swish in this video: card reveals get a soft click instead
  const add = (name: string, vol: number, ...times: number[]) =>
    times.forEach((at) => fx.push({src: sfx(name === 'swish' ? 'click' : name), at, vol: name === 'swish' ? vol * 1.5 : vol, rate: name === 'swish' ? 1 + ((at * 7) % 5) * 0.06 : 1}));
  const basic = (name: string, vol: number, ...times: number[]) => times.forEach((at) => fx.push({src: BASIC(name), at, vol}));
  // hook + title
  fx.push({src: sfx('riser'), at: 0.0, vol: 0.18});
  add('swish', 0.2, 0.0);
  add('thump', 0.25, 0.12, 2.4, 6.9);
  fx.push({src: sfx('count-run'), at: 0.12, vol: 0.14, dur: 0.9}, {src: sfx('count-run'), at: 2.4, vol: 0.14, dur: 1.3});
  add('ding', 0.26, 0.95, 3.65);
  add('stars-up-12', 0.2, 5.0);
  fx.push({src: sfx('riser'), at: 6.6, vol: 0.18});
  basic('hit', 0.3, 8.5);
  add('chime-success', 0.26, 8.7);
  // the point
  add('bonk', 0.28, 12.2);
  fx.push({src: sfx('count-run'), at: 13.4, vol: 0.14, dur: 1.3});
  add('ding', 0.28, 14.6);
  add('ping', 0.26, 18.4);
  add('swish', 0.18, 20.7);
  // step 1
  add('swish', 0.2, 25.7, 26.3, 27.1, 29.3, 33.1);
  [28.0, 28.3, 28.6].forEach((t, i) => fx.push({src: sfx('ding'), at: t, vol: 0.22, rate: 1 + i * 0.1}));
  add('slide', 0.26, 36.9);
  add('ping', 0.26, 37.9, 40.7);
  fx.push({src: 'first-ai-team/audio/scribble.mp3', at: 42.7, vol: 0.4});
  add('bonk', 0.3, 45.2);
  // step 2
  add('swish', 0.2, 51.0, 52.9, 54.9, 56.9);
  [58.3, 58.65, 59.0].forEach((t, i) => fx.push({src: sfx('ding'), at: t, vol: 0.2, rate: 1 + i * 0.1}));
  add('click', 0.5, 61.0);
  add('ding', 0.28, 61.2);
  add('coin', 0.28, 61.8);
  basic('pop', 0.3, 63.0, 63.9);
  // step 3
  add('swish', 0.2, 69.7, 71.8, 73.2);
  add('slide', 0.26, 74.9);
  add('swish', 0.2, 77.5, 78.4, 79.6, 80.5);
  [82.9, 83.2, 83.5, 83.8].forEach((t, i) => fx.push({src: sfx('ding'), at: t, vol: 0.22, rate: 1 + i * 0.08}));
  // step 4
  fx.push({src: sfx('ring-sweep'), at: 88.4, vol: 0.12, dur: 4.6});
  add('ping', 0.28, 88.8, 90.1, 91.4);
  add('slide', 0.26, 93.6);
  basic('pop', 0.3, 97.4, 98.7, 99.4);
  add('chime-success', 0.28, 100.5);
  // step 5
  [104.6, 105.5, 106.5].forEach((t, i) => fx.push({src: sfx('ding'), at: t, vol: 0.26, rate: 1 + i * 0.12}));
  add('swish', 0.2, 106.9);
  add('slide', 0.26, 108.9);
  basic('pop', 0.3, 110.5, 111.0, 111.5);
  fx.push({src: sfx('count-run'), at: 112.9, vol: 0.14, dur: 1.7});
  add('stars-up-12', 0.26, 114.0);
  // cta
  fx.push({src: sfx('riser'), at: 118.4, vol: 0.18});
  basic('hit', 0.3, 120.0);
  add('stars-up-12', 0.26, 120.1);
  add('chime-success', 0.26, 120.7);
  add('ping', 0.16, 123.0);
  return fx;
};
const FX = buildFx();

const SCENES: {T: number; end: number; C: React.FC}[] = [
  {T: 0, end: 11.2, C: SceneHook},
  {T: 11.2, end: 22.7, C: ScenePoint},
  {T: 22.7, end: 47.5, C: Step1},
  {T: 47.5, end: 65.3, C: Step2},
  {T: 65.3, end: 85.2, C: Step3},
  {T: 85.2, end: 102.3, C: Step4},
  {T: 102.3, end: 115.9, C: Step5},
  {T: 115.9, end: 125.3, C: SceneCta},
];

export const AiTeam01: React.FC = () => {
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {SCENES.map((s, i) => (
        <Sequence key={i} from={sec(s.T)} durationInFrames={sec(s.end - s.T) + 1}>
          <ClockedScene T={s.T} dur={s.end - s.T}>
            <s.C />
          </ClockedScene>
        </Sequence>
      ))}
      {WINDOWS.map((w) => (
        <Sequence key={w.in} from={sec(w.in)} durationInFrames={sec(w.out - w.in)}>
          <Clock start={w.in}>
            <Presenter w={w} />
          </Clock>
        </Sequence>
      ))}
      <Wipes />
      <Audio src={staticFile('first-ai-team/voiceover.mp3')} />
      <Audio
        src={staticFile('first-ai-team/audio/music.mp3')}
        volume={(f) => {
          const s = f / FPS;
          return 0.16 * Math.min(1, s / 2) * Math.min(1, Math.max(0, (125.3 - s) / 3));
        }}
      />
      {FX.map((f, i) => (
        <Snd key={i} {...f} />
      ))}
    </AbsoluteFill>
  );
};

const ClockedScene: React.FC<{T: number; dur: number; children: React.ReactNode}> = ({T, dur, children}) => (
  <Clock start={T}>
    <Scene start={T} dur={dur}>
      {children}
    </Scene>
  </Clock>
);

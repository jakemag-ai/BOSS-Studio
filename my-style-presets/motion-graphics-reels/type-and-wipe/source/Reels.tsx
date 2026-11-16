import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {
  Acc,
  Typed,
  BOUNCE,
  Clock,
  C,
  ELASTIC,
  F,
  FPS,
  Head,
  Meta,
  Mono,
  POP,
  Scene,
  Stars,
  enter,
  fadeIn,
  ramp,
  sp,
  useAbs,
} from './kit';

const W = 1080;
const H = 1920;
// Reels/Stories safe area: the app covers the top ~200px and the bottom ~340px.
const SAFE_TOP = 200;
const SAFE_H = 1380;

const inOut = Easing.inOut(Easing.cubic);
const sec = (s: number) => Math.round(s * FPS);

const Center: React.FC<{children: React.ReactNode}> = ({children}) => (
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
    }}
  >
    {children}
  </div>
);

const big = (size: number): React.CSSProperties => ({
  fontFamily: F.sans,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1.02,
  letterSpacing: -4,
  textTransform: 'lowercase',
  color: C.ink,
  textAlign: 'center',
  padding: '0 50px',
});

// ---------------------------------------------------------------- Krista's HeyGen avatar (ring circle) with enhanced lighting
const AV = {size: 720, srcCx: 950, srcCy: 560, srcD: 760};
// lift exposure a touch, add contrast and a little colour
const LIGHT = 'brightness(1.14) contrast(1.08) saturate(1.12)';

type AvatarProps = {
  from: number; // scene start (seconds) so her video plays in sync with the voice
  at: number; // when the circle pops in
  out?: number;
  size?: number;
  left?: number;
  top?: number;
  ring?: number;
  crop?: {cx: number; cy: number; d: number}; // source square (in 1920x1080 pixels) shown in the circle
};

const Avatar: React.FC<AvatarProps> = ({
  from,
  at,
  out,
  size = AV.size,
  left = (W - AV.size) / 2,
  top = 232,
  ring = 10,
  crop = {cx: AV.srcCx, cy: AV.srcCy, d: AV.srcD},
}) => {
  const abs = useAbs();
  const s = sp(abs, at, ELASTIC);
  const fade = out === undefined ? 1 : 1 - ramp(abs, out, out + 0.8, Easing.in(Easing.quad));
  const k = size / crop.d;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#d9d2c7',
        boxShadow: `0 0 0 ${ring}px ${C.accent}, 0 ${size * 0.05}px ${size * 0.11}px rgba(20,17,15,.28)`,
        transform: `scale(${s})`,
        opacity: Math.min(1, s * 2) * fade,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: size / 2 - crop.cx * k,
          top: size / 2 - crop.cy * k,
          width: 1920 * k,
          height: 1080 * k,
          filter: LIGHT,
        }}
      >
        <OffthreadVideo src={staticFile('reviews/krista-avatar.mp4')} startFrom={sec(from)} muted style={{width: '100%', height: '100%'}} />
      </div>
      {/* soft warm key light from the upper left */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 28% 18%, rgba(255,232,200,.38), rgba(255,232,200,0) 62%)',
          mixBlendMode: 'soft-light',
        }}
      />
      {/* gentle vignette so the face stays the brightest part */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 62%, rgba(20,17,15,.28) 100%)',
        }}
      />
    </div>
  );
};

/** Small presenter circle for the graphic sections: lower right, ~15% of the frame width, inside the safe area. */
const Pip: React.FC<{from: number}> = ({from}) => (
  <Avatar from={from} at={from + 0.9} size={168} left={W - 168 - 44} top={1410} ring={5} crop={{cx: 950, cy: 470, d: 600}} />
);

/** Text area under the avatar circle (inside the safe area). */
const Lower: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 975,
      height: 480,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </div>
);


// ---------------------------------------------------------------- A: hook + title (0-7)
const HookWord: React.FC<{at: number; out: number; size: number; children: React.ReactNode}> = ({at, out, size, children}) => {
  const abs = useAbs();
  const e = enter(abs, at, {from: 0.4, y: 60});
  const gone = ramp(abs, out, out + 0.2, Easing.in(Easing.quad));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        ...big(size),
        opacity: (e.opacity as number) * (1 - gone),
        transform: `${e.transform} translateY(${-30 * gone}px)`,
      }}
    >
      <Typed at={at} variant="caret" cps={26}>
        {children}
      </Typed>
    </div>
  );
};

const SceneA: React.FC = () => {
  const abs = useAbs();
  const pulse = 1 + 0.12 * Math.sin(Math.PI * ramp(abs, 5.6, 6.6, (t) => t));
  return (
    <Scene start={0} dur={7}>
      <Avatar from={0} at={0.1} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 975, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <HookWord at={0.1} out={0.85} size={130}>
          you <Acc>read</Acc> them.
        </HookWord>
        <HookWord at={0.9} out={1.65} size={130}>
          you <Acc>trust</Acc> them.
        </HookWord>
        <HookWord at={1.7} out={3.15} size={112}>
          you <Acc>buy</Acc> because of them.
        </HookWord>
      </div>
      <Lower>
        <div style={{transform: `scale(${pulse})`, marginBottom: 26}}>
          <Stars val={5} size={84} gap={12} at={3.35} stagger={0.1} spin />
        </div>
        <div style={{...big(120)}}>
          <Typed at={3.2} variant="fall" cps={20}>
            why reviews <Acc>matter</Acc>
          </Typed>
        </div>
        <Mono size={24} style={{marginTop: 28}}>
          <Typed at={4.7} variant="caret" cps={30}>
            a 50-second explainer
          </Typed>
        </Mono>
      </Lower>
    </Scene>
  );
};

// ---------------------------------------------------------------- B: trust (7-15)
const Card: React.FC<{
  top: number;
  x: number;
  at: number;
  bar: string;
  name: string;
  children: React.ReactNode;
}> = ({top, x, at, bar, name, children}) => {
  const abs = useAbs();
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        top,
        width: 900,
        height: 470,
        background: '#fff',
        borderRadius: 34,
        boxShadow: '0 24px 60px rgba(20,17,15,.12)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '38px 30px 30px',
        gap: 6,
        ...enter(abs, at, {from: 0.6, x}),
      }}
    >
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 12, background: bar}} />
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 44, letterSpacing: -1, textTransform: 'lowercase'}}>{name}</div>
      {children}
    </div>
  );
};

const Chip: React.FC<{at: number; children: React.ReactNode; style: React.CSSProperties}> = ({at, children, style}) => {
  const abs = useAbs();
  const s = sp(abs, at, POP);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 26,
        left: '50%',
        padding: '12px 32px',
        borderRadius: 999,
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: 3,
        textTransform: 'uppercase',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        whiteSpace: 'nowrap',
        transform: `translateX(-50%) scale(${s})`,
        opacity: Math.min(1, s * 2),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const SceneB: React.FC = () => {
  const abs = useAbs();
  const b = 7.6;
  const wob = abs > 9.9 && abs < 10.74 ? 9 * Math.abs(Math.sin((Math.PI * (abs - 9.9)) / 0.28)) : 0;
  const cnt = ramp(abs, 11.1, 12.4, Easing.out(Easing.quad));
  const bubbles = ['“so friendly!”', '“best coffee in town”', '“worth the trip”'];
  return (
    <Scene start={7} dur={8} shrink={0.93}>
      <Head at={b + 0.1} variant="caret">
        they build <Acc>trust</Acc>
      </Head>

      <Card top={450} x={-200} at={b + 0.7} bar="#CFC8BD" name="corner café">
        <div style={{...big(140), color: '#B9B1A5', letterSpacing: -4, padding: 0, transform: `rotate(${wob}deg)`}}>?</div>
        <Stars val={0} size={50} />
        <Mono size={24}>0 reviews</Mono>
        <Chip at={10.6} style={{border: `3px solid ${C.accent}`, color: C.accent}}>i'd skip it</Chip>
      </Card>

      <Card top={950} x={200} at={b + 0.8} bar={C.accent} name="harbor café">
        <div style={{...big(140), padding: 0, letterSpacing: -4}}>{(cnt * 4.8).toFixed(1)}</div>
        <Stars val={4.8} size={50} at={11.1} stagger={0.14} />
        <Mono size={24}>{Math.round(cnt * 128)} reviews</Mono>
        <Chip at={12.5} style={{background: C.green, color: '#fff'}}>
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          trusted
        </Chip>
      </Card>

      <div style={{position: 'absolute', left: 0, right: 0, top: 1462, display: 'flex', justifyContent: 'center', gap: 12}}>
        {bubbles.map((t, i) => (
          <div
            key={t}
            style={{
              background: '#fff',
              border: `2px solid ${C.line}`,
              borderRadius: 999,
              padding: '14px 24px',
              fontFamily: F.sans,
              fontWeight: 700,
              fontSize: 28,
              whiteSpace: 'nowrap',
              boxShadow: '0 12px 30px rgba(20,17,15,.08)',
              ...enter(abs, 12.9 + i * 0.25, {from: 0.8, y: 50}),
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </Scene>
  );
};

// ---------------------------------------------------------------- C: decisions (15-23)
const Row: React.FC<{
  top: number;
  at: number;
  name: string;
  val: number;
  count: string;
  num: string;
  numColor?: string;
  dy?: number;
  highlight?: boolean;
  chosen?: boolean;
}> = ({top, at, name, val, count, num, numColor, dy = 0, highlight, chosen}) => {
  const abs = useAbs();
  const move = dy * (1 - ramp(abs, 17.6, 18.5, inOut));
  const e = enter(abs, at, {from: 0.85, x: -90});
  const hl = highlight ? ramp(abs, 19.6, 19.9) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        top,
        width: 940,
        height: 140,
        background: '#fff',
        border: `3px solid ${hl > 0.5 ? C.accent : C.line}`,
        borderRadius: 28,
        boxShadow: '0 14px 36px rgba(20,17,15,.09)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 30px',
        gap: 20,
        opacity: e.opacity,
        transform: `translateY(${move}px) ${e.transform}`,
      }}
    >
      <div style={{flex: 1, fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: -1, textTransform: 'lowercase', whiteSpace: 'nowrap'}}>
        {name}
      </div>
      <Stars val={val} size={34} gap={4} />
      <Mono size={22} style={{width: 96, letterSpacing: 1}}>
        {count}
      </Mono>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 48, width: 84, textAlign: 'right', color: numColor ?? C.ink}}>{num}</div>
      {chosen ? (
        <Chip at={19.75} style={{top: -26, bottom: 'auto', left: 'auto', right: 24, transform: undefined, padding: '8px 22px', fontSize: 20, background: C.accent, color: '#fff'}}>
          chosen
        </Chip>
      ) : null}
    </div>
  );
};

const SceneC: React.FC = () => {
  const abs = useAbs();
  const c = 15.6;
  const cnt = ramp(abs, c + 0.8, c + 2.2, Easing.out(Easing.quad));
  // cursor path + click
  const move = ramp(abs, 18.7, 19.5, inOut);
  const cx = 880 + (1030 - 880) * move;
  const cy = 1150 + (610 - 1150) * move;
  const click = 1 - 0.22 * Math.sin(Math.PI * ramp(abs, 19.5, 19.7, (t) => t));
  const ring = ramp(abs, 19.56, 20.16, Easing.out(Easing.cubic));
  const plusIn = ramp(abs, 20.3, 20.8);
  const plusOut = ramp(abs, 21.3, 21.8, Easing.in(Easing.quad));
  return (
    <Scene start={15} dur={8} shrink={0.93}>
      <Head at={c + 0.1} variant="block">
        they guide <Acc>decisions</Acc>
      </Head>

      <Row top={700} at={c + 0.9} name="sunrise bakery" val={4.2} count="(36)" num="4.2" />
      <Row top={860} at={c + 1.1} name="corner café" val={0} count="(0)" num="–" numColor="#B9B1A5" dy={-320} />
      <Row top={540} at={c + 0.7} name="harbor café" val={4.8} count="(128)" num="4.8" dy={320} highlight chosen />

      <Mono style={{position: 'absolute', left: 0, right: 0, top: 1040, textAlign: 'center', opacity: fadeIn(abs, c + 0.6, 0.5)}}>
        average rating
      </Mono>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1062, ...big(250), letterSpacing: -10, ...enter(abs, c + 0.6, {from: 0.5, y: 40})}}>
        {(cnt * 4.8).toFixed(1)}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1340}}>
        <Stars val={4.8} size={76} gap={10} at={c + 1.8} stagger={0.12} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1446,
          textAlign: 'center',
          fontFamily: F.sans,
          fontWeight: 700,
          fontSize: 46,
          textTransform: 'lowercase',
          letterSpacing: -1,
          opacity: fadeIn(abs, c + 2.6, 0.6),
        }}
      >
        <Typed at={c + 2.6} variant="caret" cps={28}>
          people pick the one that's <Acc>proven.</Acc>
        </Typed>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 1030 - 30,
          top: 610 - 30,
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: `4px solid ${C.accent}`,
          opacity: abs < 19.56 ? 0 : 0.7 * (1 - ring),
          transform: `scale(${0.6 + 2 * ring})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: cx - 22,
          top: cy - 22,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: C.ink,
          border: '5px solid #fff',
          boxShadow: '0 8px 20px rgba(20,17,15,.35)',
          opacity: ramp(abs, 18.7, 19.0),
          transform: `scale(${click})`,
        }}
      />
      <Mono
        size={30}
        style={{
          position: 'absolute',
          left: 830,
          top: 492,
          color: C.green,
          opacity: plusIn * (1 - plusOut),
          transform: `translateY(${-20 * plusIn - 30 * plusOut}px)`,
        }}
      >
        +1 order
      </Mono>
    </Scene>
  );
};

// ---------------------------------------------------------------- D: improve (23-31)
const Pill: React.FC<{left: number; top: number; at: number; accent?: boolean; children: React.ReactNode}> = ({left, top, at, accent, children}) => {
  const abs = useAbs();
  const s = sp(abs, at, ELASTIC);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: 420,
        height: 92,
        borderRadius: 999,
        background: accent ? C.accent : C.ink,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: F.sans,
        fontWeight: 800,
        fontSize: 33,
        letterSpacing: -0.5,
        textTransform: 'lowercase',
        transform: `scale(${s})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      {children}
    </div>
  );
};

const Quote: React.FC<{left: number; at: number; text: string; val: number}> = ({left, at, text, val}) => {
  const abs = useAbs();
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: 1350,
        width: 480,
        background: '#fff',
        border: `2px solid ${C.line}`,
        borderRadius: 36,
        padding: '26px 28px',
        boxShadow: '0 12px 30px rgba(20,17,15,.08)',
        textAlign: 'center',
        fontFamily: F.sans,
        fontWeight: 700,
        fontSize: 34,
        lineHeight: 1.2,
        ...enter(abs, at, {from: 0.6, y: 60}),
      }}
    >
      {text}
      <div style={{marginTop: 14}}>
        <Stars val={val} size={38} gap={5} />
      </div>
    </div>
  );
};

const SceneD: React.FC = () => {
  const abs = useAbs();
  const d = 23.6;
  const R = 300;
  const CIRC = 2 * Math.PI * R;
  const draw = ramp(abs, 24.4, 29.0, Easing.inOut(Easing.sin));
  const rating = 3.9 + 0.8 * ramp(abs, 28.3, 29.9, Easing.inOut(Easing.quad));
  return (
    <Scene start={23} dur={8} shrink={0.93}>
      <Head at={d + 0.1} variant="word">
        they help you <Acc>improve</Acc>
      </Head>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={540} cy={950} r={R} fill="none" stroke={C.line} strokeWidth={8} />
        <circle
          cx={540}
          cy={950}
          r={R}
          fill="none"
          stroke={C.accent}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - draw)}
          transform="rotate(-90 540 950)"
        />
      </svg>
      <Pill left={330} top={604} at={24.4}>
        customers review
      </Pill>
      <Pill left={590} top={1054} at={27.2} accent>
        you fix it
      </Pill>
      <Pill left={70} top={1054} at={28.3}>
        experience improves
      </Pill>
      <div
        style={{
          position: 'absolute',
          left: 340,
          width: 400,
          top: 830,
          textAlign: 'center',
          ...enter(abs, d + 0.6, {from: 0.4, cfg: ELASTIC}),
        }}
      >
        <Mono size={24}>rating</Mono>
        <div style={{...big(180), padding: 0, letterSpacing: -7}}>{rating.toFixed(1)}</div>
      </div>
      <Quote left={50} at={d + 2} text="“the wait was too long.”" val={2} />
      <Quote left={550} at={28.6} text="“fixed it. so fast now!”" val={5} />
    </Scene>
  );
};

// ---------------------------------------------------------------- E: real people (31-39)
const HL = [4, 9, 11, 14, 17, 20, 25, 29, 33];
const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z';

const SceneE: React.FC = () => {
  const abs = useAbs();
  const e = 31.6;
  const dots = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const idx = r * 6 + c;
      const dist = Math.hypot(r - 2.5, c - 2.5);
      const s = sp(abs, 32.4 + dist * 0.08, BOUNCE);
      const k = HL.indexOf(idx);
      const h = k > -1 ? sp(abs, 34.4 + k * 0.18, ELASTIC) : 0;
      dots.push(
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: 166 + c * 128,
            top: 560 + r * 128,
            width: 108,
            height: 108,
            borderRadius: '50%',
            background: '#E6E0D6',
            transform: `scale(${s})`,
            opacity: Math.min(1, s * 2),
          }}
        >
          {k > -1 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: C.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${h})`,
              }}
            >
              <svg viewBox="0 0 24 24" width={58} height={58}>
                <path d={STAR_PATH} fill="#fff" />
              </svg>
            </div>
          ) : null}
        </div>,
      );
    }
  }
  return (
    <Scene start={31} dur={8} shrink={0.93}>
      <Head at={e + 0.1} variant="fall" cps={22}>
        they show <Acc>real people</Acc>
      </Head>
      {dots}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1352, ...big(58), lineHeight: 1.1, letterSpacing: -1.5, fontWeight: 700, ...enter(abs, 33.9, {from: 0.7, y: 30})}}>
        <Typed at={33.9} variant="block" cps={26}>
          every dot is someone who took <Acc>30 seconds.</Acc>
        </Typed>
      </div>
    </Scene>
  );
};

// ---------------------------------------------------------------- F: outro (39-50)
const SceneF: React.FC = () => {
  const abs = useAbs();
  const linesOut = ramp(abs, 43.3, 43.8, Easing.in(Easing.quad));
  const end = ramp(abs, 48.9, 49.7, Easing.in(Easing.quad));
  const pulse = 1 + 0.12 * Math.sin(Math.PI * ramp(abs, 46.2, 47.2, (t) => t));
  const line = (at: number): React.CSSProperties => {
    const e = enter(abs, at, {from: 0.6, y: 60});
    return {...big(94), opacity: (e.opacity as number) * (1 - linesOut), transform: `${e.transform} translateY(${-40 * linesOut}px)`};
  };
  return (
    <Scene start={39} dur={11}>
      <Avatar from={39} at={39.8} out={48.9} />
      <Lower>
        <div style={line(39.7)}>
          <Typed at={39.7} variant="caret" cps={22}>
            a review takes <Acc>30 seconds.</Acc>
          </Typed>
        </div>
        <div style={{...line(41.0), marginTop: 40}}>
          <Typed at={41.0} variant="word">
            it helps someone for <Acc>years.</Acc>
          </Typed>
        </div>
      </Lower>
      <Lower>
        <div style={{opacity: 1 - end, transform: `scale(${pulse})`, marginBottom: 26}}>
          <Stars val={5} size={90} gap={12} at={44.1} stagger={0.12} spin />
        </div>
        <div style={{...big(132), ...enter(abs, 44.0, {from: 0.3, y: 70, cfg: ELASTIC}), opacity: fadeIn(abs, 44.0, 0.3) * (1 - end)}}>
          <Typed at={44.0} variant="fall" cps={14}>
            leave one <Acc>today.</Acc>
          </Typed>
        </div>
        <Mono size={26} style={{marginTop: 28, opacity: fadeIn(abs, 45.2, 0.6) * (1 - end)}}>
          <Typed at={45.2} variant="caret" cps={30}>
            real words. real people.
          </Typed>
        </Mono>
      </Lower>
    </Scene>
  );
};

// ---------------------------------------------------------------- orange iris wipes with HUGE words
const SLATES = [
  {T: 7, n: '01', size: 400, lines: ['trust']},
  {T: 15, n: '02', size: 300, lines: ['decide']},
  {T: 23, n: '03', size: 250, lines: ['improve']},
  {T: 31, n: '04', size: 310, lines: ['real', 'people']},
  {T: 39, n: 'NOW', size: 330, lines: ['your', 'turn']},
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
          <div
            key={l}
            style={{
              fontFamily: i === 1 ? F.serif : F.sans,
              fontStyle: i === 1 ? 'italic' : 'normal',
              fontWeight: i === 1 ? 700 : 800,
              fontSize: s.size,
              lineHeight: 0.98,
              letterSpacing: i === 1 ? -4 : -9,
              textTransform: 'lowercase',
              whiteSpace: 'nowrap',
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- audio
// voice: Krista Mashore (ElevenLabs), music bed, and the BOSS Motion Graphics - 01 sound-effect set (see my-style-presets).
const Snd: React.FC<{file: string; at: number; volume: number; rate?: number; dur?: number}> = ({file, at, volume, rate = 1, dur}) => (
  <Sequence from={sec(at)} durationInFrames={dur === undefined ? undefined : Math.max(1, sec(dur))} layout="none">
    <Audio src={staticFile(`reviews/${file}`)} volume={volume} playbackRate={rate} />
  </Sequence>
);

type Fx = {file: string; at: number; vol: number; rate?: number; dur?: number};
const sfx = (name: string) => `sfx/boss01-${name}.wav`;

// every text that types itself: [start, characters, characters per second]
const TYPING: Array<[number, number, number]> = [
  [0.1, 14, 26], // you read them.
  [0.9, 15, 26], // you trust them.
  [1.7, 24, 26], // you buy because of them.
  [3.2, 18, 20], // why reviews matter
  [4.7, 21, 30], // a 50-second explainer
  [7.7, 16, 20], // they build trust
  [15.7, 20, 20], // they guide decisions
  [18.2, 34, 28], // people pick the one that's proven.
  [31.7, 21, 22], // they show real people
  [33.9, 41, 26], // every dot is someone who took 30 seconds.
  [39.7, 26, 22], // a review takes 30 seconds.
  [44.0, 16, 14], // leave one today.
  [45.2, 24, 30], // real words. real people.
];
// words that pop in one by one instead of typing: [first word time, number of words]
const WORD_POPS: Array<[number, number]> = [
  [23.7, 4], // they help you improve
  [41.0, 5], // it helps someone for years.
];

const WIPES = [7, 15, 23, 31, 39];

const buildFx = (): Fx[] => {
  const fx: Fx[] = [];
  // typing ticks
  TYPING.forEach(([at, chars, cps]) => fx.push({file: sfx('type-run'), at, vol: 0.13, rate: cps / 24, dur: chars / cps}));
  WORD_POPS.forEach(([at, n]) => {
    for (let i = 0; i < n; i++) fx.push({file: 'pop.wav', at: at + i * 0.2, vol: 0.22});
  });
  // transitions: a riser leading into every orange wipe, then the whoosh
  WIPES.forEach((T) => {
    fx.push({file: sfx('riser'), at: T - 1.95, vol: 0.17});
    fx.push({file: 'whoosh.wav', at: T - 0.5, vol: 0.3});
  });
  // A: hook + title
  fx.push({file: sfx('swish'), at: 0.0, vol: 0.2});
  [0.1, 0.9, 1.7].forEach((t) => fx.push({file: sfx('thump'), at: t, vol: 0.2}));
  fx.push({file: sfx('riser'), at: 1.7, vol: 0.18});
  fx.push({file: 'hit.wav', at: 3.2, vol: 0.3});
  fx.push({file: sfx('stars-up-10'), at: 3.35, vol: 0.28});
  // B: trust
  fx.push({file: sfx('swish'), at: 8.3, vol: 0.22}, {file: sfx('swish'), at: 8.4, vol: 0.22});
  fx.push({file: sfx('bonk'), at: 10.6, vol: 0.3});
  fx.push({file: sfx('stars-up-14'), at: 11.1, vol: 0.28});
  fx.push({file: sfx('count-run'), at: 11.1, vol: 0.12, dur: 1.3});
  fx.push({file: sfx('chime-success'), at: 12.5, vol: 0.28});
  [12.9, 13.15, 13.4].forEach((t) => fx.push({file: 'pop.wav', at: t, vol: 0.3}));
  // C: decisions
  [16.3, 16.5, 16.7].forEach((t) => fx.push({file: sfx('swish'), at: t, vol: 0.2}));
  fx.push({file: sfx('count-run'), at: 16.4, vol: 0.12, dur: 1.4});
  fx.push({file: sfx('stars-up-12'), at: 17.4, vol: 0.28});
  fx.push({file: sfx('slide'), at: 17.6, vol: 0.28});
  fx.push({file: sfx('click'), at: 19.55, vol: 0.5});
  fx.push({file: sfx('ding'), at: 19.75, vol: 0.28});
  fx.push({file: sfx('coin'), at: 20.3, vol: 0.28});
  // D: improve
  fx.push({file: sfx('ring-sweep'), at: 24.4, vol: 0.12, dur: 4.6});
  [24.4, 27.2, 28.3].forEach((t) => fx.push({file: sfx('ping'), at: t, vol: 0.28}));
  fx.push({file: sfx('swish'), at: 25.6, vol: 0.2}, {file: sfx('swish'), at: 28.6, vol: 0.2});
  fx.push({file: sfx('count-run'), at: 28.3, vol: 0.12, dur: 1.6});
  // E: real people
  fx.push({file: sfx('pop-cascade'), at: 32.4, vol: 0.22});
  for (let i = 0; i < 9; i++) fx.push({file: sfx('ding'), at: 34.4 + i * 0.18, vol: 0.2, rate: 1 + i * 0.07});
  // F: outro
  fx.push({file: sfx('swish'), at: 39.8, vol: 0.2});
  fx.push({file: sfx('swish'), at: 43.3, vol: 0.16});
  fx.push({file: sfx('riser'), at: 42.55, vol: 0.18});
  fx.push({file: 'hit.wav', at: 44.0, vol: 0.3});
  fx.push({file: sfx('stars-up-12'), at: 44.1, vol: 0.28});
  fx.push({file: sfx('chime-success'), at: 44.6, vol: 0.28});
  fx.push({file: sfx('ping'), at: 46.2, vol: 0.14});
  return fx;
};
const FX = buildFx();

export const WhyReviewsReels: React.FC = () => {
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Sequence from={0} durationInFrames={sec(7)}>
        <Clock start={0}>
          <SceneA />
        </Clock>
      </Sequence>
      <Sequence from={sec(7)} durationInFrames={sec(8)}>
        <Clock start={7}>
          <SceneB />
        </Clock>
      </Sequence>
      <Sequence from={sec(15)} durationInFrames={sec(8)}>
        <Clock start={15}>
          <SceneC />
        </Clock>
      </Sequence>
      <Sequence from={sec(23)} durationInFrames={sec(8)}>
        <Clock start={23}>
          <SceneD />
        </Clock>
      </Sequence>
      <Sequence from={sec(31)} durationInFrames={sec(8)}>
        <Clock start={31}>
          <SceneE />
        </Clock>
      </Sequence>
      <Sequence from={sec(39)} durationInFrames={sec(11)}>
        <Clock start={39}>
          <SceneF />
        </Clock>
      </Sequence>

      <Wipes />

      {/* voiceover takes */}
      <Snd file="a.mp3" at={0.15} volume={1} />
      <Snd file="b.mp3" at={7.6} volume={1} />
      <Snd file="c.mp3" at={15.5} volume={1} />
      <Snd file="d.mp3" at={23.6} volume={1} />
      <Snd file="e.mp3" at={31.6} volume={1} />
      <Snd file="f1.mp3" at={39.7} volume={1} />
      <Snd file="f2.mp3" at={44.05} volume={1} />
      {/* quiet music bed (already faded in/out) */}
      <Snd file="bed-faded.mp3" at={0} volume={0.16} />
      {/* sound effects: typing, clicks, risers, whooshes, pings, dings */}
      {FX.map((f, i) => (
        <Snd key={i} file={f.file} at={f.at} volume={f.vol} rate={f.rate} dur={f.dur} />
      ))}
    </AbsoluteFill>
  );
};

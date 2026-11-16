import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, Easing, Loop, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';
import words from './words.json';

const {fontFamily} = loadFont('normal', {weights: ['500', '600', '700', '800']});

export const FPS = 30;
export const DURATION_FB = Math.ceil(97.4 * FPS);

type Word = {text: string; start: number; end: number};
const W = (words as {words: Word[]}).words;

/* ------------------------------------------------------------ time */
const TimeCtx = createContext(0);
const useAbs = () => {
  const from = useContext(TimeCtx);
  return from + useCurrentFrame() / FPS;
};
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const pop = (abs: number, t0: number, dur = 0.4) => {
  const p = Easing.out(Easing.back(1.5))(clamp((abs - t0) / dur));
  const o = clamp((abs - t0) / (dur * 0.5));
  return {opacity: o, transform: `translateY(${(1 - p) * 34}px) scale(${0.9 + 0.1 * p})`} as React.CSSProperties;
};
const count = (abs: number, t0: number, dur: number, a: number, b: number) =>
  Math.round(a + (b - a) * Easing.out(Easing.cubic)(clamp((abs - t0) / dur)));

/* ------------------------------------------------------------ colours */
const TEAL = '#6FF0D9';
const PERI = '#8FA2FF';
const BLUE = '#3B5BF0';
const VIOLET = '#6A5CF0';
const INK = '#0F1648';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/** Headline words appear on the exact spoken word. *word* marks accent words. */
function timed(spec: string, from: number) {
  let cursor = Math.max(0, W.findIndex((w) => w.start >= from - 0.45));
  let last = from;
  let inAcc = false;
  return spec.split(' ').map((tok) => {
    if (tok.startsWith('*')) inAcc = true;
    const accent = inAcc;
    if (tok.endsWith('*')) inAcc = false;
    const text = tok.replace(/\*/g, '');
    const n = norm(text);
    let t = last + 0.22;
    if (n) {
      for (let k = cursor; k < Math.min(cursor + 3, W.length); k++) {
        if (norm(W[k].text) === n) {
          t = W[k].start;
          cursor = k + 1;
          break;
        }
      }
    }
    last = t;
    return {text, accent, t};
  });
}

const Headline: React.FC<{spec: string; from: number; dark?: boolean; size?: number; top?: number; weight?: number; align?: 'center' | 'left'; maxW?: number}> = ({
  spec, from, dark = true, size = 88, top = 120, weight = 700, align = 'center', maxW = 1640,
}) => {
  const abs = useAbs();
  const ws = timed(spec, from);
  const grad = dark ? `linear-gradient(90deg, ${TEAL}, ${PERI})` : `linear-gradient(90deg, ${BLUE}, ${VIOLET})`;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', padding: align === 'left' ? '0 140px' : 0}}>
      <div style={{maxWidth: maxW, textAlign: align, fontSize: size, fontWeight: weight, letterSpacing: -size * 0.025, lineHeight: 1.08, color: dark ? '#fff' : INK}}>
        {ws.map((w, i) => {
          const p = clamp((abs - w.t) / 0.3);
          return (
            <span key={i} style={{display: 'inline-block', marginRight: size * 0.26, opacity: p, transform: `translateY(${(1 - p) * 22}px)`, filter: `blur(${(1 - p) * 8}px)`,
              ...(w.accent ? {background: grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'} : {})}}>
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ stage */
const Stage: React.FC<{dark?: boolean; children?: React.ReactNode}> = ({dark = true, children}) => {
  const abs = useAbs();
  const drift = Math.sin(abs * 0.5) * 60;
  return (
    <AbsoluteFill style={{background: dark ? '#070C3A' : '#E9EDF7', fontFamily, overflow: 'hidden'}}>
      {dark ? (
        <>
          <div style={{position: 'absolute', inset: 0, background: `radial-gradient(55% 70% at ${50 + drift / 40}% 62%, #2D52E0 0%, #1A2C9A 36%, #0B1456 72%, #070C3A 100%)`}} />
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(40% 40% at 88% 8%, rgba(120,90,255,.30), transparent 70%)'}} />
        </>
      ) : (
        <>
          <div style={{position: 'absolute', inset: 0, background: `radial-gradient(45% 50% at ${6 + drift / 30}% 4%, rgba(170,246,205,.85), transparent 70%)`}} />
          <div style={{position: 'absolute', inset: 0, background: `radial-gradient(48% 52% at ${96 - drift / 30}% 100%, rgba(196,182,252,.85), transparent 70%)`}} />
        </>
      )}
      {children}
    </AbsoluteFill>
  );
};

/* Scene: cross-dissolve with blur + scale, the reference's transition. */
const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const OVER = 0.25;
  return (
    <Sequence from={Math.round(from * FPS)} durationInFrames={Math.round((to - from + OVER) * FPS)} layout="none">
      <TimeCtx.Provider value={from}>
        <Fade len={to - from + OVER}>{children}</Fade>
      </TimeCtx.Provider>
    </Sequence>
  );
};
const Fade: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const t = useCurrentFrame() / FPS;
  const inP = clamp(t / 0.3);
  const outP = clamp((len - t) / 0.25);
  const p = Math.min(inP, outP);
  const blur = (1 - p) * 12;
  const sc = inP < outP ? 1 + (1 - inP) * 0.05 : 1 - (1 - outP) * 0.02;
  return <AbsoluteFill style={{opacity: p, filter: `blur(${blur}px)`, transform: `scale(${sc})`}}>{children}</AbsoluteFill>;
};

/* ------------------------------------------------------------ icons */
const Avatar: React.FC<{label?: string; size?: number; style?: React.CSSProperties}> = ({label, size = 120, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, ...style}}>
    <div style={{width: size, height: size, borderRadius: '50%', background: 'linear-gradient(160deg,#4C79FF,#1C34B8)', border: '4px solid #D8E2FF', display: 'grid', placeItems: 'center', boxShadow: '0 0 40px rgba(90,130,255,.5)'}}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="8" r="4.2" /><path d="M3.5 21c.6-5 4-7.2 8.5-7.2s7.9 2.2 8.5 7.2z" /></svg>
    </div>
    {label && <div style={{color: '#fff', fontSize: 26, fontWeight: 600}}>{label}</div>}
  </div>
);
const Robot: React.FC<{size?: number; glow?: boolean}> = ({size = 90, glow}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{filter: glow ? 'drop-shadow(0 0 18px rgba(111,240,217,.7))' : undefined}}>
    <line x1="50" y1="6" x2="50" y2="20" stroke="#BFD0FF" strokeWidth="4" strokeLinecap="round" /><circle cx="50" cy="6" r="4.5" fill="#6FF0D9" />
    <rect x="22" y="20" width="56" height="46" rx="18" fill="#EAF0FF" /><rect x="14" y="36" width="8" height="16" rx="4" fill="#9DB3FF" /><rect x="78" y="36" width="8" height="16" rx="4" fill="#9DB3FF" />
    <rect x="30" y="30" width="40" height="26" rx="12" fill="#1E3AC8" /><circle cx="42" cy="43" r="4.5" fill="#6FF0D9" /><circle cx="58" cy="43" r="4.5" fill="#6FF0D9" />
    <rect x="28" y="68" width="44" height="26" rx="12" fill="#EAF0FF" /><circle cx="50" cy="81" r="7" fill="none" stroke="#3B5BF0" strokeWidth="4" /><circle cx="50" cy="81" r="2.5" fill="#3B5BF0" />
  </svg>
);
const Tile: React.FC<{size?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({size = 110, children, style}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 18px 40px rgba(5,10,60,.45)', ...style}}>{children}</div>
);
const Sparkle: React.FC<{size?: number; color?: string}> = ({size = 70, color = BLUE}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"><path d="M12 2.5c.7 5.2 3.8 8.3 9 9-5.2.7-8.3 3.8-9 9-.7-5.2-3.8-8.3-9-9 5.2-.7 8.3-3.8 9-9z" /></svg>
);
const Doc: React.FC<{size?: number; color?: string}> = ({size = 48, color = BLUE}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2.5h8l4.5 4.5v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1z" /><path d="M14 2.5V7h4.5M8.5 12h7M8.5 15.5h7M8.5 8.5h3" /></svg>
);
const Tick: React.FC<{size?: number; bg?: string}> = ({size = 36, bg = '#4C79FF'}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: bg, display: 'grid', placeItems: 'center', flex: 'none'}}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  </div>
);
const Cross: React.FC<{size?: number}> = ({size = 36}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: '#F0566C', display: 'grid', placeItems: 'center', flex: 'none'}}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  </div>
);
const Brain: React.FC<{size?: number}> = ({size = 240}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" stroke={TEAL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 16px rgba(111,240,217,.9))'}}>
    <path d="M100 38C82 22 52 30 48 56 28 62 22 90 38 104 30 124 46 146 68 144 74 164 96 168 100 154" />
    <path d="M100 38C118 22 148 30 152 56 172 62 178 90 162 104 170 124 154 146 132 144 126 164 104 168 100 154" />
    <path d="M100 38V154M70 70c10 2 18 10 18 22M130 70c-10 2-18 10-18 22M64 112c12-2 22 4 24 16M136 112c-12-2-22 4-24 16" />
  </svg>
);
const Window: React.FC<{w: number; h?: number; title: string; light?: boolean; children: React.ReactNode; style?: React.CSSProperties}> = ({w, h, title, light = true, children, style}) => (
  <div style={{width: w, height: h, borderRadius: 24, background: light ? '#fff' : 'rgba(255,255,255,.09)', border: light ? '2px solid #C3CCEE' : '2px solid rgba(255,255,255,.14)', boxShadow: light ? '0 34px 80px rgba(20,30,110,.30), 0 8px 20px rgba(20,30,110,.14)' :'0 26px 60px rgba(2,6,40,.5)', overflow: 'hidden', ...style}}>
    <div style={{height: 46, display: 'flex', alignItems: 'center', padding: '0 20px', position: 'relative'}}>
      {['#FF6B6B', '#FFC857', '#4ADE80'].map((c) => <div key={c} style={{width: 12, height: 12, borderRadius: '50%', background: c, marginRight: 8}} />)}
      <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 18, fontWeight: 600, color: light ? '#8A93BD' : 'rgba(255,255,255,.55)'}}>{title}</div>
    </div>
    <div style={{padding: '8px 28px 28px'}}>{children}</div>
  </div>
);
const Center: React.FC<{children: React.ReactNode; top?: number; style?: React.CSSProperties}> = ({children, top = 260, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', ...style}}>{children}</div>
);
const Cursor: React.FC<{x: number; y: number; o?: number}> = ({x, y, o = 1}) => (
  <svg width="38" height="38" viewBox="0 0 24 24" style={{position: 'absolute', left: x, top: y, opacity: o, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.4))'}}><path d="M5 3l14 9-6 1.5L10 20z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" /></svg>
);
const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties}> = ({children, bg = 'rgba(255,255,255,.12)', color = '#fff', style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '16px 26px', borderRadius: 18, background: bg, border: '1.5px solid rgba(255,255,255,.18)', color, fontSize: 30, fontWeight: 600, ...style}}>{children}</div>
);

/* ------------------------------------------------------------ b-roll */
const Broll: React.FC<{src: string; spec: string; from: number}> = ({src, spec, from}) => {
  const abs = useAbs();
  const f = useCurrentFrame();
  const zoom = 1.04 + f * 0.0005;
  return (
    <AbsoluteFill style={{background: '#050A30', fontFamily}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,12,58,.15) 0%, rgba(7,12,58,.15) 45%, rgba(7,12,58,.82) 100%)'}} />
      <Headline spec={spec} from={from} top={760} size={92} weight={800} align="left" maxW={1500} />
      <div style={{display: 'none'}}>{abs}</div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ scenes */
const S_Avatars: React.FC = () => {
  const abs = useAbs();
  const L = ['Marketing', 'Sales', 'Content', 'Operations'];
  return (
    <Stage>
      <Headline spec="What if *everyone…*" from={3.2} size={96} />
      <Center top={430} style={{gap: 150}}>
        {L.map((l, i) => <Avatar key={l} label={l} size={150} style={pop(abs, 3.9 + i * 0.35)} />)}
      </Center>
    </Stage>
  );
};
const S_PA: React.FC = () => {
  const abs = useAbs();
  const rows = [['9:00', 'Call with Sarah'], ['10:30', 'Dentist'], ['12:00', 'Lunch with Mike'], ['2:00', 'Team sync']];
  return (
    <Stage>
      <Headline spec="AI personal *assistants*" from={6.8} />
      <Center top={290}>
        <Window w={980} title="Today · booked by your assistant" light={false}>
          {rows.map(([t, l], i) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 30, margin: '20px 0', ...pop(abs, 7.3 + i * 0.25)}}>
              <div style={{width: 110, color: 'rgba(255,255,255,.6)', fontSize: 28, fontWeight: 600}}>{t}</div>
              <div style={{flex: 1, padding: '20px 26px', borderRadius: 14, background: i % 2 ? 'rgba(111,140,255,.5)' : 'rgba(60,200,200,.55)', color: '#fff', fontSize: 32, fontWeight: 600}}>{l}</div>
            </div>
          ))}
        </Window>
      </Center>
    </Stage>
  );
};
const S_Editor: React.FC = () => {
  const abs = useAbs();
  const items = ['Cut the mistakes', 'Captions', 'B-roll', 'Color', 'Music'];
  return (
    <Stage dark={false}>
      <Headline spec="AI video *editors*" from={8.4} dark={false} />
      <Center top={290}>
        <Window w={1100} title="AI Editor">
          <div style={{display: 'flex', gap: 30}}>
            <div style={{width: 460, height: 280, borderRadius: 16, background: 'linear-gradient(140deg,#2B4FD8,#0B1456)', position: 'relative', ...pop(abs, 8.7)}}>
              <div style={{position: 'absolute', left: 90, bottom: 60, padding: '10px 22px', borderRadius: 10, background: '#fff', color: INK, fontWeight: 800, fontSize: 32, transform: 'rotate(-6deg)', boxShadow: '0 10px 24px rgba(0,0,0,.3)', opacity: clamp((abs - 9.1) / 0.3)}}>EDITED ✓</div>
            </div>
            <div style={{flex: 1}}>
              {items.map((it, i) => (
                <div key={it} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 4px', fontSize: 28, fontWeight: 600, color: INK, ...pop(abs, 8.8 + i * 0.12)}}>{it}<Tick size={30} /></div>
              ))}
            </div>
          </div>
          <div style={{marginTop: 24, display: 'grid', gap: 10}}>
            {[BLUE, VIOLET, '#39D6A0'].map((c, r) => (
              <div key={c} style={{display: 'flex', gap: 8}}>
                {Array.from({length: 7}).map((_, k) => <div key={k} style={{flex: 1, height: 24, borderRadius: 6, background: c, opacity: clamp((abs - 9.0 - k * 0.05 - r * 0.1) / 0.25)}} />)}
              </div>
            ))}
          </div>
        </Window>
      </Center>
    </Stage>
  );
};
const S_Web: React.FC = () => {
  const abs = useAbs();
  return (
    <Stage dark={false}>
      <Headline spec="AI web *designers*" from={9.6} dark={false} />
      <Center top={290}>
        <Window w={1100} title="yourbusiness.com">
          <div style={{height: 150, borderRadius: 16, background: `linear-gradient(90deg,${BLUE},${VIOLET})`, ...pop(abs, 10.0)}} />
          <div style={{display: 'flex', gap: 24, marginTop: 24}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{flex: 1, height: 230, borderRadius: 16, background: '#EEF1FF', border: '2px solid #DDE3FA', padding: 22, ...pop(abs, 10.2 + i * 0.15)}}>
                <div style={{height: 90, borderRadius: 10, background: ['#BFD0FF', '#C9F4E1', '#DCCFFB'][i]}} />
                <div style={{height: 14, borderRadius: 7, background: '#C9D1F3', marginTop: 20, width: '80%'}} />
                <div style={{height: 14, borderRadius: 7, background: '#C9D1F3', marginTop: 12, width: '55%'}} />
              </div>
            ))}
          </div>
        </Window>
        <Cursor x={1180} y={560} o={clamp((abs - 10.3) / 0.2)} />
      </Center>
    </Stage>
  );
};
const LineChart: React.FC<{w: number; h: number; p: number; color?: string}> = ({w, h, p, color = '#2FD6E0'}) => {
  const pts = [[0, .8], [.12, .72], [.24, .78], [.38, .55], [.5, .6], [.64, .38], [.78, .42], [1, .12]];
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x * w} ${y * h}`).join(' ');
  return <svg width={w} height={h}><path d={d} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></svg>;
};
const S_Market: React.FC = () => {
  const abs = useAbs();
  return (
    <Stage dark={false}>
      <Headline spec="AI market *researchers*" from={10.7} dark={false} />
      <Center top={290}>
        <Window w={1100} title="Market research">
          <div style={{position: 'relative', height: 380, padding: '20px 30px'}}>
            <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" style={{position: 'absolute', left: 120, top: 30, ...pop(abs, 11.0)}}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
            <div style={{position: 'absolute', left: 30, right: 30, top: 120}}><LineChart w={980} h={220} p={Easing.out(Easing.cubic)(clamp((abs - 11.2) / 1.0))} /></div>
          </div>
        </Window>
      </Center>
    </Stage>
  );
};
const S_Compete: React.FC = () => {
  const abs = useAbs();
  const rows: [string, boolean[]][] = [['Price', [true, false, true]], ['Features', [true, true, false]], ['Reviews', [true, false, false]], ['Speed', [true, false, true]]];
  return (
    <Stage>
      <Headline spec="AI competitive *analysts*" from={12.4} />
      <Center top={300}>
        <Window w={1000} title="Competitor analysis" light={false}>
          <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', alignItems: 'center', gap: '8px 0', color: '#fff', fontSize: 30, fontWeight: 600}}>
            <div />{['You', 'Rival A', 'Rival B'].map((h) => <div key={h} style={{textAlign: 'center', color: h === 'You' ? TEAL : 'rgba(255,255,255,.6)'}}>{h}</div>)}
            {rows.map(([l, v], i) => (
              <React.Fragment key={l}>
                <div style={{padding: '18px 0', ...pop(abs, 12.8 + i * 0.2)}}>{l}</div>
                {v.map((ok, k) => <div key={k} style={{display: 'grid', placeItems: 'center', ...pop(abs, 12.9 + i * 0.2 + k * 0.08)}}>{ok ? <Tick bg="#4C79FF" /> : <Cross />}</div>)}
              </React.Fragment>
            ))}
          </div>
        </Window>
      </Center>
    </Stage>
  );
};
const S_Mkt: React.FC = () => {
  const abs = useAbs();
  return (
    <Stage dark={false}>
      <Headline spec="AI marketing *managers.*" from={13.9} dark={false} />
      <Center top={290}>
        <Window w={1180} title="Ads manager">
          <div style={{display: 'flex', gap: 22}}>
            {['Meta Ads', 'Video Ads', 'Search Ads'].map((t, i) => (
              <div key={t} style={{flex: 1, padding: '20px 24px', borderRadius: 16, background: '#F2F5FF', border: '2px solid #DDE3FA', ...pop(abs, 14.2 + i * 0.18)}}>
                <div style={{fontSize: 28, fontWeight: 700, color: INK}}>{t}</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: 22, color: '#2FB67A', fontWeight: 600}}><div style={{width: 12, height: 12, borderRadius: '50%', background: '#2FB67A'}} />Live</div>
              </div>
            ))}
          </div>
          <div style={{position: 'relative', marginTop: 26, height: 230}}>
            <div style={{position: 'absolute', left: 0, top: 0, padding: '10px 20px', borderRadius: 10, background: '#DDF7E8', color: '#1F9D63', fontWeight: 700, fontSize: 26, ...pop(abs, 14.9)}}>ROAS 4.2x</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 30}}><LineChart w={1120} h={190} p={clamp((abs - 14.6) / 1.0)} /></div>
          </div>
        </Window>
      </Center>
    </Stage>
  );
};
const S_Expo: React.FC = () => {
  const abs = useAbs();
  // one smooth eased value drives everything, so counters roll every frame instead of jumping in steps
  const cnt = 2 + 14 * Easing.inOut(Easing.cubic)(clamp((abs - 16.4) / 3.6));
  const n = Math.round(cnt);
  const hours = cnt * 9.8, money = cnt * 768;
  const tileIn = (i: number) => {
    const q = clamp(cnt - i);
    return {opacity: 0.1 + 0.9 * q, transform: `scale(${0.8 + 0.2 * Easing.out(Easing.back(2))(q)})`};
  };
  return (
    <Stage>
      <div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', fontSize: 130, fontWeight: 800, letterSpacing: -4, ...({background: `linear-gradient(90deg,${TEAL},${PERI})`, WebkitBackgroundClip: 'text', color: 'transparent'} as React.CSSProperties), opacity: clamp((abs - 15.8) / 0.4)}}>Exponential</div>
      <div style={{position: 'absolute', left: 190, top: 380, width: 700, display: 'flex', flexWrap: 'wrap', gap: 24}}>
        {Array.from({length: 16}).map((_, i) => <Tile key={i} size={140} style={tileIn(i)}><Robot size={100} /></Tile>)}
      </div>
      <div style={{position: 'absolute', left: 1000, top: 400, width: 720, display: 'grid', gap: 36}}>
        {[['Hours saved / week', String(Math.round(hours))], ['Saved / month', '$' + Math.round(money).toLocaleString('en-US')]].map(([l, v]) => (
          <div key={l} style={{padding: '34px 44px', borderRadius: 26, background: 'rgba(255,255,255,.10)', border: '2px solid rgba(255,255,255,.18)'}}>
            <div style={{fontSize: 28, color: 'rgba(255,255,255,.65)', fontWeight: 600}}>{l}</div>
            <div style={{fontSize: 104, fontWeight: 800, color: '#fff', letterSpacing: -3, fontVariantNumeric: 'tabular-nums'}}>{v}</div>
          </div>
        ))}
        <div style={{textAlign: 'right', fontSize: 34, fontWeight: 700, color: PERI}}>× {n} employees</div>
      </div>
    </Stage>
  );
};
const S_Search: React.FC = () => {
  const abs = useAbs();
  const typed = 'How do I write a follow-up email?'.slice(0, Math.floor(Math.max(0, abs - 23.3) * 16));
  return (
    <Stage dark={false}>
      <Headline spec="Most people use AI like a *search tool.*" from={21.1} dark={false} size={84} />
      <Center top={330} style={{gap: 70, position: 'absolute'}}>
        <div style={{display: 'flex', gap: 60, alignItems: 'center'}}>
          <Window w={760} h={470} title="AI chat" style={pop(abs, 22.0)}>
            <div style={{textAlign: 'center', marginTop: 70, fontSize: 40, fontWeight: 700, color: INK}}>What can I help with?</div>
            <div style={{marginTop: 70, padding: '24px 30px', borderRadius: 40, border: '2px solid #DDE3FA', fontSize: 28, color: typed ? INK : '#9AA3C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span>{typed || 'Ask anything'}</span><div style={{width: 44, height: 44, borderRadius: '50%', background: '#111', flex: 'none'}} />
            </div>
          </Window>
          <div style={{width: 74, height: 74, borderRadius: '50%', background: BLUE, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 48, fontWeight: 800, boxShadow: '0 10px 30px rgba(59,91,240,.5)', ...pop(abs, 22.6)}}>=</div>
          <Window w={760} h={470} title="Search" style={pop(abs, 22.3)}>
            <div style={{display: 'grid', placeItems: 'center', marginTop: 30}}><svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg></div>
            <div style={{marginTop: 50, padding: '24px 30px', borderRadius: 40, border: '2px solid #DDE3FA', fontSize: 28, color: INK}}>{typed.slice(0, 14)}</div>
          </Window>
        </div>
      </Center>
    </Stage>
  );
};
const S_Email: React.FC = () => {
  const abs = useAbs();
  const full = 'Hi Sarah, thanks for the call today! Attached is the proposal we discussed. Let me know if Friday works for a quick review.';
  const typed = full.slice(0, Math.floor(clamp((abs - 25.4) / 2.0) * full.length));
  return (
    <Stage dark={false}>
      <Headline spec="Write this *email…* then *paste*" from={24.9} dark={false} />
      <Center top={290}>
        <Window w={1180} h={560} title="New message" style={pop(abs, 25.2)}>
          <div style={{fontSize: 26, color: INK, lineHeight: 1.7}}><b style={{color: '#8A93BD', fontWeight: 600}}>To:</b> sarah@clientco.com<br /><b style={{color: '#8A93BD', fontWeight: 600}}>Subject:</b> Proposal + next steps</div>
          <div style={{marginTop: 26, fontSize: 30, color: INK, lineHeight: 1.5, minHeight: 150}}>{typed}</div>
          <div style={{display: 'inline-block', marginTop: 20, padding: '16px 44px', borderRadius: 40, background: `linear-gradient(90deg,${BLUE},${VIOLET})`, color: '#fff', fontWeight: 700, fontSize: 28, transform: `scale(${abs > 28.0 && abs < 28.2 ? 0.94 : 1})`}}>Send</div>
        </Window>
        <div style={{position: 'absolute', top: 850, padding: '14px 34px', borderRadius: 40, background: '#fff', border: '2px solid #C3CCEE', boxShadow: '0 16px 36px rgba(20,30,110,.28)', fontSize: 28, fontWeight: 600, color: INK, ...pop(abs, 28.3)}}>✉ Sent</div>
      </Center>
    </Stage>
  );
};
const S_Three: React.FC = () => {
  const abs = useAbs();
  const pct = Math.max(3, count(abs, 30.2, 1.6, 0, 3));
  return (
    <Stage dark={false}>
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', fontSize: 64, fontWeight: 700, color: INK, opacity: clamp((abs - 29.7) / 0.3)}}>Using about</div>
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', fontSize: 340, fontWeight: 800, letterSpacing: -12, background: `linear-gradient(90deg,${BLUE},${VIOLET})`, WebkitBackgroundClip: 'text', color: 'transparent', lineHeight: 1}}>{pct}%</div>
      <div style={{position: 'absolute', top: 700, left: 500, width: 920, height: 22, borderRadius: 11, background: '#C9D1F3'}}><div style={{width: `${3 + clamp((abs - 30.2) / 1) * 0}%`, minWidth: 30, height: '100%', borderRadius: 11, background: BLUE}} /></div>
      <div style={{position: 'absolute', top: 780, left: 0, right: 0, textAlign: 'center', fontSize: 64, fontWeight: 700, color: INK, opacity: clamp((abs - 31.0) / 0.3)}}>of what <span style={{color: BLUE}}>AI</span> is capable of</div>
    </Stage>
  );
};
const S_Super: React.FC = () => {
  const abs = useAbs();
  return (
    <Stage>
      <Headline spec="Tap into the real *superpowers*" from={33.3} />
      <Center top={380}>
        <div style={{position: 'relative'}}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = abs * 0.8 + i * 1.05;
            return <div key={i} style={{position: 'absolute', left: 150 + Math.cos(a) * 250 - 6, top: 150 + Math.sin(a) * 250 - 6, width: 12, height: 12, borderRadius: '50%', background: TEAL, boxShadow: '0 0 16px #6FF0D9'}} />;
          })}
          <Tile size={300} style={{...pop(abs, 33.9), borderRadius: 70}}><Sparkle size={170} /></Tile>
        </div>
      </Center>
    </Stage>
  );
};
const S_Agentic: React.FC = () => {
  const abs = useAbs();
  const tasks = ['Research', 'Draft', 'Report'];
  return (
    <Stage>
      <Headline spec="Agentic *workflows*" from={35.3} />
      <div style={{position: 'absolute', left: 190, top: 480, ...pop(abs, 36.0)}}><Pill style={{padding: '22px 34px'}}><span style={{fontSize: 40}}>⏰</span><div><div style={{fontSize: 30}}>Every day</div><div style={{fontSize: 20, color: 'rgba(255,255,255,.55)'}}>Trigger</div></div></Pill></div>
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}} fill="none" stroke={PERI} strokeWidth="3" strokeLinecap="round">
        <path d="M470 520 H800" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp((abs - 36.4) / 0.4)} />
        {[0, 1, 2].map((i) => <path key={i} d={`M1030 540 C 1150 540, 1150 ${470 + i * 120}, 1280 ${470 + i * 120}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp((abs - 37.0 - i * 0.15) / 0.4)} />)}
      </svg>
      <div style={{position: 'absolute', left: 810, top: 420, ...pop(abs, 36.5)}}><Robot size={220} glow /></div>
      {tasks.map((t, i) => (
        <div key={t} style={{position: 'absolute', left: 1290, top: 430 + i * 120, ...pop(abs, 37.4 + i * 0.4)}}>
          <Pill style={{width: 380, justifyContent: 'space-between', background: 'rgba(255,255,255,.16)'}}>{t}<Tick bg="#4C79FF" /></Pill>
        </div>
      ))}
    </Stage>
  );
};
const S_Brain: React.FC = () => {
  const abs = useAbs();
  const chips = ['Content', 'Scheduling', 'Support', 'Emails', 'Reports', 'Research'];
  const lv = count(abs, 40.8, 4, 6, 44);
  return (
    <Stage>
      <Headline spec="One centralized *AI brain*" from={42.7} />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}><ellipse cx="960" cy="640" rx="560" ry="250" fill="none" stroke="rgba(143,162,255,.35)" strokeWidth="2" /></svg>
      <div style={{position: 'absolute', left: 840, top: 480, ...pop(abs, 41.0)}}><Brain size={240} /></div>
      {chips.map((c, i) => {
        const a = abs * 0.35 + (i / chips.length) * Math.PI * 2;
        return <div key={c} style={{position: 'absolute', left: 960 + Math.cos(a) * 560 - 90, top: 640 + Math.sin(a) * 250 - 28, opacity: clamp((abs - 41.2 - i * 0.15) / 0.3)}}><Pill style={{fontSize: 26, padding: '12px 20px', background: 'rgba(255,255,255,.14)'}}>{c}</Pill></div>;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: "center", fontSize: 46, fontWeight: 700, color: TEAL}}>Lv {lv}</div>
      <div style={{position: 'absolute', left: 800, top: 920, width: 320, height: 10, borderRadius: 5, background: 'rgba(255,255,255,.15)'}}><div style={{width: `${(lv / 44) * 100}%`, height: '100%', borderRadius: 5, background: TEAL}} /></div>
    </Stage>
  );
};
const S_OneJob: React.FC = () => {
  const abs = useAbs();
  return (
    <Stage>
      <Headline spec="Each AI employee, *one clear job*" from={48.8} />
      <Center top={400}>
        <div style={{display: 'flex', alignItems: 'center', gap: 60, ...pop(abs, 49.6)}}>
          <Tile size={280} style={{borderRadius: 64}}><Robot size={200} /></Tile>
          <div style={{padding: '34px 48px', borderRadius: 28, background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.2)'}}>
            <div style={{fontSize: 24, color: 'rgba(255,255,255,.6)', fontWeight: 600}}>ROLE</div>
            <div style={{fontSize: 64, fontWeight: 800, color: '#fff'}}>One job,</div>
            <div style={{fontSize: 64, fontWeight: 800, color: TEAL}}>done well.</div>
          </div>
        </div>
      </Center>
    </Stage>
  );
};
const S_Tiles: React.FC = () => {
  const abs = useAbs();
  const T = [['Schedule', <svg key="a" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>, 52.5], ['Videos', <svg key="b" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.7" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9.5v5l4.5-2.5z" /></svg>, 53.4], ['Competitors', <svg key="c" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6" /></svg>, 54.9]] as [string, React.ReactNode, number][];
  return (
    <Stage>
      <Headline spec="*Schedule.* *Videos.* *Competitors.*" from={52.4} size={96} />
      <Center top={400} style={{gap: 90}}>
        {T.map(([l, ic, t]) => (
          <div key={l} style={{width: 400, padding: '44px 20px', borderRadius: 36, background: '#fff', boxShadow: '0 26px 60px rgba(5,10,60,.5)', textAlign: 'center', ...pop(abs, t)}}>
            <div style={{width: 130, height: 130, borderRadius: 34, background: '#E7EBFF', margin: '0 auto 30px', display: 'grid', placeItems: 'center'}}>{ic}</div>
            <div style={{fontSize: 44, fontWeight: 800, color: INK}}>{l}</div>
          </div>
        ))}
      </Center>
    </Stage>
  );
};
const S_Setup: React.FC = () => {
  const abs = useAbs();
  const D = ['Personal Assistant', 'Video Editor', 'Researcher', 'Marketer'];
  return (
    <Stage>
      <Headline spec="A few simple *setup files*" from={56.6} />
      <Center top={380} style={{gap: 46}}>
        {D.map((d, i) => (
          <div key={d} style={{width: 330, padding: '40px 24px', borderRadius: 30, background: '#fff', textAlign: 'center', boxShadow: '0 26px 60px rgba(5,10,60,.5)', ...pop(abs, 57.4 + i * 0.4)}}>
            <Doc size={78} />
            <div style={{fontSize: 34, fontWeight: 800, color: INK, marginTop: 14}}>{d}</div>
            <div style={{fontSize: 22, color: '#6A74A8', fontWeight: 500, marginTop: 4}}>setup file</div>
            <div style={{marginTop: 22, padding: '13px 0', borderRadius: 12, background: abs > 59.4 + i * 0.3 ? '#C9D4FF' : `linear-gradient(90deg,${BLUE},${VIOLET})`, color: abs > 59.4 + i * 0.3 ? BLUE : '#fff', fontWeight: 700, fontSize: 24}}>{abs > 59.4 + i * 0.3 ? '✓ Ready' : 'Download'}</div>
          </div>
        ))}
      </Center>
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', fontSize: 40, fontWeight: 600, color: 'rgba(255,255,255,.9)', opacity: clamp((abs - 58.7) / 0.4)}}>…that spell out how <span style={{color: TEAL}}>you</span> work</div>
    </Stage>
  );
};
const S_Team: React.FC = () => {
  const abs = useAbs();
  const L = ['Marketing', 'Sales', 'Content', 'Support'];
  return (
    <Stage>
      <Headline spec="A small team of *real people*" from={65.5} />
      <Center top={340} style={{gap: 200}}>
        {L.map((l, i) => (
          <div key={l} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', ...pop(abs, 66.4 + i * 0.35)}}>
            <Avatar label={l} size={150} />
            <svg width="200" height="60"><path d="M100 4 V24 M100 24 H30 M100 24 H170 M100 24 V50 M30 24 V50 M170 24 V50" stroke="rgba(143,162,255,.6)" strokeWidth="2.5" strokeDasharray="5 5" fill="none" opacity={clamp((abs - 68.7) / 0.4)} /></svg>
            <div style={{display: 'flex', gap: 14, opacity: clamp((abs - 68.7 - i * 0.12) / 0.4), marginTop: -4}}>{[0, 1, 2].map((k) => <Robot key={k} size={70} />)}</div>
          </div>
        ))}
      </Center>
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', fontSize: 44, fontWeight: 600, color: 'rgba(255,255,255,.9)', opacity: clamp((abs - 68.9) / 0.4)}}>each with their own <span style={{color: TEAL}}>AI employees</span></div>
    </Stage>
  );
};
const S_Elim: React.FC = () => {
  const abs = useAbs();
  const R = ['Data entry', 'Sorting the inbox', 'Copy-paste reports', 'Follow-up emails', 'Scheduling'];
  return (
    <Stage>
      <Headline spec="Eliminate *repetitive* tasks" from={71.4} />
      <Center top={300}>
        <div style={{width: 1000, display: 'grid', gap: 22}}>
          {R.map((r, i) => {
            const t = 72.3 + i * 0.7;
            const strike = clamp((abs - t) / 0.35);
            return (
              <div key={r} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 34px', borderRadius: 18, background: 'rgba(255,255,255,.10)', border: '1.5px solid rgba(255,255,255,.16)', ...pop(abs, 72.0 + i * 0.15)}}>
                <div style={{position: 'relative', fontSize: 38, fontWeight: 600, color: 'rgba(255,255,255,.85)'}}>{r}<div style={{position: 'absolute', left: 0, top: '52%', height: 4, width: `${strike * 100}%`, background: '#FF5C7A'}} /></div>
                <div style={{padding: '8px 22px', borderRadius: 10, background: 'rgba(60,220,150,.2)', color: '#59E6A8', fontSize: 26, fontWeight: 700, opacity: strike}}>Automated ✓</div>
              </div>
            );
          })}
        </div>
      </Center>
    </Stage>
  );
};
const S_Timer: React.FC = () => {
  const abs = useAbs();
  const p = clamp((abs - 81.2) / 2.4);
  const mins = Math.round(p * 30);
  const C = 2 * Math.PI * 130;
  return (
    <Stage dark={false}>
      <Headline spec="The first *AI employee* takes about *30 minutes*" from={80.6} dark={false} size={76} maxW={1500} />
      <Center top={420}>
        <div style={{position: 'relative', width: 380, height: 380, ...pop(abs, 81.0)}}>
          <svg width="380" height="380" viewBox="0 0 300 300" style={{filter: 'drop-shadow(0 22px 40px rgba(20,30,110,.3))'}}><circle cx="150" cy="150" r="130" fill="#fff" stroke="#C3CCEE" strokeWidth="14" /><circle cx="150" cy="150" r="130" fill="none" stroke={BLUE} strokeWidth="14" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90 150 150)" /></svg>
          <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center'}}><div><div style={{fontSize: 130, fontWeight: 800, color: INK, lineHeight: 1}}>{mins}</div><div style={{fontSize: 34, fontWeight: 700, color: '#6A74A8'}}>MIN</div></div></div>
        </div>
      </Center>
    </Stage>
  );
};
const S_Build: React.FC = () => {
  const abs = useAbs();
  const N = ['Assistant', 'Savings', 'Planner', 'Editor', 'Analyst', 'Marketer'];
  return (
    <Stage>
      <Headline spec="Build the team *one hire* at a time" from={85.0} />
      <div style={{position: 'absolute', left: 250, right: 250, top: 585, height: 4, background: 'rgba(143,162,255,.45)', transform: `scaleX(${clamp((abs - 85.6) / 2)})`, transformOrigin: 'left'}} />
      <Center top={460} style={{gap: 56}}>
        {N.map((n, i) => (
          <div key={n} style={{textAlign: 'center', ...pop(abs, 85.6 + i * 0.35)}}>
            <div style={{position: 'relative'}}><Tile size={170}><Robot size={120} /></Tile>
              <div style={{position: 'absolute', right: -12, top: -12, width: 46, height: 46, borderRadius: '50%', background: BLUE, color: '#fff', fontWeight: 800, fontSize: 26, display: 'grid', placeItems: 'center', border: '3px solid #fff'}}>{i + 1}</div></div>
            <div style={{marginTop: 18, fontSize: 28, color: '#fff', fontWeight: 600}}>{n}</div>
          </div>
        ))}
      </Center>
    </Stage>
  );
};
const S_End: React.FC = () => {
  const abs = useAbs();
  return (
    <Stage>
      {/* the clip is 5s but the scene is ~9.6s: loop it and keep a slow push so the ending never freezes */}
      <AbsoluteFill style={{opacity: 0.35, transform: `scale(${1.02 + (abs - 88) * 0.008})`}}>
        <Loop durationInFrames={150}><OffthreadVideo src={staticFile('fbreel/gen/broll6.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(60% 60% at 50% 50%, rgba(7,12,58,.2), rgba(7,12,58,.85))'}} />
      <Headline spec="The future of work isn't *people or AI.*" from={88.0} size={92} top={250} />
      <Headline spec="It's *people with AI,*" from={89.4} size={150} weight={800} top={470} />
      <Headline spec="working side by side." from={92.5} size={84} weight={600} top={710} />
    </Stage>
  );
};

/* ------------------------------------------------------------ timeline */
export const SCENES: {id: string; from: number; to: number; node: React.ReactNode}[] = [
  {id: 'broll-open', from: 0, to: 3.2, node: <Broll src="fbreel/gen/broll1.mp4" spec="Before you hire your next *employee*" from={0} />},
  {id: 'avatars', from: 3.2, to: 6.8, node: <S_Avatars />},
  {id: 'assistants', from: 6.8, to: 8.4, node: <S_PA />},
  {id: 'editors', from: 8.4, to: 9.6, node: <S_Editor />},
  {id: 'web', from: 9.6, to: 10.7, node: <S_Web />},
  {id: 'research', from: 10.7, to: 12.4, node: <S_Market />},
  {id: 'competitive', from: 12.4, to: 13.9, node: <S_Compete />},
  {id: 'marketing', from: 13.9, to: 15.7, node: <S_Mkt />},
  {id: 'exponential', from: 15.7, to: 21.1, node: <S_Expo />},
  {id: 'search', from: 21.1, to: 25.0, node: <S_Search />},
  {id: 'email', from: 25.0, to: 29.7, node: <S_Email />},
  {id: 'three', from: 29.7, to: 33.3, node: <S_Three />},
  {id: 'superpowers', from: 33.3, to: 35.3, node: <S_Super />},
  {id: 'agentic', from: 35.3, to: 40.5, node: <S_Agentic />},
  {id: 'brain', from: 40.5, to: 45.0, node: <S_Brain />},
  {id: 'broll-output', from: 45.0, to: 48.8, node: <Broll src="fbreel/gen/broll2.mp4" spec="*Improves* output quality across the board" from={45.0} />},
  {id: 'one-job', from: 48.8, to: 52.4, node: <S_OneJob />},
  {id: 'tiles', from: 52.4, to: 57.3, node: <S_Tiles />},
  {id: 'setup', from: 57.3, to: 62.4, node: <S_Setup />},
  {id: 'broll-nocode', from: 62.4, to: 65.5, node: <Broll src="fbreel/gen/broll4.mp4" spec="No coding or *AI experience* required" from={62.4} />},
  {id: 'team', from: 65.5, to: 71.1, node: <S_Team />},
  {id: 'eliminate', from: 71.1, to: 76.6, node: <S_Elim />},
  {id: 'broll-value', from: 76.6, to: 80.6, node: <Broll src="fbreel/gen/broll3.mp4" spec="Solving problems. Building *real value*" from={76.6} />},
  {id: 'timer', from: 80.6, to: 85.0, node: <S_Timer />},
  {id: 'build', from: 85.0, to: 88.0, node: <S_Build />},
  {id: 'end', from: 88.0, to: 97.4, node: <S_End />},
];

/* ------------------------------------------------------------ sound (ElevenLabs SFX; my-rules: clicks and dings, never whooshes) */
type Sfx = 'click' | 'ding' | 'typing' | 'ticks';
const SFX_LEN: Record<Sfx, number> = {click: 0.48, ding: 1.2, typing: 3, ticks: 2};
const steps = (t0: number, n: number, gap: number, name: Sfx = 'click', vol = 0.3): [number, Sfx, number][] =>
  Array.from({length: n}, (_, i) => [t0 + i * gap, name, vol]);
const SFX: [number, Sfx, number][] = [
  ...SCENES.slice(1).map((s) => [s.from, 'click', 0.28] as [number, Sfx, number]),
  ...steps(3.9, 4, 0.35),
  ...steps(7.3, 4, 0.25, 'click', 0.2),
  [9.1, 'ding', 0.3],
  [16.6, 'ticks', 0.22], [18.6, 'ticks', 0.18],
  [23.3, 'typing', 0.25],
  [25.4, 'typing', 0.25],
  [28.3, 'ding', 0.32],
  [33.9, 'ding', 0.3],
  ...steps(37.4, 3, 0.4, 'click', 0.25),
  [40.8, 'ticks', 0.18], [41.0, 'ding', 0.25],
  [49.6, 'click', 0.3],
  [52.5, 'click', 0.3], [53.4, 'click', 0.3], [54.9, 'click', 0.3],
  ...steps(57.4, 4, 0.4),
  [59.4, 'ding', 0.3],
  ...steps(66.4, 4, 0.35),
  ...steps(72.3, 5, 0.7, 'click', 0.25),
  [75.2, 'ding', 0.3],
  [81.2, 'ticks', 0.2], [83.6, 'ding', 0.32],
  ...steps(85.6, 6, 0.35, 'click', 0.25),
  [89.4, 'ding', 0.28],
];

export const FbReel: React.FC = () => (
  <AbsoluteFill style={{background: '#070C3A'}}>
    {SCENES.map((s) => <Scene key={s.id} from={s.from} to={s.to}>{s.node}</Scene>)}
    <Audio src={staticFile('fbreel/voiceover.mp3')} />
    <Audio src={staticFile('fbreel/sfx/music.mp3')} volume={(f) => interpolate(f, [0, 45, DURATION_FB - 90, DURATION_FB], [0, 0.12, 0.12, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    {SFX.map(([t, name, vol], i) => (
      <Sequence key={i} from={Math.round(t * FPS)} durationInFrames={Math.round(SFX_LEN[name] * FPS)} layout="none">
        <Audio src={staticFile(`fbreel/sfx/${name}.mp3`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

import React from 'react';
import {Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Acc, F, FPS, POP, ramp, sp, useAbs} from '../reviews/kit';

export {Acc, F, FPS, POP, ramp, sp, useAbs};
export {BOUNCE, enter, fadeIn, Clock} from '../reviews/kit';

// BOSS Studio brand (hub + Studio): warm cream, near-black, one orange-red accent; the graphic's blue/pink/cyan/purple/yellow as secondary pops
export const P = {
  bg: '#F6F3EC',
  bg2: '#EDE6D9',
  card: '#FFFFFF',
  ink: '#14110F',
  mut: '#6B645C',
  acc: '#DC2E0A',
  line: '#DDD5C6',
  green: '#1E9E5A',
  pink: '#FF3FB4',
  blue: '#4D8DFF',
  cyan: '#35D6EE',
  purple: '#A874FF',
  yellow: '#FFC83A',
};
export const ease = Easing.inOut(Easing.cubic);
export const sh = {
  card: '0 2px 0 rgba(20,17,15,.04), 0 24px 60px -20px rgba(20,17,15,.35)',
  soft: '0 10px 30px -12px rgba(20,17,15,.28)',
};

/** Blur-in reveal (the monday.com tutorial look): fades up out of a blur. */
export const blurIn = (abs: number, at: number, dur = 0.5, y = 26): React.CSSProperties => {
  const p = ramp(abs, at, at + dur);
  return {opacity: p, transform: `translateY(${(1 - p) * y}px)`, filter: `blur(${(1 - p) * 14}px)`};
};

// ---- backgrounds ----
/** Light stage: warm cream, a faint animated blueprint grid, soft orange/pink/blue glows. */
export const LightStage: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const abs = useAbs();
  const d = (abs * 12) % 56;
  return (
    <div style={{position: 'absolute', inset: 0, background: P.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 900, top: -380, width: 1100, height: 1100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(220,46,10,.20),transparent 66%)'}} />
      <div style={{position: 'absolute', left: -420, top: 560, width: 1000, height: 1000, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,116,255,.20),transparent 66%)'}} />
      <div style={{position: 'absolute', left: 1180, top: 640, width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle,rgba(77,141,255,.16),transparent 66%)'}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(20,17,15,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(20,17,15,.06) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
          backgroundPosition: `0 ${d}px`,
          WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 55% 45%,#000 25%,transparent 90%)',
        }}
      />
      {children}
    </div>
  );
};

/** Dark hero stage (the hub hero): near-black, animated grid, orange glow. */
export const DarkStage: React.FC<{children?: React.ReactNode; glowX?: number}> = ({children, glowX = 1250}) => {
  const abs = useAbs();
  const d = (abs * 14) % 56;
  const pulse = 1 + 0.06 * Math.sin(abs * 1.6);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#14110F', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: glowX - 600, top: 40, width: 1200, height: 1200, borderRadius: '50%', transform: `scale(${pulse})`, background: 'radial-gradient(circle,rgba(220,46,10,.42),transparent 62%)'}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(246,243,236,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(246,243,236,.10) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
          backgroundPosition: `0 ${d}px`,
          WebkitMaskImage: 'radial-gradient(ellipse 90% 100% at 60% 48%,#000 25%,transparent 90%)',
        }}
      />
      {children}
    </div>
  );
};

/** Section slate: full-bleed orange-red with a halftone dot ellipse in the centre. */
export const SlateBg: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0, background: P.acc, overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 2000,
        height: 1000,
        transform: 'translate(-50%,-50%)',
        backgroundImage: 'radial-gradient(rgba(0,0,0,.18) 5px,transparent 6px)',
        backgroundSize: '28px 28px',
        WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%,#000 20%,transparent 75%)',
      }}
    />
    {children}
  </div>
);

// ---- bits ----
/** The BOSS mascot loop (frames of the transparent animation, 6 s, loops). */
export const Mascot: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => {
  const abs = useAbs();
  const n = (Math.floor(abs * 30) % 180) + 1;
  return <Img src={staticFile(`promo/mascot/m_${String(n).padStart(3, '0')}.png`)} style={{width: size, height: 'auto', filter: 'drop-shadow(0 24px 30px rgba(0,0,0,.35))', ...style}} />;
};

export const Logo: React.FC<{dark?: boolean; size?: number}> = ({dark, size = 44}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.3, fontFamily: F.sans, fontWeight: 800, fontSize: size, color: dark ? '#fff' : P.ink, letterSpacing: -1}}>
    <span style={{width: size * 0.42, height: size * 0.42, borderRadius: '50%', background: P.acc, display: 'inline-block'}} />
    BOSS<span style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 700, color: P.acc, marginLeft: -size * 0.12}}>Studio</span>
  </div>
);

export const Chip: React.FC<{color?: string; children: React.ReactNode; size?: number; solid?: boolean; style?: React.CSSProperties}> = ({color = P.acc, children, size = 38, solid, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: `${size * 0.32}px ${size * 0.62}px`,
      borderRadius: 999,
      background: solid ? color : '#fff',
      color: solid ? '#fff' : P.ink,
      border: `3px solid ${color}`,
      fontFamily: F.sans,
      fontWeight: 800,
      fontSize: size,
      boxShadow: sh.soft,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Dot: React.FC<{c: string; s?: number}> = ({c, s = 18}) => <span style={{width: s, height: s, borderRadius: '50%', background: c, display: 'inline-block'}} />;

/** Mono caps label (like the app's own small headings). */
export const Label: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({children, color = P.mut, size = 26, style}) => (
  <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: 4, textTransform: 'uppercase', color, ...style}}>{children}</div>
);

/** Step badge, top-left of the tour scenes. */
export const Badge: React.FC<{n: string; label: string; at: number}> = ({n, label, at}) => {
  const abs = useAbs();
  return (
    <div style={{position: 'absolute', left: 48, top: 22, display: 'flex', alignItems: 'center', gap: 16, padding: '10px 26px 10px 12px', borderRadius: 999, background: '#fff', border: `3px solid ${P.line}`, boxShadow: sh.soft, ...blurIn(abs, at, 0.5, 14)}}>
      <div style={{width: 46, height: 46, borderRadius: '50%', background: P.acc, color: '#fff', fontFamily: F.sans, fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
      <Label color={P.ink} size={26}>{label}</Label>
    </div>
  );
};

/** Big bottom caption for the tour: one idea, blur-in, with an italic accent word. */
export const Caption: React.FC<{at: number; until?: number; children: React.ReactNode}> = ({at, until = 1e9, children}) => {
  const abs = useAbs();
  const out = ramp(abs, until, until + 0.35);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center', ...blurIn(abs, at, 0.55, 20), opacity: ramp(abs, at, at + 0.55) * (1 - out)}}>
      <div style={{padding: '14px 54px 18px', borderRadius: 999, background: '#fff', border: `3px solid ${P.line}`, boxShadow: sh.card, fontFamily: F.sans, fontWeight: 800, fontSize: 54, letterSpacing: -1.5, color: P.ink}}>{children}</div>
    </div>
  );
};

/** A crop of an image (for pulling single cards out of a screenshot). */
export const Crop: React.FC<{src: string; box: [number, number, number, number]; scale?: number; radius?: number; style?: React.CSSProperties}> = ({src, box, scale = 1, radius = 18, style}) => {
  const [x, y, w, h] = box;
  return (
    <div style={{width: w * scale, height: h * scale, overflow: 'hidden', borderRadius: radius, position: 'relative', ...style}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: -x * scale, top: -y * scale, width: 1920 * scale, height: 1080 * scale, maxWidth: 'none'}} />
    </div>
  );
};

// ---- screenshot camera (everything inside is in screenshot pixels: 1920x1080) ----
export type Cam = {t: number; x: number; y: number; z: number; mv?: number};
const BASE = 0.8; // screenshot fits the stage at 80% with room for the badge and caption
const FOCY = 505;

const camAt = (abs: number, cam: Cam[]) => {
  let cur = cam[0];
  let out = {x: cur.x, y: cur.y, z: cur.z};
  for (let i = 1; i < cam.length; i++) {
    const a = cam[i - 1];
    const b = cam[i];
    const t0 = Math.max(a.t, b.t - (b.mv ?? 1.3));
    if (abs >= b.t) out = {x: b.x, y: b.y, z: b.z};
    else if (abs > t0) {
      const k = ease((abs - t0) / (b.t - t0));
      out = {x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k};
      break;
    } else {
      out = {x: a.x, y: a.y, z: a.z};
      break;
    }
  }
  return out;
};

/** A screenshot in a rounded window that the camera pans and zooms across. Callouts, highlights and the cursor go inside as children (screenshot pixels). */
export const ShotLayer: React.FC<{src: string; cam: Cam[]; children?: React.ReactNode; fadeAt?: number}> = ({src, cam, children, fadeAt}) => {
  const abs = useAbs();
  const c = camAt(abs, cam);
  const s = BASE * c.z;
  const op = fadeAt === undefined ? 1 : ramp(abs, fadeAt, fadeAt + 0.4);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${960 - c.x * s}px, ${FOCY - c.y * s}px) scale(${s})`, opacity: op}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 30, overflow: 'hidden', boxShadow: '0 40px 120px -30px rgba(20,17,15,.55), 0 0 0 3px rgba(20,17,15,.10)'}}>
        <Img src={staticFile(src)} style={{width: 1920, height: 1080}} />
      </div>
      {children}
    </div>
  );
};

/** Orange pulsing outline around a control. */
export const Hl: React.FC<{at: number; until?: number; x: number; y: number; w: number; h: number; r?: number}> = ({at, until = 1e9, x, y, w, h, r = 22}) => {
  const abs = useAbs();
  const k = sp(abs, at, POP) * (1 - ramp(abs, until, until + 0.3));
  const pulse = 1 + 0.025 * Math.sin((abs - at) * 6);
  if (k <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x - 10, top: y - 10, width: w + 20, height: h + 20, borderRadius: r + 10, border: `6px solid ${P.acc}`, boxShadow: '0 0 0 8px rgba(220,46,10,.18), 0 0 40px rgba(220,46,10,.45)', opacity: k, transform: `scale(${(1.1 - 0.1 * k) * pulse})`}} />
  );
};

/** A note card pointing at a control. `to` is the spot it points at; the card sits at (x,y). */
export const Callout: React.FC<{at: number; until?: number; x: number; y: number; w?: number; to?: [number, number]; tag?: string; children: React.ReactNode}> = ({at, until = 1e9, x, y, w = 520, to, tag, children}) => {
  const abs = useAbs();
  const k = sp(abs, at, POP) * (1 - ramp(abs, until, until + 0.3));
  if (k <= 0.01) return null;
  return (
    <>
      {to && (
        <svg style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible', opacity: k}}>
          <line x1={x + w / 2} y1={y + 60} x2={to[0]} y2={to[1]} stroke={P.acc} strokeWidth={6} strokeLinecap="round" />
          <circle cx={to[0]} cy={to[1]} r={11} fill={P.acc} />
        </svg>
      )}
      <div style={{position: 'absolute', left: x, top: y, width: w, padding: '22px 28px 24px', borderRadius: 26, background: '#fff', border: `3px solid ${P.line}`, borderLeft: `12px solid ${P.acc}`, boxShadow: sh.card, opacity: k, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: '0 50%', fontFamily: F.sans, fontWeight: 800, fontSize: 40, lineHeight: 1.15, color: P.ink}}>
        {tag && <Label color={P.acc} size={22} style={{marginBottom: 8}}>{tag}</Label>}
        {children}
      </div>
    </>
  );
};

export type CurKey = {t: number; x: number; y: number; click?: boolean};
/** An on-screen cursor that glides between points and ripples when it clicks. */
export const Cursor: React.FC<{keys: CurKey[]}> = ({keys}) => {
  const abs = useAbs();
  const f0 = useCurrentFrame();
  const start = abs - f0 / FPS;
  const clickSounds = keys.filter((k) => k.click).map((k, i) => (
    <Sequence key={'c' + i} from={Math.max(0, Math.round((k.t - start) * FPS))} durationInFrames={20} layout="none">
      <Audio src={staticFile('promo/audio/click.mp3')} volume={0.55} />
    </Sequence>
  ));
  if (abs < keys[0].t - 0.3) return <>{clickSounds}</>;
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (abs >= b.t) {
      x = b.x;
      y = b.y;
    } else if (abs > a.t) {
      const k = ease((abs - a.t) / (b.t - a.t));
      x = a.x + (b.x - a.x) * k;
      y = a.y + (b.y - a.y) * k;
      break;
    } else break;
  }
  const clicks = keys.filter((k) => k.click);
  const last = clicks.filter((k) => abs >= k.t).pop();
  const since = last ? abs - last.t : 9;
  const press = last && since < 0.18 ? 0.86 : 1;
  const vis = ramp(abs, keys[0].t - 0.3, keys[0].t);
  return (
    <>
      {clickSounds}
      {last && since < 0.7 && (
        <div style={{position: 'absolute', left: last.x - 40, top: last.y - 40, width: 80, height: 80, borderRadius: '50%', border: `6px solid ${P.acc}`, opacity: 1 - since / 0.7, transform: `scale(${0.4 + since * 3})`}} />
      )}
      <svg width={64} height={64} viewBox="0 0 24 24" style={{position: 'absolute', left: x - 6, top: y - 4, opacity: vis, transform: `scale(${press * 1.4})`, transformOrigin: '6px 4px', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.4))'}}>
        <path d="M5 3l14 8-6 1.8L10.2 19z" fill="#14110F" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </>
  );
};

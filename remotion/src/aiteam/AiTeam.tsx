import React from 'react';
import {AbsoluteFill, Audio, Sequence, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as loadSerif} from '@remotion/google-fonts/CormorantGaramond';

// Palette sampled from the carousel
export const P = {
  bg: '#E7DCC5',
  ink: '#050F18',
  pink: '#EE1A7B',
  white: '#FFFFFF',
  teal: '#0E8A86',
  tealLine: '#8FB8B6',
  green: '#22C55E',
  muted: '#5B5648',
};
const g = loadGrotesk('normal', {weights: ['500', '700'], subsets: ['latin']});
const s = loadSerif('normal', {weights: ['600'], subsets: ['latin']});
const SANS = g.fontFamily;
const SERIF = s.fontFamily;

export const FPS = 30;
export const DURATION = 3760; // 125.3s, voiceover is 124.2s

// ---------- helpers ----------
const sp = (t: number, at: number, damping = 12, stiffness = 140): number =>
  t < at ? 0 : spring({frame: (t - at) * FPS, fps: FPS, config: {damping, stiffness, mass: 0.7}});
const ramp = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const pop = (t: number, at: number, from = 0.7, y = 40, float = true): React.CSSProperties => {
  const k = sp(t, at);
  // after it lands, everything keeps a slow gentle float so no frame is ever fully still
  const bob = float && t > at + 0.9 ? Math.sin(t * 1.7 + at * 2.1) * 6 : 0;
  return {opacity: ramp(t, at, at + 0.2), transform: `translateY(${y * (1 - k) + bob}px) scale(${from + (1 - from) * k})`};
};

// ---------- building blocks ----------
type Word = {w: string; hot?: boolean};
/** Headline: words rise in one by one. Pink words are the key words. */
const Headline: React.FC<{t: number; at: number; lines: Word[][]; size?: number; gap?: number; align?: 'left' | 'center'}> = ({
  t,
  at,
  lines,
  size = 132,
  gap = 0.09,
  align = 'center',
}) => {
  let n = 0;
  return (
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 1.02, letterSpacing: -3, color: P.ink, textAlign: align}}>
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', columnGap: size * 0.22}}>
          {line.map((word, wi) => {
            const k = n++;
            return (
              <span key={wi} style={{display: 'inline-block', color: word.hot ? P.pink : P.ink, ...pop(t, at + k * gap, 0.9, 50, false)}}>
                {word.w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const BigNumber: React.FC<{t: number; at: number; n: string}> = ({t, at, n}) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 250,
      lineHeight: 0.85,
      letterSpacing: -10,
      color: P.pink,
      ...pop(t, at, 0.5, 80),
      transformOrigin: 'center center',
      textAlign: 'center',
    }}
  >
    {n}
  </div>
);

const Label: React.FC<{t: number; at: number; children: React.ReactNode; color?: string; size?: number}> = ({t, at, children, color = P.ink, size = 56}) => (
  <div style={{fontFamily: SANS, fontWeight: 500, fontSize: size, color, lineHeight: 1.2, ...pop(t, at, 0.95, 30)}}>{children}</div>
);

const Shot: React.FC<{t: number; at: number; src: string; w?: number; ratio: number; rot?: number}> = ({t, at, src, w = 920, ratio, rot = 0}) => (
  <div
    style={{
      width: w,
      height: w * ratio,
      borderRadius: 36,
      overflow: 'hidden',
      background: P.white,
      boxShadow: '0 30px 70px rgba(5,15,24,0.22)',
      ...pop(t, at, 0.85, 120),
      rotate: `${rot}deg`,
    }}
  >
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
  </div>
);

/** pink highlighter sweep behind a stretch of content */
const Sweep: React.FC<{t: number; at: number; style: React.CSSProperties}> = ({t, at, style}) => (
  <div
    style={{
      position: 'absolute',
      background: P.pink,
      opacity: 0.28,
      borderRadius: 10,
      transformOrigin: 'left center',
      transform: `scaleX(${ramp(t, at, at + 0.5, Easing.inOut(Easing.cubic))})`,
      ...style,
    }}
  />
);

/** hand-drawn loop that draws itself around something. `d` is in the overlay's own w x h pixel space. */
const Encircle: React.FC<{t: number; at: number; w: number; h: number; d: string; dur?: number}> = ({t, at, w, h, d, dur = 0.7}) => {
  const k = ramp(t, at, at + dur, Easing.inOut(Easing.cubic));
  if (k <= 0) return null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <path d={d} pathLength={1} fill="none" stroke={P.pink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - k} />
    </svg>
  );
};

const Chip: React.FC<{t: number; at: number; icon: string; text: string; w?: number; compact?: boolean; check?: number}> = ({t, at, icon, text, w = 440, compact, check}) => (
  <div
    style={{
      width: w,
      position: 'relative',
      height: compact ? 120 : 150,
      borderRadius: 28,
      background: P.white,
      border: `4px solid ${P.tealLine}`,
      display: 'flex',
      alignItems: 'center',
      gap: compact ? 12 : 22,
      padding: compact ? '0 16px' : '0 28px',
      boxShadow: '0 18px 40px rgba(5,15,24,0.16)',
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: compact ? 32 : 46,
      lineHeight: 1.1,
      color: P.ink,
      ...pop(t, at, 0.6, 50),
    }}
  >
    <span style={{fontSize: compact ? 46 : 64}}>{icon}</span>
    {text}
    {check !== undefined && t >= check && (
      <div
        style={{
          position: 'absolute', right: -14, top: -14, width: 52, height: 52, borderRadius: 999, background: P.green, color: P.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700,
          transform: `scale(${sp(t, check, 8, 220)})`,
        }}
      >
        ✓
      </div>
    )}
  </div>
);

const Pill: React.FC<{t: number; at: number; children: React.ReactNode}> = ({t, at, children}) => (
  <div
    style={{
      display: 'inline-block',
      alignSelf: 'center',
      background: P.pink,
      color: P.ink,
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 56,
      padding: '26px 56px',
      borderRadius: 999,
      ...pop(t, at, 0.7, 30),
    }}
  >
    {children}
  </div>
);

// ---------- scene wrapper: crossfade + slow push, content stays above the bottom 330px (app buttons) ----------
const SceneBox: React.FC<{t: number; start: number; end: number; children: (lt: number) => React.ReactNode}> = ({t, start, end, children}) => {
  if (t < start - 0.01 || t > end + 0.4) return null;
  const lt = t - start;
  const op = Math.min(ramp(t, start, start + 0.3), 1 - ramp(t, end, end + 0.35, Easing.in(Easing.quad)));
  const push = 1 + 0.035 * ramp(t, start, end, Easing.linear);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <AbsoluteFill style={{transform: `scale(${push})`, padding: '190px 80px 440px 80px'}}>{children(lt)}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Col: React.FC<{children: React.ReactNode; gap?: number; justify?: string; style?: React.CSSProperties}> = ({children, gap = 44, justify = 'flex-start', style}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap, justifyContent: justify, height: '100%', ...style}}>{children}</div>
);

// ---------- scenes (times in the scene are seconds from scene start; voiceover words noted) ----------
const Counter: React.FC<{lt: number; at: number; to: number; color: string; size: number}> = ({lt, at, to, color, size}) => {
  const v = Math.round(to * ramp(lt, at, at + 0.9, Easing.out(Easing.cubic)));
  return (
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 0.85, letterSpacing: -12, color, ...pop(lt, at, 0.6, 60)}}>{v}</div>
  );
};

const Hook: React.FC<{lt: number}> = ({lt}) => (
  <Col justify="center" gap={30}>
    <Counter lt={lt} at={0.4} to={16} color={P.pink} size={270} />
    <Label t={lt} at={1.1} size={78}>AI managers</Label>
    <div style={{height: 14}} />
    <Counter lt={lt} at={2.3} to={145} color={P.ink} size={270} />
    <Label t={lt} at={3.6} size={78}>AI team members</Label>
    <div style={{height: 24}} />
    <div style={{opacity: ramp(lt, 5.0, 5.3)}}>
      <Headline t={lt} at={6.8} size={104} lines={[[{w: "I"}, {w: 'wouldn’t'}, {w: 'start', hot: true}, {w: 'there.', hot: true}]]} />
    </div>
    <Pill t={lt} at={9.3}>Here’s where I’d start →</Pill>
  </Col>
);

const Point: React.FC<{lt: number}> = ({lt}) => {
  const strike = ramp(lt, 1.6, 2.0, Easing.out(Easing.cubic));
  const oneAt = 2.0;
  return (
    <Col justify="center" gap={40}>
      <div style={{position: 'relative', alignSelf: 'center'}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 260, letterSpacing: -12, lineHeight: 0.9, color: P.ink, opacity: 1 - 0.55 * strike}}>145</div>
        <div style={{position: 'absolute', left: -20, top: '46%', height: 28, width: `${strike * 112}%`, background: P.pink, borderRadius: 14, transform: 'rotate(-4deg)'}} />
      </div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 320, letterSpacing: -14, lineHeight: 0.85, color: P.pink, ...pop(lt, oneAt, 0.4, 90, false), scale: String(1 + 0.025 * Math.sin(lt * 3.2) * ramp(lt, 3, 3.5))}}>ONE.</div>
      <Label t={lt} at={5.0} size={64}>One AI. One job. Done really well.</Label>
      <div style={{height: 20}} />
      <Pill t={lt} at={7.2}>5 steps, in order</Pill>
      <Label t={lt} at={8.8} size={60}>Works for <span style={{color: P.pink}}>any</span> business.</Label>
    </Col>
  );
};

// Step 1  22.8 → 47.6
const Step1: React.FC<{lt: number}> = ({lt}) => (
  <Col gap={36}>
    <BigNumber t={lt} at={0.1} n="01" />
    <Headline t={lt} at={0.5} size={118} lines={[[{w: 'Teach'}, {w: 'it'}, {w: 'your', hot: true}], [{w: 'business', hot: true}, {w: 'first.'}]]} />
    <div style={{display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center'}}>
      <Chip t={lt} at={3.4} icon="📁" text="Your voice" w={290} compact check={5.4} />
      <Chip t={lt} at={4.0} icon="🛍️" text="What you sell" w={290} compact check={5.7} />
      <Chip t={lt} at={4.6} icon="🎯" text="Who you serve" w={290} compact check={6.0} />
    </div>
    <div style={{position: 'relative', marginTop: 10}}>
      {/* onboarding analogy fills the gap before the voice-rules file */}
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: 24, opacity: 1 - ramp(lt, 13.3, 13.9)}}>
        {[
          {at: 6.6, icon: '🧑‍💼', a: 'New hire', b: 'needs to be told how your business runs'},
          {at: 10.4, icon: '🤖', a: 'Your AI', b: 'exactly the same'},
        ].map((c, i) => (
          <div key={i} style={{flex: 1, borderRadius: 30, background: P.white, border: `4px solid ${P.tealLine}`, display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px', boxShadow: '0 18px 40px rgba(5,15,24,0.16)', textAlign: 'left', ...pop(lt, c.at, 0.8, 60)}}>
            <span style={{fontSize: 76}}>{c.icon}</span>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, lineHeight: 1.15, color: P.ink}}>
              <span style={{color: P.pink, fontSize: 48}}>{c.a}</span>
              <br />
              {c.b}
            </div>
          </div>
        ))}
      </div>
      <Shot t={lt} at={14.2} src="first-ai-team/img/voice-rules.png" ratio={320 / 920} />
      {/* highlight each rule as it is spoken, then draw a hand-drawn loop around both */}
      <div style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
        <Sweep t={lt} at={15.0} style={{left: 84, top: 196, width: 690, height: 54}} />
        <Sweep t={lt} at={17.9} style={{left: 84, top: 259, width: 780, height: 54}} />
      </div>
      <Encircle t={lt} at={20.0} w={920} h={320} d="M 30 226 C 28 190 200 182 460 182 C 720 182 900 190 896 244 C 892 306 720 318 460 318 C 200 318 24 312 28 250 C 30 218 120 200 200 194" />
    </div>
    <div style={{...pop(lt, 22.5, 0.9, 30), fontFamily: SANS, fontWeight: 700, fontSize: 64, color: P.ink}}>
      Skip it, and it all sounds <span style={{color: P.pink}}>generic.</span>
    </div>
  </Col>
);

// Step 2  47.6 → 65.4
const Step2: React.FC<{lt: number}> = ({lt}) => {
  const items = [
    {at: 5.4, t: 'Write captions'},
    {at: 7.4, t: 'Answer the same DMs'},
    {at: 9.4, t: 'Follow up with leads'},
  ];
  return (
    <Col gap={36}>
      <BigNumber t={lt} at={0.1} n="02" />
      <Headline t={lt} at={0.5} size={118} lines={[[{w: 'Hire'}, {w: 'for'}, {w: 'the'}, {w: 'job'}], [{w: 'you'}, {w: 'repeat.', hot: true}]]} />
      <Label t={lt} at={3.5} size={52}>📝 What you did by hand this week</Label>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, marginTop: 4, alignSelf: 'stretch'}}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              height: 130,
              borderRadius: 26,
              background: P.white,
              border: `4px solid ${P.tealLine}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 40px',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 52,
              justifyContent: 'space-between',
              boxShadow: '0 14px 34px rgba(5,15,24,0.14)',
              ...pop(lt, it.at, 0.85, 60),
            }}
          >
            <span>{it.t}</span>
            <span style={{fontFamily: SANS, fontSize: 46, color: P.pink, opacity: ramp(lt, 10.8 + i * 0.35, 11.1 + i * 0.35)}}>×5</span>
          </div>
        ))}
      </div>
      <div style={{...pop(lt, 12.6, 0.8, 40), alignSelf: 'center'}}>
        <Pill t={lt} at={12.6}>{lt < 14.3 ? 'Pick the one you repeat' : lt < 15.7 ? 'Not the biggest job' : 'The most repeated one ✓'}</Pill>
      </div>
    </Col>
  );
};

// Step 3  65.4 → 85.3
const Step3: React.FC<{lt: number}> = ({lt}) => (
  <Col gap={36}>
    <BigNumber t={lt} at={0.1} n="03" />
    <Headline t={lt} at={0.5} size={118} lines={[[{w: 'Write'}, {w: 'it'}, {w: 'a'}, {w: 'job', hot: true}], [{w: 'description.', hot: true}]]} />
    <div style={{position: 'relative', width: '100%', height: 743}}>
      {/* the three things a job description must say, as they are spoken */}
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: 26, justifyContent: 'center', opacity: 1 - ramp(lt, 9.2, 9.6)}}>
        {[
          {at: 4.4, icon: '🛠️', t: 'What it does'},
          {at: 6.5, icon: '🏆', t: 'What good looks like'},
          {at: 7.9, icon: '🚫', t: 'What it never does without you'},
        ].map((c, i) => (
          <div key={i} style={{height: 170, borderRadius: 30, background: P.white, border: `4px solid ${i === 2 ? P.pink : P.tealLine}`, display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px', fontFamily: SANS, fontWeight: 700, fontSize: 50, lineHeight: 1.1, color: P.ink, textAlign: 'left', boxShadow: '0 18px 40px rgba(5,15,24,0.16)', ...pop(lt, c.at, 0.8, 60)}}>
            <span style={{fontSize: 78}}>{c.icon}</span>
            {c.t}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
        <Shot t={lt} at={9.6} src="first-ai-team/img/daily-briefing.png" ratio={383 / 920} />
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, justifyItems: 'center'}}>
          <Chip t={lt} at={12.2} icon="📅" text="Calendar" w={440} check={17.6} />
          <Chip t={lt} at={13.1} icon="📥" text="Inbox" w={440} check={17.9} />
          <Chip t={lt} at={14.3} icon="📈" text="Pipeline" w={440} check={18.2} />
          <Chip t={lt} at={15.2} icon="⭐" text="Top move" w={440} check={18.5} />
        </div>
      </div>
    </div>
  </Col>
);

// Step 4  85.3 → 102.4
const Loop: React.FC<{lt: number}> = ({lt}) => {
  const steps = [
    {at: 3.6, t: 'Wrong', c: P.ink},
    {at: 4.9, t: 'Why', c: P.ink},
    {at: 6.2, t: 'Fix', c: P.pink},
  ];
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18}}>
      {steps.map((x, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 60,
              color: x.c === P.pink ? P.ink : P.bg,
              background: x.c === P.pink ? P.pink : P.ink,
              padding: '28px 44px',
              borderRadius: 999,
              ...pop(lt, x.at, 0.6, 30),
            }}
          >
            {x.t}
          </div>
          {i < 2 && <div style={{fontFamily: SANS, fontSize: 64, fontWeight: 700, color: P.pink, opacity: ramp(lt, x.at + 0.5, x.at + 0.8)}}>→</div>}
        </React.Fragment>
      ))}
    </div>
  );
};
const Step4: React.FC<{lt: number}> = ({lt}) => (
  <Col gap={26}>
    <BigNumber t={lt} at={0.1} n="04" />
    <Headline t={lt} at={0.5} size={118} lines={[[{w: 'Correct'}, {w: 'it'}, {w: 'like'}, {w: 'a', hot: true}], [{w: 'new', hot: true}, {w: 'hire.', hot: true}]]} />
    <Loop lt={lt} />
    <Shot t={lt} at={8.4} src="first-ai-team/img/postmortem.png" ratio={383 / 920} />
    <div style={{display: 'flex', gap: 16, justifyContent: 'center'}}>
      {[
        {at: 12.2, t: 'Root cause', pink: false},
        {at: 13.6, t: 'Logged', pink: false},
        {at: 14.3, t: 'Fixed', pink: true},
      ].map((p, i) => (
        <div key={i} style={{fontFamily: SANS, fontWeight: 700, fontSize: 44, padding: '20px 34px', borderRadius: 999, background: p.pink ? P.pink : P.ink, color: p.pink ? P.ink : P.bg, ...pop(lt, p.at, 0.6, 30)}}>
          {p.t}
        </div>
      ))}
    </div>
    <Label t={lt} at={15.3} size={50} color={P.teal}>✓ So it never happens twice.</Label>
  </Col>
);

// Step 5  102.4 → 116.0
const Step5: React.FC<{lt: number}> = ({lt}) => {
  const jobs = Math.min(3, 1 + Math.floor(ramp(lt, 2.2, 5.0, Easing.linear) * 3));
  const mgr = Math.round(16 * ramp(lt, 10.8, 12.8, Easing.out(Easing.cubic)));
  return (
    <Col gap={34}>
      <BigNumber t={lt} at={0.1} n="05" />
      <Headline t={lt} at={0.5} size={118} lines={[[{w: 'Hire'}, {w: 'the'}], [{w: 'next', hot: true}, {w: 'one.', hot: true}]]} />
      <div style={{display: 'flex', gap: 22, alignItems: 'center', justifyContent: 'center', ...pop(lt, 2.2, 0.9, 30)}}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              width: 110,
              height: 110,
              borderRadius: 999,
              background: n <= jobs ? P.pink : 'rgba(5,15,24,0.12)',
              color: n <= jobs ? P.ink : 'rgba(5,15,24,0.35)',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {n <= jobs ? '✓' : n}
          </div>
        ))}
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 56, marginLeft: 10}}>jobs running</div>
      </div>
      <div style={{position: 'relative'}}>
        <Shot t={lt} at={6.6} src="first-ai-team/img/managers.png" ratio={425 / 920} />
        <div style={{position: 'absolute', left: 120, right: 120, bottom: -70, display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontWeight: 700, fontSize: 44, color: P.pink}}>
          <span style={pop(lt, 8.2, 0.8, 20)}>Content</span>
          <span style={pop(lt, 8.7, 0.8, 20)}>Leads</span>
          <span style={pop(lt, 9.2, 0.8, 20)}>Follow-up</span>
        </div>
      </div>
      <div style={{height: 14}} />
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 24, ...pop(lt, 10.6, 0.8, 30)}}>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 110, letterSpacing: -6, color: P.pink, lineHeight: 0.9}}>{mgr}</span>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 52}}>managers</span>
      </div>
    </Col>
  );
};

// CTA 116.0 → 125.3
const CTA: React.FC<{lt: number}> = ({lt}) => {
  const pulse = 1 + 0.025 * Math.sin(lt * 6);
  return (
    <Col justify="center" gap={50}>
      <Headline t={lt} at={0.2} size={130} lines={[[{w: 'Your'}, {w: 'Team'}], [{w: 'Starts'}, {w: 'With'}], [{w: 'One', hot: true}, {w: 'Hire.', hot: true}]]} />
      <Label t={lt} at={1.8} size={64}>Pick your first job tonight.</Label>
      <div
        style={{
          background: P.pink,
          color: P.ink,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 78,
          lineHeight: 1.15,
          padding: '56px 60px',
          marginTop: 20,
          transform: `scale(${pulse * (0.8 + 0.2 * sp(lt, 4.0))})`,
          opacity: ramp(lt, 4.0, 4.3),
        }}
      >
        Comment <span style={{background: P.ink, color: P.bg, padding: '0 20px'}}>TEAM</span> and I’ll send you the 5 steps + prompts.
      </div>
      <Label t={lt} at={6.5} size={46} color={P.muted}>@kristamashore</Label>
    </Col>
  );
};

// ---------- timeline ----------
const SCENES: {start: number; end: number; C: React.FC<{lt: number}>}[] = [
  {start: 0, end: 11.2, C: Hook},
  {start: 11.2, end: 22.7, C: Point},
  {start: 22.7, end: 47.5, C: Step1},
  {start: 47.5, end: 65.3, C: Step2},
  {start: 65.3, end: 85.2, C: Step3},
  {start: 85.2, end: 102.3, C: Step4},
  {start: 102.3, end: 115.9, C: Step5},
  {start: 115.9, end: 125.3, C: CTA},
];

// ---------- sound effects: absolute seconds, matched to the animation start times above ----------
const cue = (f: string, v: number, ...times: number[]) => times.map((at) => ({f, v, at}));
const SFX: {f: string; v: number; at: number}[] = [
  ...cue('riser.mp3', 0.45, 0),
  ...cue('tick.mp3', 0.3, 0.4, 2.3, 112.9),
  ...cue('hit.wav', 0.4, 2.45, 13.2, 119.9),
  // scene changes
  ...cue('whoosh.wav', 0.3, 11.0, 22.5, 47.3, 65.1, 85.0, 102.1, 115.7),
  // wrong-number strike
  ...cue('whoosh.wav', 0.25, 12.8),
  // big step numbers and headlines
  ...cue('pop.wav', 0.4, 22.8, 47.6, 65.4, 85.3, 102.4, 116.1),
  // step 1
  ...cue('pop.wav', 0.35, 26.1, 26.7, 27.3, 37.7, 40.6, 45.2),
  ...cue('whoosh.wav', 0.25, 36.9),
  ...cue('scribble.mp3', 0.45, 42.7),
  // step 2
  ...cue('pop.wav', 0.35, 52.9, 54.9, 56.9, 60.1),
  ...cue('ding.mp3', 0.25, 58.3, 58.65, 59.0),
  // step 3
  ...cue('whoosh.wav', 0.25, 74.9),
  ...cue('pop.wav', 0.35, 77.5, 78.4, 79.6, 80.5),
  // step 4
  ...cue('pop.wav', 0.35, 88.8, 90.1),
  ...cue('ding.mp3', 0.3, 91.4, 98.9, 100.5),
  ...cue('pop.wav', 0.35, 97.4, 98.2),
  ...cue('whoosh.wav', 0.25, 93.6),
  // step 5
  ...cue('ding.mp3', 0.3, 104.6, 105.5, 106.5),
  ...cue('whoosh.wav', 0.25, 108.9),
  ...cue('pop.wav', 0.35, 110.5, 111.0, 111.5),
  // gap fillers
  ...cue('pop.wav', 0.35, 9.3, 20.0, 29.3, 33.1, 51.0, 61.8, 63.2, 69.7, 71.8, 73.2),
  ...cue('ding.mp3', 0.25, 28.1, 28.4, 28.7, 82.9, 83.2, 83.5, 83.8),
  // cta
  ...cue('ding.mp3', 0.3, 120.1),
];

/** slow drifting colour blobs behind everything, so the background is never static */
const Ambient: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
    {[
      {c: P.pink, x: 0.15, y: 0.2, r: 520, sx: 0.11, sy: 0.07, o: 0.16},
      {c: P.teal, x: 0.85, y: 0.5, r: 600, sx: 0.08, sy: 0.12, o: 0.12},
      {c: P.pink, x: 0.5, y: 0.78, r: 480, sx: 0.1, sy: 0.09, o: 0.1},
    ].map((b, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: b.r,
          height: b.r,
          borderRadius: 999,
          background: b.c,
          opacity: b.o,
          filter: 'blur(110px)',
          left: 1080 * b.x - b.r / 2 + Math.sin(t * b.sx * 6 + i * 2) * 140,
          top: 1920 * b.y - b.r / 2 + Math.cos(t * b.sy * 6 + i) * 160,
        }}
      />
    ))}
  </AbsoluteFill>
);

export const AiTeam: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{background: P.bg}}>
      <Ambient t={t} />
      {SCENES.map((sc, i) => (
        <SceneBox key={i} t={t} start={sc.start} end={sc.end}>
          {(lt) => <sc.C lt={lt} />}
        </SceneBox>
      ))}
      <Audio src={staticFile('first-ai-team/voiceover.mp3')} />
      {/* music bed, fades in over 2s and out over the last 3s */}
      <Audio
        src={staticFile('first-ai-team/audio/music.mp3')}
        volume={(f) => {
          const sec = f / FPS;
          return 0.17 * Math.min(1, sec / 2) * Math.min(1, Math.max(0, (125.3 - sec) / 3));
        }}
      />
      {SFX.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * FPS)} layout="none">
          <Audio src={staticFile(`first-ai-team/audio/${c.f}`)} volume={c.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

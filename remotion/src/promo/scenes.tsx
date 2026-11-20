import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Acc, Badge, blurIn, Callout, Caption, Chip, Clock, Crop, Cursor, DarkStage, Dot, enter, F, FPS, Hl, Label, LightStage, Logo, Mascot, P, POP, ramp, ShotLayer, sh, SlateBg, sp, useAbs, type Cam, type CurKey} from './ui';
import {at, endOf, GAP_AT, seq} from './words';

/** One scene on the timeline: absolute start/end in seconds. The clock inside reads absolute seconds, so cues match the voiceover. */
export const Sc: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => (
  <Sequence from={Math.round(a * FPS)} durationInFrames={Math.max(1, Math.round((b - a) * FPS))} layout="none">
    <Clock start={a}>
      <Fade a={a}>{children}</Fade>
    </Clock>
  </Sequence>
);
const Fade: React.FC<{a: number; children: React.ReactNode}> = ({a, children}) => {
  const abs = useAbs();
  return <AbsoluteFill style={{opacity: ramp(abs, a, a + 0.25)}}>{children}</AbsoluteFill>;
};

/** A section inside a scene: same clock, shown only between a and b. */
const When: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const abs = useAbs();
  if (abs < a || abs > b) return null;
  return <AbsoluteFill style={{opacity: ramp(abs, a, a + 0.25)}}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- PITCH
export const Hook: React.FC = () => {
  const abs = useAbs();
  const ws = seq('what if editing a video felt like talking to a friend');
  const tMsg1 = at('you tell them');
  const tMsg2 = at('make it a little faster');
  const Bubble: React.FC<{t: number; me?: boolean; y: number; children: React.ReactNode}> = ({t, me, y, children}) => (
    <div style={{position: 'absolute', top: y, left: me ? 'auto' : 36, right: me ? 36 : 'auto', maxWidth: 560, padding: '22px 30px', borderRadius: 34, borderBottomRightRadius: me ? 8 : 34, borderBottomLeftRadius: me ? 34 : 8, background: me ? P.acc : '#fff', color: me ? '#fff' : P.ink, border: me ? 'none' : `3px solid ${P.line}`, boxShadow: sh.soft, fontFamily: F.sans, fontWeight: 800, fontSize: 40, ...enter(abs, t, {from: 0.5, y: 40, cfg: POP})}}>
      {children}
    </div>
  );
  const typing = (t: number) => abs > t - 0.7 && abs < t;
  return (
    <LightStage>
      <div style={{position: 'absolute', left: 100, top: 0, bottom: 0, width: 900, display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: F.sans, fontWeight: 800, letterSpacing: -3}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 26px', fontSize: 112, lineHeight: 1.12, color: P.ink}}>
          {ws.map((w, i) => {
            const last = i === ws.length - 1;
            return (
              <span key={i} style={{...blurIn(abs, w.t - 0.05, 0.4, 30), display: 'inline-block'}}>
                {last ? <Acc>{w.w}</Acc> : w.w}
              </span>
            );
          })}
        </div>
        {/* revision v3 note 1: the line keeps going on screen */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 18px', marginTop: 26, fontSize: 70, lineHeight: 1.15, letterSpacing: -2, color: P.mut}}>
          {seq('who is really good at it').map((w, i) => (
            <span key={i} style={{...blurIn(abs, w.t - 0.05, 0.35, 24), display: 'inline-block', position: 'relative', isolation: 'isolate', color: i >= 2 ? P.ink : P.mut}}>
              {i >= 2 && <span style={{position: 'absolute', left: -6, right: -6, bottom: 6, height: 26, background: 'rgba(220,46,10,.22)', borderRadius: 6, transformOrigin: '0 50%', transform: `scaleX(${ramp(abs, w.t + 0.05, w.t + 0.3)})`, zIndex: -1}} />}
              {w.w}
            </span>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 1060, top: 130, width: 780, height: 820, borderRadius: 44, background: '#FFFEFB', border: `3px solid ${P.line}`, boxShadow: sh.card, overflow: 'hidden', ...enter(abs, 0.5, {from: 0.9, y: 40})}}>
        <div style={{height: 110, borderBottom: `3px solid ${P.line}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 36px'}}>
          <div style={{width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', background: '#14110F'}}>
            <Img src={staticFile('promo/mascot.webp')} style={{width: 110, marginLeft: -20, marginTop: -4}} />
          </div>
          <div>
            <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 36}}>BOSS</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, color: P.green, letterSpacing: 2}}>● ONLINE</div>
          </div>
        </div>
        <Bubble t={tMsg1} me y={150}>Make the captions bigger</Bubble>
        {typing(tMsg1 + 1.1) && <Typing y={290} />}
        <Bubble t={tMsg1 + 1.1} y={290}>Done <span style={{color: P.green}}>✓</span></Bubble>
        <Bubble t={tMsg2} me y={440}>Make it a little faster</Bubble>
        {typing(tMsg2 + 1.2) && <Typing y={580} />}
        <Bubble t={tMsg2 + 1.2} y={580}>Done <span style={{color: P.green}}>✓</span> New version ready</Bubble>
      </div>
    </LightStage>
  );
};
const Typing: React.FC<{y: number}> = ({y}) => {
  const abs = useAbs();
  return (
    <div style={{position: 'absolute', left: 36, top: y, padding: '26px 30px', borderRadius: 34, borderBottomLeftRadius: 8, background: '#fff', border: `3px solid ${P.line}`, display: 'flex', gap: 10}}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{width: 16, height: 16, borderRadius: '50%', background: P.mut, opacity: 0.4 + 0.6 * Math.abs(Math.sin(abs * 7 + i))}} />
      ))}
    </div>
  );
};

export const Title: React.FC = () => {
  const abs = useAbs();
  const t0 = at('that is boss studio');
  const tAi = at('powered by ai');
  const tLogo = t0 + 0.45; // "...Boss Studio"
  const pop = sp(abs, t0, POP);
  const up = sp(abs, tLogo - 0.1, {damping: 18, stiffness: 120, mass: 1});
  // revision v3 note 2: mascot pops in alone in the middle, rises to make room, then the logo, then the tagline
  return (
    <DarkStage glowX={960}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', justifyContent: 'center', transformOrigin: '50% 0', transform: `translateY(${250 - 170 * up}px) scale(${(0.5 + 0.5 * pop) * (1 - 0.38 * up)})`, opacity: Math.min(1, pop * 2)}}>
        <Mascot size={640} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 480, display: 'flex', justifyContent: 'center', ...blurIn(abs, tLogo, 0.55)}}>
        <Logo dark size={124} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 680, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, fontFamily: F.sans, fontWeight: 800, fontSize: 84, color: '#fff', letterSpacing: -2}}>
        <span style={blurIn(abs, at('boss studio is an'), 0.5)}>An editing app</span>
        <span style={blurIn(abs, tAi - 0.2, 0.5)}>powered by</span>
        <div style={{width: 140, height: 116, borderRadius: 30, background: 'linear-gradient(135deg,#4D8DFF,#A874FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70, boxShadow: '0 0 60px rgba(168,116,255,.6)', opacity: ramp(abs, tAi, tAi + 0.15), transform: `scale(${0.6 + 0.4 * sp(abs, tAi, POP)})`}}>AI</div>
      </div>
    </DarkStage>
  );
};

const FlowCard: React.FC<{x: number; y: number; w?: number; h?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w = 320, h = 570, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 36, overflow: 'hidden', boxShadow: sh.card, border: `3px solid ${P.line}`, ...style}}>{children}</div>
);
export const Record: React.FC = () => {
  const abs = useAbs();
  const tRec = at('you record the video');
  const tDone = at('does the editing', 0);
  const chips: [string, string, string][] = [
    ['Cuts', P.blue, at('the cuts')],
    ['Captions', P.pink, at('the captions')],
    ['Graphics', P.purple, at('the graphics')],
    ['Sound', P.cyan, at('and the sound')],
  ];
  const wipe = ramp(abs, tDone, tDone + 0.8);
  return (
    <LightStage>
      <FlowCard x={200} y={130} style={enter(abs, tRec, {from: 0.8, y: 60, cfg: POP})}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#3a342f,#1c1815)'}} />
        <Label color="#fff" size={24} style={{position: 'absolute', left: 26, top: 24}}><Dot c="#E24B4A" s={16} /> REC</Label>
        <Label color="#B9B1A5" size={22} style={{position: 'absolute', right: 26, top: 24}}>0:42</Label>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 70, height: 120, display: 'flex', alignItems: 'center', gap: 6}}>
          {Array.from({length: 22}).map((_, i) => (
            <div key={i} style={{flex: 1, height: 14 + 90 * Math.abs(Math.sin(abs * 5 + i * 0.7)) * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.3))), borderRadius: 6, background: i % 5 === 0 ? P.acc : '#B9B1A5'}} />
          ))}
        </div>
        <Label color="#B9B1A5" size={26} style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center'}}>Raw video</Label>
      </FlowCard>
      {/* revision v3 note 4: the stacked BOSS / Studio logo instead of the mascot */}
      <div style={{position: 'absolute', left: 540, top: 250, width: 840, height: 330, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, ...blurIn(abs, tDone - 0.2, 0.5)}}>
        <svg width={170} height={60} viewBox="0 0 170 60"><path d="M0 30h140M110 8l30 22-30 22" fill="none" stroke={P.acc} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 0.95, transform: `scale(${0.8 + 0.2 * sp(abs, tDone - 0.2, POP)})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: F.sans, fontWeight: 800, fontSize: 112, letterSpacing: -2, color: P.ink}}>
            <span style={{width: 46, height: 46, borderRadius: '50%', background: P.acc, display: 'inline-block'}} />BOSS
          </div>
          <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 118, color: P.acc, marginLeft: 64}}>Studio</div>
        </div>
        <svg width={170} height={60} viewBox="0 0 170 60"><path d="M0 30h140M110 8l30 22-30 22" fill="none" stroke={P.acc} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {/* revision v3 note 3: the finished video actually plays */}
      <FlowCard x={1400} y={130} style={{opacity: wipe, transform: `scale(${0.85 + 0.15 * wipe})`, background: '#000'}}>
        <Sequence from={Math.max(0, Math.round((tDone - (abs - useCurrentFrame() / FPS)) * FPS))} layout="none">
          <OffthreadVideo src={staticFile('promo/styles/dark-terminal-draft-v2.mp4')} trimBefore={60} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Sequence>
      </FlowCard>
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', gap: 36}}>
        {chips.map(([t, c, tt]) => (
          <div key={t} style={enter(abs, tt, {from: 0.4, y: 30, cfg: POP})}>
            <Chip color={c} size={50}><Dot c={c} s={22} />{t}</Chip>
          </div>
        ))}
      </div>
    </LightStage>
  );
};

export const Busy: React.FC = () => {
  const abs = useAbs();
  const t0 = at('think of it as');
  const tBusy = at('im busy');
  return (
    <DarkStage glowX={1400}>
      <div style={{position: 'absolute', left: 110, top: 190, fontFamily: F.sans, fontWeight: 800, fontSize: 104, lineHeight: 1.08, color: '#fff', letterSpacing: -3}}>
        <div style={blurIn(abs, t0, 0.5)}>Your own</div>
        <div style={blurIn(abs, t0 + 0.25, 0.5)}>video <Acc>editor.</Acc></div>
        <div style={{marginTop: 44, fontSize: 70, color: '#B9B1A5', ...blurIn(abs, at('never gets tired'), 0.5)}}>Never tired.</div>
      </div>
      <div style={{position: 'absolute', left: 140, top: 700, ...enter(abs, tBusy - 0.3, {from: 0.5, y: 40, cfg: POP})}}>
        <div style={{position: 'relative', padding: '26px 46px', borderRadius: 40, borderBottomLeftRadius: 8, background: '#fff', fontFamily: F.sans, fontWeight: 800, fontSize: 64, color: P.ink, boxShadow: sh.card}}>
          “I’m busy.”
          <div style={{position: 'absolute', left: 20, top: '50%', height: 10, width: `${100 * ramp(abs, tBusy + 0.5, tBusy + 0.9)}%`, background: P.acc, borderRadius: 6, transform: 'rotate(-4deg)'}} />
        </div>
        <Label color={P.acc} size={30} style={{marginTop: 20, ...blurIn(abs, tBusy + 0.9, 0.4, 10)}}>Never says it</Label>
      </div>
      <div style={{position: 'absolute', left: 930, top: 120, width: 900, height: 840, ...enter(abs, t0, {from: 0.8, x: 160, cfg: POP})}}>
        <AiLaptop t0={t0} />
      </div>
    </DarkStage>
  );
};

/** revision v3 note 5: a 3D laptop where an AI does the editing — live preview, a timeline being cut, a task list ticking off, floating tool tiles. */
const AiLaptop: React.FC<{t0: number}> = ({t0}) => {
  const abs = useAbs();
  const start = abs - useCurrentFrame() / FPS;
  const e = abs - t0;
  const bob = Math.sin(abs * 1.8) * 8;
  const tasks = ['Cutting the ums', 'Adding captions', 'Moving graphics', 'Music + sound'];
  const cuts = [0.22, 0.47, 0.71]; // where the timeline gets sliced (fraction of width)
  const head = (e * 0.28) % 1;
  const Tile: React.FC<{x: number; y: number; c1: string; c2: string; ph: number; children: React.ReactNode}> = ({x, y, c1, c2, ph, children}) => (
    <div style={{position: 'absolute', left: x, top: y + Math.sin(abs * 2 + ph) * 14, width: 96, height: 96, borderRadius: 26, background: `linear-gradient(145deg,${c1},${c2})`, boxShadow: `0 18px 0 -6px rgba(0,0,0,.35), 0 26px 40px -10px ${c2}aa, inset 0 3px 0 rgba(255,255,255,.45)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 48, color: '#fff', transform: `rotate(${Math.sin(abs * 1.3 + ph) * 8}deg) scale(${sp(abs, t0 + 0.4 + ph * 0.15, POP)})`}}>{children}</div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, perspective: 1900}}>
      {/* AI orb beaming into the screen */}
      <div style={{position: 'absolute', left: 380, top: 6 + bob * 0.6, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#fff 0%,#A874FF 28%,#4D8DFF 62%,rgba(77,141,255,0) 72%)', boxShadow: '0 0 80px 20px rgba(168,116,255,.55)', transform: `scale(${(0.9 + 0.08 * Math.sin(abs * 5)) * sp(abs, t0 + 0.2, POP)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: '#fff', zIndex: 3}}>AI</div>
      <div style={{position: 'absolute', left: 445, top: 140, width: 10, height: 90, background: 'linear-gradient(#A874FF,rgba(168,116,255,0))', opacity: 0.5 + 0.5 * Math.abs(Math.sin(abs * 6)), borderRadius: 5, zIndex: 2}} />
      <div style={{position: 'absolute', left: 50, top: 190 + bob, width: 800, height: 600, transformStyle: 'preserve-3d', transform: 'rotateX(10deg) rotateY(-16deg)'}}>
        {/* screen */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 800, height: 500, borderRadius: 28, background: '#1c1815', padding: 18, boxSizing: 'border-box', boxShadow: '0 50px 90px -30px rgba(0,0,0,.8), inset 0 0 0 2px #3a342f'}}>
          <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 14, overflow: 'hidden', background: '#0f0d0c'}}>
            {/* preview */}
            <div style={{position: 'absolute', left: 16, top: 16, width: 180, height: 320, borderRadius: 10, overflow: 'hidden', background: '#000'}}>
              <Sequence from={Math.max(0, Math.round((t0 - start) * FPS))} layout="none">
                <OffthreadVideo src={staticFile('promo/final-student.mp4')} trimBefore={78} muted style={{width: 180, height: 320, objectFit: 'cover'}} />
              </Sequence>
            </div>
            {/* task list the AI ticks off */}
            <div style={{position: 'absolute', left: 214, top: 16, right: 16, height: 320, borderRadius: 10, background: '#1c1815', padding: '16px 20px', boxSizing: 'border-box'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontWeight: 700, fontSize: 16, letterSpacing: 2, color: '#A874FF'}}>✦ BOSS IS EDITING<span style={{opacity: Math.floor(abs * 3) % 2}}>_</span></div>
              {tasks.map((t, i) => {
                const ti = t0 + 0.6 + i * 0.75;
                const done = abs > ti + 0.55;
                return (
                  <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, fontFamily: F.sans, fontWeight: 700, fontSize: 24, color: '#fff', opacity: ramp(abs, ti, ti + 0.25), transform: `translateX(${(1 - ramp(abs, ti, ti + 0.3)) * 30}px)`}}>
                    <span style={{width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: done ? P.green : 'transparent', border: done ? 'none' : '3px solid #6B645C', transform: `scale(${done ? sp(abs, ti + 0.55, POP) : 1}) rotate(${done ? 0 : abs * 360}deg)`, borderTopColor: done ? undefined : P.acc}}>{done ? '✓' : ''}</span>
                    {t}
                  </div>
                );
              })}
            </div>
            {/* timeline being cut */}
            <div style={{position: 'absolute', left: 16, right: 16, bottom: 16, height: 112, borderRadius: 10, background: '#1c1815', padding: 12, boxSizing: 'border-box'}}>
              {[P.blue, P.pink, P.cyan].map((c, r) => (
                <div key={r} style={{position: 'relative', height: 24, marginBottom: 6}}>
                  {[0, ...cuts].map((a, k) => {
                    const b = k < cuts.length ? cuts[k] : 1;
                    const cutAt = t0 + 0.9 + k * 0.7;
                    const gap = k > 0 ? 6 * ramp(abs, cutAt, cutAt + 0.2) : 0;
                    return <div key={k} style={{position: 'absolute', top: 0, height: 24, left: `calc(${a * 100}% + ${gap}px)`, width: `calc(${(b - a) * 100}% - ${gap + 3}px)`, borderRadius: 6, background: c, opacity: r === 0 ? 0.95 : 0.7}} />;
                  })}
                </div>
              ))}
              <div style={{position: 'absolute', top: 6, bottom: 6, left: `calc(12px + ${head * 100}% * 0.96)`, width: 3, background: '#fff', boxShadow: '0 0 10px #fff'}} />
            </div>
          </div>
        </div>
        {/* hinge + keyboard deck in perspective */}
        <div style={{position: 'absolute', left: -40, top: 496, width: 880, height: 300, borderRadius: '0 0 30px 30px', transformOrigin: '50% 0', transform: 'rotateX(78deg)', background: 'linear-gradient(#cfc8bd,#9c958a)', boxShadow: 'inset 0 4px 0 #e9e3d8'}}>
          <div style={{position: 'absolute', left: 70, right: 70, top: 30, height: 150, borderRadius: 12, background: 'repeating-linear-gradient(90deg,#3a342f 0 46px,#9c958a 46px 52px)', opacity: 0.8}} />
          <div style={{position: 'absolute', left: 320, width: 240, top: 200, height: 80, borderRadius: 12, background: '#b5aea3'}} />
        </div>
      </div>
      <Tile x={0} y={130} c1="#FF7AC8" c2="#FF3FB4" ph={0}>Aa</Tile>
      <Tile x={770} y={70} c1="#7FE9F7" c2="#20B9D6" ph={1}>♪</Tile>
      <Tile x={800} y={560} c1="#FFB27A" c2="#DC2E0A" ph={2}>✂</Tile>
      <Tile x={-20} y={600} c1="#C7A6FF" c2="#8A54F0" ph={3}>▶</Tile>
    </div>
  );
};

type Tok = {w: string; k?: 'um' | 'rep' | 'fs'};
const TOKS: Tok[] = [
  {w: 'So,'}, {w: 'um,', k: 'um'}, {w: 'today'}, {w: 'I'}, {w: 'want'}, {w: 'to'}, {w: 'uh,', k: 'um'}, {w: 'to', k: 'rep'}, {w: 'show'}, {w: 'you'}, {w: 'the'}, {w: 'the', k: 'rep'},
  {w: 'new'}, {w: 'app.'}, {w: 'I', k: 'fs'}, {w: 'mean,', k: 'fs'}, {w: 'we—', k: 'fs'}, {w: 'BOSS'}, {w: 'does'}, {w: 'the'}, {w: 'rest.'},
];
export const Cleanup: React.FC = () => {
  const abs = useAbs();
  const t0 = at('it cleans up');
  const tM = {um: at('the ums'), rep: at('the repeats'), fs: at('the false starts')};
  const tOut = at('takes them out');
  const col = {um: P.yellow, rep: P.blue, fs: P.pink};
  const fs = 54;
  const cw = fs * 0.6;
  const out = ramp(abs, tOut, tOut + 0.9);
  return (
    <LightStage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 90, letterSpacing: -2.5, color: P.ink, ...blurIn(abs, t0, 0.5)}}>
        It cleans up <Acc>your talking</Acc>
      </div>
      <div style={{position: 'absolute', left: 130, top: 330, width: 1660, padding: '56px 64px', borderRadius: 38, background: '#fff', border: `3px solid ${P.line}`, boxShadow: sh.card, fontFamily: F.mono, fontWeight: 700, fontSize: fs, lineHeight: 1.75, color: P.ink, ...enter(abs, t0 + 0.2, {from: 0.92, y: 30})}}>
        {TOKS.map((t, i) => {
          const on = t.k ? ramp(abs, tM[t.k] - 0.05, tM[t.k] + 0.3) : 0;
          const wpx = (t.w.length + 1) * cw;
          return (
            <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', overflow: 'hidden', verticalAlign: 'top', maxWidth: t.k ? wpx * (1 - out) : wpx, opacity: t.k ? 1 - out : 1}}>
              <span style={{background: on ? `${col[t.k!]}` : 'transparent', color: on && t.k !== 'um' ? '#fff' : P.ink, borderRadius: 10, padding: '0 6px', textDecoration: t.k && out > 0.1 ? 'line-through' : 'none'}}>{t.w}</span>{' '}
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 780, display: 'flex', justifyContent: 'center', gap: 34}}>
        {([['ums', 'um'], ['repeats', 'rep'], ['false starts', 'fs']] as const).map(([l, k]) => (
          <div key={l} style={enter(abs, tM[k], {from: 0.4, y: 30, cfg: POP})}>
            <Chip color={col[k]} size={46}><Dot c={col[k]} s={20} />{l}</Chip>
          </div>
        ))}
        <div style={enter(abs, tOut + 0.5, {from: 0.4, y: 30, cfg: POP})}>
          <Chip color={P.green} size={46} solid>Clean ✓ saved 11s</Chip>
        </div>
      </div>
    </LightStage>
  );
};

// revision v3 note 6: each style card plays that style's sample loop (the same clips the Start a Project page shows); [name, file, start second]
const STYLE_BOX: [string, string, number][] = [
  ['Kinetic Type', 'boss01-why-reviews-reels', 4],
  ['Pastel Punch', 'boss02-first-ai-team-pink', 13],
  ['Hype Cam', 'viral-style-v1-draft-v8', 14],
  ['Skill Score', 'reel-recreate-pink-cream', 12],
  ['Dark Terminal', 'boss-ui-short-onyx-gold', 20],
];
const StyleCard: React.FC<{name: string; file: string; from: number; playAt: number}> = ({name, file, from, playAt}) => {
  const abs = useAbs();
  const start = abs - useCurrentFrame() / FPS;
  return (
    <div style={{width: 306, height: 587, borderRadius: 22, overflow: 'hidden', background: '#fff', border: `3px solid ${P.line}`, boxSizing: 'border-box'}}>
      <div style={{width: 300, height: 533, background: '#000', overflow: 'hidden'}}>
        <Sequence from={Math.max(0, Math.round((playAt - start) * FPS))} layout="none">
          <OffthreadVideo src={staticFile(`promo/styles/${file}.mp4`)} trimBefore={Math.round(from * FPS)} muted style={{width: 300, height: 533, objectFit: 'cover'}} />
        </Sequence>
      </div>
      <div style={{height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 22, color: P.ink}}>{name}</div>
    </div>
  );
};
export const Styles: React.FC = () => {
  const abs = useAbs();
  const t0 = at('it gives your video');
  const tPick = at('choosing one');
  const sel = 1;
  const k = ramp(abs, tPick, tPick + 0.5);
  return (
    <LightStage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 92, letterSpacing: -2.5, color: P.ink, ...blurIn(abs, t0, 0.5)}}>
        Pick a <Acc>style</Acc>
      </div>
      <div style={{position: 'absolute', left: 147, top: 250, display: 'flex', gap: 24}}>
        {STYLE_BOX.map(([n, file, from], i) => {
          const e = sp(abs, at('you pick from') + i * 0.18, POP);
          const isSel = i === sel;
          return (
            <div key={n} style={{opacity: e * (1 - 0.45 * k * (isSel ? 0 : 1)), transform: `translateY(${(1 - e) * 120 - (isSel ? 34 * k : 0)}px) rotate(${(1 - e) * (i % 2 ? 6 : -6)}deg) scale(${1 + (isSel ? 0.08 * k : 0)})`, boxShadow: isSel && k > 0 ? `0 0 0 8px ${P.acc}, 0 40px 80px -20px rgba(220,46,10,.55)` : sh.card, borderRadius: 22}}>
              <StyleCard name={n} file={file} from={from} playAt={t0} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 50, color: P.ink, ...blurIn(abs, tPick, 0.5)}}>
        Like choosing an <Acc>outfit.</Acc>
      </div>
    </LightStage>
  );
};

export const Adds: React.FC = () => {
  const abs = useAbs();
  const cards: [string, number, string][] = [
    ['Captions that pop', at('it adds captions'), P.pink],
    ['Moving graphics', at('moving words'), P.purple],
    ['Music + sound effects', at('it adds music'), P.cyan],
  ];
  const start = abs - useCurrentFrame() / FPS;
  return (
    <LightStage>
      {cards.map(([label, t, c], i) => {
        const x = 130 + i * 590;
        return (
          <div key={label} style={{position: 'absolute', left: x, top: 90, width: 530, ...enter(abs, t, {from: 0.7, y: 90, cfg: POP})}}>
            <div style={{height: 700, borderRadius: 40, background: '#14110F', border: `6px solid ${c}`, boxShadow: sh.card, overflow: 'hidden', position: 'relative'}}>
              {/* revision v3 note 7: real clips playing — popping captions, then the animated "Loan Denied" graphics */}
              {i < 2 && (
                <div style={{width: 388, height: 688, margin: '0 auto', overflow: 'hidden'}}>
                  <Sequence from={Math.max(0, Math.round((t - start) * FPS))} layout="none">
                    <OffthreadVideo src={staticFile('promo/final-student.mp4')} trimBefore={i === 0 ? 75 : 15} muted style={{width: 388, height: 690, objectFit: 'cover'}} />
                  </Sequence>
                </div>
              )}
              {i === 2 && (
                <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '0 36px'}}>
                  {Array.from({length: 17}).map((_, j) => (
                    <div key={j} style={{width: 18, height: 40 + 360 * Math.abs(Math.sin(abs * 4.5 + j * 0.55)) * (0.35 + 0.65 * Math.abs(Math.sin(j * 1.7))), borderRadius: 9, background: j % 4 === 0 ? P.cyan : j % 4 === 1 ? P.purple : P.pink}} />
                  ))}
                </div>
              )}
            </div>
            <div style={{marginTop: 30, textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 48, color: P.ink}}>{label}</div>
          </div>
        );
      })}
    </LightStage>
  );
};

export const Formats: React.FC = () => {
  const abs = useAbs();
  const tTall = at('and it makes the right');
  const tWide = at('wide for youtube');
  const start = abs - useCurrentFrame() / FPS;
  return (
    <LightStage>
      <div style={{position: 'absolute', left: 190, top: 90, ...enter(abs, tTall, {from: 0.8, y: 80, cfg: POP})}}>
        <div style={{width: 400, height: 710, borderRadius: 46, background: '#14110F', padding: 12, boxShadow: sh.card}}>
          {/* revision v4 note 1: both formats play */}
          <div style={{width: 376, height: 686, borderRadius: 36, overflow: 'hidden', background: '#000'}}>
            <Sequence from={Math.max(0, Math.round((tTall - start) * FPS))} layout="none">
              <OffthreadVideo src={staticFile('promo/final-student.mp4')} trimBefore={Math.round(6.5 * FPS)} muted style={{width: 376, height: 686, objectFit: 'cover'}} />
            </Sequence>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 16, marginTop: 34}}>
          <Chip color={P.pink} size={40}>Reels</Chip>
          <Chip color={P.cyan} size={40}>TikTok</Chip>
        </div>
      </div>
      <div style={{position: 'absolute', left: 740, top: 190, ...enter(abs, tWide, {from: 0.8, y: 80, cfg: POP})}}>
        <div style={{width: 1010, height: 568, borderRadius: 30, background: '#14110F', padding: 12, boxShadow: sh.card}}>
          <div style={{width: 986, height: 544, borderRadius: 20, overflow: 'hidden', background: '#000'}}>
            <Sequence from={Math.max(0, Math.round((tWide - start) * FPS))} layout="none">
              <OffthreadVideo src={staticFile('promo/styles/explainer-video-sample.mp4')} trimBefore={Math.round(16 * FPS)} muted style={{width: 986, height: 544, objectFit: 'cover'}} />
            </Sequence>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 34}}>
          <Chip color={P.acc} size={40}>YouTube</Chip>
        </div>
      </div>
    </LightStage>
  );
};

export const Boss: React.FC = () => {
  const abs = useAbs();
  const t0 = at('the best part');
  const fit = (t: number, i: number) => ({...enter(abs, t + i * 0.15, {from: 0.6, y: 70, cfg: POP})});
  return (
    <SlateBg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 252, lineHeight: 0.98, letterSpacing: -10, color: '#fff'}}>
          <div style={fit(at('you stay the boss'), 0)}>YOU STAY</div>
          <div style={fit(at('you stay the boss'), 1)}>THE BOSS.</div>
        </div>
        <Label color="#fff" size={54} style={{marginTop: 44, ...blurIn(abs, at('nothing is final'), 0.5, 16)}}>Nothing is final until you say so</Label>
      </div>
    </SlateBg>
  );
};

// ---------------------------------------------------------------- TOUR
const K = (t: number, x: number, y: number, click = false): CurKey => ({t, x, y, click});

export const TourProjects: React.FC<{a: number}> = ({a}) => {
  const tFolder = at('every project gets');
  const cam: Cam[] = [{t: a, x: 960, y: 540, z: 1}, {t: tFolder + 0.4, x: 1112, y: 470, z: 1.45, mv: 1.6}];
  return (
    <LightStage>
      <ShotLayer src="promo/03-projects-page.png" cam={cam}>
        <Hl at={tFolder} x={969} y={282} w={286} h={222} />
        <Callout at={tFolder + 0.3} x={640} y={570} w={760} to={[1112, 504]} tag="Your projects">Each project is a private folder on your computer</Callout>
        <Cursor keys={[K(a + 0.5, 1500, 800), K(tFolder, 1180, 430)]} />
      </ShotLayer>
      <Badge n="▶" label="Quick tour" at={a + 0.1} />
      <Caption at={a + 0.4}>The <Acc>projects</Acc> page</Caption>
    </LightStage>
  );
};

/** Paints over 04-new-project.png (screenshot px) so the form looks filled in and both buttons are active (the raw capture had them disabled).
 *  With `t` the fields fill as the voice names them; without it they are already filled. */
const NP_NAME = 'Student Video Edit - 01';
const NP_IDEA = 'Make it energetic, with big captions.';
const NewProjectFill: React.FC<{t?: {name: number; media: number; idea: number}}> = ({t}) => {
  const abs = useAbs();
  const txt: React.CSSProperties = {position: 'absolute', fontFamily: F.sans, fontWeight: 500, fontSize: 16, color: P.ink, whiteSpace: 'nowrap'};
  const mediaK = t ? sp(abs, t.media + 0.3, POP) : 1;
  const btn = (x: number, w: number, bg: string, label: string): React.ReactNode => (
    <div style={{position: 'absolute', left: x - 2, top: 460, width: w + 4, height: 56, borderRadius: 28, background: bg, color: '#fff', fontFamily: F.sans, fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 20px -8px rgba(0,0,0,.45)'}}>{label}</div>
  );
  return (
    <>
      <div style={{position: 'absolute', left: 552, top: 361, width: 816, height: 34, borderRadius: 18, background: '#fff'}} />
      {t ? <Typed text={NP_NAME} a={t.name + 0.2} b={t.name + 1.1} x={562} y={367} w={800} size={16} /> : <div style={{...txt, left: 562, top: 367}}>{NP_NAME}</div>}
      <div style={{position: 'absolute', left: 554, top: 442, width: 440, height: 93, borderRadius: 10, background: '#fff', opacity: Math.min(1, mediaK * 2)}} />
      <div style={{position: 'absolute', left: 569, top: 462, display: 'flex', alignItems: 'center', gap: 16, opacity: mediaK, transform: `scale(${0.85 + 0.15 * mediaK})`, transformOrigin: '0 50%'}}>
        <div style={{width: 52, height: 52, borderRadius: 12, background: '#14110F', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>▶</div>
        <div style={{fontFamily: F.sans}}>
          <div style={{fontWeight: 700, fontSize: 17, color: P.ink}}>student-video-raw.mp4</div>
          <div style={{fontWeight: 500, fontSize: 14, color: P.mut, marginTop: 4}}>0:42 · 186 MB · <span style={{color: P.green, fontWeight: 700}}>✓ Added</span></div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 552, top: 630, width: 816, height: 66, background: '#fff'}} />
      {t ? <Typed text={NP_IDEA} a={t.idea + 0.2} b={t.idea + 1.6} x={562} y={640} w={800} size={16} /> : <div style={{...txt, left: 562, top: 640}}>{NP_IDEA}</div>}
      {btn(1013, 187, P.acc, '＋ Create project')}
      {btn(1214, 157, P.ink, '✦ Magic Edit')}
    </>
  );
};

/** revision v4 note 2: the style cards on 05-new-project-pick-a-style.png play their sample loops, like the real picker. Boxes are the media areas in screenshot px. */
const PICKER: [string, number, [number, number, number, number]][] = [
  ['boss01-why-reviews-reels', 4, [299, 483, 250, 444]],
  ['boss02-first-ai-team-pink', 13, [567, 483, 250, 444]],
  ['viral-style-v1-draft-v8', 14, [835, 483, 250, 444]],
  ['reel-recreate-pink-cream', 12, [1371, 483, 250, 444]],
  ['boss-ui-short-onyx-gold', 20, [1640, 483, 250, 444]],
  ['explainer-video-sample', 16, [31, 723, 249, 141]],
  ['clean-explainer-why-reviews', 12, [1103, 483, 250, 140]],
  ['custom-1794781635123-sample', 4, [1103, 677, 250, 140]],
];
const PickerLoops: React.FC<{playAt: number}> = ({playAt}) => {
  const abs = useAbs();
  const from = Math.max(0, Math.round((playAt - (abs - useCurrentFrame() / FPS)) * FPS));
  return (
    <>
      {PICKER.map(([file, s, [x, y, w, h]]) => (
        <div key={file} style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', borderRadius: '14px 14px 0 0', background: '#000'}}>
          <Sequence from={from} layout="none">
            <OffthreadVideo src={staticFile(`promo/styles/${file}.mp4`)} trimBefore={Math.round(s * FPS)} muted style={{width: w, height: h, objectFit: 'cover'}} />
          </Sequence>
        </div>
      ))}
    </>
  );
};

export const TourNew: React.FC<{a: number; b: number}> = ({a, b}) => {
  const tName = at('give it a name');
  const tMedia = at('add your raw video');
  const tIdea = at('write your first idea');
  const tPick = at('then pick a style');
  const tTwo = at('you have two ways');
  const tCreate = at('press create project');
  const tMagic = at('or press magic');
  return (
    <LightStage>
      <When a={a} b={tPick + 0.2}>
        <ShotLayer src="promo/04-new-project.png" cam={[{t: a, x: 960, y: 540, z: 1}, {t: tName, x: 960, y: 420, z: 1.5, mv: 1.4}, {t: tMedia, x: 900, y: 490, z: 1.55}, {t: tIdea, x: 960, y: 620, z: 1.5}]}>
          <NewProjectFill t={{name: tName, media: tMedia, idea: tIdea}} />
          <Hl at={tName} until={tMedia} x={549} y={358} w={822} h={40} r={14} />
          <Hl at={tMedia} until={tIdea} x={549} y={437} w={450} h={103} />
          <Hl at={tIdea} x={549} y={627} w={822} h={76} r={14} />
          <Cursor keys={[K(a + 0.4, 1500, 300), K(tName, 900, 380, true), K(tMedia, 780, 490, true), K(tIdea, 900, 660, true)]} />
        </ShotLayer>
        <Badge n="1" label="Start a project" at={a + 0.1} />
        <Caption at={a + 0.4}>Name it. Add your video. <Acc>Say what you want.</Acc></Caption>
      </When>
      <When a={tPick - 0.1} b={tTwo + 0.2}>
        <ShotLayer src="promo/05-new-project-pick-a-style.png" cam={[{t: tPick, x: 960, y: 560, z: 1}, {t: tPick + 1.2, x: 960, y: 720, z: 1.35, mv: 1.2}]}>
          <PickerLoops playAt={tPick - 0.1} />
          <Hl at={tPick + 0.8} x={567} y={482} w={251} h={481} />
          <Cursor keys={[K(tPick + 0.2, 1500, 300), K(tPick + 1.2, 690, 700, true)]} />
        </ShotLayer>
        <Badge n="1" label="Start a project" at={tPick} />
        <Caption at={tPick + 0.2}>Pick a <Acc>style.</Acc></Caption>
      </When>
      <When a={tTwo - 0.1} b={b}>
        <ShotLayer src="promo/04-new-project.png" cam={[{t: tTwo, x: 1200, y: 490, z: 1.1}, {t: tCreate, x: 1200, y: 490, z: 1.9, mv: 1.4}]}>
          <NewProjectFill />
          <Hl at={tCreate} until={tMagic} x={1013} y={462} w={187} h={52} r={26} />
          <Hl at={tMagic} x={1214} y={462} w={157} h={52} r={26} />
          <Callout at={tCreate + 0.1} until={tMagic} x={720} y={600} w={540} tag="Create project">Review each step yourself</Callout>
          <Callout at={tMagic + 0.1} x={1000} y={600} w={540} tag="Magic Edit">BOSS decides everything</Callout>
          <Cursor keys={[K(tTwo, 1400, 700), K(tCreate + 0.2, 1110, 490, true), K(tMagic + 0.4, 1290, 490, true)]} />
        </ShotLayer>
        <Badge n="1" label="Two ways to go" at={tTwo} />
      </When>
    </LightStage>
  );
};

export const TourScript: React.FC<{a: number; b: number}> = ({a, b}) => {
  const tRead = at('now you can read');
  const tSel = at('select any words');
  const tSug = at('or press suggest');
  const tPrev = at('press preview edits');
  const tOrig = at('your original video');
  return (
    <LightStage>
      <When a={a} b={tSel + 0.2}>
        <ShotLayer src="promo/06-step1-script.png" cam={[{t: a, x: 960, y: 540, z: 1}, {t: tRead, x: 1258, y: 640, z: 1.4, mv: 1.6}]}>
          <Hl at={tRead} x={975} y={405} w={566} h={515} r={26} />
          <Cursor keys={[K(a + 0.6, 1500, 250), K(tRead + 0.3, 1400, 560)]} />
        </ShotLayer>
        <Badge n="1" label="Step 1 · Script" at={a + 0.1} />
        <Caption at={a + 0.4}>BOSS writes down <Acc>every word.</Acc></Caption>
      </When>
      <When a={tSel - 0.1} b={b}>
        <ShotLayer src="promo/06b-step1-script-select-words.png" cam={[{t: tSel, x: 1258, y: 520, z: 1.3}, {t: tSug - 0.4, x: 1240, y: 360, z: 1.8, mv: 1.4}]}>
          <Hl at={tSel + 2.0} until={tSug} x={975} y={316} w={160} h={36} r={18} />
          <Hl at={tSug} until={tPrev} x={975} y={360} w={168} h={36} r={18} />
          <Hl at={tPrev} until={tOrig} x={1322} y={360} w={174} h={36} r={18} />
          <Callout at={tSug + 0.1} until={tPrev} x={760} y={470} w={620} to={[1060, 380]} tag="Suggest cleanup">BOSS finds stutters and retakes</Callout>
          <Callout at={tPrev + 0.1} until={tOrig} x={900} y={470} w={620} to={[1408, 380]} tag="Preview edits">Watch it with those parts skipped</Callout>
          <Cursor keys={[K(tSel + 0.2, 1200, 600), K(tSel + 2.2, 1055, 335, true), K(tSug + 0.3, 1060, 380, true), K(tPrev + 0.3, 1408, 380, true)]} />
        </ShotLayer>
        <Badge n="1" label="Step 1 · Script" at={tSel} />
        <Caption at={tOrig} until={b}>Your original is <Acc>never changed.</Acc></Caption>
      </When>
    </LightStage>
  );
};

const Typed: React.FC<{text: string; a: number; b: number; x: number; y: number; w: number; size?: number}> = ({text, a, b, x, y, w, size = 22}) => {
  const abs = useAbs();
  const f0 = useCurrentFrame();
  const start = abs - f0 / FPS;
  const thocks = Array.from({length: Math.floor(text.length / 2)}, (_, i) => (
    <Sequence key={'t' + i} from={Math.max(0, Math.round((a + ((b - a) * (i * 2)) / text.length - start) * FPS))} durationInFrames={12} layout="none">
      <Audio src={staticFile('promo/audio/thock.mp3')} volume={0.28} playbackRate={0.95 + 0.15 * ((i * 7) % 5) / 4} />
    </Sequence>
  ));
  const n = Math.floor(text.length * ramp(abs, a, b, (t) => t));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: F.sans, fontWeight: 500, fontSize: size, lineHeight: 1.35, color: P.ink}}>
      {thocks}
      {text.slice(0, n)}
      {abs > a && abs < b + 1.5 && <span style={{display: 'inline-block', width: 2, height: size, background: P.acc, marginLeft: 2, verticalAlign: -3, opacity: Math.floor(abs * 3) % 2}} />}
    </div>
  );
};

export const TourInstr: React.FC<{a: number; b: number}> = ({a, b}) => {
  const tWhat = at('tell boss what you want');
  const tEx = at('for example');
  const tTick = at('you can tick boxes');
  const tPaste = at('you can even paste');
  const abs = useAbs();
  const boxes: [number, number, number][] = [
    [989, 443, at('clean up the sound')],
    [1276, 443, at('add soft music')],
    [989, 527, at('add sound effects')],
  ];
  return (
    <LightStage>
      <ShotLayer src="promo/07-step2-instructions.png" cam={[{t: a, x: 960, y: 540, z: 1}, {t: tWhat, x: 1258, y: 660, z: 1.5, mv: 1.4}, {t: tTick, x: 1258, y: 500, z: 1.5}, {t: tPaste, x: 1258, y: 380, z: 1.7}]}>
        <div style={{position: 'absolute', left: 980, top: 606, width: 556, height: 120, background: '#fff'}} />
        <Typed text="Make it energetic, with big captions." a={tEx + 0.3} b={endOf('big captions') } x={990} y={612} w={540} size={24} />
        <Hl at={tWhat} until={tTick} x={975} y={601} w={566} h={130} r={16} />
        {boxes.map(([x, y, t], i) => (
          <div key={i} style={{position: 'absolute', left: x - 4, top: y - 4, width: 26, height: 26, borderRadius: 7, background: P.green, color: '#fff', fontFamily: F.sans, fontWeight: 800, fontSize: 20, textAlign: 'center', lineHeight: '26px', transform: `scale(${sp(abs, t, POP)})`}}>✓</div>
        ))}
        <Hl at={tTick} until={tPaste} x={975} y={430} w={566} h={160} r={20} />
        <Hl at={tPaste} x={975} y={335} w={566} h={80} r={20} />
        <Callout at={tPaste + 0.2} x={780} y={180} w={560} to={[1100, 380]} tag="Reference video">BOSS copies its style</Callout>
        <Cursor keys={[K(a + 0.5, 1500, 250), K(tWhat + 0.4, 1200, 660, true), K(tTick + 0.3, 1010, 465, true), K(tPaste + 0.3, 1250, 380, true)]} />
      </ShotLayer>
      <Badge n="2" label="Step 2 · Instructions" at={a + 0.1} />
      <Caption at={a + 0.4}>Tell BOSS in <Acc>plain words.</Acc></Caption>
    </LightStage>
  );
};

const Progress: React.FC<{a: number; b: number}> = ({a, b}) => {
  const abs = useAbs();
  const k = ramp(abs, a, b, (t) => t * t * (3 - 2 * t));
  const pct = Math.round(6 + 90 * k);
  return (
    <>
      <div style={{position: 'absolute', left: 629, top: 327, width: 620, height: 12, borderRadius: 6, background: '#EFE9DE'}} />
      <div style={{position: 'absolute', left: 629, top: 327, width: 620 * (pct / 100), height: 12, borderRadius: 6, background: P.acc}} />
      <div style={{position: 'absolute', left: 625, top: 342, width: 330, height: 24, background: '#fff'}} />
      <div style={{position: 'absolute', left: 629, top: 344, fontFamily: F.sans, fontWeight: 500, fontSize: 15, color: P.mut}}>{pct}% · {Math.round(2 + 28 * k)}s elapsed (estimate)</div>
    </>
  );
};

/** The revision-notes list growing under the note box on 10-snapshot-canvas-raw.png (screenshot px), like the real app stacks notes. */
const NOTES: [string, string][] = [
  ['0:09', 'Make this word bigger and add a pop sound.'],
  ['0:14', 'Cut the pause before this line.'],
  ['0:21', 'Put a house B-roll here.'],
  ['0:28', 'Slow the zoom down a little.'],
];
export const NOTE_STACK_BTN = {x: 1278, y: 540 + NOTES.length * 52 + 8, w: 175, h: 37};
const NoteStack: React.FC<{times: number[]}> = ({times}) => {
  const abs = useAbs();
  if (abs < times[0]) return null;
  const ks = times.map((t) => sp(abs, t, POP));
  const n = times.filter((t) => abs >= t).length;
  const footer = 540 + ks.reduce((s, k) => s + k * 52, 0) + 8;
  return (
    <>
      <div style={{position: 'absolute', left: 1053, top: 532, width: 418, height: footer - 532 + 60, background: '#fff', borderRadius: '0 0 22px 22px', border: '1.5px solid #E6DFD3', borderTop: 'none'}} />
      {NOTES.map(([ts, txt], i) => (
        <div key={i} style={{position: 'absolute', left: 1071, top: 540 + i * 52, width: 382, height: 44, borderRadius: 12, background: '#F6F3EC', border: '1.5px solid #E6DFD3', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', boxSizing: 'border-box', opacity: ks[i], transform: `translateY(${(1 - ks[i]) * -14}px) scale(${0.9 + 0.1 * ks[i]})`, fontFamily: F.sans}}>
          <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 13, color: '#fff', background: P.acc, borderRadius: 8, padding: '3px 7px'}}>{ts}</span>
          <span style={{fontWeight: 600, fontSize: 14, color: P.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{txt}</span>
        </div>
      ))}
      <div style={{position: 'absolute', left: 1071, top: footer + 9, fontFamily: F.sans, fontWeight: 700, fontSize: 15, color: P.ink}}>{n} note{n === 1 ? '' : 's'} ready</div>
      <div style={{position: 'absolute', left: NOTE_STACK_BTN.x, top: footer, width: NOTE_STACK_BTN.w, height: NOTE_STACK_BTN.h, borderRadius: 19, background: P.acc, color: '#fff', fontFamily: F.sans, fontWeight: 800, fontSize: 16, textAlign: 'center', lineHeight: '37px'}}>Render Draft</div>
    </>
  );
};

export const TourEditing: React.FC<{a: number; b: number}> = ({a, b}) => {
  const tWatch = at('watch the draft');
  const tFrames = at('and the frames');
  const tChange = at('see something to change');
  const tCircle = at('circle it');
  const tNote = at('then write a note');
  const tNoteTxt = at('make this word bigger');
  const tEach = at('each note sticks');
  const tMany = at('add as many as you want');
  const tReady = at('when you have your notes');
  const tFix = at('and boss fixes');
  const abs = useAbs();
  const draw = (t: number, d: number) => ramp(abs, t, t + d, (x) => x);
  return (
    <LightStage>
      <When a={a} b={tWatch + 0.2}>
        <ShotLayer src="promo/11-boss-working-progress-bar.png" cam={[{t: a, x: 960, y: 540, z: 1}, {t: a + 1.4, x: 960, y: 330, z: 1.55, mv: 1.4}]}>
          <Progress a={a + 0.8} b={tWatch} />
          <Hl at={at('a progress bar')} x={580} y={270} w={760} h={98} r={20} />
        </ShotLayer>
        <Badge n="3" label="Step 3 · Editing" at={a + 0.1} />
        <Caption at={a + 0.5}>BOSS gets to work. <Acc>A bar shows it.</Acc></Caption>
      </When>
      <When a={tWatch - 0.1} b={tFrames + 0.2}>
        <ShotLayer src="promo/08-step3-editing-draft.png" cam={[{t: tWatch, x: 700, y: 560, z: 1.25}, {t: tFrames - 0.6, x: 950, y: 470, z: 1.5, mv: 1.1}]}>
          <Hl at={tFrames - 0.5} x={843} y={287} w={208} h={36} r={18} />
          <Cursor keys={[K(tWatch + 0.2, 1500, 700), K(tFrames - 0.2, 905, 305, true)]} />
        </ShotLayer>
        <Badge n="3" label="Step 3 · Editing" at={tWatch} />
        <Caption at={tWatch + 0.2}>Watch the <Acc>draft.</Acc></Caption>
      </When>
      <When a={tFrames - 0.1} b={tChange + 0.2}>
        <ShotLayer src="promo/09-step3-frames-view.png" cam={[{t: tFrames, x: 950, y: 470, z: 1.5}, {t: tChange - 0.2, x: 950, y: 560, z: 1.35, mv: 1.6}]}>
          <Hl at={tFrames + 0.1} x={947} y={287} w={104} h={36} r={18} />
          <Cursor keys={[K(tFrames, 905, 305), K(tFrames + 0.7, 1000, 305, true), K(tFrames + 1.6, 1100, 500)]} />
        </ShotLayer>
        <Badge n="3" label="Step 3 · Editing" at={tFrames} />
        <Caption at={tFrames + 0.2}>Jump <Acc>anywhere.</Acc></Caption>
      </When>
      <When a={tChange - 0.1} b={tFix - 0.1}>
        <ShotLayer src="promo/10-snapshot-canvas-raw.png" cam={[{t: tChange, x: 960, y: 540, z: 1}, {t: tChange + 1.2, x: 800, y: 330, z: 1.5, mv: 1.2}, {t: tNote, x: 1180, y: 420, z: 1.5, mv: 1.5}, {t: tMany, x: 1220, y: 560, z: 1.4, mv: 0.9}, {t: tReady, x: 1330, y: 700, z: 1.75, mv: 1.0}]}>
          <Hl at={tChange + 0.3} until={tCircle} x={1071} y={123} w={120} h={36} r={18} />
          <svg style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible'}}>
            <ellipse cx={854} cy={211} rx={66} ry={30} fill="none" stroke="#E24B4A" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw(tCircle, 0.7)} transform="rotate(-2 854 211)" />
            <path d="M900 400 L802 478 M802 478 L826 470 M802 478 L808 452" fill="none" stroke="#E24B4A" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw(tCircle + 0.9, 0.8)} />
          </svg>
          <div style={{position: 'absolute', left: 1076, top: 302, width: 372, height: 120, background: '#fff'}} />
          <Typed text="Make this word bigger and add a pop sound." a={tNoteTxt} b={endOf('a pop sound')} x={1086} y={308} w={352} size={21} />
          <Hl at={tNote} until={tReady} x={1071} y={297} w={382} h={130} r={16} />
          <NoteStack times={[tEach - 0.2, tMany, tMany + 0.3, tMany + 0.6]} />
          <Callout at={tEach} until={tReady} x={1490} y={300} w={400} to={[1246, 513]} tag="Pinned to 0:09">Each note sticks to that exact second</Callout>
          <Hl at={tReady + 0.2} x={NOTE_STACK_BTN.x} y={NOTE_STACK_BTN.y} w={NOTE_STACK_BTN.w} h={NOTE_STACK_BTN.h} r={19} />
          <Cursor keys={[K(tChange, 1500, 700), K(tChange + 0.6, 1130, 142, true), K(tCircle, 790, 182), K(tCircle + 0.7, 918, 238), K(tCircle + 0.9, 900, 400), K(tCircle + 1.7, 802, 478), K(tNote + 0.2, 1260, 360, true), K(tEach - 0.3, 1160, 513, true), K(tMany - 0.1, 1160, 513, true), K(tMany + 0.25, 1160, 513, true), K(tMany + 0.55, 1160, 513, true), K(tReady + 0.3, NOTE_STACK_BTN.x + 87, NOTE_STACK_BTN.y + 18, true)]} />
        </ShotLayer>
        <Badge n="3" label="Step 3 · Editing" at={tChange} />
        <Caption at={tChange + 0.2} until={tNote}>Draw right on the <Acc>frame.</Acc></Caption>
        <Caption at={tNote + 0.2} until={tReady}>Write a <Acc>note.</Acc></Caption>
        <Caption at={tReady + 0.3}>Press <Acc>Render Draft.</Acc></Caption>
      </When>
      <When a={tFix - 0.2} b={b}>
        <ShotLayer src="promo/11-boss-working-progress-bar.png" cam={[{t: tFix, x: 960, y: 330, z: 1.55}]}>
          <Progress a={tFix} b={b - 0.5} />
        </ShotLayer>
        <Badge n="3" label="Step 3 · Editing" at={tFix} />
        <Caption at={tFix + 0.1}>BOSS fixes it all <Acc>in one go.</Acc></Caption>
      </When>
    </LightStage>
  );
};

export const TourGallery: React.FC<{a: number; b: number}> = ({a, b}) => {
  const tSaved = at('every version is saved');
  const tOpen = at('open any of them');
  const tFolder = at('show the file in its folder');
  const tDrive = at('send it to google drive');
  const tSmall = at('drafts are small');
  const tFinal = at('render final version');
  return (
    <LightStage>
      <When a={a} b={tSmall + 0.2}>
        <ShotLayer src="promo/12-step4-gallery-versions.png" cam={[{t: a, x: 960, y: 540, z: 1}, {t: tSaved, x: 800, y: 480, z: 1.25, mv: 1.4}, {t: tOpen, x: 620, y: 700, z: 2.1, mv: 1.4}]}>
          <Hl at={tOpen} until={tFolder} x={674} y={764} w={150} h={34} r={17} />
          <Hl at={tFolder} until={tDrive} x={822} y={764} w={34} h={34} r={17} />
          <Hl at={tDrive} x={861} y={764} w={34} h={34} r={17} />
          <Callout at={tDrive + 0.1} x={560} y={850} w={560} to={[878, 800]} tag="Upload to Drive">One click</Callout>
          <Cursor keys={[K(a + 0.6, 1500, 300), K(tOpen + 0.2, 750, 780, true), K(tFolder + 0.2, 838, 780, true), K(tDrive + 0.3, 878, 780, true)]} />
        </ShotLayer>
        <Badge n="4" label="Step 4 · Gallery" at={a + 0.1} />
        <Caption at={a + 0.4}>Every version is <Acc>saved.</Acc></Caption>
      </When>
      <When a={tSmall - 0.1} b={tFinal + 0.5}>
        <ShotLayer src="promo/08-step3-editing-draft.png" cam={[{t: tSmall, x: 1000, y: 700, z: 1.2}, {t: tFinal - 0.2, x: 1487, y: 862, z: 2.1, mv: 1.6}]}>
          <Hl at={tFinal} x={1493} y={844} w={175} h={38} r={19} />
          <Cursor keys={[K(tSmall + 0.4, 1200, 700), K(tFinal - 0.1, 1580, 862)]} />
        </ShotLayer>
        <Badge n="4" label="Step 4 · Gallery" at={tSmall} />
        <Caption at={tSmall + 0.2}>Love it? <Acc>Make it final.</Acc></Caption>
      </When>
      <When a={tFinal + 0.4} b={GAP_AT + 0.2}>
        <RenderFinal a={tFinal + 0.4} click={tFinal + 0.85} done={at('full quality')} />
      </When>
      <When a={GAP_AT} b={b}>
        <FinalPlay a={GAP_AT} />
      </When>
    </LightStage>
  );
};

/** Full screen: the Render Final Version button gets clicked, fills while it renders, then flips to "It's done". */
const RenderFinal: React.FC<{a: number; click: number; done: number}> = ({a, click, done}) => {
  const abs = useAbs();
  const k = ramp(abs, click + 0.1, done - 0.05, (t) => t);
  const fin = sp(abs, done, POP);
  const pressed = abs > click && abs < click + 0.15 ? 0.94 : 1;
  const green = '#1E9E5A';
  return (
    <LightStage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', ...blurIn(abs, a, 0.45)}}>
        <Label color={P.mut} size={30}>Final version · 1080×1920</Label>
      </div>
      <div style={{position: 'absolute', left: 460, top: 360, width: 1000, height: 200, borderRadius: 100, overflow: 'hidden', background: abs < click ? green : '#CDEBD9', boxShadow: '0 30px 80px -20px rgba(30,158,90,.55)', transform: `scale(${pressed * (0.7 + 0.3 * sp(abs, a, POP)) * (1 + 0.06 * fin * Math.max(0, 1 - (abs - done) * 2))})`}}>
        {abs >= click && <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${100 * (abs >= done ? 1 : k)}%`, background: green}} />}
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: F.sans, fontWeight: 800, fontSize: 72, color: '#fff', letterSpacing: -1.5}}>
          {abs < click && 'Render Final Version'}
          {abs >= click && abs < done && <span style={{color: k > 0.45 ? '#fff' : green}}>Rendering… {Math.round(100 * k)}%</span>}
          {abs >= done && (
            <>
              <span style={{width: 96, height: 96, borderRadius: '50%', background: '#fff', color: green, fontSize: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${fin})`}}>✓</span>
              <span style={{opacity: fin}}>It’s done!</span>
            </>
          )}
        </div>
      </div>
      {abs >= done && [0, 1].map((i) => {
        const s = abs - done - i * 0.15;
        return s > 0 && s < 0.9 ? <div key={i} style={{position: 'absolute', left: 460, top: 360, width: 1000, height: 200, borderRadius: 100, border: `6px solid ${green}`, opacity: 1 - s / 0.9, transform: `scale(${1 + s * 0.35})`}} /> : null;
      })}
      <Cursor keys={[K(a + 0.05, 1500, 820), K(click, 1080, 470, true)]} />
      <Caption at={done + 0.1}>Full quality. <Acc>Ready.</Acc></Caption>
    </LightStage>
  );
};

/** The finished video playing on its project page for a couple of seconds (voiceover pauses here, see GAP in words.ts). */
const FinalPlay: React.FC<{a: number}> = ({a}) => {
  const abs = useAbs();
  const start = abs - useCurrentFrame() / FPS;
  const p = (299 - 181) / 478; // where the scrub head sits in the screenshot
  const prog = Math.min(1, p + (abs - a) / 36.86);
  return (
    <>
      <ShotLayer src="promo/08-step3-editing-draft.png" cam={[{t: a, x: 420, y: 650, z: 1.2}]}>
        <div style={{position: 'absolute', left: 231, top: 329, width: 378, height: 672, background: '#000', overflow: 'hidden'}}>
          <Sequence from={Math.max(0, Math.round((a - start) * FPS))} layout="none">
            <OffthreadVideo src={staticFile('promo/final-student.mp4')} volume={0.9} style={{width: 378, height: 672, objectFit: 'cover'}} />
          </Sequence>
        </div>
        <div style={{position: 'absolute', left: 178, top: 282, width: 470, height: 28, background: '#FFFFFF'}} />
        <div style={{position: 'absolute', left: 182, top: 287, fontFamily: F.mono, fontWeight: 700, fontSize: 13, letterSpacing: 2, color: '#1E9E5A'}}>✓ FINAL · 1080×1920 · FINAL-STUDENT-VIDEO-EDIT-01.MP4</div>
        <div style={{position: 'absolute', left: 181, top: 1039, width: 478, height: 5, borderRadius: 3, background: '#E3DCD0'}} />
        <div style={{position: 'absolute', left: 181, top: 1039, width: 478 * prog, height: 5, borderRadius: 3, background: P.acc}} />
      </ShotLayer>
      <Badge n="4" label="Step 4 · Gallery" at={a} />
      <Chip color="#1E9E5A" size={40} solid style={{position: 'absolute', left: 330, top: 470, ...enter(abs, a + 0.2, {from: 0.5, y: 30, cfg: POP})}}>✓ Final video</Chip>
      <Caption at={a + 0.2}>Your finished video. <Acc>Ready to post.</Acc></Caption>
    </>
  );
};

// ---------------------------------------------------------------- CLOSE
export const Close: React.FC<{a: number; end: number}> = ({a, end}) => {
  const abs = useAbs();
  const steps = seq('start script instructions editing gallery', 0);
  const tNeed = at('you dont need');
  const tJust = at('you just need');
  const tFinal = at('boss studio your vision');
  const stepsOut = 1 - ramp(abs, tNeed - 0.3, tNeed + 0.2);
  const needOut = 1 - ramp(abs, tFinal - 0.5, tFinal - 0.1);
  const cols = [P.acc, P.blue, P.pink, P.purple, P.cyan];
  const fin = ramp(abs, tFinal, tFinal + 0.7);
  return (
    <DarkStage glowX={1100}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', gap: 28, opacity: stepsOut}}>
        {steps.map((s, i) => (
          <div key={i} style={enter(abs, s.t - 0.05, {from: 0.4, y: 50, cfg: POP})}>
            <Chip color={cols[i]} size={46} solid><span style={{opacity: 0.8, fontFamily: F.mono}}>{i + 1}</span>{s.w.replace(/[^A-Za-z]/g, '')}</Chip>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 104, lineHeight: 1.16, color: '#fff', letterSpacing: -3, opacity: needOut}}>
        <div style={blurIn(abs, tNeed, 0.5)}>You don’t need to be an <Acc>editor.</Acc></div>
        <div style={{fontSize: 96, color: '#B9B1A5', ...blurIn(abs, tJust, 0.5)}}>Just know what you want.</div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 230, opacity: fin, transform: `translateY(${(1 - fin) * 40}px)`}}>
        <Logo dark size={120} />
        <div style={{marginTop: 38, fontFamily: F.sans, fontWeight: 800, fontSize: 80, lineHeight: 1.08, letterSpacing: -2.5, color: '#fff'}}>
          Your vision.<br />BOSS does <Acc>the editing.</Acc>
        </div>
        <div style={{marginTop: 54, ...enter(abs, at('start creating'), {from: 0.6, y: 30, cfg: POP})}}>
          <div style={{display: 'inline-block', padding: '28px 60px', borderRadius: 999, background: P.acc, color: '#fff', fontFamily: F.sans, fontWeight: 800, fontSize: 52, boxShadow: '0 20px 60px -10px rgba(220,46,10,.7)'}}>Start creating</div>
        </div>
      </div>
      <Mascot size={740} style={{position: 'absolute', right: 140, top: 230, opacity: fin, transform: `translateX(${(1 - fin) * 160}px)`}} />
    </DarkStage>
  );
};

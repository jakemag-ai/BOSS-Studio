import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Structure copied from a 46s SaaS explainer ad (talking head <-> product UI cutaways <-> CTA end card).
// Content is original/placeholder: swap the TALKING HEAD panels for your own footage and edit the copy.
export const FPS = 30;
export const DURATION_AD = 46 * FPS;
const BG = 'linear-gradient(135deg,#f4f1ff,#e3e9ff 60%,#f8e9ff)';
const PURPLE = '#5b4bf5';
const rows = ['Launch plan', 'Budget review', 'Hiring', 'Site redesign', 'Q4 report', 'Partner deck'];
const colors = ['#00c875', '#fdab3d', '#e2445c', '#579bfc', '#00c875', '#a25ddc'];
const S = (s: number) => Math.round(s * FPS);

const Pop: React.FC<{children: React.ReactNode; delay?: number}> = ({children, delay = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 14}});
  return <div style={{transform: `scale(${0.8 + 0.2 * s}) translateY(${(1 - s) * 30}px)`, opacity: s}}>{children}</div>;
};

const Head: React.FC<{text?: string}> = ({text}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 90], [-12, 12]);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(120deg,#cfd8e8,#8fa3c4)'}}>
      <div style={{position: 'absolute', left: 560 + x, top: 120, width: 800, height: 900, borderRadius: 400, background: 'rgba(255,255,255,.35)', display: 'grid', placeItems: 'center', font: '600 36px Inter, sans-serif', color: '#334'}}>TALKING HEAD</div>
      {text && (
        <div style={{position: 'absolute', left: 80, top: 200, font: '900 220px Inter, Arial Black, sans-serif', color: 'rgba(255,255,255,.92)', lineHeight: 0.9, letterSpacing: -6}}>
          {text.split(' ').map((w, i) => <Pop key={w} delay={i * 8}><div>{w}</div></Pop>)}
        </div>
      )}
    </AbsoluteFill>
  );
};

const Card: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <AbsoluteFill style={{background: BG, alignItems: 'center', justifyContent: 'center'}}>
    <Pop>
      <div style={{width: 1500, height: 820, background: '#fff', borderRadius: 28, boxShadow: '0 40px 100px rgba(60,40,160,.18)', padding: 56, font: '500 30px Inter, sans-serif', color: '#222'}}>
        <div style={{font: '700 44px Inter, sans-serif', marginBottom: 32}}>{title}</div>
        {children}
      </div>
    </Pop>
  </AbsoluteFill>
);

const Board: React.FC = () => (
  <div>
    {rows.map((r, i) => (
      <Pop key={r} delay={i * 5}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '16px 0', borderBottom: '1px solid #eee'}}>
          <div style={{flex: 1}}>{r}</div>
          <div style={{width: 200, height: 40, borderRadius: 8, background: colors[i]}} />
          <div style={{width: 260, height: 14, borderRadius: 8, background: '#e6e6f5'}}>
            <div style={{width: `${40 + i * 10}%`, height: 14, borderRadius: 8, background: PURPLE}} />
          </div>
        </div>
      </Pop>
    ))}
  </div>
);

const Dash: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', gap: 40}}>
      <div style={{flex: 1, height: 560, borderRadius: 20, background: '#f4f1ff', display: 'flex', alignItems: 'flex-end', gap: 24, padding: 40}}>
        {[60, 90, 45, 120, 80].map((h, i) => (
          <div key={i} style={{flex: 1, background: PURPLE, borderRadius: 10, height: interpolate(f, [i * 4, i * 4 + 30], [0, h * 3], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})}} />
        ))}
      </div>
      <div style={{width: 420, display: 'grid', gap: 24}}>
        <div style={{background: '#e9fff4', borderRadius: 20, padding: 32, font: '800 80px Inter, sans-serif'}}>$0.6M</div>
        <div style={{background: '#fff4e5', borderRadius: 20, padding: 32, font: '800 80px Inter, sans-serif'}}>6 / 2 / 3</div>
      </div>
    </div>
  );
};

const Chat: React.FC<{q: string; a: string}> = ({q, a}) => (
  <div style={{display: 'grid', gap: 28, maxWidth: 900}}>
    <Pop><div style={{background: '#e8e6ff', borderRadius: 20, padding: 28}}>{q}</div></Pop>
    <Pop delay={25}><div style={{background: '#f4f4f8', borderRadius: 20, padding: 28}}>{a}</div></Pop>
  </div>
);

const Risk: React.FC = () => (
  <div>
    <div style={{font: '700 56px Inter, sans-serif', marginBottom: 28}}>Hi Jay, 16 of your 45 projects are at risk.</div>
    <div style={{height: 36, borderRadius: 18, background: 'linear-gradient(90deg,#e2445c,#fdab3d,#00c875)'}} />
    <div style={{display: 'flex', gap: 28, marginTop: 40}}>
      {['Delays from vendor', 'PM on vacation 2 weeks', 'Team behind schedule'].map((t, i) => (
        <Pop key={t} delay={i * 10}><div style={{width: 440, background: '#f7f7fb', borderRadius: 18, padding: 28}}>{t}</div></Pop>
      ))}
    </div>
  </div>
);

const Assign: React.FC = () => (
  <div style={{display: 'grid', gap: 24, width: 800}}>
    {[['Developer 1', 'Ann Berry'], ['Developer 2', 'Anthony Woodpecker']].map(([a, b], i) => (
      <Pop key={a} delay={i * 12}>
        <div style={{display: 'flex', justifyContent: 'space-between', background: '#f7f7fb', borderRadius: 16, padding: 28}}><span>{a}</span><span>to {b}</span></div>
      </Pop>
    ))}
    <Pop delay={30}><div style={{background: PURPLE, color: '#fff', borderRadius: 14, padding: '18px 40px', width: 160, textAlign: 'center'}}>Apply</div></Pop>
  </div>
);

const Logo: React.FC = () => (
  <AbsoluteFill style={{background: BG, alignItems: 'center', justifyContent: 'center', font: '800 150px Inter, sans-serif', color: '#2b2a6b'}}>
    <Pop>YourTool</Pop>
  </AbsoluteFill>
);

const End: React.FC = () => (
  <AbsoluteFill style={{background: PURPLE, alignItems: 'center', justifyContent: 'center', gap: 36, color: '#fff', font: '800 120px Inter, sans-serif'}}>
    <Pop>YourTool</Pop>
    <Pop delay={15}><div style={{font: '500 56px Inter, sans-serif'}}>The first work platform you'll <b>love</b> to use</div></Pop>
    <Pop delay={30}><div style={{font: '600 36px Inter, sans-serif', opacity: 0.85}}>Start free trial</div></Pop>
  </AbsoluteFill>
);

export const AdRecreate: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={S(4)}><Head text="TO BE HONEST" /></Sequence>
    <Sequence from={S(4)} durationInFrames={S(2)}><Logo /></Sequence>
    <Sequence from={S(6)} durationInFrames={S(3)}><Card title="Department strategic initiatives"><Board /></Card></Sequence>
    <Sequence from={S(9)} durationInFrames={S(3)}><Card title="Dashboard"><Dash /></Card></Sequence>
    <Sequence from={S(12)} durationInFrames={S(3)}><Head /></Sequence>
    <Sequence from={S(15)} durationInFrames={S(3)}><Card title="Weekly portfolio report"><Dash /></Card></Sequence>
    <Sequence from={S(18)} durationInFrames={S(6)}><Card title="Q4 Projects"><Chat q="Please collect all live Q4 projects into one board" a="Sure, I'm on it!" /></Card></Sequence>
    <Sequence from={S(24)} durationInFrames={S(5)}><Card title="OKR Portfolio"><Risk /></Card></Sequence>
    <Sequence from={S(29)} durationInFrames={S(3)}><Card title="Department strategic initiatives"><Board /></Card></Sequence>
    <Sequence from={S(32)} durationInFrames={S(4)}><Card title="Team assignment"><Assign /></Card></Sequence>
    <Sequence from={S(36)} durationInFrames={S(3)}><Head /></Sequence>
    <Sequence from={S(39)} durationInFrames={S(3)}><Card title="Q4 Projects"><Chat q="Hi Jay, how can I help?" a="Create a planning doc for this initiative" /></Card></Sequence>
    <Sequence from={S(42)} durationInFrames={S(4)}><End /></Sequence>
  </AbsoluteFill>
);

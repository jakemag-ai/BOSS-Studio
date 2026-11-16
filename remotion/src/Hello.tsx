import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Uses the BOSS style: warm off-white, near-black, orange-red accent.
export const Hello = ({title}: {title: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 9, stiffness: 120}});
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill
      style={{backgroundColor: '#FBFAF8', justifyContent: 'center', alignItems: 'center'}}
    >
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          fontWeight: 800,
          fontSize: 150,
          letterSpacing: -4,
          color: '#14110F',
          opacity,
          transform: `scale(${0.4 + pop * 0.6})`,
        }}
      >
        {title.split(' ')[0]} <span style={{color: '#DC2E0A'}}>{title.split(' ').slice(1).join(' ')}</span>
      </div>
    </AbsoluteFill>
  );
};

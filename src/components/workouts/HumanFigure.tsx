import { useMemo } from "react";
import type { JointPositions } from "./exerciseAnimationData";

interface HumanFigureProps {
  pose: JointPositions;
  prevPose?: JointPositions;
  progress: number; // 0 to 1 for interpolation
  accentColor?: string;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPoint(a: [number, number], b: [number, number], t: number): [number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}

function interpolatePose(a: JointPositions, b: JointPositions, t: number): JointPositions {
  const keys = Object.keys(a) as (keyof JointPositions)[];
  const result = {} as JointPositions;
  for (const key of keys) {
    result[key] = lerpPoint(a[key], b[key], t);
  }
  return result;
}

export const HumanFigure = ({ pose, prevPose, progress, accentColor = "hsl(199, 89%, 48%)" }: HumanFigureProps) => {
  const currentPose = useMemo(() => {
    if (!prevPose) return pose;
    // Smooth easing
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    return interpolatePose(prevPose, pose, eased);
  }, [pose, prevPose, progress]);

  const p = currentPose;

  // Build body parts with proper thickness
  return (
    <svg viewBox="0 0 100 96" className="w-full h-full" style={{ filter: `drop-shadow(0 0 8px ${accentColor}40)` }}>
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="limbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.5" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="50" cy="94" rx="20" ry="2" fill={accentColor} opacity="0.15" />

      {/* Body segments with rounded limbs */}
      <g filter="url(#glow)">
        {/* Torso */}
        <line x1={p.neck[0]} y1={p.neck[1]} x2={p.torsoMid[0]} y2={p.torsoMid[1]}
          stroke="url(#bodyGrad)" strokeWidth="5" strokeLinecap="round" />
        <line x1={p.torsoMid[0]} y1={p.torsoMid[1]} x2={(p.hipL[0] + p.hipR[0]) / 2} y2={(p.hipL[1] + p.hipR[1]) / 2}
          stroke="url(#bodyGrad)" strokeWidth="5" strokeLinecap="round" />

        {/* Shoulder bar */}
        <line x1={p.shoulderL[0]} y1={p.shoulderL[1]} x2={p.shoulderR[0]} y2={p.shoulderR[1]}
          stroke="url(#bodyGrad)" strokeWidth="4" strokeLinecap="round" />

        {/* Hip bar */}
        <line x1={p.hipL[0]} y1={p.hipL[1]} x2={p.hipR[0]} y2={p.hipR[1]}
          stroke="url(#bodyGrad)" strokeWidth="4" strokeLinecap="round" />

        {/* Left arm */}
        <line x1={p.shoulderL[0]} y1={p.shoulderL[1]} x2={p.elbowL[0]} y2={p.elbowL[1]}
          stroke="url(#limbGrad)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1={p.elbowL[0]} y1={p.elbowL[1]} x2={p.handL[0]} y2={p.handL[1]}
          stroke="url(#limbGrad)" strokeWidth="3" strokeLinecap="round" />

        {/* Right arm */}
        <line x1={p.shoulderR[0]} y1={p.shoulderR[1]} x2={p.elbowR[0]} y2={p.elbowR[1]}
          stroke="url(#limbGrad)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1={p.elbowR[0]} y1={p.elbowR[1]} x2={p.handR[0]} y2={p.handR[1]}
          stroke="url(#limbGrad)" strokeWidth="3" strokeLinecap="round" />

        {/* Left leg */}
        <line x1={p.hipL[0]} y1={p.hipL[1]} x2={p.kneeL[0]} y2={p.kneeL[1]}
          stroke="url(#limbGrad)" strokeWidth="4" strokeLinecap="round" />
        <line x1={p.kneeL[0]} y1={p.kneeL[1]} x2={p.footL[0]} y2={p.footL[1]}
          stroke="url(#limbGrad)" strokeWidth="3.5" strokeLinecap="round" />

        {/* Right leg */}
        <line x1={p.hipR[0]} y1={p.hipR[1]} x2={p.kneeR[0]} y2={p.kneeR[1]}
          stroke="url(#limbGrad)" strokeWidth="4" strokeLinecap="round" />
        <line x1={p.kneeR[0]} y1={p.kneeR[1]} x2={p.footR[0]} y2={p.footR[1]}
          stroke="url(#limbGrad)" strokeWidth="3.5" strokeLinecap="round" />

        {/* Joints */}
        {[p.shoulderL, p.shoulderR, p.elbowL, p.elbowR, p.hipL, p.hipR, p.kneeL, p.kneeR].map((joint, i) => (
          <circle key={i} cx={joint[0]} cy={joint[1]} r="2.2" fill={accentColor} opacity="0.7" />
        ))}

        {/* Hands */}
        <circle cx={p.handL[0]} cy={p.handL[1]} r="2.5" fill={accentColor} opacity="0.8" />
        <circle cx={p.handR[0]} cy={p.handR[1]} r="2.5" fill={accentColor} opacity="0.8" />

        {/* Feet */}
        <ellipse cx={p.footL[0]} cy={p.footL[1]} rx="3" ry="1.5" fill={accentColor} opacity="0.7" />
        <ellipse cx={p.footR[0]} cy={p.footR[1]} rx="3" ry="1.5" fill={accentColor} opacity="0.7" />

        {/* Head */}
        <circle cx={p.head[0]} cy={p.head[1]} r="6" fill="url(#bodyGrad)" />
        <circle cx={p.head[0]} cy={p.head[1]} r="6" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.5" />
      </g>
    </svg>
  );
};

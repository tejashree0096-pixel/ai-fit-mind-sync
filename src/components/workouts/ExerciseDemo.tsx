import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Gauge } from "lucide-react";

interface ExerciseDemoProps {
  exerciseName: string;
  muscle: string;
  isVisible: boolean;
}

// Animated stick-figure exercise demonstrations
const exerciseAnimations: Record<string, { frames: string[]; tips: string[] }> = {
  "Push-ups": {
    frames: [
      "M50,30 L50,55 L35,75 L30,95 M50,55 L65,75 L70,95 M50,30 L30,50 M50,30 L70,50", // up
      "M50,35 L50,58 L35,72 L32,90 M50,58 L65,72 L68,90 M50,35 L25,48 M50,35 L75,48", // mid
      "M50,40 L50,60 L35,70 L33,85 M50,60 L65,70 L67,85 M50,40 L20,45 M50,40 L80,45", // down
      "M50,35 L50,58 L35,72 L32,90 M50,58 L65,72 L68,90 M50,35 L25,48 M50,35 L75,48", // mid
    ],
    tips: ["Keep core tight", "Full range of motion", "Elbows at 45°"],
  },
  "Bodyweight Squats": {
    frames: [
      "M50,20 L50,45 L45,65 L45,90 M50,45 L55,65 L55,90 M50,35 L35,40 M50,35 L65,40", // standing
      "M50,25 L50,48 L42,62 L40,82 M50,48 L58,62 L60,82 M50,38 L33,43 M50,38 L67,43", // quarter
      "M50,30 L50,52 L38,60 L35,75 M50,52 L62,60 L65,75 M50,42 L30,47 M50,42 L70,47", // half
      "M50,35 L50,55 L35,58 L30,70 M50,55 L65,58 L70,70 M50,45 L28,50 M50,45 L72,50", // deep
      "M50,30 L50,52 L38,60 L35,75 M50,52 L62,60 L65,75 M50,42 L30,47 M50,42 L70,47", // half
      "M50,25 L50,48 L42,62 L40,82 M50,48 L58,62 L60,82 M50,38 L33,43 M50,38 L67,43", // quarter
    ],
    tips: ["Knees over toes", "Chest up", "Push through heels"],
  },
  "Plank Hold": {
    frames: [
      "M20,45 L50,45 L80,45 M20,45 L15,60 M80,45 L85,60 M50,45 L50,35 L45,30",
      "M20,44 L50,45 L80,46 M20,44 L15,59 M80,46 L85,61 M50,45 L50,35 L45,30",
    ],
    tips: ["Straight line from head to heels", "Engage core", "Don't sag hips"],
  },
  "Bench Press": {
    frames: [
      "M50,25 L50,50 L40,70 L40,90 M50,50 L60,70 L60,90 M50,35 L25,25 M50,35 L75,25", // top
      "M50,25 L50,50 L40,70 L40,90 M50,50 L60,70 L60,90 M50,35 L25,35 M50,35 L75,35", // mid
      "M50,25 L50,50 L40,70 L40,90 M50,50 L60,70 L60,90 M50,35 L25,42 M50,35 L75,42", // bottom
      "M50,25 L50,50 L40,70 L40,90 M50,50 L60,70 L60,90 M50,35 L25,35 M50,35 L75,35", // mid
    ],
    tips: ["Retract shoulder blades", "Feet flat on floor", "Control the descent"],
  },
};

const defaultAnimation = {
  frames: [
    "M50,20 L50,45 L45,65 L45,90 M50,45 L55,65 L55,90 M50,35 L35,30 M50,35 L65,30",
    "M50,20 L50,45 L45,65 L45,90 M50,45 L55,65 L55,90 M50,35 L32,35 M50,35 L68,35",
    "M50,20 L50,45 L45,65 L45,90 M50,45 L55,65 L55,90 M50,35 L35,30 M50,35 L65,30",
  ],
  tips: ["Focus on form", "Controlled movement", "Breathe steadily"],
};

export const ExerciseDemo = ({ exerciseName, muscle, isVisible }: ExerciseDemoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const animation = exerciseAnimations[exerciseName] || defaultAnimation;
  const frames = animation.frames;

  useEffect(() => {
    if (isPlaying && isVisible) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
      }, 800 / speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, frames.length, isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setIsPlaying(false);
      setCurrentFrame(0);
    }
  }, [isVisible]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReplay = () => { setCurrentFrame(0); setIsPlaying(true); };
  const toggleSpeed = () => setSpeed((prev) => (prev === 1 ? 0.5 : prev === 0.5 ? 2 : 1));

  if (!isVisible) return null;

  return (
    <div className="mt-4 rounded-xl bg-secondary/60 border border-border/50 p-4 animate-slide-up">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Animation viewport */}
        <div className="relative w-full sm:w-48 h-40 bg-background/60 rounded-lg border border-border/30 flex items-center justify-center overflow-hidden">
          {/* Neon ring */}
          <div className="absolute inset-2 rounded-lg border border-primary/20" />
          
          <svg viewBox="0 0 100 100" className="w-32 h-32">
            {/* Body */}
            <path
              d={frames[currentFrame]}
              stroke="hsl(199, 89%, 48%)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: `d ${600 / speed}ms ease-in-out` }}
            />
            {/* Head */}
            <circle
              cx="50"
              cy={parseInt(frames[currentFrame].match(/M(\d+),(\d+)/)?.[2] || "20") - 8}
              r="6"
              fill="none"
              stroke="hsl(199, 89%, 48%)"
              strokeWidth="2"
            />
          </svg>

          {/* Speed indicator */}
          <div className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground bg-card/80 px-1.5 py-0.5 rounded">
            {speed}x
          </div>
        </div>

        {/* Controls & tips */}
        <div className="flex-1 flex flex-col justify-between min-h-[120px]">
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-2">
              Form Tips — {muscle}
            </h4>
            <ul className="space-y-1">
              {animation.tips.map((tip, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              className="gap-1.5 h-8 text-xs border-border/60"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReplay}
              className="gap-1.5 h-8 text-xs border-border/60"
            >
              <RotateCcw className="w-3 h-3" />
              Replay
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSpeed}
              className="gap-1.5 h-8 text-xs border-border/60"
            >
              <Gauge className="w-3 h-3" />
              {speed === 0.5 ? "Slow" : speed === 1 ? "Normal" : "Fast"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

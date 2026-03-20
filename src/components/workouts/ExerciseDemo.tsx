import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { HumanFigure } from "./HumanFigure";
import { exerciseAnimationData, defaultAnimation, type ExerciseStep } from "./exerciseAnimationData";

interface ExerciseDemoProps {
  exerciseName: string;
  muscle: string;
  isVisible: boolean;
}

const SPEEDS = [
  { label: "0.5×", value: 0.5 },
  { label: "1×", value: 1 },
  { label: "1.5×", value: 1.5 },
  { label: "2×", value: 2 },
];

export const ExerciseDemo = ({ exerciseName, muscle, isVisible }: ExerciseDemoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [interpolationProgress, setInterpolationProgress] = useState(1);
  const [showStepView, setShowStepView] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const holdTimeRef = useRef<number>(0);

  const animation = exerciseAnimationData[exerciseName] || defaultAnimation;
  const steps = animation.steps;
  const speed = SPEEDS[speedIndex].value;

  const TRANSITION_DURATION = 800 / speed; // ms per transition
  const HOLD_DURATION = 400 / speed; // ms to hold at each pose

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;

    // During hold phase
    if (holdTimeRef.current > 0) {
      holdTimeRef.current -= delta;
      lastTimeRef.current = timestamp;
      if (holdTimeRef.current <= 0) {
        // Move to next step
        setCurrentStepIndex(prev => {
          const next = (prev + 1) % steps.length;
          return next;
        });
        setInterpolationProgress(0);
      }
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // During transition phase
    setInterpolationProgress(prev => {
      const newProgress = prev + delta / TRANSITION_DURATION;
      if (newProgress >= 1) {
        holdTimeRef.current = HOLD_DURATION;
        return 1;
      }
      return newProgress;
    });

    lastTimeRef.current = timestamp;
    animationRef.current = requestAnimationFrame(animate);
  }, [steps.length, TRANSITION_DURATION, HOLD_DURATION]);

  useEffect(() => {
    if (isPlaying && isVisible) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      stopAnimation();
    }
    return stopAnimation;
  }, [isPlaying, isVisible, animate, stopAnimation]);

  useEffect(() => {
    if (!isVisible) {
      setIsPlaying(false);
      setCurrentStepIndex(0);
      setInterpolationProgress(1);
      stopAnimation();
    }
  }, [isVisible, stopAnimation]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleReplay = () => {
    stopAnimation();
    setCurrentStepIndex(0);
    setInterpolationProgress(1);
    holdTimeRef.current = 0;
    lastTimeRef.current = 0;
    setIsPlaying(true);
  };

  const handleStepNav = (direction: -1 | 1) => {
    setIsPlaying(false);
    stopAnimation();
    setCurrentStepIndex(prev => {
      const next = prev + direction;
      if (next < 0) return steps.length - 1;
      if (next >= steps.length) return 0;
      return next;
    });
    setInterpolationProgress(1);
  };

  const handleSpeedCycle = () => {
    setSpeedIndex(prev => (prev + 1) % SPEEDS.length);
  };

  const handleStepClick = (index: number) => {
    setIsPlaying(false);
    stopAnimation();
    setCurrentStepIndex(index);
    setInterpolationProgress(1);
  };

  if (!isVisible) return null;

  const prevStepIndex = currentStepIndex === 0 ? steps.length - 1 : currentStepIndex - 1;
  const currentStep = steps[currentStepIndex];
  const prevStep = steps[prevStepIndex];

  return (
    <div className="border-t border-border/30 bg-secondary/40 animate-slide-up">
      <div className="p-4 sm:p-6">
        {/* Header with exercise info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-display font-bold text-sm text-foreground">Exercise Demo</h4>
            <div className="flex gap-2 mt-1">
              {animation.muscles.map((m, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold">
                  {m}
                </span>
              ))}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                animation.difficulty === "Beginner" ? "bg-accent/15 text-accent" :
                animation.difficulty === "Intermediate" ? "bg-yellow-500/15 text-yellow-400" :
                "bg-destructive/15 text-destructive"
              }`}>
                {animation.difficulty}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={() => setShowStepView(!showStepView)}
          >
            {showStepView ? "Animation" : "Steps"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Animation viewport */}
          <div className="relative w-full lg:w-64 h-56 bg-background/80 rounded-xl border border-border/40 overflow-hidden flex-shrink-0">
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Neon frame */}
            <div className="absolute inset-1.5 rounded-lg border border-primary/20" />

            {/* Figure */}
            <div className="relative z-10 flex items-center justify-center h-full p-4">
              <HumanFigure
                pose={currentStep.pose}
                prevPose={prevStep.pose}
                progress={interpolationProgress}
              />
            </div>

            {/* Speed badge */}
            <div className="absolute top-2 right-2 text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              {SPEEDS[speedIndex].label}
            </div>

            {/* Step counter */}
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground bg-card/80 px-2 py-0.5 rounded-md">
              {currentStepIndex + 1} / {steps.length}
            </div>
          </div>

          {/* Controls & info panel */}
          <div className="flex-1 flex flex-col justify-between min-h-[180px]">
            {showStepView ? (
              /* Step-by-step breakdown */
              <div className="space-y-1.5 mb-3 max-h-[140px] overflow-y-auto pr-1">
                {steps.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => handleStepClick(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-all duration-200 ${
                      i === currentStepIndex
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : i < currentStepIndex
                        ? "text-muted-foreground/70 bg-secondary/40"
                        : "text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="font-medium">{step.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              /* Current step + tips */
              <div className="mb-3">
                <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 mb-3">
                  <p className="text-xs font-semibold text-primary">
                    Step {currentStepIndex + 1}: {currentStep.label}
                  </p>
                </div>
                <h4 className="font-display font-semibold text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Form Tips
                </h4>
                <ul className="space-y-1">
                  {animation.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step progress bar */}
            <div className="mb-3">
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full flex-1 transition-all duration-300 cursor-pointer ${
                      i === currentStepIndex
                        ? "bg-primary"
                        : i < currentStepIndex
                        ? "bg-primary/40"
                        : "bg-muted"
                    }`}
                    onClick={() => handleStepClick(i)}
                  />
                ))}
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => handleStepNav(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="gradient"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => handleStepNav(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1 border-border/50 ml-1"
                onClick={handleReplay}
              >
                <RotateCcw className="w-3 h-3" />
                Replay
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1 border-border/50"
                onClick={handleSpeedCycle}
              >
                <Zap className="w-3 h-3" />
                {SPEEDS[speedIndex].label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

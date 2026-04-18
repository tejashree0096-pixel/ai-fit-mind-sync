import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap,
  Volume2, VolumeX, Mic, MicOff, Snail, Rabbit, Maximize2, Timer, Flame
} from "lucide-react";
import { ExerciseVideoPlayer } from "./ExerciseVideoPlayer";
import { exerciseAnimationData, defaultAnimation } from "./exerciseAnimationData";
import { voiceCoachingData, defaultVoiceCoaching } from "./voiceCoachingData";
import { useVoiceCoach } from "@/hooks/useVoiceCoach";
import { useDemoGender } from "@/hooks/useDemoGender";

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

type CoachingPace = "normal" | "slow";

export const ExerciseDemo = ({ exerciseName, muscle, isVisible }: ExerciseDemoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [interpolationProgress, setInterpolationProgress] = useState(1);
  const [showStepView, setShowStepView] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [coachingPace, setCoachingPace] = useState<CoachingPace>("normal");
  const [repCount, setRepCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [demoGender, setDemoGender] = useDemoGender();
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const holdTimeRef = useRef<number>(0);
  const lastSpokenStepRef = useRef<number>(-1);
  const hasSpokenIntroRef = useRef(false);
  const waitingForSpeechRef = useRef(false);
  const repCountRef = useRef(0);

  const animation = exerciseAnimationData[exerciseName] || defaultAnimation;
  const coaching = voiceCoachingData[exerciseName] || defaultVoiceCoaching;
  const steps = animation.steps;
  const speed = SPEEDS[speedIndex].value;

  const paceMultiplier = coachingPace === "slow" ? 1.8 : 1;

  const onSpeechEnd = useCallback(() => {
    waitingForSpeechRef.current = false;
  }, []);

  const { speak, speakStep, stop: stopVoice, isSpeaking, isSupported } = useVoiceCoach({
    enabled: voiceEnabled,
    volume: voiceVolume,
    rate: coachingPace === "slow" ? 0.6 : (speed > 1.5 ? 0.9 : 0.75),
    onSpeechEnd,
  });

  // Base durations scaled by pace
  const TRANSITION_DURATION = (1000 * paceMultiplier) / speed;
  const HOLD_DURATION = (800 * paceMultiplier) / speed;

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Speak the current step when it changes during playback
  useEffect(() => {
    if (!isPlaying || !voiceEnabled) return;
    if (currentStepIndex === lastSpokenStepRef.current) return;

    lastSpokenStepRef.current = currentStepIndex;

    // Track reps (when we cycle back to step 0)
    if (currentStepIndex === 0 && repCountRef.current > 0) {
      repCountRef.current += 1;
      setRepCount(repCountRef.current);
    } else if (currentStepIndex === 0 && repCountRef.current === 0) {
      repCountRef.current = 1;
      setRepCount(1);
    }

    const isFirstRep = repCountRef.current <= 1;
    const coachStep = coaching.steps[currentStepIndex % coaching.steps.length];

    if (coachStep) {
      if (isFirstRep) {
        // Full detailed guidance on first rep
        waitingForSpeechRef.current = true;

        // Include hold cue if present
        const instruction = coachStep.holdCue 
          ? `${coachStep.instruction} ${coachStep.holdCue}`
          : coachStep.instruction;
        
        speakStep(instruction, coachStep.muscleCue, coachStep.breathingCue);
      } else {
        // Short cues for subsequent reps
        const repCue = coaching.repCues[currentStepIndex % coaching.repCues.length];
        speakStep(repCue, undefined, undefined, true);
      }
    }

    // Add encouragement at halfway and near end of first rep
    if (isFirstRep) {
      const halfway = Math.floor(steps.length / 2);
      const nearEnd = steps.length - 1;
      if (currentStepIndex === halfway || currentStepIndex === nearEnd) {
        const encouragement = coaching.encouragement[Math.floor(Math.random() * coaching.encouragement.length)];
        speak(encouragement, false, 1000);
      }
    }
  }, [currentStepIndex, isPlaying, voiceEnabled, coaching, speakStep, speak, steps.length]);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;

    // If voice is speaking and we're in "wait for speech" mode, pause animation
    if (waitingForSpeechRef.current && voiceEnabled) {
      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    if (holdTimeRef.current > 0) {
      holdTimeRef.current -= delta;
      lastTimeRef.current = timestamp;
      if (holdTimeRef.current <= 0) {
        setCurrentStepIndex(prev => (prev + 1) % steps.length);
        setInterpolationProgress(0);
      }
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

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
  }, [steps.length, TRANSITION_DURATION, HOLD_DURATION, voiceEnabled]);

  useEffect(() => {
    if (isPlaying && isVisible) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      stopAnimation();
    }
    return stopAnimation;
  }, [isPlaying, isVisible, animate, stopAnimation]);

  // Timer — counts elapsed seconds while playing
  useEffect(() => {
    if (!isPlaying || !isVisible) return;
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setIsPlaying(false);
      setCurrentStepIndex(0);
      setInterpolationProgress(1);
      setRepCount(0);
      setElapsedSeconds(0);
      setIsFullscreen(false);
      repCountRef.current = 0;
      stopAnimation();
      stopVoice();
      lastSpokenStepRef.current = -1;
      hasSpokenIntroRef.current = false;
      waitingForSpeechRef.current = false;
    }
  }, [isVisible, stopAnimation, stopVoice]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      if (!hasSpokenIntroRef.current && voiceEnabled) {
        speak(coaching.intro, true, 2000);
        speak(coaching.muscleTarget, false, 1500);
        hasSpokenIntroRef.current = true;
        lastSpokenStepRef.current = -1;
        waitingForSpeechRef.current = true;
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      stopVoice();
      waitingForSpeechRef.current = false;
    }
  };

  const handleReplay = () => {
    stopAnimation();
    stopVoice();
    setCurrentStepIndex(0);
    setInterpolationProgress(1);
    setRepCount(0);
    setElapsedSeconds(0);
    repCountRef.current = 0;
    holdTimeRef.current = 0;
    lastTimeRef.current = 0;
    lastSpokenStepRef.current = -1;
    hasSpokenIntroRef.current = false;
    waitingForSpeechRef.current = false;
    setIsPlaying(true);

    if (voiceEnabled) {
      speak(coaching.intro, true, 2000);
      speak(coaching.muscleTarget, false, 1500);
      hasSpokenIntroRef.current = true;
      waitingForSpeechRef.current = true;
    }
  };

  const handleStepNav = (direction: -1 | 1) => {
    setIsPlaying(false);
    stopAnimation();
    stopVoice();
    waitingForSpeechRef.current = false;
    const newIndex = (() => {
      const next = currentStepIndex + direction;
      if (next < 0) return steps.length - 1;
      if (next >= steps.length) return 0;
      return next;
    })();
    setCurrentStepIndex(newIndex);
    setInterpolationProgress(1);

    if (voiceEnabled) {
      const coachStep = coaching.steps[newIndex % coaching.steps.length];
      if (coachStep) {
        const instruction = coachStep.holdCue 
          ? `${coachStep.instruction} ${coachStep.holdCue}`
          : coachStep.instruction;
        speakStep(instruction, coachStep.muscleCue, coachStep.breathingCue);
      }
    }
    lastSpokenStepRef.current = newIndex;
  };

  const handleSpeedCycle = () => {
    setSpeedIndex(prev => (prev + 1) % SPEEDS.length);
  };

  const handleStepClick = (index: number) => {
    setIsPlaying(false);
    stopAnimation();
    stopVoice();
    waitingForSpeechRef.current = false;
    setCurrentStepIndex(index);
    setInterpolationProgress(1);

    if (voiceEnabled) {
      const coachStep = coaching.steps[index % coaching.steps.length];
      if (coachStep) {
        const instruction = coachStep.holdCue 
          ? `${coachStep.instruction} ${coachStep.holdCue}`
          : coachStep.instruction;
        speakStep(instruction, coachStep.muscleCue, coachStep.breathingCue);
      }
    }
    lastSpokenStepRef.current = index;
  };

  const handleVoiceToggle = () => {
    if (voiceEnabled) {
      stopVoice();
      waitingForSpeechRef.current = false;
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handlePaceToggle = () => {
    setCoachingPace(prev => prev === "normal" ? "slow" : "normal");
  };

  if (!isVisible) return null;

  const prevStepIndex = currentStepIndex === 0 ? steps.length - 1 : currentStepIndex - 1;
  const currentStep = steps[currentStepIndex];
  const prevStep = steps[prevStepIndex];
  const currentCoachStep = coaching.steps[currentStepIndex % coaching.steps.length];

  return (
    <div className="border-t border-border/30 bg-secondary/40 animate-slide-up">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-display font-bold text-sm text-foreground">Exercise Demo</h4>
            <div className="flex flex-wrap gap-2 mt-1">
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
              {repCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-semibold">
                  Rep {repCount}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 gap-1"
              onClick={() => setShowStepView(!showStepView)}
            >
              {showStepView ? "Animation" : "Steps"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Animation viewport */}
          <div className="relative w-full lg:w-64 h-56 bg-background/80 rounded-xl border border-border/40 overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute inset-1.5 rounded-lg border border-primary/20" />
            <div className="relative z-10 flex items-center justify-center h-full p-2">
              <ExerciseVideoPlayer
                exerciseName={exerciseName}
                isPlaying={isPlaying}
                speed={speed}
                gender={demoGender}
              />
            </div>

            {/* Speaking indicator */}
            {isSpeaking && voiceEnabled && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-accent/20 border border-accent/30 rounded-md px-2 py-0.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="w-0.5 bg-accent rounded-full"
                      style={{
                        height: `${6 + Math.random() * 6}px`,
                        animation: `pulseGlow ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-semibold text-accent ml-0.5">Coach</span>
              </div>
            )}

            {/* Waiting indicator - animation paused for speech */}
            {waitingForSpeechRef.current && isPlaying && voiceEnabled && (
              <div className="absolute bottom-2 right-2 text-[9px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                Listening...
              </div>
            )}

            <div className="absolute top-2 right-2 text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              {SPEEDS[speedIndex].label}
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground bg-card/80 px-2 py-0.5 rounded-md">
              {currentStepIndex + 1} / {steps.length}
            </div>
          </div>

          {/* Controls & info panel */}
          <div className="flex-1 flex flex-col justify-between min-h-[180px]">
            {showStepView ? (
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
              <div className="mb-3 space-y-2">
                {/* Current step */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                  <p className="text-xs font-semibold text-primary">
                    Step {currentStepIndex + 1}: {currentStep.label}
                  </p>
                </div>

                {/* Voice coaching bubble */}
                {currentCoachStep && (
                  <div className="bg-accent/8 border border-accent/20 rounded-lg px-3 py-2 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <Volume2 className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-foreground/80 leading-relaxed">
                        {currentCoachStep.instruction}
                      </p>
                    </div>
                    {currentCoachStep.holdCue && (
                      <div className="flex items-start gap-2 pl-5">
                        <span className="text-[10px] text-accent/70 leading-relaxed italic">
                          ⏸ {currentCoachStep.holdCue}
                        </span>
                      </div>
                    )}
                    {currentCoachStep.muscleCue && (
                      <div className="flex items-start gap-2 pl-5">
                        <span className="text-[10px] text-accent/80 leading-relaxed">
                          💪 {currentCoachStep.muscleCue}
                        </span>
                      </div>
                    )}
                    {currentCoachStep.breathingCue && (
                      <div className="flex items-start gap-2 pl-5">
                        <span className="text-[10px] text-muted-foreground leading-relaxed">
                          🫁 {currentCoachStep.breathingCue}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Form tips */}
                <ul className="space-y-0.5">
                  {animation.tips.map((tip, i) => (
                    <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0 mt-1" />
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
                      i === currentStepIndex ? "bg-primary" : i < currentStepIndex ? "bg-primary/40" : "bg-muted"
                    }`}
                    onClick={() => handleStepClick(i)}
                  />
                ))}
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => handleStepNav(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="gradient" size="icon" className="rounded-full h-10 w-10" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => handleStepNav(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" className="h-8 text-xs gap-1 border-border/50 ml-1" onClick={handleReplay}>
                <RotateCcw className="w-3 h-3" /> Replay
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1 border-border/50" onClick={handleSpeedCycle}>
                <Zap className="w-3 h-3" /> {SPEEDS[speedIndex].label}
              </Button>

              {/* Voice controls */}
              <div className="flex items-center gap-1.5 ml-auto">
                {isSupported && (
                  <>
                    {/* Coaching pace toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 text-xs gap-1 border-border/50 ${coachingPace === "slow" ? "bg-accent/15 border-accent/30 text-accent" : ""}`}
                      onClick={handlePaceToggle}
                      title={coachingPace === "slow" ? "Switch to normal pace" : "Switch to slow coaching mode"}
                    >
                      {coachingPace === "slow" ? <Snail className="w-3 h-3" /> : <Rabbit className="w-3 h-3" />}
                      {coachingPace === "slow" ? "Slow" : "Normal"}
                    </Button>

                    <Button
                      variant={voiceEnabled ? "default" : "outline"}
                      size="icon"
                      className={`rounded-full h-8 w-8 ${voiceEnabled ? "bg-accent hover:bg-accent/90" : "border-border/50"}`}
                      onClick={handleVoiceToggle}
                      title={voiceEnabled ? "Turn off voice coach" : "Turn on voice coach"}
                    >
                      {voiceEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                    </Button>
                    {voiceEnabled && (
                      <div className="flex items-center gap-1.5 w-20">
                        <VolumeX className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <Slider
                          value={[voiceVolume * 100]}
                          onValueChange={([val]) => setVoiceVolume(val / 100)}
                          max={100}
                          step={5}
                          className="flex-1"
                        />
                        <Volume2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

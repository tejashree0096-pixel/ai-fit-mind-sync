import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

interface BreathingSessionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  durationSeconds?: number;
}

type Phase = "inhale" | "hold" | "exhale";

const PHASE_DURATIONS: Record<Phase, number> = {
  inhale: 4,
  hold: 4,
  exhale: 6,
};

const PHASE_LABEL: Record<Phase, string> = {
  inhale: "Breathe In",
  hold: "Hold",
  exhale: "Breathe Out",
};

const PHASE_ORDER: Phase[] = ["inhale", "hold", "exhale"];

export function BreathingSession({ open, onOpenChange, durationSeconds = 120 }: BreathingSessionProps) {
  const [running, setRunning] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const phase = PHASE_ORDER[phaseIndex];
  const phaseDur = PHASE_DURATIONS[phase];
  const phaseProgress = phaseElapsed / phaseDur;
  const remaining = Math.max(0, durationSeconds - elapsed);
  const finished = elapsed >= durationSeconds;

  // reset on open
  useEffect(() => {
    if (open) {
      setRunning(true);
      setElapsed(0);
      setPhaseIndex(0);
      setPhaseElapsed(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !running || finished) return;
    intervalRef.current = window.setInterval(() => {
      setElapsed((e) => e + 0.1);
      setPhaseElapsed((p) => {
        const next = p + 0.1;
        if (next >= PHASE_DURATIONS[PHASE_ORDER[phaseIndex]]) {
          setPhaseIndex((i) => (i + 1) % PHASE_ORDER.length);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [open, running, finished, phaseIndex]);

  // Circle scale: inhale grows, hold stays large, exhale shrinks
  const scale =
    phase === "inhale"
      ? 0.5 + 0.5 * phaseProgress
      : phase === "hold"
      ? 1
      : 1 - 0.5 * phaseProgress;

  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60).toString().padStart(2, "0");

  const reset = () => {
    setElapsed(0);
    setPhaseIndex(0);
    setPhaseElapsed(0);
    setRunning(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Guided Breathing Session</DialogTitle>
          <DialogDescription>
            {finished
              ? "Session complete. Notice how you feel."
              : "Follow the circle. Inhale 4s · Hold 4s · Exhale 6s."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <div
              className="absolute rounded-full bg-gradient-to-br from-teal-500/40 to-blue-500/40 blur-xl transition-transform duration-100"
              style={{ width: "100%", height: "100%", transform: `scale(${scale})` }}
            />
            <div
              className="rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center transition-transform duration-100"
              style={{ width: "70%", height: "70%", transform: `scale(${scale})` }}
            >
              <span className="text-white font-display font-semibold text-xl">
                {finished ? "Done" : PHASE_LABEL[phase]}
              </span>
            </div>
          </div>

          <div className="mt-6 text-3xl font-display font-bold tabular-nums">
            {mins}:{secs}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {finished ? "Great job 🌿" : `${PHASE_LABEL[phase]} · ${Math.ceil(phaseDur - phaseElapsed)}s`}
          </div>

          <div className="flex gap-3 mt-6">
            {!finished && (
              <Button
                variant="outline"
                onClick={() => setRunning((r) => !r)}
                className="gap-2"
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? "Pause" : "Resume"}
              </Button>
            )}
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
            <Button onClick={() => onOpenChange(false)} className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
              {finished ? "Close" : "End"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

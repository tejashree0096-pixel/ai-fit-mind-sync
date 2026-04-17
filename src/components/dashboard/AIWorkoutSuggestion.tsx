import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Flame, Dumbbell, Activity, ArrowRight } from "lucide-react";

interface Props {
  currentWeight: number | null;
  goalWeight: number | null;
}

export const AIWorkoutSuggestion = ({ currentWeight, goalWeight }: Props) => {
  if (!currentWeight || !goalWeight) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg">AI Workout Plan</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Set your current and goal weight to unlock a personalized AI workout recommendation.
        </p>
      </div>
    );
  }

  const diff = currentWeight - goalWeight;
  const mode = Math.abs(diff) < 0.5 ? "maintenance" : diff > 0 ? "fat-loss" : "muscle-gain";

  const plans = {
    "fat-loss": {
      title: "Fat Loss Protocol",
      icon: Flame,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      intensity: "High",
      focus: "HIIT + Cardio + Compound lifts",
      sessions: "5x / week",
      duration: "40-50 min",
      blocks: [
        { name: "Warm-up", detail: "5 min dynamic stretching" },
        { name: "HIIT Cardio", detail: "20 min — sprint intervals 30s on / 30s off" },
        { name: "Compound Strength", detail: "Squats, Push-ups, Rows — 3×12" },
        { name: "Core Finisher", detail: "Plank + Mountain climbers — 3 rounds" },
      ],
      reason: `You're ${Math.abs(diff).toFixed(1)} kg above your goal. High-intensity workouts maximize calorie burn while preserving muscle.`,
    },
    "muscle-gain": {
      title: "Hypertrophy Builder",
      icon: Dumbbell,
      gradient: "from-cyan-500 via-blue-500 to-violet-500",
      intensity: "Moderate-High",
      focus: "Progressive overload + Volume",
      sessions: "4x / week (split)",
      duration: "50-60 min",
      blocks: [
        { name: "Warm-up", detail: "5 min activation drills" },
        { name: "Heavy Compound", detail: "Squat / Bench / Deadlift — 4×6-8" },
        { name: "Accessory Volume", detail: "Isolation lifts — 3×10-12" },
        { name: "Cool-down", detail: "5 min static stretching" },
      ],
      reason: `You're ${Math.abs(diff).toFixed(1)} kg below your goal. Progressive overload with controlled volume drives lean mass gain.`,
    },
    maintenance: {
      title: "Maintain & Optimize",
      icon: Activity,
      gradient: "from-green-500 via-teal-500 to-cyan-500",
      intensity: "Moderate",
      focus: "Functional + Mobility",
      sessions: "4x / week",
      duration: "35-45 min",
      blocks: [
        { name: "Warm-up", detail: "5 min mobility flow" },
        { name: "Full-body Strength", detail: "Mixed lifts — 3×10" },
        { name: "Steady Cardio", detail: "20 min Zone 2" },
        { name: "Mobility", detail: "Foam roll + stretch — 5 min" },
      ],
      reason: `You're at your goal weight. Balanced workouts preserve composition and improve longevity.`,
    },
  };

  const plan = plans[mode];
  const Icon = plan.icon;

  return (
    <div className="glass-card-elevated p-6 rounded-2xl relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${plan.gradient} opacity-10 blur-3xl rounded-full -mr-20 -mt-20`} />

      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${plan.gradient}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-lg">{plan.title}</h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{plan.focus}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 relative">
        <div className="p-2 rounded-lg bg-secondary/40 text-center">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Intensity</div>
          <div className="text-xs font-semibold mt-0.5">{plan.intensity}</div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/40 text-center">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Sessions</div>
          <div className="text-xs font-semibold mt-0.5">{plan.sessions}</div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/40 text-center">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Duration</div>
          <div className="text-xs font-semibold mt-0.5">{plan.duration}</div>
        </div>
      </div>

      <div className="space-y-2 mb-4 relative">
        {plan.blocks.map((b, i) => (
          <div key={i} className="flex gap-3 p-2.5 rounded-lg bg-secondary/30">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {i + 1}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">{b.name}</div>
              <div className="text-xs text-muted-foreground truncate">{b.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4 relative">
        <div className="flex gap-2">
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-primary mb-0.5">Why AI suggested this</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{plan.reason}</p>
          </div>
        </div>
      </div>

      <Link to="/workouts">
        <Button variant="gradient" className="w-full gap-2">
          Start Today's Workout
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

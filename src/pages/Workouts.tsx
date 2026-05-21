import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dumbbell, Home, Building2, Clock, Flame, ChevronRight,
  Play, RefreshCw, Sparkles, Pause, CheckCircle2, Eye, EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { ExerciseDemo } from "@/components/workouts/ExerciseDemo";

type WorkoutType = "home" | "gym";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  muscle: string;
  emoji: string;
}

const homeWorkouts: Exercise[] = [
  { name: "Push-ups", sets: 3, reps: "12-15", rest: "60s", muscle: "Chest", emoji: "💪" },
  { name: "Bodyweight Squats", sets: 4, reps: "15-20", rest: "45s", muscle: "Legs", emoji: "🦵" },
  { name: "Plank Hold", sets: 3, reps: "30-45s", rest: "30s", muscle: "Core", emoji: "🧘" },
  { name: "Lunges", sets: 3, reps: "10 each", rest: "60s", muscle: "Legs", emoji: "🏃" },
  { name: "Mountain Climbers", sets: 3, reps: "20", rest: "45s", muscle: "Full Body", emoji: "⛰️" },
  { name: "Burpees", sets: 3, reps: "8-10", rest: "90s", muscle: "Full Body", emoji: "🔥" },
];

const gymWorkouts: Exercise[] = [
  { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s", muscle: "Chest", emoji: "🏋️" },
  { name: "Lat Pulldown", sets: 4, reps: "10-12", rest: "60s", muscle: "Back", emoji: "💪" },
  { name: "Leg Press", sets: 4, reps: "12-15", rest: "90s", muscle: "Legs", emoji: "🦵" },
  { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", rest: "60s", muscle: "Shoulders", emoji: "🎯" },
  { name: "Cable Tricep Pushdown", sets: 3, reps: "12-15", rest: "45s", muscle: "Arms", emoji: "💪" },
  { name: "Barbell Curl", sets: 3, reps: "10-12", rest: "45s", muscle: "Arms", emoji: "🏆" },
];

const Workouts = () => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>("home");
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [expandedDemo, setExpandedDemo] = useState<number | null>(null);
  const [regenSeed, setRegenSeed] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSavingWorkout, setIsSavingWorkout] = useState(false);

  const baseExercises = workoutType === "home" ? homeWorkouts : gymWorkouts;
  const exercises = (() => {
    if (regenSeed === 0) return baseExercises;
    // Deterministic shuffle based on seed
    const arr = [...baseExercises];
    let s = regenSeed;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  })();

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setIsWorkoutActive(false);
    setCompletedExercises([]);
    setCurrentExerciseIndex(0);
    setExpandedDemo(null);
    setTimeout(() => {
      setRegenSeed(Date.now());
      setIsRegenerating(false);
      toast.success("✨ New AI workout generated!");
    }, 600);
  };

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setCurrentExerciseIndex(0);
    setCompletedExercises([]);
    setExpandedDemo(0);
    toast.success("Workout started! Let's go! 💪");
  };

  const handlePauseWorkout = () => {
    setIsWorkoutActive(false);
    toast.info("Workout paused");
  };

  const saveCompletedWorkout = async (completedList: number[]) => {
    setIsSavingWorkout(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsSavingWorkout(false);
      return;
    }

    const durationMinutes = 45;
    const caloriesBurned = workoutType === "gym" ? 420 : 350;
    const today = new Date().toISOString().split("T")[0];
    const completedWorkout = {
      user_id: user.id,
      workout_name: `${workoutType === "home" ? "Home" : "Gym"} Strength Session`,
      workout_type: workoutType,
      workout_date: today,
      duration_minutes: durationMinutes,
      calories_burned: caloriesBurned,
      exercises: exercises.map((exercise, exerciseIndex) => ({
        ...exercise,
        completed: completedList.includes(exerciseIndex),
      })),
    };

    const { error: workoutError } = await supabase.from("workout_history").insert(completedWorkout);
    const { data: activity } = await supabase
      .from("activity_logs")
      .select("id, calories_burned, active_minutes")
      .eq("user_id", user.id)
      .eq("log_date", today)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const activityPayload = {
      user_id: user.id,
      log_date: today,
      calories_burned: (activity?.calories_burned ?? 0) + caloriesBurned,
      active_minutes: (activity?.active_minutes ?? 0) + durationMinutes,
    };
    const { error: activityError } = activity
      ? await supabase.from("activity_logs").update(activityPayload).eq("id", activity.id)
      : await supabase.from("activity_logs").insert(activityPayload);

    setIsSavingWorkout(false);
    if (workoutError || activityError) {
      toast.error("Workout completed, but progress could not be saved");
    } else {
      toast.success("🎉 Workout saved to Progress!");
    }
  };

  const handleCompleteExercise = (index: number) => {
    if (!completedExercises.includes(index)) {
      const updated = [...completedExercises, index];
      setCompletedExercises(updated);
      if (index < exercises.length - 1) {
        setCurrentExerciseIndex(index + 1);
        setExpandedDemo(index + 1);
        toast.success(`${exercises[index].name} completed! Next: ${exercises[index + 1].name}`);
      } else {
        setIsWorkoutActive(false);
        setExpandedDemo(null);
        saveCompletedWorkout(updated);
      }
    }
  };

  const toggleDemo = (index: number) => {
    setExpandedDemo(expandedDemo === index ? null : index);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-2 tracking-tight">
              Today's <span className="gradient-text">Workout</span>
            </h1>
            <p className="text-muted-foreground">
              AI-generated workout with real-time exercise demos
            </p>
          </div>
          <Button variant="gradient" className="gap-2" onClick={handleRegenerate} disabled={isRegenerating}>
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`} />
            {isRegenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>

        {/* Type Toggle */}
        <div className="glass-card p-1.5 rounded-xl inline-flex gap-1.5 mb-8">
          <button
            onClick={() => { setWorkoutType("home"); setCompletedExercises([]); setIsWorkoutActive(false); setExpandedDemo(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
              workoutType === "home"
                ? "bg-primary text-primary-foreground neon-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => { setWorkoutType("gym"); setCompletedExercises([]); setIsWorkoutActive(false); setExpandedDemo(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
              workoutType === "gym"
                ? "bg-primary text-primary-foreground neon-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Gym
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Dumbbell, value: exercises.length, label: "Exercises", color: "text-primary" },
            { icon: Clock, value: "45", label: "Minutes", color: "text-accent" },
            { icon: Flame, value: "~350", label: "Calories", color: "text-destructive" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-xl text-center neon-border">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1.5`} />
              <div className="font-display font-bold text-xl tabular-nums">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* AI Note */}
        <div className="glass-card p-4 rounded-xl mb-8 border-l-2 border-l-primary">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">AI Suggestion</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tap the eye icon on any exercise to see the animated demo. During active workout mode, 
                demos auto-open for the current exercise so you can follow along.
              </p>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-3">
          {exercises.map((exercise, index) => {
            const isCompleted = completedExercises.includes(index);
            const isCurrent = isWorkoutActive && currentExerciseIndex === index;
            const isDemoOpen = expandedDemo === index;
            
            return (
              <div
                key={`${workoutType}-${index}`}
                className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${
                  isCurrent ? "ring-1 ring-primary/60 neon-glow" : ""
                } ${isCompleted ? "opacity-50" : ""}`}
              >
                <div className="p-4 flex items-center gap-3">
                  {/* Emoji / check */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    isCompleted ? "bg-accent/20" : "bg-secondary"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6 text-accent" /> : exercise.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-display font-semibold text-base ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                      {exercise.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span>{exercise.sets} sets</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>{exercise.reps} reps</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>{exercise.rest} rest</span>
                    </div>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                      {exercise.muscle}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-9 w-9"
                      onClick={() => toggleDemo(index)}
                    >
                      {isDemoOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {isWorkoutActive && !isCompleted ? (
                      <Button 
                        variant="gradient" 
                        size="icon" 
                        className="rounded-full h-9 w-9"
                        onClick={() => handleCompleteExercise(index)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-9 w-9 text-primary"
                        onClick={() => { toggleDemo(index); }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Demo panel */}
                <ExerciseDemo
                  exerciseName={exercise.name}
                  muscle={exercise.muscle}
                  isVisible={isDemoOpen}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom action */}
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40 md:relative md:mt-8 md:px-0">
          {isWorkoutActive ? (
            <Button 
              variant="outline" 
              size="xl" 
              className="w-full gap-2 border-border/60"
              onClick={handlePauseWorkout}
            >
              <Pause className="w-5 h-5" />
              Pause Workout
            </Button>
          ) : (
            <Button 
              variant="gradient" 
              size="xl" 
              className="w-full gap-2"
              onClick={handleStartWorkout}
            >
              <Play className="w-5 h-5" />
              {completedExercises.length > 0 ? "Resume Workout" : "Start Workout"}
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Workouts;

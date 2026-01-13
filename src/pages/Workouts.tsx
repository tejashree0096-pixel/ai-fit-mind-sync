import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  Home, 
  Building2, 
  Clock, 
  Flame, 
  ChevronRight,
  Play,
  RefreshCw,
  Info,
  Sparkles,
  Pause,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
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
  const exercises = workoutType === "home" ? homeWorkouts : gymWorkouts;

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setCurrentExerciseIndex(0);
    setCompletedExercises([]);
    toast.success("Workout started! Let's go! 💪");
  };

  const handlePauseWorkout = () => {
    setIsWorkoutActive(false);
    toast.info("Workout paused");
  };

  const handleCompleteExercise = (index: number) => {
    if (!completedExercises.includes(index)) {
      setCompletedExercises([...completedExercises, index]);
      if (index < exercises.length - 1) {
        setCurrentExerciseIndex(index + 1);
        toast.success(`${exercises[index].name} completed! Next up: ${exercises[index + 1].name}`);
      } else {
        toast.success("🎉 Workout Complete! Great job!");
        setIsWorkoutActive(false);
      }
    }
  };
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
              Today's Workout
            </h1>
            <p className="text-muted-foreground">
              AI-generated workout based on your profile and goals
            </p>
          </div>
          <Button variant="gradient" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Regenerate Workout
          </Button>
        </div>

        {/* Workout Type Toggle */}
        <div className="glass-card p-2 rounded-2xl inline-flex gap-2 mb-8">
          <button
            onClick={() => setWorkoutType("home")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              workoutType === "home"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="w-5 h-5" />
            Home Workout
          </button>
          <button
            onClick={() => setWorkoutType("gym")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              workoutType === "gym"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="w-5 h-5" />
            Gym Workout
          </button>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5 rounded-2xl text-center">
            <Dumbbell className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="font-display font-bold text-2xl">{exercises.length}</div>
            <div className="text-sm text-muted-foreground">Exercises</div>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center">
            <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="font-display font-bold text-2xl">45</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center">
            <Flame className="w-6 h-6 text-destructive mx-auto mb-2" />
            <div className="font-display font-bold text-2xl">~350</div>
            <div className="text-sm text-muted-foreground">Calories</div>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="glass-card p-5 rounded-2xl mb-8 border-l-4 border-l-primary">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Why AI Suggested This Workout</h3>
              <p className="text-sm text-muted-foreground">
                Based on your goal (muscle gain) and intermediate experience level, this workout 
                focuses on compound movements for maximum muscle activation. The rest periods are 
                optimized for hypertrophy, and exercise order prevents muscle fatigue interference.
              </p>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => {
            const isCompleted = completedExercises.includes(index);
            const isCurrent = isWorkoutActive && currentExerciseIndex === index;
            
            return (
              <div
                key={index}
                className={`glass-card p-5 rounded-2xl group hover:-translate-y-1 transition-all duration-300 ${
                  isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                } ${isCompleted ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-4">
                  {/* Exercise Number & Emoji */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                    isCompleted ? "bg-green-500/20" : "bg-secondary"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : exercise.emoji}
                  </div>

                  {/* Exercise Info */}
                  <div className="flex-1">
                    <h3 className={`font-display font-semibold text-lg ${isCompleted ? "line-through" : ""}`}>
                      {exercise.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{exercise.sets} sets</span>
                      <span>•</span>
                      <span>{exercise.reps} reps</span>
                      <span>•</span>
                      <span>{exercise.rest} rest</span>
                    </div>
                    <span className="inline-block mt-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {exercise.muscle}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Info className="w-5 h-5" />
                    </Button>
                    {isWorkoutActive && !isCompleted ? (
                      <Button 
                        variant="gradient" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => handleCompleteExercise(index)}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </Button>
                    ) : (
                      <Button variant="gradient" size="icon" className="rounded-full">
                        <Play className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start/Pause Workout Button */}
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40 md:relative md:mt-8 md:px-0">
          {isWorkoutActive ? (
            <Button 
              variant="outline" 
              size="xl" 
              className="w-full gap-2"
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

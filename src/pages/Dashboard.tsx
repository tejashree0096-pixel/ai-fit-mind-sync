import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ActivityTracker } from "@/components/dashboard/ActivityTracker";
import { ReminderManager } from "@/components/dashboard/ReminderManager";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dumbbell, Apple, Brain, TrendingUp, ArrowRight, Sparkles, Calendar
} from "lucide-react";

interface UserProfile {
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessGoal: string;
  foodPreference: string;
  workoutExperience: string;
  workoutTime: string;
  stressLevel: number;
  sleepQuality: number;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [nutritionCount, setNutritionCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) setProfile(JSON.parse(stored));

    const fetchCounts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { count: wc } = await supabase.from("workout_history").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      const { count: nc } = await supabase.from("nutrition_logs").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setWorkoutCount(wc || 0);
      setNutritionCount(nc || 0);
    };
    fetchCounts();
  }, []);

  const goalLabels: Record<string, string> = {
    "fat-loss": "Fat Loss",
    "muscle-gain": "Muscle Gain",
    "endurance": "Endurance",
    "flexibility": "Flexibility",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Your AI coach is ready. Let's crush your goals today!</p>
        </div>

        {/* Profile Summary */}
        {profile && (
          <div className="glass-card p-6 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {profile.gender === "Male" ? "👨" : profile.gender === "Female" ? "👩" : "🧑"}
                </div>
                <div>
                  <div className="font-display font-semibold text-lg">Your Profile</div>
                  <div className="text-sm text-muted-foreground">
                    {profile.age} years • {profile.height}cm • {profile.weight}kg
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {goalLabels[profile.fitnessGoal]}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      {workoutCount} workouts
                    </span>
                  </div>
                </div>
              </div>
              <Link to="/onboarding">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Activity Tracker + Reminders */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ActivityTracker />
          <ReminderManager />
        </div>

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/workouts" className="block">
            <div className="glass-card-elevated p-6 rounded-2xl h-full group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_40px_hsl(187_100%_50%/0.2)]">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Today's Workout</h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI-generated workout with real-time voice coaching and demos.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">{workoutCount} completed</span>
              </div>
            </div>
          </Link>

          <Link to="/nutrition" className="block">
            <div className="glass-card-elevated p-6 rounded-2xl h-full group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_40px_hsl(35_100%_55%/0.2)]">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-red-500">
                  <Apple className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-400 transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Nutrition Scanner</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Log meals, track macros, and get AI-powered meal suggestions.
              </p>
              <span className="px-2 py-1 rounded-full bg-orange-400/10 text-orange-400 text-xs font-medium">
                {nutritionCount} meals logged
              </span>
            </div>
          </Link>

          <Link to="/coach" className="block">
            <div className="glass-card-elevated p-6 rounded-2xl h-full group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_40px_hsl(280_100%_65%/0.2)]">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-400 to-pink-500">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-violet-400 transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">AI Coach</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with your AI coach — voice input, streaming responses, personalized plans.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-violet-400 font-medium">Powered by AI</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Progress Link */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg">Your Progress</h3>
              <p className="text-sm text-muted-foreground">View detailed analytics and AI insights</p>
            </div>
            <Link to="/progress">
              <Button variant="outline" size="sm" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

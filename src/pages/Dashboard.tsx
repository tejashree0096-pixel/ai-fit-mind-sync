import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ActivityTracker } from "@/components/dashboard/ActivityTracker";
import { ReminderManager } from "@/components/dashboard/ReminderManager";
import { WeightTracker } from "@/components/dashboard/WeightTracker";
import { AIWorkoutSuggestion } from "@/components/dashboard/AIWorkoutSuggestion";
import { supabase } from "@/integrations/supabase/client";
import {
  Dumbbell, Apple, Brain, TrendingUp, ArrowRight, Sparkles, Calendar
} from "lucide-react";

const Dashboard = () => {
  const [displayName, setDisplayName] = useState<string>("there");
  const [weightInfo, setWeightInfo] = useState<{ weight: number | null; goal_weight: number | null }>({ weight: null, goal_weight: null });
  const [workoutCount, setWorkoutCount] = useState(0);
  const [nutritionCount, setNutritionCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: profile }, { count: wc }, { count: nc }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
        supabase.from("workout_history").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("nutrition_logs").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      const name = profile?.full_name
        || (user.user_metadata as any)?.full_name
        || user.email?.split("@")[0]
        || "there";
      setDisplayName(name);
      setWorkoutCount(wc || 0);
      setNutritionCount(nc || 0);
    })();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            {greeting}, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{displayName}</span> 👋
          </h1>
          <p className="text-muted-foreground">Welcome back. Your AI coach is ready — let's crush your goals today.</p>
        </div>

        {/* Weight + AI Workout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <WeightTracker onUpdate={(d) => setWeightInfo({ weight: d.weight, goal_weight: d.goal_weight })} />
          <AIWorkoutSuggestion currentWeight={weightInfo.weight} goalWeight={weightInfo.goal_weight} />
        </div>

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

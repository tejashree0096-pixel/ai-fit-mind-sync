import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { 
  TrendingUp, TrendingDown, Scale, Dumbbell, Apple, Target,
  Award, Flame, Sparkles, Calendar, BarChart3
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from "recharts";

const Progress = () => {
  const { weeklyData } = useActivityTracker();
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [nutritionHistory, setNutritionHistory] = useState<any[]>([]);
  const [profileWeight, setProfileWeight] = useState<number>(75);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch workout history
      const { data: workouts } = await supabase
        .from("workout_history")
        .select("*")
        .eq("user_id", user.id)
        .order("workout_date", { ascending: true })
        .limit(30);
      if (workouts) setWorkoutHistory(workouts);

      // Fetch nutrition history
      const { data: nutrition } = await supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("log_date", { ascending: true })
        .limit(30);
      if (nutrition) setNutritionHistory(nutrition);

      // Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("weight")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile?.weight) setProfileWeight(Number(profile.weight));
    };
    fetchData();
  }, []);

  // Compute stats
  const totalWorkouts = workoutHistory.length;
  const totalCalories = weeklyData.reduce((sum, d) => sum + d.calories_burned, 0);
  const avgSteps = weeklyData.length > 0 ? Math.round(weeklyData.reduce((s, d) => s + d.steps, 0) / weeklyData.length) : 0;
  const streak = weeklyData.filter(d => d.active_minutes > 0).length;

  // Charts data
  const activityChartData = weeklyData.map(d => ({
    date: new Date(d.log_date).toLocaleDateString("en", { weekday: "short" }),
    steps: d.steps,
    calories: d.calories_burned,
    active: d.active_minutes,
  }));

  const workoutChartData = (() => {
    const byDate: Record<string, number> = {};
    workoutHistory.forEach(w => {
      const d = new Date(w.workout_date).toLocaleDateString("en", { month: "short", day: "numeric" });
      byDate[d] = (byDate[d] || 0) + (w.duration_minutes || 0);
    });
    return Object.entries(byDate).map(([date, minutes]) => ({ date, minutes }));
  })();

  const nutritionChartData = (() => {
    const byDate: Record<string, { calories: number; protein: number; count: number }> = {};
    nutritionHistory.forEach(n => {
      const d = new Date(n.log_date).toLocaleDateString("en", { month: "short", day: "numeric" });
      if (!byDate[d]) byDate[d] = { calories: 0, protein: 0, count: 0 };
      byDate[d].calories += n.calories || 0;
      byDate[d].protein += Number(n.protein) || 0;
      byDate[d].count++;
    });
    return Object.entries(byDate).map(([date, v]) => ({ date, ...v }));
  })();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            Progress Analytics
          </h1>
          <p className="text-muted-foreground">AI-powered insights from your real data</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Dumbbell, label: "Workouts", value: totalWorkouts.toString(), trend: "up", color: "text-cyan-400" },
            { icon: Flame, label: "Calories Burned", value: totalCalories.toLocaleString(), trend: "up", color: "text-orange-400" },
            { icon: Target, label: "Avg Steps", value: avgSteps.toLocaleString(), trend: "up", color: "text-emerald-400" },
            { icon: Award, label: "Active Days", value: `${streak}/7`, trend: "up", color: "text-violet-400" },
          ].map((stat, index) => (
            <div key={index} className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color.replace("text-", "bg-")}/10`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="font-display font-bold text-2xl mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Activity Chart */}
        {activityChartData.length > 0 && (
          <div className="glass-card p-6 rounded-2xl mb-8">
            <h2 className="font-display font-semibold text-lg mb-1">Weekly Activity</h2>
            <p className="text-sm text-muted-foreground mb-4">Steps & calories this week</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                  <XAxis dataKey="date" stroke="hsl(215 20% 65%)" />
                  <YAxis stroke="hsl(215 20% 65%)" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 8%)", border: "1px solid hsl(222 30% 18%)", borderRadius: "12px" }} />
                  <Bar dataKey="steps" fill="hsl(175 70% 40%)" radius={[4, 4, 0, 0]} name="Steps" />
                  <Bar dataKey="calories" fill="hsl(25 100% 55%)" radius={[4, 4, 0, 0]} name="Calories" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Workout Duration Chart */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="font-display font-semibold text-lg mb-1">Workout Duration</h2>
            <p className="text-sm text-muted-foreground mb-4">Minutes per session</p>
            <div className="h-48">
              {workoutChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={workoutChartData}>
                    <defs>
                      <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                    <XAxis dataKey="date" stroke="hsl(215 20% 65%)" fontSize={12} />
                    <YAxis stroke="hsl(215 20% 65%)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 8%)", border: "1px solid hsl(222 30% 18%)", borderRadius: "12px" }} />
                    <Area type="monotone" dataKey="minutes" stroke="hsl(199 89% 48%)" strokeWidth={2} fill="url(#colorMin)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Complete workouts to see your duration trends
                </div>
              )}
            </div>
          </div>

          {/* Nutrition Chart */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="font-display font-semibold text-lg mb-1">Nutrition Tracking</h2>
            <p className="text-sm text-muted-foreground mb-4">Calorie & protein intake</p>
            <div className="h-48">
              {nutritionChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={nutritionChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                    <XAxis dataKey="date" stroke="hsl(215 20% 65%)" fontSize={12} />
                    <YAxis stroke="hsl(215 20% 65%)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 8%)", border: "1px solid hsl(222 30% 18%)", borderRadius: "12px" }} />
                    <Line type="monotone" dataKey="calories" stroke="hsl(25 100% 55%)" strokeWidth={2} name="Calories" />
                    <Line type="monotone" dataKey="protein" stroke="hsl(175 70% 40%)" strokeWidth={2} name="Protein (g)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Log meals to see nutrition trends
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-2">AI Insights</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {totalWorkouts > 0
                  ? `You've completed ${totalWorkouts} workouts. ${streak >= 5 ? "Amazing consistency!" : "Try to maintain at least 5 active days per week."} `
                  : "Start logging workouts to get personalized insights! "}
                {avgSteps > 8000
                  ? "Your step count is great — keep it up! "
                  : avgSteps > 0
                  ? `Averaging ${avgSteps} steps/day. Try aiming for 10,000 for optimal health. `
                  : ""}
                {totalCalories > 0
                  ? `You've burned ${totalCalories.toLocaleString()} calories this week through tracked activities.`
                  : "Track your daily activity to see calorie burn data."}
              </p>
              <div className="flex flex-wrap gap-2">
                {streak >= 5 && (
                  <span className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-sm font-medium">✓ Consistent</span>
                )}
                {avgSteps > 8000 && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">🚶 Active Walker</span>
                )}
                {totalWorkouts > 10 && (
                  <span className="px-3 py-1 rounded-full bg-orange-400/10 text-orange-400 text-sm font-medium">🏆 Dedicated</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "First Workout", desc: "Complete your first workout", emoji: "🎉", unlocked: totalWorkouts >= 1 },
              { title: "Week Warrior", desc: "5 active days in a week", emoji: "💪", unlocked: streak >= 5 },
              { title: "Step Master", desc: "10k steps in a day", emoji: "🚶", unlocked: weeklyData.some(d => d.steps >= 10000) },
              { title: "Hydration Hero", desc: "8 glasses daily", emoji: "💧", unlocked: weeklyData.some(d => d.water_glasses >= 8) },
            ].map((badge, index) => (
              <div key={index} className={`glass-card p-4 rounded-2xl text-center ${!badge.unlocked ? "opacity-40" : ""}`}>
                <div className="text-3xl mb-2">{badge.emoji}</div>
                <div className="font-semibold text-sm">{badge.title}</div>
                <div className="text-xs text-muted-foreground">{badge.desc}</div>
                {badge.unlocked && <div className="text-xs text-emerald-400 mt-1">✓ Unlocked</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Progress;

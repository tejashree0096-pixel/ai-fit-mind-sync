import { Layout } from "@/components/layout/Layout";
import { 
  TrendingUp, 
  TrendingDown,
  Scale,
  Dumbbell,
  Apple,
  Target,
  Calendar,
  Award,
  Flame,
  Sparkles
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const weightData = [
  { week: "W1", weight: 75 },
  { week: "W2", weight: 74.5 },
  { week: "W3", weight: 74.2 },
  { week: "W4", weight: 73.8 },
  { week: "W5", weight: 73.5 },
  { week: "W6", weight: 73.1 },
  { week: "W7", weight: 72.8 },
  { week: "W8", weight: 72.5 },
];

const workoutData = [
  { day: "Mon", completed: 1 },
  { day: "Tue", completed: 1 },
  { day: "Wed", completed: 0 },
  { day: "Thu", completed: 1 },
  { day: "Fri", completed: 1 },
  { day: "Sat", completed: 1 },
  { day: "Sun", completed: 0 },
];

const Progress = () => {
  const totalWorkouts = workoutData.reduce((sum, d) => sum + d.completed, 0);
  const consistencyScore = Math.round((totalWorkouts / 7) * 100);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            Progress Analytics
          </h1>
          <p className="text-muted-foreground">
            AI-powered insights into your fitness journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Scale, label: "Weight Lost", value: "-2.5 kg", trend: "down", color: "text-emerald-400" },
            { icon: Dumbbell, label: "Workouts", value: "28", trend: "up", color: "text-cyan-400" },
            { icon: Flame, label: "Streak", value: "12 days", trend: "up", color: "text-orange-400" },
            { icon: Target, label: "Goal Progress", value: "68%", trend: "up", color: "text-violet-400" },
          ].map((stat, index) => (
            <div key={index} className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color.replace("text-", "bg-")}/10`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                {stat.trend === "up" ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div className="font-display font-bold text-2xl mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Weight Trend Chart */}
        <div className="glass-card p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-lg">Weight Trend</h2>
              <p className="text-sm text-muted-foreground">Last 8 weeks progress</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <TrendingDown className="w-4 h-4" />
              -2.5 kg
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(187 100% 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(187 100% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="week" stroke="hsl(215 20% 65%)" />
                <YAxis domain={[70, 76]} stroke="hsl(215 20% 65%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 47% 8%)",
                    border: "1px solid hsl(222 30% 18%)",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(187 100% 50%)"
                  strokeWidth={3}
                  fill="url(#colorWeight)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consistency & Nutrition Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Workout Consistency */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold text-lg">Weekly Consistency</h2>
                <p className="text-sm text-muted-foreground">This week's workouts</p>
              </div>
              <div className="text-2xl font-display font-bold text-primary">
                {consistencyScore}%
              </div>
            </div>
            <div className="flex justify-between gap-2">
              {workoutData.map((day, index) => (
                <div key={index} className="text-center flex-1">
                  <div
                    className={`h-20 rounded-xl mb-2 flex items-end justify-center transition-all ${
                      day.completed
                        ? "bg-gradient-to-t from-primary to-primary/50"
                        : "bg-secondary"
                    }`}
                  >
                    {day.completed ? (
                      <Dumbbell className="w-5 h-5 text-primary-foreground mb-2" />
                    ) : null}
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Score */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold text-lg">Nutrition Score</h2>
                <p className="text-sm text-muted-foreground">Weekly average</p>
              </div>
              <Apple className="w-6 h-6 text-orange-400" />
            </div>
            <div className="space-y-4">
              {[
                { label: "Protein Goal", value: 72, color: "bg-red-400" },
                { label: "Calorie Target", value: 85, color: "bg-orange-400" },
                { label: "Hydration", value: 90, color: "bg-cyan-400" },
                { label: "Meal Timing", value: 65, color: "bg-violet-400" },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Weekly Report */}
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-2">AI Weekly Report</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Great progress this week! You've maintained a 71% workout consistency and lost 0.3kg. 
                Your protein intake improved by 15% compared to last week. 
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Areas to improve:</strong> You missed Wednesday's 
                recovery session. Adding mobility work can help prevent injuries and improve performance.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-sm font-medium">
                  ✓ On Track
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  68% to Goal
                </span>
                <span className="px-3 py-1 rounded-full bg-orange-400/10 text-orange-400 text-sm font-medium">
                  Focus: Protein
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-8">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Recent Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "First Week", desc: "Completed first week", emoji: "🎉" },
              { title: "Protein Pro", desc: "Hit protein 5 days", emoji: "💪" },
              { title: "Early Bird", desc: "Morning workout streak", emoji: "🌅" },
              { title: "Hydration Hero", desc: "8 glasses daily", emoji: "💧" },
            ].map((badge, index) => (
              <div key={index} className="glass-card p-4 rounded-2xl text-center">
                <div className="text-3xl mb-2">{badge.emoji}</div>
                <div className="font-semibold text-sm">{badge.title}</div>
                <div className="text-xs text-muted-foreground">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Progress;

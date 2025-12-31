import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  Apple, 
  Brain, 
  TrendingUp, 
  Flame,
  Droplets,
  Moon,
  Target,
  ArrowRight,
  Sparkles,
  Calendar
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

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const goalLabels: Record<string, string> = {
    "fat-loss": "Fat Loss",
    "muscle-gain": "Muscle Gain",
    "endurance": "Endurance",
    "flexibility": "Flexibility",
  };

  const quickStats = [
    { icon: Flame, label: "Calories", value: "1,850", target: "2,200", color: "text-orange-400", bg: "bg-orange-400/10" },
    { icon: Droplets, label: "Water", value: "6", target: "8 glasses", color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { icon: Moon, label: "Sleep", value: profile?.sleepQuality || "7", target: "8 hrs", color: "text-violet-400", bg: "bg-violet-400/10" },
    { icon: Target, label: "Steps", value: "8,543", target: "10,000", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Your AI coach is ready to guide you. Let's crush your goals today!
          </p>
        </div>

        {/* Profile Summary Card */}
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
                      {profile.workoutExperience}
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="glass-card p-5 rounded-2xl">
              <div className={`inline-flex p-3 rounded-xl ${stat.bg} mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="font-display font-bold text-2xl mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">
                {stat.label} • <span className={stat.color}>{stat.target}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Workout */}
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
                AI-generated workout based on your goals and energy levels.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Upper Body Focus</span>
              </div>
            </div>
          </Link>

          {/* Nutrition Tracker */}
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
                Log meals, scan food, and track your macros with AI analysis.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 rounded-full bg-orange-400/10 text-orange-400 text-xs font-medium">
                  Indian Food Ready
                </span>
              </div>
            </div>
          </Link>

          {/* AI Coach */}
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
                Chat with your adaptive AI coach for personalized guidance.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-violet-400 font-medium">Always Available</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Progress Section */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-lg">Weekly Progress</h3>
              <p className="text-sm text-muted-foreground">Your AI-analyzed fitness journey</p>
            </div>
            <Link to="/progress">
              <Button variant="outline" size="sm" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                View Details
              </Button>
            </Link>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            {[
              { label: "Workout Consistency", value: 75, color: "bg-cyan-400" },
              { label: "Nutrition Goals", value: 60, color: "bg-orange-400" },
              { label: "Protein Intake", value: 45, color: "bg-violet-400" },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

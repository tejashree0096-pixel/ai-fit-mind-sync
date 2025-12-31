import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Camera, 
  Search, 
  Plus, 
  Apple, 
  Flame,
  Beef,
  Wheat,
  Droplet,
  AlertCircle,
  Sparkles,
  History,
  Hand
} from "lucide-react";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portion: string;
  emoji: string;
}

const recentFoods: FoodItem[] = [
  { name: "Paneer Butter Masala", calories: 350, protein: 15, carbs: 12, fats: 28, portion: "1 cup", emoji: "🧀" },
  { name: "Chapati", calories: 104, protein: 3, carbs: 20, fats: 1, portion: "1 piece", emoji: "🫓" },
  { name: "Dal Tadka", calories: 180, protein: 9, carbs: 24, fats: 6, portion: "1 bowl", emoji: "🥣" },
  { name: "Rice", calories: 206, protein: 4, carbs: 45, fats: 0.4, portion: "1 cup", emoji: "🍚" },
  { name: "Masala Dosa", calories: 250, protein: 5, carbs: 35, fats: 10, portion: "1 piece", emoji: "🥞" },
  { name: "Idli", calories: 58, protein: 2, carbs: 12, fats: 0.4, portion: "1 piece", emoji: "⚪" },
];

const Nutrition = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dailyIntake] = useState({
    calories: { current: 1420, target: 2200 },
    protein: { current: 45, target: 120 },
    carbs: { current: 180, target: 275 },
    fats: { current: 55, target: 73 },
  });

  const proteinGap = dailyIntake.protein.target - dailyIntake.protein.current;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            Nutrition Tracker
          </h1>
          <p className="text-muted-foreground">
            Scan, log, and analyze your food with AI-powered insights
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button variant="gradient" className="h-auto py-6 flex-col gap-2">
            <Camera className="w-8 h-8" />
            <span className="font-semibold">Scan Food</span>
            <span className="text-xs opacity-80">Use camera to analyze</span>
          </Button>
          <Button variant="gradientEnergy" className="h-auto py-6 flex-col gap-2">
            <Plus className="w-8 h-8" />
            <span className="font-semibold">Add Manually</span>
            <span className="text-xs opacity-80">Enter food details</span>
          </Button>
        </div>

        {/* Daily Macros Overview */}
        <div className="glass-card p-6 rounded-2xl mb-8">
          <h2 className="font-display font-semibold text-lg mb-4">Today's Intake</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Calories", icon: Flame, current: dailyIntake.calories.current, target: dailyIntake.calories.target, unit: "kcal", color: "text-orange-400", bg: "bg-orange-400" },
              { label: "Protein", icon: Beef, current: dailyIntake.protein.current, target: dailyIntake.protein.target, unit: "g", color: "text-red-400", bg: "bg-red-400" },
              { label: "Carbs", icon: Wheat, current: dailyIntake.carbs.current, target: dailyIntake.carbs.target, unit: "g", color: "text-amber-400", bg: "bg-amber-400" },
              { label: "Fats", icon: Droplet, current: dailyIntake.fats.current, target: dailyIntake.fats.target, unit: "g", color: "text-blue-400", bg: "bg-blue-400" },
            ].map((macro, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex p-3 rounded-xl ${macro.bg}/10 mb-3`}>
                  <macro.icon className={`w-5 h-5 ${macro.color}`} />
                </div>
                <div className="font-display font-bold text-xl">
                  {macro.current}
                  <span className="text-sm text-muted-foreground font-normal">/{macro.target}{macro.unit}</span>
                </div>
                <div className="text-sm text-muted-foreground">{macro.label}</div>
                {/* Progress Bar */}
                <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${macro.bg} rounded-full`}
                    style={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protein Gap Alert */}
        {proteinGap > 30 && (
          <div className="glass-card p-5 rounded-2xl mb-8 border-l-4 border-l-destructive">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-destructive">Protein Gap Detected!</h3>
                <p className="text-sm text-muted-foreground">
                  You're {proteinGap}g short on protein today. Consider adding paneer, dal, soya chunks, 
                  or eggs to meet your muscle-building goals.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Portion Guide */}
        <div className="glass-card p-5 rounded-2xl mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Hand className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Hand-Size Portion Guide</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <div className="text-2xl mb-1">✊</div>
              <div className="font-medium">Fist</div>
              <div className="text-muted-foreground">= 1 cup rice/dal</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <div className="text-2xl mb-1">🤚</div>
              <div className="font-medium">Palm</div>
              <div className="text-muted-foreground">= 100g protein</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <div className="text-2xl mb-1">👆</div>
              <div className="font-medium">Thumb</div>
              <div className="text-muted-foreground">= 1 tbsp fat</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <div className="text-2xl mb-1">🤏</div>
              <div className="font-medium">Handful</div>
              <div className="text-muted-foreground">= 30g nuts</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search Indian foods (dal, chapati, rice...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-secondary/50 border-0 rounded-xl"
          />
        </div>

        {/* Recent Foods */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Popular Indian Foods</h3>
          </div>
          <div className="grid gap-3">
            {recentFoods.map((food, index) => (
              <div
                key={index}
                className="glass-card p-4 rounded-xl flex items-center gap-4 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                  {food.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-muted-foreground">{food.portion}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">{food.calories} kcal</div>
                  <div className="text-xs text-muted-foreground">
                    P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-400">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-400/10">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">AI Food Suggestion</h3>
              <p className="text-sm text-muted-foreground">
                To reach your protein goal, add 2 boiled eggs (12g protein) or a bowl of soya chunks 
                (52g protein per 100g) to your next meal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Nutrition;

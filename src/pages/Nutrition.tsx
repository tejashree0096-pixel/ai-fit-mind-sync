import { useState, useRef, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Camera, 
  Search, 
  Plus, 
  Flame,
  Beef,
  Wheat,
  Droplet,
  AlertCircle,
  Sparkles,
  History,
  Hand,
  Brain,
  Heart,
  Smile,
  Frown,
  Meh,
  CloudRain,
  Sun,
  Moon,
  Zap,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Activity,
  Loader2,
  RefreshCw,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AIRecommendation {
  meals: Array<{
    name: string;
    benefit: string;
    calories: number;
    protein: number;
  }>;
  stressTip: string;
  hydrationTip: string;
  overallAdvice: string;
}

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portion: string;
  emoji: string;
}

interface MoodEntry {
  mood: "great" | "good" | "okay" | "low" | "stressed";
  energy: number;
  sleep: number;
  stress: number;
  notes: string;
}

interface DayMeal {
  breakfast: string;
  snack1: string;
  lunch: string;
  snack2: string;
  dinner: string;
  calories: number;
  protein: number;
}

const recentFoods: FoodItem[] = [
  { name: "Paneer Butter Masala", calories: 350, protein: 15, carbs: 12, fats: 28, portion: "1 cup", emoji: "🧀" },
  { name: "Chapati", calories: 104, protein: 3, carbs: 20, fats: 1, portion: "1 piece", emoji: "🫓" },
  { name: "Dal Tadka", calories: 180, protein: 9, carbs: 24, fats: 6, portion: "1 bowl", emoji: "🥣" },
  { name: "Rice", calories: 206, protein: 4, carbs: 45, fats: 0.4, portion: "1 cup", emoji: "🍚" },
  { name: "Masala Dosa", calories: 250, protein: 5, carbs: 35, fats: 10, portion: "1 piece", emoji: "🥞" },
  { name: "Idli", calories: 58, protein: 2, carbs: 12, fats: 0.4, portion: "1 piece", emoji: "⚪" },
];

const weeklyDietPlan: Record<string, DayMeal> = {
  Monday: {
    breakfast: "Oats with banana & almonds",
    snack1: "Green tea + 5 soaked almonds",
    lunch: "Brown rice, dal, sabzi, salad",
    snack2: "Sprouts chaat",
    dinner: "Chapati, paneer curry, curd",
    calories: 1850,
    protein: 75,
  },
  Tuesday: {
    breakfast: "Moong dal chilla + chutney",
    snack1: "Buttermilk + walnuts",
    lunch: "Jeera rice, rajma, cucumber",
    snack2: "Fruit bowl",
    dinner: "Vegetable khichdi + kadhi",
    calories: 1780,
    protein: 68,
  },
  Wednesday: {
    breakfast: "Poha with peanuts",
    snack1: "Coconut water + dates",
    lunch: "Chapati, chole, onion salad",
    snack2: "Roasted chana",
    dinner: "Palak paneer, rice, raita",
    calories: 1920,
    protein: 82,
  },
  Thursday: {
    breakfast: "Idli sambar + coconut chutney",
    snack1: "Mixed nuts handful",
    lunch: "Pulao, dal fry, papad",
    snack2: "Makhana (fox nuts)",
    dinner: "Methi paratha + curd",
    calories: 1800,
    protein: 70,
  },
  Friday: {
    breakfast: "Upma with vegetables",
    snack1: "Lassi + flax seeds",
    lunch: "Rice, sambar, kootu, pickle",
    snack2: "Banana + peanut butter",
    dinner: "Roti, mixed veg, dal",
    calories: 1890,
    protein: 78,
  },
  Saturday: {
    breakfast: "Besan chilla + mint chutney",
    snack1: "Fresh fruit juice",
    lunch: "Biryani (veg), raita, salad",
    snack2: "Dhokla",
    dinner: "Light soup + grilled paneer",
    calories: 1950,
    protein: 85,
  },
  Sunday: {
    breakfast: "Aloo paratha + curd",
    snack1: "Chai + biscuits",
    lunch: "Special thali (variety)",
    snack2: "Ice cream / sweet",
    dinner: "Khichdi + pickle + papad",
    calories: 2100,
    protein: 72,
  },
};

const moodEmojis = {
  great: { icon: Sun, label: "Great", color: "text-green-500" },
  good: { icon: Smile, label: "Good", color: "text-teal-500" },
  okay: { icon: Meh, label: "Okay", color: "text-blue-500" },
  low: { icon: Frown, label: "Low", color: "text-blue-400" },
  stressed: { icon: CloudRain, label: "Stressed", color: "text-teal-400" },
};

const Nutrition = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [addManuallyOpen, setAddManuallyOpen] = useState(false);
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [manualFood, setManualFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    portion: "",
  });
  const [dailyIntake, setDailyIntake] = useState({
    calories: { current: 1420, target: 2200 },
    protein: { current: 45, target: 120 },
    carbs: { current: 180, target: 275 },
    fats: { current: 55, target: 73 },
  });
  const [currentMood, setCurrentMood] = useState<MoodEntry>({
    mood: "good",
    energy: 7,
    sleep: 7,
    stress: 3,
    notes: "",
  });
  const [weeklyMoodData] = useState([
    { day: "Mon", mood: 8, energy: 7, sleep: 7 },
    { day: "Tue", mood: 7, energy: 6, sleep: 8 },
    { day: "Wed", mood: 6, energy: 5, sleep: 6 },
    { day: "Thu", mood: 8, energy: 8, sleep: 7 },
    { day: "Fri", mood: 7, energy: 7, sleep: 8 },
    { day: "Sat", mood: 9, energy: 8, sleep: 9 },
    { day: "Sun", mood: 8, energy: 7, sleep: 8 },
  ]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Camera states
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    portion: string;
    confidence: string;
    description: string;
  } | null>(null);

  const handleFilePick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (!result || result.length < 1000) {
        toast.error("Could not read this image. Try another file.");
        return;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      setAnalysisResult(null);
      setCapturedImage(result);
      toast.success("Image loaded — ready to analyze");
    };
    reader.onerror = () => toast.error("Failed to read image");
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCapturedImage(null);
      setAnalysisResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to actually have frame data before allowing capture
        await new Promise<void>((resolve) => {
          const video = videoRef.current!;
          const onReady = () => {
            video.removeEventListener('loadeddata', onReady);
            resolve();
          };
          if (video.readyState >= 2) {
            resolve();
          } else {
            video.addEventListener('loadeddata', onReady);
          }
          video.play();
        });
      }
      setCameraActive(true);
    } catch (error: any) {
      console.error("Camera error:", error);
      if (error.name === "NotAllowedError") {
        toast.error("Camera permission denied. Please allow camera access in your browser settings.");
      } else if (error.name === "NotFoundError") {
        toast.error("No camera found on this device.");
      } else if (error.name === "NotReadableError") {
        toast.error("Camera is being used by another application.");
      } else {
        toast.error("Failed to access camera. Please try again.");
      }
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    
    // Ensure video stream has actual frame data before capturing
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error("Camera is still loading. Please wait a moment and try again.");
      return;
    }
    
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Draw with explicit dimensions to ensure proper rendering
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.85);
    if (!imageDataUrl || imageDataUrl === "data:," || imageDataUrl.length < 1000) {
      toast.error("Failed to capture image. Please try again.");
      return;
    }
    setCapturedImage(imageDataUrl);
    stopCamera();
  }, [stopCamera]);

  const analyzeFood = useCallback(async () => {
    if (!capturedImage) {
      toast.error("No image captured. Please take a photo first.");
      return;
    }
    const base64Data = capturedImage.split(",")[1];
    if (!base64Data || base64Data.length < 100) {
      toast.error("Image capture failed. Please retake the photo.");
      setCapturedImage(null);
      return;
    }
    setIsAnalyzing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Please sign in to scan food."); return; }
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-food-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ imageBase64: base64Data }),
        }
      );

      if (response.status === 429) {
        toast.error("Too many requests. Please try again in a moment.");
        return;
      }
      if (response.status === 402) {
        toast.error("AI credits depleted.");
        return;
      }
      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }
      setAnalysisResult(data);
      toast.success(`Detected: ${data.name}`);
    } catch (error) {
      console.error("Food analysis error:", error);
      toast.error("Failed to analyze food. Please try again or add manually.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [capturedImage]);

  const addAnalyzedFood = useCallback(() => {
    if (!analysisResult) return;
    handleAddFood({
      name: analysisResult.name,
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fats: analysisResult.fats,
      portion: analysisResult.portion,
      emoji: "📸",
    });
    setScanDialogOpen(false);
    setCapturedImage(null);
    setAnalysisResult(null);
  }, [analysisResult]);

  const handleScanDialogClose = useCallback((open: boolean) => {
    if (!open) {
      stopCamera();
      setCapturedImage(null);
      setAnalysisResult(null);
    }
    setScanDialogOpen(open);
  }, [stopCamera]);

  const fetchAIRecommendations = async () => {
    setIsLoadingAI(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Please sign in for AI recommendations."); setIsLoadingAI(false); return; }
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meal-recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            mood: currentMood.mood,
            energy: currentMood.energy,
            stress: currentMood.stress,
            sleep: currentMood.sleep,
            currentCalories: dailyIntake.calories.current,
            targetCalories: dailyIntake.calories.target,
            proteinGap: dailyIntake.protein.target - dailyIntake.protein.current,
          }),
        }
      );

      if (response.status === 429) {
        toast.error("Too many requests. Please try again in a moment.");
        return;
      }
      if (response.status === 402) {
        toast.error("AI credits depleted. Please add credits to continue.");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      setAiRecommendations(data);
      toast.success("AI recommendations updated!");
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      toast.error("Failed to get AI recommendations. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const proteinGap = dailyIntake.protein.target - dailyIntake.protein.current;
  const days = Object.keys(weeklyDietPlan);
  const currentDayIndex = days.indexOf(selectedDay);

  const handleAddFood = (food: FoodItem) => {
    setDailyIntake(prev => ({
      calories: { ...prev.calories, current: prev.calories.current + food.calories },
      protein: { ...prev.protein, current: prev.protein.current + food.protein },
      carbs: { ...prev.carbs, current: prev.carbs.current + food.carbs },
      fats: { ...prev.fats, current: prev.fats.current + food.fats },
    }));
    toast.success(`Added ${food.name} to your daily log!`);
  };

  const handleManualSubmit = () => {
    if (!manualFood.name || !manualFood.calories) {
      toast.error("Please enter at least food name and calories");
      return;
    }
    const newFood: FoodItem = {
      name: manualFood.name,
      calories: Number(manualFood.calories) || 0,
      protein: Number(manualFood.protein) || 0,
      carbs: Number(manualFood.carbs) || 0,
      fats: Number(manualFood.fats) || 0,
      portion: manualFood.portion || "1 serving",
      emoji: "🍽️",
    };
    handleAddFood(newFood);
    setManualFood({ name: "", calories: "", protein: "", carbs: "", fats: "", portion: "" });
    setAddManuallyOpen(false);
  };

  const handleSaveMood = () => {
    toast.success("Mood logged successfully! Keep tracking for better insights.");
    setMoodDialogOpen(false);
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" 
      ? (currentDayIndex - 1 + 7) % 7 
      : (currentDayIndex + 1) % 7;
    setSelectedDay(days[newIndex]);
  };

  const avgMood = Math.round(weeklyMoodData.reduce((a, b) => a + b.mood, 0) / 7);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            <span className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
              Nutrition & Wellness
            </span>
          </h1>
          <p className="text-muted-foreground">
            Track your nutrition, mood, and mental wellness holistically
          </p>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="nutrition" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-blue-500/10">
            <TabsTrigger value="nutrition" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              <Flame className="w-4 h-4 mr-2" />
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="mental" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              Mental Health
            </TabsTrigger>
            <TabsTrigger value="diet-plan" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Weekly Plan
            </TabsTrigger>
          </TabsList>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="h-auto py-6 flex-col gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                onClick={() => setScanDialogOpen(true)}
              >
                <Camera className="w-8 h-8" />
                <span className="font-semibold">Scan Food</span>
                <span className="text-xs opacity-80">Use camera to analyze</span>
              </Button>
              <Button 
                className="h-auto py-6 flex-col gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                onClick={() => setAddManuallyOpen(true)}
              >
                <Plus className="w-8 h-8" />
                <span className="font-semibold">Add Manually</span>
                <span className="text-xs opacity-80">Enter food details</span>
              </Button>
            </div>

            {/* Daily Macros Overview */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-teal-500">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-500" />
                Today's Intake
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Calories", icon: Flame, current: dailyIntake.calories.current, target: dailyIntake.calories.target, unit: "kcal", color: "text-green-500", bg: "bg-green-500" },
                  { label: "Protein", icon: Beef, current: dailyIntake.protein.current, target: dailyIntake.protein.target, unit: "g", color: "text-teal-500", bg: "bg-teal-500" },
                  { label: "Carbs", icon: Wheat, current: dailyIntake.carbs.current, target: dailyIntake.carbs.target, unit: "g", color: "text-blue-500", bg: "bg-blue-500" },
                  { label: "Fats", icon: Droplet, current: dailyIntake.fats.current, target: dailyIntake.fats.target, unit: "g", color: "text-teal-400", bg: "bg-teal-400" },
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
                    <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${macro.bg} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protein Gap Alert */}
            {proteinGap > 30 && (
              <div className="glass-card p-5 rounded-2xl border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-blue-600">Protein Gap Detected!</h3>
                    <p className="text-sm text-muted-foreground">
                      You're {proteinGap}g short on protein today. Consider adding paneer, dal, soya chunks, 
                      or eggs to meet your muscle-building goals.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Portion Guide */}
            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-green-500">
              <div className="flex items-center gap-2 mb-4">
                <Hand className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Hand-Size Portion Guide</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                  { emoji: "✊", label: "Fist", desc: "= 1 cup rice/dal" },
                  { emoji: "🤚", label: "Palm", desc: "= 100g protein" },
                  { emoji: "👆", label: "Thumb", desc: "= 1 tbsp fat" },
                  { emoji: "🤏", label: "Handful", desc: "= 30g nuts" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl">
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search Indian foods (dal, chapati, rice...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-gradient-to-r from-teal-500/5 to-blue-500/5 border-teal-500/20 rounded-xl focus:border-teal-500"
              />
            </div>

            {/* Recent Foods */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-teal-500" />
                <h3 className="font-semibold">Popular Indian Foods</h3>
              </div>
              <div className="grid gap-3">
                {recentFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((food, index) => (
                  <div
                    key={index}
                    className="glass-card p-4 rounded-xl flex items-center gap-4 hover:-translate-y-0.5 transition-all cursor-pointer hover:border-teal-500/30"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 flex items-center justify-center text-2xl">
                      {food.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-muted-foreground">{food.portion}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-teal-600">{food.calories} kcal</div>
                      <div className="text-xs text-muted-foreground">
                        P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full hover:bg-teal-500/10 hover:text-teal-600"
                      onClick={() => handleAddFood(food)}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Personalized Recommendations */}
            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-teal-400 bg-gradient-to-r from-teal-500/5 to-blue-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-teal-400/10">
                    <Sparkles className="w-5 h-5 text-teal-500" />
                  </div>
                  <h3 className="font-semibold">AI Meal Recommendations</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAIRecommendations}
                  disabled={isLoadingAI}
                  className="border-teal-500/30 hover:bg-teal-500/10"
                >
                  {isLoadingAI ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  {isLoadingAI ? "Analyzing..." : "Get AI Tips"}
                </Button>
              </div>

              {aiRecommendations ? (
                <div className="space-y-4">
                  {/* Recommended Meals */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-teal-600">Recommended for your mood & goals:</p>
                    {aiRecommendations.meals.map((meal, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center text-lg">
                          {i === 0 ? "🥗" : i === 1 ? "🍲" : "🥤"}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{meal.name}</p>
                          <p className="text-xs text-muted-foreground">{meal.benefit}</p>
                        </div>
                        <div className="text-right text-xs">
                          <span className="text-teal-600 font-medium">{meal.calories} kcal</span>
                          <span className="text-muted-foreground"> • {meal.protein}g protein</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="grid gap-2">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                      <p className="text-xs font-medium text-blue-600">🧘 Stress Relief Tip</p>
                      <p className="text-sm text-muted-foreground mt-1">{aiRecommendations.stressTip}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <p className="text-xs font-medium text-green-600">💧 Hydration Tip</p>
                      <p className="text-sm text-muted-foreground mt-1">{aiRecommendations.hydrationTip}</p>
                    </div>
                  </div>

                  {/* Overall Advice */}
                  <div className="p-3 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-teal-600">✨ </span>
                      {aiRecommendations.overallAdvice}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-teal-400/50" />
                  <p className="text-sm text-muted-foreground">
                    Click "Get AI Tips" for personalized meal recommendations based on your mood, stress, and nutritional goals.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Mental Health Tab */}
          <TabsContent value="mental" className="space-y-6">
            {/* Mood Check-in Card */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  <h2 className="font-display font-semibold text-lg">Today's Mood Check-in</h2>
                </div>
                <Button 
                  onClick={() => setMoodDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Mood
                </Button>
              </div>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {Object.entries(moodEmojis).map(([key, value]) => {
                  const MoodIcon = value.icon;
                  const isSelected = currentMood.mood === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setCurrentMood(prev => ({ ...prev, mood: key as MoodEntry["mood"] }))}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                        isSelected 
                          ? "bg-gradient-to-br from-teal-500 to-blue-500 text-white scale-105" 
                          : "bg-secondary/50 hover:bg-teal-500/10"
                      }`}
                    >
                      <MoodIcon className={`w-6 h-6 mb-1 ${isSelected ? "text-white" : value.color}`} />
                      <span className="text-xs">{value.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Energy Level", value: currentMood.energy, icon: Zap, color: "text-green-500" },
                  { label: "Sleep Quality", value: currentMood.sleep, icon: Moon, color: "text-blue-500" },
                  { label: "Stress Level", value: currentMood.stress, icon: Heart, color: "text-teal-500" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-xl">
                    <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                    <div className="font-display font-bold text-2xl">{stat.value}/10</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Mood Trend */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-teal-500">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-teal-500" />
                <h3 className="font-semibold">Weekly Mood Trend</h3>
                <span className="ml-auto text-sm bg-teal-500/10 px-3 py-1 rounded-full text-teal-600">
                  Avg: {avgMood}/10
                </span>
              </div>
              <div className="flex items-end justify-between gap-2 h-32">
                {weeklyMoodData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-t-lg transition-all bg-gradient-to-t from-teal-500 to-blue-400"
                      style={{ height: `${day.mood * 10}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mind-Body Connection */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-green-500">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Mind-Body Insights</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl">
                  <p className="text-sm font-medium mb-1">🧘 Stress-Based Recommendation</p>
                  <p className="text-sm text-muted-foreground">
                    Your stress level is moderate. Consider a light yoga session or 10 minutes of deep breathing today.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl">
                  <p className="text-sm font-medium mb-1">💤 Sleep Impact</p>
                  <p className="text-sm text-muted-foreground">
                    Good sleep quality detected! Your recovery should be optimal for today's workout.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl">
                  <p className="text-sm font-medium mb-1">⚡ Energy Optimization</p>
                  <p className="text-sm text-muted-foreground">
                    Schedule high-intensity workouts during your peak energy hours (10 AM - 12 PM based on your patterns).
                  </p>
                </div>
              </div>
            </div>

            {/* Breathing Exercise */}
            <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 via-teal-500/5 to-green-500/5">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center animate-pulse">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Quick Breathing Exercise</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Take a moment to relax with a guided breathing session
                </p>
                <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white">
                  Start 2-Minute Session
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Weekly Diet Plan Tab */}
          <TabsContent value="diet-plan" className="space-y-6">
            {/* Day Selector */}
            <div className="glass-card p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigateDay("prev")}
                  className="hover:bg-teal-500/10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1 text-center">
                  <h2 className="font-display font-bold text-2xl bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                    {selectedDay}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {weeklyDietPlan[selectedDay].calories} kcal • {weeklyDietPlan[selectedDay].protein}g protein
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigateDay("next")}
                  className="hover:bg-teal-500/10"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Day Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2">
              {days.map(day => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedDay(day)}
                  className={selectedDay === day 
                    ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white" 
                    : "hover:bg-teal-500/10"
                  }
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>

            {/* Meal Plan */}
            <div className="space-y-4">
              {[
                { time: "7:00 AM", meal: "Breakfast", food: weeklyDietPlan[selectedDay].breakfast, emoji: "🌅" },
                { time: "10:00 AM", meal: "Morning Snack", food: weeklyDietPlan[selectedDay].snack1, emoji: "🍎" },
                { time: "1:00 PM", meal: "Lunch", food: weeklyDietPlan[selectedDay].lunch, emoji: "🍛" },
                { time: "4:00 PM", meal: "Evening Snack", food: weeklyDietPlan[selectedDay].snack2, emoji: "🥤" },
                { time: "8:00 PM", meal: "Dinner", food: weeklyDietPlan[selectedDay].dinner, emoji: "🌙" },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="glass-card p-4 rounded-xl flex items-center gap-4 hover:border-teal-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 via-teal-500/10 to-blue-500/10 flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.meal}</span>
                      <span className="text-xs text-muted-foreground bg-teal-500/10 px-2 py-0.5 rounded-full">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.food}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-green-500/10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Weekly Summary */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-green-500">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Weekly Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl text-center">
                  <div className="font-display font-bold text-2xl text-green-600">13,190</div>
                  <div className="text-sm text-muted-foreground">Total Calories</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-xl text-center">
                  <div className="font-display font-bold text-2xl text-teal-600">530g</div>
                  <div className="text-sm text-muted-foreground">Total Protein</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 p-3 bg-blue-500/5 rounded-lg">
                💡 <strong>AI Tip:</strong> Your weekly plan is well-balanced! Consider adding more leafy greens on Wednesday and Friday for extra micronutrients.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Scan Food Dialog */}
      <Dialog open={scanDialogOpen} onOpenChange={handleScanDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-500" />
              Scan Food
            </DialogTitle>
            <DialogDescription>
              Use your camera to scan and analyze food with AI
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera / Captured Image / Analysis View */}
            <div className="w-full aspect-video bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-xl overflow-hidden relative border-2 border-teal-500/30">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : capturedImage ? (
                <img src={capturedImage} alt="Captured food" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-3 text-teal-500" />
                    <p className="text-sm text-muted-foreground">Tap "Open Camera" to start</p>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Analyzing food with AI...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Result */}
            {analysisResult && (
              <div className="w-full p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{analysisResult.name}</p>
                    <p className="text-xs text-muted-foreground">{analysisResult.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    analysisResult.confidence === "high" ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                  }`}>
                    {analysisResult.confidence === "high" ? "✓ High confidence" : "⚠ Low confidence"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="p-2 bg-white/50 rounded-lg">
                    <p className="font-bold text-green-600">{analysisResult.calories}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                  <div className="p-2 bg-white/50 rounded-lg">
                    <p className="font-bold text-teal-600">{analysisResult.protein}g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="p-2 bg-white/50 rounded-lg">
                    <p className="font-bold text-blue-600">{analysisResult.carbs}g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div className="p-2 bg-white/50 rounded-lg">
                    <p className="font-bold text-teal-400">{analysisResult.fats}g</p>
                    <p className="text-xs text-muted-foreground">Fats</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Portion: {analysisResult.portion}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFilePick}
              />
              {!cameraActive && !capturedImage && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                    onClick={startCamera}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              )}

              {cameraActive && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={stopCamera}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                    onClick={capturePhoto}
                  >
                    📸 Capture
                  </Button>
                </div>
              )}

              {capturedImage && !analysisResult && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setCapturedImage(null); startCamera(); }}>
                    Retake
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                    onClick={analyzeFood}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Analyze with AI
                  </Button>
                </div>
              )}

              {analysisResult && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setCapturedImage(null); setAnalysisResult(null); startCamera(); }}>
                    Scan Again
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                    onClick={addAnalyzedFood}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Log
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Manually Dialog */}
      <Dialog open={addManuallyOpen} onOpenChange={setAddManuallyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500" />
              Add Food Manually
            </DialogTitle>
            <DialogDescription>
              Enter the nutritional details of your food
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="food-name">Food Name *</Label>
              <Input
                id="food-name"
                placeholder="e.g., Paneer Tikka"
                value={manualFood.name}
                onChange={(e) => setManualFood(prev => ({ ...prev, name: e.target.value }))}
                className="focus:border-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="portion">Portion Size</Label>
              <Input
                id="portion"
                placeholder="e.g., 1 cup, 100g"
                value={manualFood.portion}
                onChange={(e) => setManualFood(prev => ({ ...prev, portion: e.target.value }))}
                className="focus:border-teal-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="kcal"
                  value={manualFood.calories}
                  onChange={(e) => setManualFood(prev => ({ ...prev, calories: e.target.value }))}
                  className="focus:border-teal-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="grams"
                  value={manualFood.protein}
                  onChange={(e) => setManualFood(prev => ({ ...prev, protein: e.target.value }))}
                  className="focus:border-teal-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="grams"
                  value={manualFood.carbs}
                  onChange={(e) => setManualFood(prev => ({ ...prev, carbs: e.target.value }))}
                  className="focus:border-teal-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fats">Fats (g)</Label>
                <Input
                  id="fats"
                  type="number"
                  placeholder="grams"
                  value={manualFood.fats}
                  onChange={(e) => setManualFood(prev => ({ ...prev, fats: e.target.value }))}
                  className="focus:border-teal-500"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setAddManuallyOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white" 
              onClick={handleManualSubmit}
            >
              Add Food
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mood Log Dialog */}
      <Dialog open={moodDialogOpen} onOpenChange={setMoodDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              Log Your Mood
            </DialogTitle>
            <DialogDescription>
              Track how you're feeling today
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Mood Selection */}
            <div>
              <Label className="mb-3 block">How are you feeling?</Label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(moodEmojis).map(([key, value]) => {
                  const MoodIcon = value.icon;
                  const isSelected = currentMood.mood === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setCurrentMood(prev => ({ ...prev, mood: key as MoodEntry["mood"] }))}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                        isSelected 
                          ? "bg-gradient-to-br from-teal-500 to-blue-500 text-white scale-105" 
                          : "bg-secondary/50 hover:bg-teal-500/10"
                      }`}
                    >
                      <MoodIcon className={`w-5 h-5 mb-1 ${isSelected ? "text-white" : value.color}`} />
                      <span className="text-xs">{value.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            {[
              { label: "Energy Level", key: "energy" as const, icon: Zap },
              { label: "Sleep Quality", key: "sleep" as const, icon: Moon },
              { label: "Stress Level", key: "stress" as const, icon: Heart },
            ].map((item) => (
              <div key={item.key}>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-teal-500" />
                    {item.label}
                  </Label>
                  <span className="text-sm font-medium">{currentMood[item.key]}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood[item.key]}
                  onChange={(e) => setCurrentMood(prev => ({ ...prev, [item.key]: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>
            ))}

            {/* Notes */}
            <div>
              <Label htmlFor="mood-notes" className="mb-2 block">Notes (optional)</Label>
              <Input
                id="mood-notes"
                placeholder="How's your day going?"
                value={currentMood.notes}
                onChange={(e) => setCurrentMood(prev => ({ ...prev, notes: e.target.value }))}
                className="focus:border-teal-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setMoodDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white" 
              onClick={handleSaveMood}
            >
              Save Mood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Nutrition;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Target, 
  Apple, 
  Activity,
  Brain,
  CheckCircle2,
  Loader2
} from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

interface UserProfile {
  age: string;
  gender: string;
  height: string;
  weight: string;
  goalWeight: string;
  fitnessGoal: string;
  foodPreference: string;
  workoutExperience: string;
  workoutTime: string;
  stressLevel: number;
  sleepQuality: number;
}

const steps = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Fitness Goal", icon: Target },
  { id: 3, title: "Diet Preferences", icon: Apple },
  { id: 4, title: "Workout Level", icon: Activity },
  { id: 5, title: "Wellness", icon: Brain },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goalWeight: "",
    fitnessGoal: "",
    foodPreference: "",
    workoutExperience: "",
    workoutTime: "",
    stressLevel: 5,
    sleepQuality: 5,
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("age, height, weight, goal_weight, fitness_goal")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setProfile((p) => ({
          ...p,
          age: data.age?.toString() ?? p.age,
          height: data.height?.toString() ?? p.height,
          weight: data.weight?.toString() ?? p.weight,
          goalWeight: (data as any).goal_weight?.toString() ?? p.goalWeight,
          fitnessGoal: data.fitness_goal ?? p.fitnessGoal,
        }));
      }
    })();
  }, []);

  const updateProfile = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((currentStep + 1) as Step);
    else handleComplete();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const handleComplete = async () => {
    setSaving(true);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const payload: any = {
        user_id: user.id,
        age: profile.age ? parseInt(profile.age) : null,
        height: profile.height ? parseFloat(profile.height) : null,
        weight: profile.weight ? parseFloat(profile.weight) : null,
        goal_weight: profile.goalWeight ? parseFloat(profile.goalWeight) : null,
        fitness_goal: profile.fitnessGoal || null,
      };
      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "user_id" });
      if (error) {
        toast.error("Could not save profile");
        setSaving(false);
        return;
      }
      toast.success("Profile saved!");
    }
    setSaving(false);
    navigate("/dashboard");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={profile.age}
                  onChange={(e) => updateProfile("age", e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="flex gap-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      onClick={() => updateProfile("gender", g)}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        profile.gender === g
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={profile.height}
                  onChange={(e) => updateProfile("height", e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={profile.weight}
                  onChange={(e) => updateProfile("weight", e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
              <Input
                id="goalWeight"
                type="number"
                step="0.1"
                placeholder="65"
                value={profile.goalWeight}
                onChange={(e) => updateProfile("goalWeight", e.target.value)}
                className="bg-secondary/50"
              />
              <p className="text-xs text-muted-foreground">
                Used to personalize your AI workout intensity (fat loss, maintain, or muscle gain).
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Label>What's your primary fitness goal?</Label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "fat-loss", label: "🔥 Fat Loss", desc: "Lose weight & get lean" },
                { id: "muscle-gain", label: "💪 Muscle Gain", desc: "Build strength & size" },
                { id: "endurance", label: "🏃 Endurance", desc: "Improve stamina" },
                { id: "flexibility", label: "🧘 Flexibility", desc: "Increase mobility" },
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => updateProfile("fitnessGoal", goal.id)}
                  className={`p-6 rounded-2xl text-left transition-all ${
                    profile.fitnessGoal === goal.id
                      ? "bg-primary/20 border-2 border-primary"
                      : "bg-secondary/50 border-2 border-transparent hover:bg-secondary"
                  }`}
                >
                  <div className="text-2xl mb-2">{goal.label.split(" ")[0]}</div>
                  <div className="font-semibold">{goal.label.split(" ")[1]} {goal.label.split(" ")[2]}</div>
                  <div className="text-sm text-muted-foreground mt-1">{goal.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Food Preference</Label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "veg", label: "🥗 Vegetarian" },
                  { id: "non-veg", label: "🍗 Non-Veg" },
                  { id: "mixed", label: "🍽️ Mixed" },
                ].map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => updateProfile("foodPreference", pref.id)}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      profile.foodPreference === pref.id
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-secondary/50 border-2 border-transparent hover:bg-secondary"
                    }`}
                  >
                    <div className="text-3xl mb-2">{pref.label.split(" ")[0]}</div>
                    <div className="font-medium text-sm">{pref.label.split(" ")[1]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Workout Experience</Label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "beginner", label: "🌱 Beginner", desc: "New to fitness" },
                  { id: "intermediate", label: "⚡ Intermediate", desc: "Some experience" },
                  { id: "advanced", label: "🏆 Advanced", desc: "Very experienced" },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => updateProfile("workoutExperience", exp.id)}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      profile.workoutExperience === exp.id
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-secondary/50 border-2 border-transparent hover:bg-secondary"
                    }`}
                  >
                    <div className="text-3xl mb-2">{exp.label.split(" ")[0]}</div>
                    <div className="font-medium text-sm">{exp.label.split(" ")[1]}</div>
                    <div className="text-xs text-muted-foreground mt-1">{exp.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Available Workout Time (per day)</Label>
              <div className="grid grid-cols-4 gap-3">
                {["15 min", "30 min", "45 min", "60+ min"].map((time) => (
                  <button
                    key={time}
                    onClick={() => updateProfile("workoutTime", time)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      profile.workoutTime === time
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 hover:bg-secondary"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label>Stress Level (1-10)</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Low</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={profile.stressLevel}
                  onChange={(e) => updateProfile("stressLevel", parseInt(e.target.value))}
                  className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm text-muted-foreground">High</span>
                <span className="w-8 text-center font-semibold text-primary">{profile.stressLevel}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Sleep Quality (1-10)</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Poor</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={profile.sleepQuality}
                  onChange={(e) => updateProfile("sleepQuality", parseInt(e.target.value))}
                  className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm text-muted-foreground">Great</span>
                <span className="w-8 text-center font-semibold text-primary">{profile.sleepQuality}</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12">
        <div className="w-full max-w-2xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-1 mx-1 rounded-full transition-all ${
                      currentStep > step.id ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="glass-card-elevated p-8 rounded-3xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">
                {steps[currentStep - 1].title}
              </h1>
              <p className="text-muted-foreground">
                Step {currentStep} of {steps.length}
              </p>
            </div>

            {/* Step Content */}
            <div className="mb-8">{renderStep()}</div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button variant="gradient" onClick={nextStep} className="gap-2" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    {currentStep === 5 ? "Complete Setup" : "Continue"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;

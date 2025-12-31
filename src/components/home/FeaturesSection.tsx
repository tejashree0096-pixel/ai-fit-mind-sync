import { 
  Brain, 
  Dumbbell, 
  Apple, 
  MessageCircle, 
  Heart, 
  BarChart3,
  Sparkles,
  Target
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Workout Generator",
    description: "Smart algorithms create personalized daily workouts based on your body type, goals, and available equipment.",
    gradient: "from-cyan-400 to-blue-500",
    glow: "group-hover:shadow-[0_0_40px_hsl(187_100%_50%/0.3)]",
  },
  {
    icon: Apple,
    title: "Smart Nutrition Scanner",
    description: "Scan food with your camera or enter manually. Get instant macro breakdowns with Indian food support.",
    gradient: "from-orange-400 to-red-500",
    glow: "group-hover:shadow-[0_0_40px_hsl(35_100%_55%/0.3)]",
  },
  {
    icon: MessageCircle,
    title: "Adaptive AI Coach",
    description: "Your personal coach that detects motivation drops and adjusts plans based on your mental state.",
    gradient: "from-violet-400 to-pink-500",
    glow: "group-hover:shadow-[0_0_40px_hsl(280_100%_65%/0.3)]",
  },
  {
    icon: Heart,
    title: "Mind-Body Wellness",
    description: "Stress-based workout adjustments, breathing exercises, and overtraining detection for holistic health.",
    gradient: "from-pink-400 to-rose-500",
    glow: "group-hover:shadow-[0_0_40px_hsl(330_100%_60%/0.3)]",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "AI-powered insights with weight trends, consistency scores, and personalized weekly fitness reports.",
    gradient: "from-emerald-400 to-teal-500",
    glow: "group-hover:shadow-[0_0_40px_hsl(150_80%_45%/0.3)]",
  },
  {
    icon: Sparkles,
    title: "AI Explainability",
    description: "Understand why AI recommends specific workouts and diets with transparent decision explanations.",
    gradient: "from-amber-400 to-yellow-500",
    glow: "group-hover:shadow-[0_0_40px_hsl(45_100%_55%/0.3)]",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
            <Target className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Powerful Features</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
            Everything You Need to{" "}
            <span className="gradient-text-accent">Succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Advanced AI technology meets fitness science to create the most personalized 
            health experience ever.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group glass-card p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 ${feature.glow}`}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 border border-primary/20">
            <Dumbbell className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Powered by advanced machine learning algorithms
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

import { ClipboardList, Brain, TrendingUp, Trophy } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Create Your Profile",
    description: "Enter your body metrics, fitness goals, diet preferences, and lifestyle details.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analyzes You",
    description: "Our AI processes your data to create a completely personalized fitness plan.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/30",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Train & Track",
    description: "Follow AI workouts, log meals, and watch the system adapt to your progress.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Achieve Goals",
    description: "Reach your fitness targets with continuous AI coaching and motivation.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
            How <span className="gradient-text">AI Fitness Arena</span> Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Four simple steps to transform your fitness journey with artificial intelligence.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={index} className="relative group">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0" />
                )}

                {/* Card */}
                <div className={`glass-card p-6 rounded-2xl border ${item.border} h-full transition-all duration-300 group-hover:-translate-y-2`}>
                  {/* Step Number */}
                  <div className={`text-5xl font-display font-bold ${item.color} opacity-20 mb-4`}>
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl ${item.bg} mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

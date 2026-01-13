import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Brain, Dumbbell, Apple, Heart } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      
      {/* Floating Elements */}
      <div className="absolute top-32 right-[15%] hidden lg:block animate-float">
        <div className="glass-card p-4 rounded-2xl">
          <Dumbbell className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="absolute top-48 left-[10%] hidden lg:block animate-float" style={{ animationDelay: "2s" }}>
        <div className="glass-card p-4 rounded-2xl">
          <Brain className="w-8 h-8 text-accent" />
        </div>
      </div>
      <div className="absolute bottom-32 left-[20%] hidden lg:block animate-float" style={{ animationDelay: "4s" }}>
        <div className="glass-card p-4 rounded-2xl">
          <Apple className="w-8 h-8 text-orange-400" />
        </div>
      </div>
      <div className="absolute bottom-48 right-[12%] hidden lg:block animate-float" style={{ animationDelay: "3s" }}>
        <div className="glass-card p-4 rounded-2xl">
          <Heart className="w-8 h-8 text-destructive" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">AI-Powered Fitness Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 animate-slide-up delay-100">
            Transform Your Body with{" "}
            <span className="gradient-text">Intelligent</span>{" "}
            <span className="gradient-text-accent">AI Coaching</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200">
            Experience personalized workouts, smart nutrition tracking, and adaptive coaching 
            that evolves with your progress. Your AI fitness journey starts here.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
            <Link to="/auth">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto gap-2">
                <Zap className="w-5 h-5" />
                Start Free Today
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 animate-slide-up delay-400">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "500+", label: "Workout Plans" },
              { value: "98%", label: "Success Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display font-bold text-2xl md:text-4xl gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

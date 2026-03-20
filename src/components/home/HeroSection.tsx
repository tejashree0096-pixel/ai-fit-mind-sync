import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/40" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(199 89% 48% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(199 89% 48% / 0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neon-border bg-primary/5 mb-10 animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">AI-Powered Fitness Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-6 animate-slide-up delay-100 tracking-tight">
            AI Fitness
            <br />
            <span className="gradient-text">Arena</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed animate-slide-up delay-200 font-light">
            Train Smart. Move Right.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
            <Link to="/auth">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto gap-2 text-base">
                <Zap className="w-5 h-5" />
                Start Training Free
              </Button>
            </Link>
            <Link to="/workouts">
              <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2 text-base border-border/60 hover:bg-card">
                Explore Workouts
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Workout category cards */}
          <div className="grid grid-cols-2 gap-4 mt-20 max-w-2xl mx-auto animate-slide-up delay-400">
            <Link to="/workouts" className="group">
              <div className="glass-card p-6 rounded-2xl text-center transition-all duration-500 hover:-translate-y-1 neon-border group-hover:neon-glow">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="font-display font-bold text-lg text-foreground">Home Workouts</h3>
                <p className="text-sm text-muted-foreground mt-1">No equipment needed</p>
              </div>
            </Link>
            <Link to="/workouts" className="group">
              <div className="glass-card p-6 rounded-2xl text-center transition-all duration-500 hover:-translate-y-1 neon-border group-hover:neon-glow">
                <div className="text-4xl mb-3">🏋️</div>
                <h3 className="font-display font-bold text-lg text-foreground">Gym Workouts</h3>
                <p className="text-sm text-muted-foreground mt-1">Full equipment access</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

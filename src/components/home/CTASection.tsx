import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
            Ready to Transform Your{" "}
            <span className="gradient-text">Fitness?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands who train smarter with AI-powered coaching and real-time exercise demos.
          </p>
          <Link to="/auth">
            <Button variant="gradient" size="xl" className="gap-2">
              <Zap className="w-5 h-5" />
              Start Your Free Trial
            </Button>
          </Link>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {["No Credit Card Required", "100% Free to Start", "Cancel Anytime"].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

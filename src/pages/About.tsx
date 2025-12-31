import { Layout } from "@/components/layout/Layout";
import { Brain, Target, Users, Award, Code, Database, Cpu, LineChart } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Final Year BCA Project</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl mb-6">
              About <span className="gradient-text">AI Fitness Arena</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              An innovative AI-powered fitness platform designed as a final-year computer science 
              project, combining machine learning with health science.
            </p>
          </div>
        </div>
      </section>

      {/* Project Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display font-bold text-3xl mb-6">
                  Project <span className="gradient-text-accent">Vision</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  AI Fitness Arena goes beyond traditional fitness apps by implementing 
                  a virtual AI fitness coach that combines workout planning, nutrition analysis, 
                  and mental wellness monitoring into one unified platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The system continuously learns from user behavior, adapting recommendations 
                  based on progress, stress levels, and lifestyle patterns to provide truly 
                  personalized health guidance.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Brain, label: "AI-Powered", value: "Smart Algorithms" },
                  { icon: Target, label: "Goal-Oriented", value: "Custom Plans" },
                  { icon: Users, label: "User-Centric", value: "Personalized" },
                  { icon: LineChart, label: "Data-Driven", value: "Analytics" },
                ].map((item, index) => (
                  <div key={index} className="glass-card p-6 rounded-2xl text-center">
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="font-semibold text-foreground">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl mb-4">
                Technology <span className="gradient-text">Stack</span>
              </h2>
              <p className="text-muted-foreground">Built with modern, industry-standard technologies</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Code, name: "React + TypeScript", desc: "Frontend Framework" },
                { icon: Cpu, name: "AI/ML Algorithms", desc: "Smart Processing" },
                { icon: Database, name: "Cloud Database", desc: "Data Storage" },
                { icon: LineChart, name: "Analytics Engine", desc: "Progress Tracking" },
              ].map((tech, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl text-center group hover:-translate-y-2 transition-all duration-300">
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                    <tech.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-semibold text-foreground mb-1">{tech.name}</div>
                  <div className="text-sm text-muted-foreground">{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl mb-8 text-center">
              Unique <span className="gradient-text-accent">Features</span>
            </h2>

            <div className="space-y-6">
              {[
                {
                  title: "Adaptive AI Coach",
                  desc: "Detects motivation drops through missed workouts and reduced food logging, responding with encouragement and plan adjustments.",
                },
                {
                  title: "Indian Food Intelligence",
                  desc: "Complete support for Indian cuisine including dosa, chapati, rice, paneer, soya with portion estimation using hand-size methods.",
                },
                {
                  title: "Mind-Body Wellness Sync",
                  desc: "Stress-based workout adjustments, breathing exercises, and overtraining detection for holistic health management.",
                },
                {
                  title: "AI Explainability",
                  desc: "Transparent AI decisions with clear explanations for why specific workouts and diets are recommended.",
                },
              ].map((feature, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl">
                  <h3 className="font-display font-semibold text-lg text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

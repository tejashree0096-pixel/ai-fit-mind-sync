import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send, GraduationCap, Code, Brain } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">BCA Final Year Project</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Project <span className="gradient-text">Information</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Learn more about this AI-powered fitness platform project
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Project Details */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="font-display font-semibold text-xl mb-4">About the Project</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AI Fitness Arena is a comprehensive final-year BCA project that demonstrates 
                  the practical application of artificial intelligence in the health and fitness domain.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The project showcases modern web development practices, AI integration, 
                  and user-centered design principles.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-display font-semibold text-lg mb-4">Key Technologies</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Code, label: "React + TypeScript" },
                    { icon: Brain, label: "AI/ML Algorithms" },
                    { icon: MessageSquare, label: "Natural Language" },
                    { icon: GraduationCap, label: "Research-Based" },
                  ].map((tech, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                      <tech.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{tech.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-display font-semibold text-lg mb-4">Project Objectives</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Develop AI-powered personalized fitness recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Create intelligent nutrition tracking with Indian food support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Implement adaptive coaching based on user behavior analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Integrate mental wellness monitoring with fitness planning
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card-elevated p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-xl">Get in Touch</h2>
                  <p className="text-sm text-muted-foreground">Have questions about the project?</p>
                </div>
              </div>

              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className="bg-secondary/50 border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="bg-secondary/50 border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Project Inquiry"
                    className="bg-secondary/50 border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={4}
                    className="bg-secondary/50 border-0 resize-none"
                  />
                </div>
                <Button variant="gradient" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <div className="glass-card p-6 rounded-2xl inline-block">
              <p className="text-muted-foreground">
                🎓 This is a <span className="text-primary font-medium">Final Year BCA Project</span> demonstrating 
                AI applications in health and fitness technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

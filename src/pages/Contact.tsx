import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send, Code, Brain, Dumbbell, Heart } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Get in touch with our team for any questions or support
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* About Section */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="font-display font-semibold text-xl mb-4">About AI Fitness Arena</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AI Fitness Arena is a comprehensive fitness platform that leverages 
                  artificial intelligence to provide personalized workout and nutrition guidance.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform combines modern technology with fitness expertise to help you 
                  achieve your health and fitness goals.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-display font-semibold text-lg mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Brain, label: "AI-Powered Coach" },
                    { icon: Dumbbell, label: "Smart Workouts" },
                    { icon: Heart, label: "Nutrition Tracking" },
                    { icon: Code, label: "Progress Analytics" },
                  ].map((tech, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                      <tech.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{tech.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-display font-semibold text-lg mb-4">What We Offer</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    AI-powered personalized fitness recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Intelligent nutrition tracking with Indian food support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Adaptive coaching based on your progress
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Comprehensive progress tracking and analytics
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
                  <p className="text-sm text-muted-foreground">We'd love to hear from you</p>
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
                    placeholder="How can we help?"
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
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
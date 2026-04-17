import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Heart } from "lucide-react";
import logoImage from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-card/30 border-t border-border/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="AI Fitness Arena" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Your AI-powered fitness companion. Personalized workouts with real-time demos, 
              smart nutrition tracking, and adaptive coaching.
            </p>
            <div className="flex gap-3 mt-6">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors neon-border">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Dashboard", "Workouts", "Nutrition", "AI Coach", "Progress"].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(" ", "-")}`} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Fitness Arena. Train smarter <Heart className="w-4 h-4 inline text-destructive" />
          </p>
          <p className="text-sm text-muted-foreground">AI-Powered Personal Fitness</p>
        </div>
      </div>
    </footer>
  );
};

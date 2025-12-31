import { Link } from "react-router-dom";
import { Dumbbell, Github, Linkedin, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-xl">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="gradient-text">AI Fitness</span>
                <span className="text-foreground"> Arena</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Your AI-powered fitness companion. Personalized workouts, smart nutrition tracking, 
              and adaptive coaching to help you achieve your fitness goals.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Dashboard", "Workouts", "Nutrition", "AI Coach", "Progress"].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Project Info</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Final Year BCA Project</li>
              <li>AI & Machine Learning</li>
              <li>Health & Fitness Domain</li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About the Project →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2024 AI Fitness Arena. Built with <Heart className="w-4 h-4 inline text-destructive" /> for Final Year BCA Project.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by AI • React • TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

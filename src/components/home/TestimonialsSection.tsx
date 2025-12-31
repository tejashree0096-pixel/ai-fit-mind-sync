import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Lost 15kg in 4 months",
    avatar: "PS",
    content: "The AI coach understood my vegetarian diet and created perfect meal plans. The workouts adapt when I'm stressed!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Gained 8kg muscle",
    avatar: "RV",
    content: "Finally, an app that understands Indian food! The portion estimation with hand sizes is genius.",
    rating: 5,
  },
  {
    name: "Anjali Patel",
    role: "Improved energy levels",
    avatar: "AP",
    content: "The mind-body sync feature noticed I was overtraining before I did. Recovery suggestions were perfect.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
            Real Results, Real <span className="gradient-text">Stories</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See how AI Fitness Arena has transformed lives across India.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card-elevated p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/20 mb-4" />

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-semibold text-primary-foreground">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

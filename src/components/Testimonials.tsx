import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    role: "Bengaluru · Weight loss journey",
    quote:
      "I told FlavorAI my pantry and goal — it gave me a week of Indian high-protein meals I actually loved. Down 4kg in a month.",
  },
  {
    name: "Marcus T.",
    role: "London · Busy dad of two",
    quote:
      "The grocery planner alone is worth it. 15-minute weeknight dinners, zero food waste, kids ask for seconds.",
  },
  {
    name: "Ananya R.",
    role: "Mumbai · Vegetarian",
    quote:
      "Finally an AI that gets veg cooking. Authentic recipes, real macros, and the planner is gorgeous.",
  },
];

const Testimonials = () => (
  <section className="relative max-w-6xl mx-auto px-5 sm:px-6 py-14 md:py-20 border-t border-border">
    <div className="text-center max-w-2xl mx-auto mb-10">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
        Loved by home cooks worldwide
      </h2>
      <p className="mt-3 text-muted-foreground">Real results from real kitchens.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {testimonials.map((t) => (
        <figure
          key={t.name}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur p-6 hover:border-primary/30 transition-colors"
        >
          <div className="flex gap-0.5 mb-3" aria-label="5 star rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
          <blockquote className="text-sm leading-relaxed text-foreground/90">
            "{t.quote}"
          </blockquote>
          <figcaption className="mt-4 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{t.name}</span> · {t.role}
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

export default Testimonials;

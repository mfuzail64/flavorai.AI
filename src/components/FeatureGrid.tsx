import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Leaf, Flame, ShoppingBasket, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Meal plan in 10 seconds",
    desc: "Tell us your goal — get a 7-day plan with macros, prep time, and a grocery list.",
    href: "/ai-generator",
    accent: "from-orange-500/20 to-amber-500/0",
  },
  {
    icon: Leaf,
    title: "Indian · Keto · Vegetarian",
    desc: "Plans tuned for your cuisine and diet. Authentic flavors, smarter portions.",
    href: "/collections",
    accent: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    icon: Flame,
    title: "Weight-loss recipes",
    desc: "High-protein, low-calorie meals that actually taste good. Track every macro.",
    href: "/explore?collection=weight_loss",
    accent: "from-rose-500/20 to-rose-500/0",
  },
  {
    icon: ShoppingBasket,
    title: "AI grocery planner",
    desc: "Auto-built shopping lists from your weekly plan — never overbuy again.",
    href: "/ai-generator",
    accent: "from-sky-500/20 to-sky-500/0",
  },
];

const FeatureGrid = () => (
  <section className="relative max-w-6xl mx-auto px-5 sm:px-6 py-14 md:py-20">
    <div className="text-center max-w-2xl mx-auto mb-10">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
        Everything you need to eat better
      </h2>
      <p className="mt-3 text-muted-foreground text-balance">
        From the ingredients in your fridge to a full week of meals — FlavorAI handles it all.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map(({ icon: Icon, title, desc, href, accent }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
        >
          <Link
            to={href}
            className="group relative block h-full rounded-2xl border border-border bg-card/70 backdrop-blur p-5 hover:border-primary/40 hover:shadow-card-hover transition-all"
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeatureGrid;

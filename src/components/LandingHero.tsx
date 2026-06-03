import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart, CreditCard } from "lucide-react";

interface Props {
  onSeeDemo: () => void;
}

const trust = [
  { icon: ShieldCheck, label: "Secure & private" },
  { icon: CreditCard, label: "No credit card" },
  { icon: Sparkles, label: "Personalized by AI" },
  { icon: Zap, label: "Results in seconds" },
];

const LandingHero = ({ onSeeDemo }: Props) => {
  return (
    <section className="relative overflow-hidden">
      {/* glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-[520px] gradient-hero" />
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-12 pb-16 md:pt-20 md:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3.5 py-1.5 text-xs sm:text-sm text-muted-foreground"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          AI Meal Coach · trusted by 50k+ home cooks
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-5 text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          AI Meal Coach for{" "}
          <span className="bg-clip-text text-transparent gradient-primary">
            Personalized Recipes
          </span>{" "}
          & Meal Plans
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-5 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
        >
          Get smart meals, calories, and nutrition guidance in seconds — built around what's already in your kitchen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="h-12 px-7 rounded-full gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition-opacity w-full sm:w-auto"
          >
            <Link to="/auth">
              Start Free <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button
            onClick={onSeeDemo}
            size="lg"
            variant="outline"
            className="h-12 px-7 rounded-full border-border bg-card/60 backdrop-blur hover:bg-card w-full sm:w-auto"
          >
            See Demo
          </Button>
        </motion.div>

        {/* Trust strip */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {trust.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/60 backdrop-blur px-3 py-2.5 text-xs sm:text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{label}</span>
            </li>
          ))}
        </motion.ul>

        {/* social proof */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
          <span>4.9 / 5 from 2,300+ reviews</span>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;

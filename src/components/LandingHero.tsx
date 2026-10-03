import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart, CreditCard, Search } from "lucide-react";

interface Props {
  onSeeDemo: () => void;
}

const trust = [
  { icon: ShieldCheck, label: "hero.trustSecure" },
  { icon: CreditCard, label: "hero.trustCard" },
  { icon: Sparkles, label: "hero.trustAi" },
  { icon: Zap, label: "hero.trustFast" },
];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const LandingHero = ({ onSeeDemo }: Props) => {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const handleGenerate = () => {
    onSeeDemo();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSeeDemo();
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] md:h-[800px] md:w-[800px] rounded-full bg-primary/8 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-20 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        {/* Top label */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-3"
        >
          <span className="hidden sm:block h-px w-8 bg-primary/40" />
          {/* All-caps reserved for the short label; the rest is sentence case */}
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">{t("hero.label")}</span>
            <span className="text-muted-foreground">{t("hero.tagline")}</span>
          </span>
          <span className="hidden sm:block h-px w-8 bg-primary/40" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-serif text-balance text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[0.95] text-foreground"
        >
          {t("hero.title1")}{" "}
          <span className="italic text-primary">{t("hero.titleAccent")}</span>{" "}
          {t("hero.title2")}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 md:mt-8 font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Command bar */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-10 w-full max-w-2xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 to-amber-500/20 blur opacity-20 group-hover:opacity-35 group-focus-within:opacity-45 transition duration-700" />
            <div className="relative flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-xl p-2 shadow-card">
              <div className="flex flex-1 items-center w-full px-3 sm:px-4">
                <Search className="h-5 w-5 text-primary/70 shrink-0 me-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={onSeeDemo}
                  onKeyDown={handleKeyDown}
                  placeholder={t("hero.placeholder")}
                  aria-label={t("hero.inputLabel")}
                  className="w-full bg-transparent border-none outline-none py-3.5 sm:py-4 text-foreground placeholder:text-muted-foreground/70 font-body text-base"
                />
              </div>
              <Button
                onClick={handleGenerate}
                variant="hero"
                size="xl"
                className="w-full sm:w-auto whitespace-nowrap"
              >
                {t("hero.cta")}
              </Button>
            </div>
          </div>

          {/* Secondary actions — single centered row, matching baselines */}
          <div className="mt-5 flex items-center justify-center gap-6">
            <Button
              onClick={onSeeDemo}
              variant="link"
              size="sm"
              className="text-muted-foreground hover:text-primary no-underline hover:no-underline"
            >
              {t("hero.howItWorks")}
            </Button>

            <Button asChild variant="link" size="sm">
              <Link to="/auth">
                {t("hero.createAccount")} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Trust strip */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 md:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {trust.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card/40 backdrop-blur px-3 py-2.5 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate font-body">{t(label)}</span>
            </li>
          ))}
        </motion.ul>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground font-body"
        >
          <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
          <span>{t("hero.free")}</span>
        </motion.div>
      </div>

      {/* Decorative accents */}
      <div className="pointer-events-none absolute bottom-8 left-8 lg:left-16 opacity-10 hidden md:block">
        <span className="font-serif text-[10rem] leading-none text-primary select-none">"</span>
      </div>
      <div className="pointer-events-none absolute top-24 right-8 lg:right-16 opacity-[0.07] hidden md:block">
        <div className="w-28 h-28 lg:w-36 lg:h-36 border border-primary/40 rounded-full flex items-center justify-center p-4">
          <div className="w-full h-full border border-dashed border-primary/25 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;

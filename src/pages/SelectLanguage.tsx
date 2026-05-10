import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import logo from "@/assets/flavorai-logo.png";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/language/LanguageSelector";
import { useAuth } from "@/contexts/AuthProvider";
import { useLanguage } from "@/hooks/useLanguage";
import { detectBrowserLanguage, getLangMeta } from "@/i18n/languages";

const SelectLanguage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, profile } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const suggestion = useMemo(() => detectBrowserLanguage(), []);
  const [selected, setSelected] = useState<string>(lang || suggestion || "en");
  const [saving, setSaving] = useState(false);

  // Preview the language while picking
  useEffect(() => {
    if (selected && selected !== lang) setLang(selected, { silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (profile?.preferred_language) return <Navigate to={from} replace />;

  const meta = getLangMeta(selected);

  const handleContinue = async () => {
    setSaving(true);
    await setLang(selected);
    navigate(from, { replace: true });
  };

  const handleSkip = async () => {
    setSaving(true);
    await setLang("en");
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-amber-400/30 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <img src={logo} alt="FlavorAI" className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight">
              Flavor<span className="text-primary">AI</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> {t("language.welcome")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("language.chooseTitle")}
          </h1>
          <p className="text-muted-foreground">{t("language.chooseSubtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl p-5 md:p-7 shadow-2xl"
        >
          <LanguageSelector
            value={selected}
            onChange={setSelected}
            suggestion={suggestion}
          />
        </motion.div>

        <div className="sticky bottom-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-3 shadow-xl"
          >
            <Button
              onClick={handleContinue}
              disabled={saving}
              size="lg"
              className="w-full sm:flex-1 h-12 rounded-xl shadow-glow"
            >
              {t("language.continueIn", { lang: meta.nativeName })}
            </Button>
            <button
              onClick={handleSkip}
              disabled={saving}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              {t("language.skipDefault")}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SelectLanguage;

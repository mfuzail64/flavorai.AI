import { useMemo, useState } from "react";
import Header from "@/components/Header";
import LanguageSelector from "@/components/language/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthProvider";
import { detectBrowserLanguage, getLangMeta } from "@/i18n/languages";
import { motion } from "framer-motion";
import { Globe, User } from "lucide-react";

const Settings = () => {
  const { t, lang, setLang, current } = useLanguage();
  const { user, profile } = useAuth();
  const suggestion = useMemo(() => detectBrowserLanguage(), []);
  const [selected, setSelected] = useState<string>(lang);

  const handleChange = async (code: string) => {
    setSelected(code);
    await setLang(code);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-1">{t("settings.title")}</h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
        </motion.div>

        {user && (
          <section className="rounded-2xl border border-border bg-card/70 backdrop-blur p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">{t("settings.profileSection")}</h2>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">{t("auth.name")}</dt>
                <dd className="font-medium text-foreground">{profile?.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("auth.email")}</dt>
                <dd className="font-medium text-foreground truncate">{user.email}</dd>
              </div>
            </dl>
          </section>
        )}

        <section className="rounded-2xl border border-border bg-card/70 backdrop-blur p-5">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground">{t("settings.languageSection")}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{t("settings.languageDesc")}</p>
          <p className="text-xs text-muted-foreground mb-4">
            {t("language.currentLanguage")}: <span className="font-medium text-foreground">{getLangMeta(lang).nativeName}</span>
          </p>
          <LanguageSelector value={selected} onChange={handleChange} suggestion={suggestion} />
        </section>
      </main>
    </div>
  );
};

export default Settings;

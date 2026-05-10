import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { LANGUAGES, isRTL, type LangMeta } from "@/i18n/languages";
import { toast } from "sonner";

const STORAGE_KEY = "flavorai-lang";

/**
 * Apply HTML dir + lang attributes for the active language.
 */
function applyHtmlAttrs(code: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = code;
  document.documentElement.dir = isRTL(code) ? "rtl" : "ltr";
}

export function useLanguage() {
  const { i18n, t } = useTranslation();
  const { user, profile } = useAuth();

  // Sync HTML attrs whenever language changes
  useEffect(() => {
    applyHtmlAttrs(i18n.language);
  }, [i18n.language]);

  // When the profile loads with a saved preference, switch to it
  useEffect(() => {
    const saved = profile?.preferred_language;
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
      try { localStorage.setItem(STORAGE_KEY, saved); } catch { /* ignore */ }
    }
  }, [profile?.preferred_language, i18n]);

  const setLang = useCallback(
    async (code: string, opts: { silent?: boolean } = {}) => {
      await i18n.changeLanguage(code);
      try { localStorage.setItem(STORAGE_KEY, code); } catch { /* ignore */ }
      applyHtmlAttrs(code);

      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ preferred_language: code, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);
        if (error && !opts.silent) toast.error(error.message);
      }
      if (!opts.silent) toast.success(t("language.savedToast"));
    },
    [i18n, t, user]
  );

  const current: LangMeta =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return {
    t,
    lang: i18n.language,
    setLang,
    isRTL: isRTL(i18n.language),
    current,
    languages: LANGUAGES,
  };
}

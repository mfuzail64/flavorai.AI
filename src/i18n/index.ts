import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./locales";
import { landing } from "./locales/landing";
import { LANGUAGE_CODES, isRTL } from "./languages";

// Merge landing strings into each language's translation namespace.
const merged: Record<string, { translation: Record<string, unknown> }> = {};
for (const [code, res] of Object.entries(resources)) {
  merged[code] = { translation: { ...(res as { translation: object }).translation, ...(landing[code] ?? {}) } };
}

/** Keep <html lang/dir> in sync with the active language everywhere in the app. */
function applyHtmlAttrs(code: string) {
  if (typeof document === "undefined") return;
  const base = code.split("-")[0];
  document.documentElement.lang = base;
  document.documentElement.dir = isRTL(base) ? "rtl" : "ltr";
}

i18n.on("languageChanged", applyHtmlAttrs);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: merged,
    fallbackLng: "en",
    supportedLngs: LANGUAGE_CODES,
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "flavorai-lang",
      caches: ["localStorage"],
    },
    returnNull: false,
  })
  .then(() => applyHtmlAttrs(i18n.language || "en"));

export default i18n;

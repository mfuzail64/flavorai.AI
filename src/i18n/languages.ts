export interface LangMeta {
  code: string;
  nativeName: string;
  englishName: string;
  flag: string;
  rtl?: boolean;
  featured?: boolean;
  /** ISO region codes that suggest this language */
  regions?: string[];
}

export const LANGUAGES: LangMeta[] = [
  { code: "en", nativeName: "English",   englishName: "English",   flag: "🇬🇧", featured: true,  regions: ["US", "GB", "AU", "CA", "NZ", "IN"] },
  { code: "kn", nativeName: "ಕನ್ನಡ",      englishName: "Kannada",   flag: "🇮🇳", featured: true,  regions: ["IN-KA"] },
  { code: "ur", nativeName: "اُردُو",       englishName: "Urdu",      flag: "🇵🇰", rtl: true, featured: true, regions: ["PK", "IN-UP"] },
  { code: "ta", nativeName: "தமிழ்",       englishName: "Tamil",     flag: "🇮🇳", featured: true,  regions: ["IN-TN", "LK", "SG"] },
  { code: "ml", nativeName: "മലയാളം",     englishName: "Malayalam", flag: "🇮🇳", featured: true,  regions: ["IN-KL"] },
  { code: "hi", nativeName: "हिन्दी",       englishName: "Hindi",     flag: "🇮🇳", regions: ["IN", "IN-DL", "IN-UP", "IN-MP"] },
  { code: "te", nativeName: "తెలుగు",     englishName: "Telugu",    flag: "🇮🇳", regions: ["IN-AP", "IN-TG"] },
  { code: "ar", nativeName: "العربية",    englishName: "Arabic",    flag: "🇸🇦", rtl: true, regions: ["SA", "AE", "EG", "JO", "QA", "OM", "KW", "BH"] },
  { code: "mr", nativeName: "मराठी",       englishName: "Marathi",   flag: "🇮🇳", regions: ["IN-MH"] },
  { code: "bn", nativeName: "বাংলা",       englishName: "Bengali",   flag: "🇧🇩", regions: ["BD", "IN-WB"] },
];

export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code);
export const RTL_CODES = LANGUAGES.filter((l) => l.rtl).map((l) => l.code);

export function getLangMeta(code?: string | null): LangMeta {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function isRTL(code?: string | null): boolean {
  return RTL_CODES.includes(code ?? "");
}

/**
 * Suggest a language based on `navigator.language`.
 * Returns the best matching code, or "en".
 */
export function detectBrowserLanguage(): string {
  if (typeof navigator === "undefined") return "en";
  const candidates = [navigator.language, ...(navigator.languages ?? [])];
  for (const raw of candidates) {
    if (!raw) continue;
    const lc = raw.toLowerCase();
    const base = lc.split("-")[0];
    const direct = LANGUAGES.find((l) => l.code === base);
    if (direct) return direct.code;
    // region-aware match (e.g. en-IN -> kn? no; we keep it conservative)
    const region = lc.split("-")[1]?.toUpperCase();
    if (region) {
      const regionMatch = LANGUAGES.find((l) => l.regions?.some((r) => r.endsWith(region)));
      if (regionMatch) return regionMatch.code;
    }
  }
  return "en";
}

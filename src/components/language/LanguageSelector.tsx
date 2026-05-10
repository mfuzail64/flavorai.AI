import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import LanguageCard from "./LanguageCard";
import { LANGUAGES, type LangMeta } from "@/i18n/languages";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onChange: (code: string) => void;
  suggestion?: string;
}

const LanguageSelector = ({ value, onChange, suggestion }: Props) => {
  const { t } = useTranslation();
  const [q, setQ] = useState("");

  const sorted: LangMeta[] = useMemo(() => {
    const arr = [...LANGUAGES];
    arr.sort((a, b) => {
      // Suggested first, then featured, then alphabetical
      const sA = suggestion === a.code ? 0 : 1;
      const sB = suggestion === b.code ? 0 : 1;
      if (sA !== sB) return sA - sB;
      const fA = a.featured ? 0 : 1;
      const fB = b.featured ? 0 : 1;
      if (fA !== fB) return fA - fB;
      return a.englishName.localeCompare(b.englishName);
    });
    if (!q.trim()) return arr;
    const lc = q.trim().toLowerCase();
    return arr.filter(
      (l) => l.englishName.toLowerCase().includes(lc) || l.nativeName.toLowerCase().includes(lc),
    );
  }, [q, suggestion]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("language.searchPlaceholder")}
          className="pl-10 h-11 rounded-xl bg-card/60 backdrop-blur"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((l) => (
          <LanguageCard
            key={l.code}
            lang={l}
            selected={value === l.code}
            suggested={suggestion === l.code}
            suggestedLabel={t("language.suggested")}
            onClick={() => onChange(l.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LangMeta } from "@/i18n/languages";
import { cn } from "@/lib/utils";

interface Props {
  lang: LangMeta;
  selected: boolean;
  suggested?: boolean;
  suggestedLabel?: string;
  onClick: () => void;
}

const LanguageCard = ({ lang, selected, suggested, suggestedLabel, onClick }: Props) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full text-left rounded-2xl border p-4 transition-all backdrop-blur-xl",
        "bg-card/60 border-border/60 hover:border-primary/40 hover:bg-card/80",
        selected && "border-primary ring-2 ring-primary shadow-[0_0_30px_hsl(var(--primary)/0.35)] bg-card",
      )}
      aria-pressed={selected}
    >
      {suggested && (
        <span className="absolute -top-2 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground">
          {suggestedLabel ?? "Suggested"}
        </span>
      )}

      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none" aria-hidden>{lang.flag}</span>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-foreground truncate"
            dir={lang.rtl ? "rtl" : "ltr"}
          >
            {lang.nativeName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{lang.englishName}</p>
        </div>
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background/40",
          )}
        >
          {selected && <Check className="h-3.5 w-3.5" />}
        </span>
      </div>
    </motion.button>
  );
};

export default LanguageCard;

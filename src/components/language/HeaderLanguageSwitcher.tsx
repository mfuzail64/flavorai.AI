import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";

const HeaderLanguageSwitcher = () => {
  const { lang, setLang, languages, current, t } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t("header.chooseLanguage")} className="gap-1.5 px-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">{current.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        <DropdownMenuRadioGroup value={lang.split("-")[0]} onValueChange={(c) => setLang(c)}>
          {languages.map((l) => (
            <DropdownMenuRadioItem key={l.code} value={l.code}>
              <span lang={l.code} dir={l.rtl ? "rtl" : "ltr"}>{l.nativeName}</span>
              <span className="ms-2 text-xs text-muted-foreground">{l.englishName}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderLanguageSwitcher;

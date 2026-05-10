import { useState, KeyboardEvent } from "react";
import { Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface IngredientInputProps {
  onAddIngredient: (ingredient: string) => void;
}

const IngredientInput = ({ onAddIngredient }: IngredientInputProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed) {
      onAddIngredient(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 w-full max-w-xl">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("home.addPlaceholder")}
          className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-card"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="px-6 py-3.5 gradient-hero text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all hover:shadow-glow active:scale-95 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">{t("home.add")}</span>
      </button>
    </div>
  );
};

export default IngredientInput;

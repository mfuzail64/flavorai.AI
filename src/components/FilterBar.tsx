import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CUISINES = [
  "Indian", "Italian", "Chinese", "Japanese", "Korean", "Thai", "Mexican",
  "American", "Arabic", "Turkish", "Mediterranean", "French", "Spanish",
  "African", "Indonesian",
];

export const DIETS = ["Vegetarian", "Vegan", "Keto", "High-Protein", "Gluten-Free"];

export interface FilterState {
  cuisine?: string;
  diet?: string;
  maxTime?: number;
  maxCalories?: number;
}

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

const FilterBar = ({ value, onChange }: Props) => {
  const { t } = useTranslation();
  const hasAny = value.cuisine || value.diet || value.maxTime || value.maxCalories;

  const TIMES = [
    { label: t("filter.under15"), value: 15 },
    { label: t("filter.under30"), value: 30 },
    { label: t("filter.under60"), value: 60 },
  ];
  const CALORIES = [
    { label: t("filter.under300"), value: 300 },
    { label: t("filter.under500"), value: 500 },
    { label: t("filter.under800"), value: 800 },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={value.cuisine ?? "_any"}
        onValueChange={(v) => onChange({ ...value, cuisine: v === "_any" ? undefined : v })}
      >
        <SelectTrigger className="w-[150px] h-9 rounded-full">
          <SelectValue placeholder={t("filter.cuisine")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_any">{t("filter.anyCuisine")}</SelectItem>
          {CUISINES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.diet ?? "_any"}
        onValueChange={(v) => onChange({ ...value, diet: v === "_any" ? undefined : v })}
      >
        <SelectTrigger className="w-[140px] h-9 rounded-full">
          <SelectValue placeholder={t("filter.diet")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_any">{t("filter.anyDiet")}</SelectItem>
          {DIETS.map((d) => (
            <SelectItem key={d} value={d}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.maxTime ? String(value.maxTime) : "_any"}
        onValueChange={(v) => onChange({ ...value, maxTime: v === "_any" ? undefined : Number(v) })}
      >
        <SelectTrigger className="w-[150px] h-9 rounded-full">
          <SelectValue placeholder={t("filter.time")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_any">{t("filter.anyTime")}</SelectItem>
          {TIMES.map((tt) => (
            <SelectItem key={tt.value} value={String(tt.value)}>{tt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.maxCalories ? String(value.maxCalories) : "_any"}
        onValueChange={(v) => onChange({ ...value, maxCalories: v === "_any" ? undefined : Number(v) })}
      >
        <SelectTrigger className="w-[150px] h-9 rounded-full">
          <SelectValue placeholder={t("filter.calories")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_any">{t("filter.anyCalories")}</SelectItem>
          {CALORIES.map((c) => (
            <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasAny && (
        <Button variant="ghost" size="sm" className="h-9 rounded-full" onClick={() => onChange({})}>
          <X className="w-4 h-4 mr-1" /> {t("filter.clear")}
        </Button>
      )}
    </div>
  );
};

export default FilterBar;

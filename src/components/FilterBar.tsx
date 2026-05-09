import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export const CUISINES = [
  "Indian", "Italian", "Chinese", "Japanese", "Korean", "Thai", "Mexican",
  "American", "Arabic", "Turkish", "Mediterranean", "French", "Spanish",
  "African", "Indonesian",
];

export const DIETS = ["Vegetarian", "Vegan", "Keto", "High-Protein", "Gluten-Free"];

export const TIMES = [
  { label: "Under 15 min", value: 15 },
  { label: "Under 30 min", value: 30 },
  { label: "Under 60 min", value: 60 },
];

export const CALORIES = [
  { label: "Under 300", value: 300 },
  { label: "Under 500", value: 500 },
  { label: "Under 800", value: 800 },
];

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
  const hasAny = value.cuisine || value.diet || value.maxTime || value.maxCalories;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={value.cuisine ?? "_any"}
        onValueChange={(v) => onChange({ ...value, cuisine: v === "_any" ? undefined : v })}
      >
        <SelectTrigger className="w-[150px] h-9 rounded-full">
          <SelectValue placeholder="Cuisine" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_any">Any cuisine</SelectItem>
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
          <SelectValue placeholder="Diet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_any">Any diet</SelectItem>
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
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_any">Any time</SelectItem>
          {TIMES.map((t) => (
            <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.maxCalories ? String(value.maxCalories) : "_any"}
        onValueChange={(v) => onChange({ ...value, maxCalories: v === "_any" ? undefined : Number(v) })}
      >
        <SelectTrigger className="w-[150px] h-9 rounded-full">
          <SelectValue placeholder="Calories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_any">Any calories</SelectItem>
          {CALORIES.map((c) => (
            <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasAny && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 rounded-full"
          onClick={() => onChange({})}
        >
          <X className="w-4 h-4 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
};

export default FilterBar;

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AspectRatio = "square" | "card" | "wide" | "auto";

interface Props {
  src?: string | null;
  alt: string;
  category?: string;
  cuisine?: string;
  status?: "pending" | "ready" | "failed" | string;
  aspect?: AspectRatio;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  rounded?: boolean;
  showSpinner?: boolean;
}

// Curated, high-resolution Unsplash fallbacks — auto-format & responsive.
const CATEGORY_FALLBACKS: Record<string, string> = {
  breakfast: "photo-1525351484163-7529414344d8", // eggs/toast
  brunch: "photo-1533089860892-a7c6f0a88666",
  lunch: "photo-1547592180-85f173990554",
  dinner: "photo-1559847844-5315695dadae",
  dessert: "photo-1565958011703-44f9829ba187", // cake
  snack: "photo-1599490659213-e2b9527bd087",
  drink: "photo-1437418747212-8d9709afab22", // smoothie
  beverage: "photo-1437418747212-8d9709afab22",
  salad: "photo-1512621776951-a57141f2eefd",
  soup: "photo-1547592166-23ac45744acd",
  appetizer: "photo-1541529086526-db283c563270",
  "main course": "photo-1559847844-5315695dadae",
  side: "photo-1467003909585-2f8a72700288",
  bread: "photo-1509440159596-0249088772ff",
  baking: "photo-1509440159596-0249088772ff",
};

const CUISINE_FALLBACKS: Record<string, string> = {
  indian: "photo-1585937421612-70a008356fbe", // curry
  italian: "photo-1551183053-bf91a1d81141",
  mexican: "photo-1565299585323-38d6b0865b47",
  japanese: "photo-1579584425555-c3ce17fd4351",
  chinese: "photo-1525755662778-989d0524087e",
  thai: "photo-1559314809-0d155014e29e",
  french: "photo-1414235077428-338989a2e8c0",
  mediterranean: "photo-1505253716362-afaea1d3d1af",
  american: "photo-1568901346375-23c9450c58cd",
  korean: "photo-1583224994076-ae3a39bcc35e",
  middle_eastern: "photo-1540713434306-58505cf1b6fc",
};

const GENERIC_FALLBACK = "photo-1495195134817-aeb325a55b65";

const buildUnsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

const buildSrcSet = (id: string) =>
  [400, 600, 800, 1200, 1600]
    .map((w) => `${buildUnsplash(id, w)} ${w}w`)
    .join(", ");

const pickFallback = (category?: string, cuisine?: string) => {
  const c = category?.toLowerCase().trim();
  const cu = cuisine?.toLowerCase().trim();
  if (c && CATEGORY_FALLBACKS[c]) return CATEGORY_FALLBACKS[c];
  if (cu && CUISINE_FALLBACKS[cu]) return CUISINE_FALLBACKS[cu];
  // Loose contains-match
  if (c) {
    for (const k of Object.keys(CATEGORY_FALLBACKS)) if (c.includes(k)) return CATEGORY_FALLBACKS[k];
  }
  if (cu) {
    for (const k of Object.keys(CUISINE_FALLBACKS)) if (cu.includes(k)) return CUISINE_FALLBACKS[k];
  }
  return GENERIC_FALLBACK;
};

const aspectClass: Record<AspectRatio, string> = {
  square: "aspect-square",
  card: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  auto: "",
};

const RecipeImage = ({
  src,
  alt,
  category,
  cuisine,
  status,
  aspect = "card",
  priority = false,
  className,
  imgClassName,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  rounded = false,
  showSpinner = true,
}: Props) => {
  const isPending = status && status !== "ready" && status !== "failed" && !src;
  const fallbackId = pickFallback(category, cuisine);
  const fallbackSrc = buildUnsplash(fallbackId, 1200);
  const fallbackSrcSet = buildSrcSet(fallbackId);

  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setErrored(false);
    setLoaded(false);
  }, [src]);

  const useFallback = errored || !src || status === "failed";
  const finalSrc = useFallback ? fallbackSrc : src!;
  const finalSrcSet = useFallback ? fallbackSrcSet : undefined;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectClass[aspect],
        rounded && "rounded-2xl",
        className,
      )}
    >
      {/* Shimmer skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-accent/30 to-muted animate-pulse" />
      )}

      {/* Pending spinner overlay (still generating) */}
      {isPending && showSpinner && !loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <span className="text-xs font-medium">Plating up…</span>
          </div>
        </div>
      )}

      <img
        src={finalSrc}
        srcSet={finalSrcSet}
        sizes={finalSrcSet ? sizes : undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...({ fetchpriority: priority ? "high" : "auto" } as Record<string, string>)}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!errored) setErrored(true);
          else setLoaded(true);
        }}
        className={cn(
          "w-full h-full object-cover object-center transition-all duration-700 ease-out",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]",
          imgClassName,
        )}
      />

      {/* Subtle dark-mode friendly overlay for legibility on hovered cards */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/10 to-transparent dark:from-background/30" />
    </div>
  );
};

export default RecipeImage;

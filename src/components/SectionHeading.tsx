import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  /** Icon is required so every section title looks the same */
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Centered for marketing sections, left-aligned for content rows */
  align?: "center" | "left";
  /** Optional trailing action (e.g. "Explore all" link) — only for left align */
  action?: React.ReactNode;
}

/**
 * One shared section heading: identical font size, weight and icon treatment
 * across every <h2> on the page.
 */
const SectionHeading = ({
  icon: Icon,
  title,
  description,
  align = "center",
  action,
}: SectionHeadingProps) => {
  if (align === "left") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="inline-flex items-center gap-2 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          <Icon className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
          {title}
        </h2>
        {action}
      </div>
    );
  }

  return (
    <div className="text-center max-w-2xl mx-auto mb-10">
      <h2 className="inline-flex items-center gap-2 text-2xl md:text-3xl font-bold tracking-tight text-balance text-foreground">
        <Icon className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-muted-foreground text-balance">{description}</p>
      )}
    </div>
  );
};

export default SectionHeading;

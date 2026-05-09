import { Skeleton } from "@/components/ui/skeleton";

const RecipeCardSkeleton = () => (
  <div className="bg-card rounded-2xl overflow-hidden shadow-card">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export default RecipeCardSkeleton;

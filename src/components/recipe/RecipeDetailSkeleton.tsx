import { Skeleton } from "@/components/ui/skeleton";

const RecipeDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
    <Skeleton className="h-10 w-32" />
    <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
    <Skeleton className="h-10 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  </div>
);

export default RecipeDetailSkeleton;

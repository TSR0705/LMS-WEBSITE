import { Loader } from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Hero Section Skeleton */}
      <div className="mb-12 space-y-6">
        <Skeleton className="h-32 w-4/5 max-w-3xl" />
        <Skeleton className="h-8 w-3/5 max-w-2xl" />
      </div>

      {/* Grid of Course Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-xl overflow-hidden shadow-lg border border-border flex flex-col"
          >
            {/* Image Skeleton */}
            <div className="relative h-52 w-full bg-muted flex items-center justify-center">
              <Loader size="lg" />
            </div>

            {/* Content Skeleton */}
            <div className="p-6 flex flex-col flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <div className="mt-auto space-y-4">
                {/* Instructor Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>

                {/* Progress Skeleton */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loading;

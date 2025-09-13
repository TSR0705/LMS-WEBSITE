import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-y-8">
        {/* Title skeleton */}
        <Skeleton className="h-8 w-[50%]" />

        {/* Video player skeleton */}
        <div className="aspect-video w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>

        {/* Content skeleton - Multiple lines */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[75%]" />
          <Skeleton className="h-4 w-[85%]" />

          {/* Paragraph gap */}
          <div className="py-2" />

          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
    </div>
  );
}

export default Loading;

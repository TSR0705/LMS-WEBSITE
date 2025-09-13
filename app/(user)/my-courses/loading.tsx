function Loading() {
  return (
    <div className="h-full pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />{" "}
          {/* Graduation cap icon */}
          <div className="h-10 w-48 bg-muted rounded-md animate-pulse" />{" "}
          {/* "My Courses" text */}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full"
            >
              {/* Image */}
              <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <div className="h-full w-full bg-muted animate-pulse" />
              </div>

              {/* Content */}
              <div className="flex flex-col pt-2 space-y-4">
                {/* Title */}
                <div className="h-7 w-3/4 bg-muted rounded animate-pulse" />

                {/* Description */}
                <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />

                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>

                {/* Progress bar */}
                <div className="mt-2 space-y-2">
                  <div className="h-4 w-16 bg-muted/60 rounded animate-pulse" />
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full w-[57%] bg-muted animate-pulse rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loading;

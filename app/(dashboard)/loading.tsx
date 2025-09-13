function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="h-16 w-16 relative">
        <div className="absolute inset-0">
          <div className="h-full w-full animate-spin border-4 border-muted-foreground border-t-primary rounded-full" />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>
    </div>
  );
}

export default Loading;

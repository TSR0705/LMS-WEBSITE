"use client";

import dynamic from "next/dynamic";

// Properly type the dynamic component as a React Functional Component
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as React.FC<any>;

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  return (
    <div className="relative aspect-video">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing={false}
      />
    </div>
  );
};

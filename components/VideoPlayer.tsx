"use client";

import dynamic from "next/dynamic";

interface PlayerProps {
  url: string;
  width?: string;
  height?: string;
  controls?: boolean;
  playing?: boolean;
}

// Properly type the dynamic component as a React Component
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as React.ComponentType<PlayerProps>;

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-border bg-black">
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

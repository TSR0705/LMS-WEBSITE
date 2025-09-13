"use client";

import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

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

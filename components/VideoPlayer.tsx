"use client";

import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

interface PlayerProps {
  url: string;
  width?: string;
  height?: string;
  controls?: boolean;
  playing?: boolean;
}

const Player = ReactPlayer as unknown as React.ComponentType<PlayerProps>;

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-border bg-black animate-pulse" />
    );
  }
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-border bg-black">
      <Player
        url={url}
        width="100%"
        height="100%"
        controls
        playing={false}
      />
    </div>
  );
};

"use client";

interface LoomEmbedProps {
  shareUrl: string;
}

export function LoomEmbed({ shareUrl }: LoomEmbedProps) {
  // Convert share URL to embed URL
  const embedUrl = shareUrl.replace("/share/", "/embed/").split("?")[0];

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
}

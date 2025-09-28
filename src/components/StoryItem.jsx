import React, { useState, useEffect } from "react";

function StoryItem({ item, onLoadingChange }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!item) return;

    setIsLoading(true);
    setHasError(false);

    // Notify parent that loading has started
    console.log("StoryItem: Notifying loading started");
    if (onLoadingChange) onLoadingChange(true);

    // Preload the image/video
    const preloadMedia = () => {
      if (item.type === "image") {
        const img = new Image();
        img.onload = () => {
          console.log("StoryItem: Image loaded, notifying loading finished");
          setIsLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        };
        img.onerror = () => {
          setHasError(true);
          setIsLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        };
        img.src = item.url;
      } else if (item.type === "video") {
        const video = document.createElement("video");
        video.oncanplaythrough = () => {
          console.log("StoryItem: Video loaded, notifying loading finished");
          setIsLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        };
        video.onerror = () => {
          setHasError(true);
          setIsLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        };
        video.src = item.url;
        video.load();
      }
    };

    preloadMedia();
  }, [item, onLoadingChange]);

  if (!item) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white">
        <div className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <div>Failed to load story</div>
        </div>
      </div>
    );
  }

  if (item.type === "image") {
    return (
      <img
        src={item.url}
        alt="story"
        className="w-full h-full object-cover"
        style={{
          opacity: isLoading ? 0 : 1,
          maxWidth: "100vw",
          maxHeight: "100vh",
          objectFit: "cover",
        }}
      />
    );
  }

  if (item.type === "video") {
    return (
      <video
        src={item.url}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        style={{
          opacity: isLoading ? 0 : 1,
          maxWidth: "100vw",
          maxHeight: "100vh",
          objectFit: "cover",
        }}
      />
    );
  }

  return null;
}

export default StoryItem;

import React from "react";

function StoryItem({ item }) {
  if (!item) return null;

  if (item.type === "image") {
    return (
      <img
        src={item.url}
        alt="story"
        className="max-w-full max-h-full object-contain"
      />
    );
  }

  if (item.type === "video") {
    return (
      <video
        src={item.url}
        className="max-w-full max-h-full object-contain"
        autoPlay
        muted
        playsInline
      />
    );
  }

  return null;
}

export default StoryItem;

import React, { useState, useEffect } from "react";
import StoryItem from "./StoryItem.jsx";

function StoryCarousel({ stories, onClose, goToNextUser }) {
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalStories = stories.items.length;
  const currentItem = stories.items[currentIndex];

  // Reset index when stories prop changes (new user)
  useEffect(() => {
    setCurrentIndex(0);
  }, [stories]);

  // Auto-advance
  useEffect(() => {
    if (!currentItem) return;

    const timer = setTimeout(() => {
      if (currentIndex < totalStories - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Call parent only inside effect
        if (goToNextUser) goToNextUser();
        else onClose();
      }
    }, currentItem.duration);

    return () => clearTimeout(timer);
  }, [currentIndex, currentItem, totalStories, goToNextUser, onClose]);

  const prevStory = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const nextStory = () => {
    if (currentIndex < totalStories - 1) setCurrentIndex(currentIndex + 1);
    else if (goToNextUser) goToNextUser();
    else onClose();
  };
  if (!stories || !stories.items || stories.items.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-screen min-h-screen bg-black z-50 flex flex-col">
      {/* Progress bars */}
      <div className="absolute top-4 left-0 right-0 flex p-2 space-x-1 z-10">
        {stories.items.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 h-1 bg-white/50 rounded mx-1 overflow-hidden"
          >
            <div
              className="h-1 bg-white rounded"
              style={{
                width: idx < currentIndex ? "100%" : "0%",
                transition:
                  idx === currentIndex ? `width ${item.duration}ms linear` : "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* Story content */}
      <div className="flex-1 flex items-center justify-center relative">
        <StoryItem item={currentItem} />

        {/* Tap left/right */}
        <div
          className="absolute inset-0 flex"
          onClick={(e) => {
            const x = e.clientX;
            if (x < window.innerWidth / 2) prevStory();
            else nextStory();
          }}
        />

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white text-2xl p-2 rounded-full bg-black/30 z-10"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default StoryCarousel;

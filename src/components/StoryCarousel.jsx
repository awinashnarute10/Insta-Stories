import React, { useState, useEffect } from "react";
import StoryItem from "./StoryItem.jsx";
import StoryProgress from "./StoryProgress.jsx";

function StoryCarousel({ stories, onClose, goToNextUser }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewedStories, setViewedStories] = useState(new Set());
  const totalStories = stories.items.length;
  const currentItem = stories.items[currentIndex];

  // Preload adjacent stories
  useEffect(() => {
    const preloadAdjacentStories = () => {
      const indicesToPreload = [];

      // Preload next story
      if (currentIndex < totalStories - 1) {
        indicesToPreload.push(currentIndex + 1);
      }

      // Preload previous story
      if (currentIndex > 0) {
        indicesToPreload.push(currentIndex - 1);
      }

      // Preload media for adjacent stories
      indicesToPreload.forEach((index) => {
        const item = stories.items[index];
        if (item && item.type === "image") {
          const img = new Image();
          img.src = item.url;
        } else if (item && item.type === "video") {
          const video = document.createElement("video");
          video.src = item.url;
          video.preload = "metadata";
        }
      });
    };

    preloadAdjacentStories();
  }, [currentIndex, stories.items, totalStories]);

  // Reset index when stories prop changes (new user)
  useEffect(() => {
    setCurrentIndex(0);
    setIsPaused(false);
    setIsLoading(false);
    setViewedStories(new Set());
  }, [stories]);

  // Reset loading state when current index changes
  useEffect(() => {
    console.log(
      "Current index changed to:",
      currentIndex,
      "Setting loading to true"
    );
    setIsLoading(true); // Set to true when index changes, let StoryItem control when it becomes false
  }, [currentIndex]);

  // Debug loading state
  useEffect(() => {
    console.log("Loading state changed:", isLoading);
  }, [isLoading]);

  // Progress bars now handle auto-advance timing

  const prevStory = () => {
    // Don't mark current story as viewed when going back
    // Instead, remove the previous story from viewed (if it exists)
    const prevIndex = Math.max(currentIndex - 1, 0);
    if (prevIndex !== currentIndex) {
      setViewedStories((prev) => {
        const newSet = new Set(prev);
        newSet.delete(prevIndex); // Remove previous story from viewed
        return newSet;
      });
    }
    setCurrentIndex(prevIndex);
  };

  const nextStory = () => {
    // Mark current story as viewed when manually navigating
    setViewedStories((prev) => new Set([...prev, currentIndex]));

    if (currentIndex < totalStories - 1) setCurrentIndex(currentIndex + 1);
    else if (goToNextUser) goToNextUser();
    else onClose();
  };
  if (!stories || !stories.items || stories.items.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-screen min-h-screen bg-black z-50 flex flex-col">
      {/* Progress bars */}
      <div className="absolute top-4 left-0 right-0 flex p-2 space-x-1 z-10">
        {stories.items.map((item, idx) => {
          const isViewed = viewedStories.has(idx);
          console.log(
            `Progress bar ${idx}: isViewed=${isViewed}, isActive=${
              idx === currentIndex
            }`
          );
          return (
            <StoryProgress
              key={idx}
              isActive={idx === currentIndex}
              duration={item.duration}
              isPaused={isPaused || isLoading}
              isViewed={isViewed}
              onComplete={() => {
                if (idx === currentIndex) {
                  // Mark current story as viewed
                  console.log("Marking story as viewed:", idx);
                  setViewedStories((prev) => {
                    const newSet = new Set([...prev, idx]);
                    console.log("Updated viewed stories:", Array.from(newSet));
                    return newSet;
                  });

                  // Use setTimeout to ensure state update happens before navigation
                  setTimeout(() => {
                    if (currentIndex < totalStories - 1) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      if (goToNextUser) goToNextUser();
                      else onClose();
                    }
                  }, 0);
                }
              }}
            />
          );
        })}
      </div>

      {/* Story content */}
      <div className="flex-1 flex items-center justify-center relative w-full h-full">
        <div className="w-full h-full flex items-center justify-center">
          <StoryItem item={currentItem} onLoadingChange={setIsLoading} />
        </div>

    
        <div
          className="absolute inset-0 flex"
          onClick={(e) => {
            const x = e.clientX;
            if (x < window.innerWidth / 2) prevStory();
            else nextStory();
          }}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        />

        
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

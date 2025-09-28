import React, { useEffect, useState, useRef } from "react";

function StoryProgress({
  isActive,
  duration = 5000,
  isPaused = false,
  onComplete,
  className = "",
  isViewed = false,
}) {
  const [width, setWidth] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const animationRef = useRef(null);
  const progressRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      // Don't reset width if this story is viewed - keep it at 100%
      if (!isViewed) {
        setWidth(0);
        setIsCompleted(false);
        progressRef.current = 0;
        lastTimeRef.current = 0;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Reset when becoming active (always reset for unviewed stories)
    if (isActive && (!isViewed || progressRef.current === 0)) {
      setWidth(0);
      setIsCompleted(false);
      progressRef.current = 0;
      lastTimeRef.current = 0;
    }

    const animate = (currentTime) => {
      if (!isActive || isPaused) {
        if (isActive && !isPaused) {
          animationRef.current = requestAnimationFrame(animate);
        }
        return;
      }

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      const progressIncrement = (deltaTime / duration) * 100;

      progressRef.current += progressIncrement;
      const progress = Math.min(progressRef.current, 100);

      setWidth(progress);
      lastTimeRef.current = currentTime;

      if (progress >= 100 && !isCompleted) {
        setIsCompleted(true);
        if (onComplete) onComplete();
      } else if (progress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isActive && !isPaused) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, duration, isPaused, onComplete, isCompleted]);

  // Handle pause/resume
  useEffect(() => {
    if (isPaused) {
      lastTimeRef.current = 0;
    }
  }, [isPaused]);

  // Debug isViewed prop
  useEffect(() => {
    console.log("StoryProgress isViewed:", isViewed, "isActive:", isActive);
  }, [isViewed, isActive]);

  // Handle viewed state changes
  useEffect(() => {
    if (isViewed) {
      setWidth(100);
      progressRef.current = 100;
    } else {
      // When story becomes unviewed, reset progress
      setWidth(0);
      progressRef.current = 0;
      lastTimeRef.current = 0;
    }
  }, [isViewed]);

  return (
    <div
      className={`flex-1 h-1 rounded mx-1 overflow-hidden ${
        isViewed ? "bg-gray-400" : "bg-white/30"
      } ${className}`}
      style={{
        border: isViewed ? "2px solid red" : "none",
      }}
    >
      <div
        className="h-1 rounded-full transition-none"
        style={{
          width: `${isViewed ? 100 : width}%`,
          backgroundColor: isViewed ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
          transform: "translateZ(0)", // Hardware acceleration
          border: isViewed ? "1px solid blue" : "none",
        }}
      />
    </div>
  );
}

export default StoryProgress;

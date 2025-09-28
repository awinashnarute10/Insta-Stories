import React, { useEffect, useState } from "react";

function StoryProgress({ isActive, duration }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setWidth(0);
      return;
    }

    setWidth(0);
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setWidth(progress);
      if (progress >= 100) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, duration]);

  return (
    <div className="flex-1 h-1 bg-white/50 rounded mx-1">
      <div
        className="h-1 bg-white rounded"
        style={{ width: `${width}%`, transition: "width 0.05s linear" }}
      />
    </div>
  );
}

export default StoryProgress;
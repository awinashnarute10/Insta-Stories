import React, { useState } from "react";
import StoriesHeader from "../components/storiesHeader.jsx";
import StoryCarousel from "../components/StoryCarousel.jsx";
import { stories } from "../Utils/mockData.js";

function Home() {
  const [activeUserIndex, setActiveUserIndex] = useState(null);

  const openStory = (index) => setActiveUserIndex(index);
  const closeStory = () => setActiveUserIndex(null);

  const goToNextUser = () => {
    setActiveUserIndex((prev) => {
      if (prev === null) return null;
      if (prev < stories.length - 1) return prev + 1;
      return null; // close after last user
    });
  };

  return (
    <div className="h-screen bg-gray-100">
      <StoriesHeader stories={stories} onStoryClick={openStory} />

      <div className="p-4">
        <p className="text-gray-700">Your feed content here...</p>
      </div>

      {activeUserIndex !== null && stories[activeUserIndex] && (
        <StoryCarousel
          stories={stories[activeUserIndex]}
          onClose={closeStory}
          goToNextUser={goToNextUser}
        />
      )}
    </div>
  );
}

export default Home;

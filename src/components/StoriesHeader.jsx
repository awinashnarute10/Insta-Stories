import React from "react";

function StoriesHeader({ stories, onStoryClick }) {
  return (
    <div className="flex overflow-x-auto p-2 bg-white shadow-md">
      {stories.map((user, index) => (
        <div
          key={user.user}
          className="flex flex-col items-center mx-2 cursor-pointer flex-shrink-0"
          onClick={() => onStoryClick(index)}
        >
          <img
            src={user.avatar}
            alt={user.user}
            className="w-16 h-16 rounded-full border-2 border-pink-500 object-cover"
          />
          <span className="text-xs mt-1 w-16 text-center truncate">
            {user.user}
          </span>
        </div>
      ))}
    </div>
  );
}

export default StoriesHeader;

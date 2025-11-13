import { useState, useEffect } from "react";
import { FiBookmark, FiBookmarkCheck } from "react-icons/fi";

function BookmarkBtn({ postId, postTitle, postData }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window === 'undefined') return;
    // Check if post is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.some((b) => b.id === postId));
  }, [postId]);

  const handleBookmark = () => {
    if (typeof window === 'undefined') return;
    setIsLoading(true);
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    
    if (isBookmarked) {
      // Remove bookmark
      const updated = bookmarks.filter((b) => b.id !== postId);
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      // Add bookmark
      const bookmark = {
        id: postId,
        title: postTitle,
        data: postData,
        savedAt: new Date().toISOString(),
      };
      const updated = [...bookmarks, bookmark];
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(true);
    }
    
    setIsLoading(false);
    
    // Trigger custom event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("bookmarksUpdated"));
    }
  };

  if (!isClient) return null;

  return (
    <button
      onClick={handleBookmark}
      disabled={isLoading}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
      title={isBookmarked ? "Remove bookmark" : "Save for later"}
    >
      {isBookmarked ? (
        <FiBookmarkCheck className="text-[#1a8917] dark:text-[#26c281]" style={{ fontSize: "1.5rem" }} />
      ) : (
        <FiBookmark style={{ fontSize: "1.5rem" }} />
      )}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {isBookmarked ? "Saved" : "Save"}
      </span>
    </button>
  );
}

export default BookmarkBtn;


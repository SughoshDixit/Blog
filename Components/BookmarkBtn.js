import { useState, useEffect } from "react";
import { FiBookmark, FiCheck } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
  addBookmarkToFirestore,
  removeBookmarkFromFirestore,
} from "../Lib/firebaseBookmarks";

function BookmarkBtn({ postId, postTitle, postData }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setIsClient(true);
    if (typeof window === "undefined") return;
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.some((b) => b.id === postId));
  }, [postId]);

  const handleBookmark = async () => {
    if (typeof window === "undefined") return;
    setIsLoading(true);
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

    if (isBookmarked) {
      const updated = bookmarks.filter((b) => b.id !== postId);
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
      if (user?.uid) {
        removeBookmarkFromFirestore(user.uid, postId).catch(() => {});
      }
    } else {
      const bookmark = {
        id: postId,
        title: postTitle,
        data: postData,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("bookmarks", JSON.stringify([...bookmarks, bookmark]));
      setIsBookmarked(true);
      if (user?.uid) {
        addBookmarkToFirestore(user.uid, postId, postTitle, postData).catch(() => {});
      }
    }

    setIsLoading(false);
    if (typeof window !== "undefined") {
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
        <FiCheck className="text-[#C74634]" style={{ fontSize: "1.5rem" }} />
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

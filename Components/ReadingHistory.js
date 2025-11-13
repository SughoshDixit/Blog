import { useEffect } from "react";

function ReadingHistory({ postId, postTitle, postData }) {
  useEffect(() => {
    if (typeof window === 'undefined' || !postId || !postTitle) return;

    const history = JSON.parse(localStorage.getItem("readingHistory") || "[]");
    
    // Remove existing entry if present
    const filtered = history.filter((h) => h.id !== postId);
    
    // Add to beginning
    const entry = {
      id: postId,
      title: postTitle,
      data: postData,
      readAt: new Date().toISOString(),
      lastPosition: 0, // Can be enhanced to track scroll position
    };
    
    const updated = [entry, ...filtered].slice(0, 50); // Keep last 50
    localStorage.setItem("readingHistory", JSON.stringify(updated));
  }, [postId, postTitle, postData]);

  return null; // This component doesn't render anything
}

export default ReadingHistory;


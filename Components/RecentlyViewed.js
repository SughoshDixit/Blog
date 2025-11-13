import { useState, useEffect } from "react";
import Link from "next/link";
import { generateSlug } from "../Lib/utils";
import { FiClock } from "react-icons/fi";

function RecentlyViewed({ maxPosts = 5 }) {
  const [recentPosts, setRecentPosts] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window === 'undefined') return;

    const history = JSON.parse(localStorage.getItem("readingHistory") || "[]");
    const recent = history.slice(0, maxPosts);
    setRecentPosts(recent);
    
    // Listen for updates
    const handleUpdate = () => {
      const updated = JSON.parse(localStorage.getItem("readingHistory") || "[]");
      setRecentPosts(updated.slice(0, maxPosts));
    };
    
    window.addEventListener("storage", handleUpdate);
    return () => window.removeEventListener("storage", handleUpdate);
  }, [maxPosts]);

  if (!isClient || recentPosts.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <FiClock className="text-gray-500 dark:text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "Charter, Georgia, serif" }}>
          Continue Reading
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentPosts.map((post) => (
          <Link href={`/blogs/${post.id}`} key={post.id}>
            <a className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2" style={{ fontFamily: "Charter, Georgia, serif" }}>
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(post.readAt).toLocaleDateString()}
              </p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;


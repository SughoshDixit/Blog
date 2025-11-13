import Head from "next/head";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import Link from "next/link";
import { FiBookmark, FiTrash2 } from "react-icons/fi";

export const getStaticProps = () => {
  const allTopics = getAllTopics();
  return {
    props: {
      topics: allTopics || [],
    },
  };
};

export default function SavedPosts({ topics }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = () => {
      const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarks(saved);
      setLoading(false);
    };

    loadBookmarks();
    
    // Listen for bookmark updates
    window.addEventListener("bookmarksUpdated", loadBookmarks);
    return () => window.removeEventListener("bookmarksUpdated", loadBookmarks);
  }, []);

  const handleRemove = (postId) => {
    const updated = bookmarks.filter((b) => b.id !== postId);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    setBookmarks(updated);
    window.dispatchEvent(new CustomEvent("bookmarksUpdated"));
  };

  const handleClearAll = () => {
    if (confirm("Remove all saved posts?")) {
      localStorage.setItem("bookmarks", JSON.stringify([]));
      setBookmarks([]);
      window.dispatchEvent(new CustomEvent("bookmarksUpdated"));
    }
  };

  return (
    <>
      <Head>
        <title>Saved Posts • Sughosh&apos;s Chronicles</title>
      </Head>
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#050810]">
        <Navbar topics={topics} />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Charter, Georgia, serif" }}>
                  Saved Posts
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {bookmarks.length} {bookmarks.length === 1 ? "post" : "posts"} saved
                </p>
              </div>
              {bookmarks.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-12">
                <FiBookmark className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No saved posts yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start saving posts you want to read later
                </p>
                <Link href="/">
                  <a className="medium-button inline-block">
                    Browse Posts
                  </a>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <article
                    key={bookmark.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {bookmark.data?.Topic && (
                            <span className="text-xs font-medium text-[#1a8917] dark:text-[#26c281]">
                              {bookmark.data.Topic}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Saved {new Date(bookmark.savedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link href={`/blogs/${bookmark.id}`}>
                          <a>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-[#1a8917] dark:hover:text-[#26c281] transition-colors" style={{ fontFamily: "Charter, Georgia, serif" }}>
                              {bookmark.title}
                            </h2>
                          </a>
                        </Link>
                        {bookmark.data?.Abstract && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                            {bookmark.data.Abstract}
                          </p>
                        )}
                        <Link href={`/blogs/${bookmark.id}`}>
                          <a className="inline-block mt-4 text-sm text-[#1a8917] dark:text-[#26c281] font-medium hover:underline">
                            Read article →
                          </a>
                        </Link>
                      </div>
                      <button
                        onClick={() => handleRemove(bookmark.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Remove bookmark"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}


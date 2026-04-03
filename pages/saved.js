import Head from "next/head";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllTopics } from "../Lib/Data";
import Link from "next/link";
import { FiBookmark, FiTrash2, FiCloud } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
  syncBookmarksToFirestore,
  getBookmarksFromFirestore,
  removeBookmarkFromFirestore,
  clearAllBookmarksFirestore,
} from "../Lib/firebaseBookmarks";

export const getStaticProps = () => {
  const allTopics = getAllTopics();
  return { props: { topics: allTopics || [] } };
};

export default function SavedPosts({ topics }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const loadBookmarks = async () => {
      const local = JSON.parse(localStorage.getItem("bookmarks") || "[]");

      if (user?.uid) {
        try {
          await syncBookmarksToFirestore(user.uid);
          const cloud = await getBookmarksFromFirestore(user.uid);
          const merged = new Map();
          local.forEach((b) => merged.set(b.id, b));
          cloud.forEach((b) => merged.set(b.id, b));
          const all = Array.from(merged.values());
          localStorage.setItem("bookmarks", JSON.stringify(all));
          setBookmarks(all);
          setSynced(true);
        } catch {
          setBookmarks(local);
        }
      } else {
        setBookmarks(local);
      }
      setLoading(false);
    };

    loadBookmarks();

    const handler = () => {
      const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarks(saved);
    };
    window.addEventListener("bookmarksUpdated", handler);
    return () => window.removeEventListener("bookmarksUpdated", handler);
  }, [user]);

  const handleRemove = async (postId) => {
    const updated = bookmarks.filter((b) => b.id !== postId);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    setBookmarks(updated);
    if (user?.uid) removeBookmarkFromFirestore(user.uid, postId).catch(() => {});
    window.dispatchEvent(new CustomEvent("bookmarksUpdated"));
  };

  const handleClearAll = async () => {
    if (!confirm("Remove all saved posts?")) return;
    localStorage.setItem("bookmarks", JSON.stringify([]));
    setBookmarks([]);
    if (user?.uid) clearAllBookmarksFirestore(user.uid).catch(() => {});
    window.dispatchEvent(new CustomEvent("bookmarksUpdated"));
  };

  return (
    <>
      <Head>
        <title>Saved Posts — Sughosh Dixit</title>
      </Head>
      <div className="min-h-screen bg-[#FAF8F6] dark:bg-[#201E1C]">
        <Navbar topics={topics} />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1
                  className="text-3xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-2"
                  style={{ fontFamily: "Charter, Georgia, serif" }}
                >
                  Saved Posts
                </h1>
                <p className="text-[#6E6B68] dark:text-[#B8B4B0] flex items-center gap-2">
                  {bookmarks.length} {bookmarks.length === 1 ? "post" : "posts"} saved
                  {synced && (
                    <span className="inline-flex items-center gap-1 text-xs text-[#C74634]">
                      <FiCloud className="w-3 h-3" /> Synced
                    </span>
                  )}
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
              <div className="text-center py-12 text-[#6E6B68] dark:text-[#B8B4B0]">Loading...</div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-12">
                <FiBookmark className="w-16 h-16 text-[#E0DDD9] dark:text-[#3D3A36] mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-2">
                  No saved posts yet
                </h2>
                <p className="text-[#6E6B68] dark:text-[#B8B4B0] mb-6">
                  Start saving posts you want to read later
                </p>
                <Link href="/">
                  <a className="medium-button inline-block">Browse Posts</a>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <article
                    key={bookmark.id}
                    className="bg-white dark:bg-[#2C2A27] rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {bookmark.data?.Topic && (
                            <span className="text-xs font-medium text-[#C74634]">{bookmark.data.Topic}</span>
                          )}
                          <span className="text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
                            Saved {new Date(bookmark.savedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link href={`/blogs/${bookmark.id}`}>
                          <a>
                            <h2
                              className="text-xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-2 hover:text-[#C74634] transition-colors"
                              style={{ fontFamily: "Charter, Georgia, serif" }}
                            >
                              {bookmark.title}
                            </h2>
                          </a>
                        </Link>
                        {bookmark.data?.Abstract && (
                          <p className="text-[#6E6B68] dark:text-[#B8B4B0] text-sm line-clamp-2">
                            {bookmark.data.Abstract}
                          </p>
                        )}
                        <Link href={`/blogs/${bookmark.id}`}>
                          <a className="inline-block mt-4 text-sm text-[#C74634] font-medium hover:underline">
                            Read article &rarr;
                          </a>
                        </Link>
                      </div>
                      <button
                        onClick={() => handleRemove(bookmark.id)}
                        className="p-2 text-[#B8B4B0] hover:text-red-600 dark:hover:text-red-400 transition-colors"
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

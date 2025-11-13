import Link from "next/link";
import { generateSlug } from "../Lib/utils";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function PostSeries({ currentPost, allPosts, seriesName }) {
  if (!seriesName || !allPosts) return null;

  // Find all posts in the same series
  const seriesPosts = allPosts
    .filter((post) => {
      // Check if post has Series metadata matching seriesName
      const postSeries = post.data?.Series || post.data?.series;
      return postSeries === seriesName && post.data.isPublished;
    })
    .sort((a, b) => {
      // Sort by SeriesPart or Date
      const partA = parseInt(a.data?.SeriesPart || a.data?.seriesPart || "0");
      const partB = parseInt(b.data?.SeriesPart || b.data?.seriesPart || "0");
      if (partA !== 0 && partB !== 0) return partA - partB;
      return new Date(a.data.Date) - new Date(b.data.Date);
    });

  if (seriesPosts.length < 2) return null;

  const currentIndex = seriesPosts.findIndex(
    (post) => generateSlug(post.data.Title) === generateSlug(currentPost?.data?.Title || currentPost?.Title || "")
  );

  if (currentIndex === -1) return null;

  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null;
  const currentPart = parseInt(currentPost.data?.SeriesPart || currentPost.data?.seriesPart || String(currentIndex + 1));

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1" style={{ fontFamily: "Charter, Georgia, serif" }}>
              {seriesName} Series
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Part {currentPart} of {seriesPosts.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {seriesPosts.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex
                    ? "bg-blue-600 dark:bg-blue-400"
                    : idx < currentIndex
                    ? "bg-green-500 dark:bg-green-400"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                title={`Part ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {prevPost && (
            <Link href={`/blogs/${generateSlug(prevPost.data.Title)}`}>
              <a className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <FiChevronLeft className="text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Previous</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                    {prevPost.data.Title}
                  </div>
                </div>
              </a>
            </Link>
          )}

          {nextPost && (
            <Link href={`/blogs/${generateSlug(nextPost.data.Title)}`}>
              <a className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                    {nextPost.data.Title}
                  </div>
                </div>
                <FiChevronRight className="text-gray-400 flex-shrink-0" />
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostSeries;


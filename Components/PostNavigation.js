import Link from 'next/link';
import { generateSlug } from '../Lib/utils';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function PostNavigation({ currentPost, allPosts }) {
  if (!currentPost || !allPosts || allPosts.length === 0) {
    return null;
  }

  // Find current post index
  const currentIndex = allPosts.findIndex(
    (post) => generateSlug(post.data.Title) === generateSlug(currentPost.data.Title)
  );

  if (currentIndex === -1) {
    return null;
  }

  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  if (!prevPost && !nextPost) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Previous Post */}
        {prevPost ? (
          <Link
            href={`/blogs/${generateSlug(prevPost.data.Title)}`}
            className="flex-1 group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-md block"
          >
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <FaChevronLeft className="text-xs" />
                <span>Previous Post</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {prevPost.data.Title}
              </h3>
              {prevPost.data.Abstract && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {prevPost.data.Abstract}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {/* Next Post */}
        {nextPost ? (
          <Link
            href={`/blogs/${generateSlug(nextPost.data.Title)}`}
            className="flex-1 group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-md text-right sm:text-left block"
          >
            <div>
              <div className="flex items-center justify-end sm:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Next Post</span>
                <FaChevronRight className="text-xs" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {nextPost.data.Title}
              </h3>
              {nextPost.data.Abstract && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {nextPost.data.Abstract}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}

export default PostNavigation;


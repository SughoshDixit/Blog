import Link from "next/link";
import { generateSlug } from "../Lib/utils";
import { FiArrowRight } from "react-icons/fi";
import { isProminentShelf } from "../Lib/postVisibility";

function RelatedPosts({ currentPost, allBlogs, maxPosts = 3 }) {
  if (!currentPost || !allBlogs || allBlogs.length === 0) {
    return null;
  }

  // Get current post data
  const currentTitle = currentPost.data?.Title;
  const currentTopic = currentPost.data?.Topic;
  const currentTags = (currentPost.data?.Tags || "").split(" ").filter(Boolean);
  const currentId = generateSlug(currentTitle);

  const pool =
    currentPost && isProminentShelf(currentPost)
      ? allBlogs.filter((b) => isProminentShelf(b))
      : allBlogs;

  // Find related posts based on topic and tags
  const scoredPosts = pool
    .filter((blog) => {
      if (!blog?.data) return false;
      const blogId = generateSlug(blog.data.Title);
      if (blogId === currentId) return false; // Exclude current post
      if (!blog.data.isPublished) return false; // Only published posts
      return true;
    })
    .map((blog) => {
      const blogTopic = blog.data.Topic;
      const blogTags = (blog.data.Tags || "").split(" ").filter(Boolean);

      // Score based on topic match and tag matches
      let score = 0;
      const isSameTopic = blogTopic === currentTopic;
      
      if (isSameTopic) {
        score += 10;
      }
      
      // Count matching tags
      const matchingTagsCount = blogTags.filter(tag => currentTags.includes(tag)).length;
      score += matchingTagsCount * 3; // Boost tags slightly more

      // Cross-topic discovery bonus
      if (!isSameTopic && matchingTagsCount >= 2) {
        score += 5; // Bonus for relevant content in different topics
      }

      return { ...blog, score };
    })
    .filter(blog => blog.score > 0)
    .sort((a, b) => b.score - a.score);

  const relatedPosts = scoredPosts.slice(0, maxPosts);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Charter, Georgia, serif" }}>
        Related Posts
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => {
          const slug = generateSlug(post.data.Title);
          const headerImage = post.data?.HeaderImage || "https://miro.medium.com/v2/resize:fit:640/1*9dZCMV2XpN7dBDEHMyC-qA.png";
          
          return (
            <Link href={`/blogs/${slug}`} key={slug}>
              <a className="group block">
                <article className="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                  {headerImage && (
                    <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={headerImage}
                        alt={post.data.Title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                      {post.data.Topic && (
                        <span className="text-xs font-medium text-[#C74634] dark:text-[#26c281]">
                          {post.data.Topic}
                        </span>
                      )}
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                  {post.data.Topic === currentTopic ? "Keep learning" : "Fresh perspective"}
                </span>
                      {post.readTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {post.readTime.text}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#C74634] dark:group-hover:text-[#26c281] transition-colors line-clamp-2" style={{ fontFamily: "Charter, Georgia, serif" }}>
                      {post.data.Title}
                    </h3>
                    {post.data.Abstract && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                        {post.data.Abstract}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-[#C74634] dark:text-[#26c281] font-medium">
                      Read more
                      <FiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RelatedPosts;


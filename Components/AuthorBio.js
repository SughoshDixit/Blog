import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiGithub, FiLinkedin, FiYoutube, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { generateSlug } from "../Lib/utils";

function AuthorBio({ data, allBlogs }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get recent posts by same author
  const recentPosts = allBlogs
    ?.filter((blog) => blog.data.Author === data.Author && blog.data.isPublished && generateSlug(blog.data.Title) !== generateSlug(data.Title))
    .sort((a, b) => new Date(b.data.Date) - new Date(a.data.Date))
    .slice(0, 3) || [];

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <img 
            src="/about.jpeg" 
            alt={data.Author} 
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
          />
          <div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">{data.Author}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Data Scientist & Tech Writer</div>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="medium-button-outline text-sm px-4 py-2 w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <FiChevronUp />
            </>
          ) : (
            <>
              <span>About Author</span>
              <FiChevronDown />
            </>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-6 space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <strong>In one line:</strong> Footballer, Musician by Passion, Data Science by Profession, Civilizationalist by Ideology
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/SughoshDixit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-[#1a8917] dark:text-gray-400 dark:hover:text-[#26c281] transition-colors"
            >
              <FiGithub />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/sughosh-dixit/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-[#1a8917] dark:text-gray-400 dark:hover:text-[#26c281] transition-colors"
            >
              <FiLinkedin />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href="https://www.youtube.com/@sughoshdixit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-[#1a8917] dark:text-gray-400 dark:hover:text-[#26c281] transition-colors"
            >
              <FiYoutube />
              <span className="text-sm">YouTube</span>
            </a>
            <a
              href="https://sughoshdixit.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-[#1a8917] dark:text-gray-400 dark:hover:text-[#26c281] transition-colors"
            >
              <FiExternalLink />
              <span className="text-sm">Portfolio</span>
            </a>
          </div>

          {recentPosts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Posts</h4>
              <div className="space-y-2">
                {recentPosts.map((post) => {
                  const slug = generateSlug(post.data.Title);
                  return (
                    <Link href={`/blogs/${slug}`} key={slug}>
                      <a className="block text-sm text-gray-600 dark:text-gray-300 hover:text-[#1a8917] dark:hover:text-[#26c281] transition-colors">
                        {post.data.Title}
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AuthorBio;


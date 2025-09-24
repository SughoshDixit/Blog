import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import BlogHeader from "../Components/BlogHeader";
import { getAllBlogPosts, getAllTopics } from "../Lib/Data";
import { useState, useEffect } from "react";

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const allTopics = getAllTopics();
  return {
    props: {
      blogs: allBlogs,
      topics: allTopics,
    },
  };
};

// Component to fetch engagement data for a blog post
function BlogEngagement({ blogId }) {
  const [engagement, setEngagement] = useState({ likes: 0, comments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        // Fetch likes
        const likesResponse = await fetch(`/api/likes/${blogId}`);
        const likesData = await likesResponse.json();
        
        // Fetch comments
        const commentsResponse = await fetch(`/api/comments/${blogId}`);
        const commentsData = await commentsResponse.json();
        
        setEngagement({
          likes: likesData.totalLikes || 0,
          comments: commentsData.comments?.length || 0
        });
      } catch (error) {
        console.error('Error fetching engagement data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEngagement();
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-4 h-3 sm:w-6 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-4 h-3 sm:w-6 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 sm:space-x-4">
      <div className="flex items-center space-x-1 text-gray-400 dark:text-gray-500">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{engagement.likes}</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-400 dark:text-gray-500">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{engagement.comments}</span>
      </div>
    </div>
  );
}

export default function Home({ blogs, topics }) {
  return (
    <>
      <Head>
        <title>Sughosh Dixit - Tech Insights & Innovation</title>
        <meta name="title" content="Sughosh Dixit - Tech Insights & Innovation" />
        <meta
          name="description"
          content="Explore technology, data science, and innovation through insightful articles and tutorials. Join the journey of learning and discovery in the digital world."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sughoshblog.vercel.app/" />
        <meta property="og:title" content="Sughosh Dixit - Tech Insights & Innovation" />
        <meta
          property="og:description"
          content="Explore technology, data science, and innovation through insightful articles and tutorials. Join the journey of learning and discovery in the digital world."
        />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/SughoshDixit/Blog/main/Extra/sc.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://sughoshblog.vercel.app/" />
        <meta property="twitter:title" content="Sughosh Dixit - Tech Insights & Innovation" />
        <meta
          property="twitter:description"
          content="Explore technology, data science, and innovation through insightful articles and tutorials. Join the journey of learning and discovery in the digital world."
        />
        <meta
          property="twitter:image"
          content="https://raw.githubusercontent.com/SughoshDixit/Blog/main/Extra/sc.png"
        />
      </Head>

      <div className="min-h-screen relative bg-white dark:bg-gray-900">
        <Navbar topics={topics} />
        {/* best-effort site visit counter */}
        <script dangerouslySetInnerHTML={{__html:`fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({})}).catch(()=>{})`}} />
        
        {/* Medium-style hero section */}
        <div className="pt-20 pb-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6" style={{fontFamily: 'Charter, Georgia, serif'}}>
                Tech Insights & Innovation
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto px-4">
                Discover insights, tutorials, and thoughts on technology, data science, and innovation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <a href="#latest-posts" className="medium-button inline-flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base">
                  Start reading
                </a>
                <a href="/about" className="medium-button-outline inline-flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base">
                  About Me
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Medium-style articles section */}
        <div id="latest-posts" className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
          <div className="space-y-8">
            {blogs &&
              blogs.map(
                (blog) =>
                  blog.data.isPublished && (
                    <div key={blog.data.Id} className="article-preview">
                      <div className="flex flex-col sm:flex-row items-start justify-between">
                        <div className="flex-1 sm:pr-6 w-full">
                          <div className="author-info mb-3">
                            <img 
                              src="/about.jpeg" 
                              alt="Sughosh Dixit" 
                              className="author-avatar"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Sughosh Dixit</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{blog.data.Date}</span>
                          </div>
                          
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer leading-tight" style={{fontFamily: 'Charter, Georgia, serif'}}>
                            <a href={`/blogs/${blog.data.Title.split(" ").join("-").toLowerCase()}`} className="hover:underline">
                              {blog.data.Title}
                            </a>
                          </h2>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed text-sm sm:text-base">
                            {blog.data.Abstract}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                              <span className="reading-time text-xs sm:text-sm">{blog.readTime.text}</span>
                              <div className="article-tags">
                                {blog.data.Tags && blog.data.Tags.split(" ").filter(Boolean).slice(0, 3).map((tag, index) => (
                                  <span key={index} className="article-tag text-xs">
                                    {tag}
                                  </span>
                                ))}
                                {blog.data.Tags && blog.data.Tags.split(" ").filter(Boolean).length > 3 && (
                                  <span className="article-tag bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">
                                    +{blog.data.Tags.split(" ").filter(Boolean).length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-center sm:justify-end">
                              <BlogEngagement blogId={blog.data.Title.split(" ").join("-").toLowerCase()} />
                            </div>
                          </div>
                        </div>
                        
                        {blog.data.HeaderImage && (
                          <div className="flex-shrink-0 sm:ml-4 w-full sm:w-auto mt-4 sm:mt-0">
                            <img 
                              src={blog.data.HeaderImage} 
                              alt={blog.data.Title}
                              className="w-full sm:w-32 h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )
              )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

import React from "react";
import { getAllBlogPosts, getAllTopics } from "../../Lib/Data";
import { generateSlug } from "../../Lib/utils";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import BlogHeader from "../../Components/BlogHeader";

export const getStaticPaths = () => {
  const allTopics = getAllTopics();
  return {
    paths: allTopics.map((topic) => ({
      params: {
        name: String(topic),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const params = context.params;
  const allBlogs = getAllBlogPosts();
  const allTopics = getAllTopics();

  const filteredBlogs = allBlogs.filter((blog) => {
    if (blog.data.Topic === params.name) {
      return blog;
    }
  });

  return {
    props: {
      blogs: filteredBlogs,
      topics: allTopics,
      topicName: params.name,
    },
  };
};

function name({ blogs, topics, topicName }) {
  return (
    <div className="min-h-screen relative bg-white dark:bg-gray-900">
      <Navbar topics={topics} />
      
      {/* Medium-style topic header */}
      <div className="pt-20 pb-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6" style={{fontFamily: 'Charter, Georgia, serif'}}>
              {topicName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} about {topicName}
            </p>
          </div>
        </div>
      </div>

      {/* Medium-style articles */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="space-y-0">
          {blogs &&
            blogs.map(
              (blog) =>
                blog.data.isPublished && (
                  <div key={blog.data.Id} className="article-preview">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-6">
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
                        
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer leading-tight" style={{fontFamily: 'Charter, Georgia, serif'}}>
                          <a href={`/blogs/${generateSlug(blog.data.Title)}`} className="hover:underline">
                            {blog.data.Title}
                          </a>
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                          {blog.data.Abstract}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="reading-time">{blog.readTime.text}</span>
                            <div className="article-tags">
                              {blog.data.Tags && blog.data.Tags.split(" ").filter(Boolean).map((tag, index) => (
                                <span key={index} className="article-tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {blog.data.HeaderImage && (
                        <div className="flex-shrink-0 ml-4">
                          <img 
                            src={blog.data.HeaderImage} 
                            alt={blog.data.Title}
                            className="w-32 h-32 object-cover rounded-lg"
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
  );
}

export default name;

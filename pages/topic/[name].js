import React from "react";
import { getAllBlogPosts, getAllTopics, getProminentTopics } from "../../Lib/Data";
import { isProminentShelf, isUnlisted } from "../../Lib/postVisibility";
import { generateSlug, sortByDateDesc } from "../../Lib/utils";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import BlogHeader from "../../Components/BlogHeader";
import Head from "next/head";
import { SITE_URL, siteOgImageUrl } from "../../Lib/siteConfig";

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
  const navTopics = getProminentTopics();

  // Include non-prominent shelf blogs only if they match the topic being generated
  const blogsWithoutContent = allBlogs
    .filter((blog) => blog && blog.data && blog.readTime && (isProminentShelf(blog) || blog.data.Topic === params.name))
    .map((blog) => ({
      data: blog.data,
      readTime: blog.readTime,
    }));

  const filteredBlogs = blogsWithoutContent.filter((blog) => {
    return blog.data && blog.data.Topic === params.name;
  });

  return {
    props: {
      blogs: filteredBlogs,
      topics: navTopics || [],
      topicName: params.name || '',
    },
  };
};

function name({ blogs, topics, topicName }) {
  const allPublished = (blogs || []).filter(
    (blog) => blog?.data?.isPublished && !isUnlisted(blog)
  );

  const publishedBlogs = allPublished
    .filter((blog) => blog.data?.prominentShelf !== false)
    .sort(sortByDateDesc);



  const startHere = publishedBlogs[0];
  const topicDescriptions = {
    "Data Science":
      "Structured notes and practical insights on data science, AI modeling, robust statistics, and machine learning implementations.",
    "Personal":
      "Raw, first-person essays from life: family, grief, identity, films, and moments that shape who we become.",
    "Vedic Studies":
      "Reflections that connect śāstra, dharma, and lived experience in the modern world.",
    "Book":
      "Long-form takeaways from books worth revisiting.",
    "Experience":
      "Field notes from work, growth, and learning by doing.",
  };

  const currentDesc = topicDescriptions[topicName] || `Read articles and deep-dives about ${topicName} by Sughosh Dixit.`;

  return (
    <div className="min-h-screen relative bg-white dark:bg-gray-900">
      <Head>
        <title>{topicName} Articles — Sughosh Dixit</title>
        <meta name="description" content={currentDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/topic/${generateSlug(topicName)}`} />
        <meta property="og:title" content={`${topicName} Articles — Sughosh Dixit`} />
        <meta property="og:description" content={currentDesc} />
        <meta property="og:image" content={siteOgImageUrl()} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${topicName} Articles — Sughosh Dixit`} />
        <meta name="twitter:description" content={currentDesc} />
        <meta name="twitter:image" content={siteOgImageUrl()} />
      </Head>
      <Navbar topics={topics} />
      
      {/* Medium-style topic header */}
      <div className="pt-20 pb-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6" style={{fontFamily: 'Charter, Georgia, serif'}}>
              {topicName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
              {publishedBlogs.length}{" "}
              {publishedBlogs.length === 1 ? "article" : "articles"} about {topicName}
            </p>
            {publishedBlogs.length === 0 && (
              <p className="text-base text-amber-800 dark:text-amber-200/90 max-w-2xl mx-auto mb-6">
                No featured articles in this topic on the main shelf.{" "}
                <a href="/archive" className="underline hover:text-[#C74634] dark:hover:text-[#E8572A]">
                  See the archive
                </a>{" "}
                for other pieces that may use this tag elsewhere.
              </p>
            )}
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              {topicDescriptions[topicName] || "Curated posts from this track. Start with the latest and then follow the sequence below."}
            </p>
          </div>
        </div>
      </div>

      {startHere && (
        <div className="max-w-4xl mx-auto px-6 pb-10">
          <div className="rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#1a1f2e] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#92a0c3] mb-2">Start Here</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{fontFamily: 'Charter, Georgia, serif'}}>
              <a href={`/blogs/${generateSlug(startHere.data.Title)}`} className="hover:underline">
                {startHere.data.Title}
              </a>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{startHere.data.Abstract}</p>
            <a href={`/blogs/${generateSlug(startHere.data.Title)}`} className="inline-flex items-center text-[#C74634] dark:text-[#26c281] font-semibold">
              Read this first →
            </a>
          </div>
        </div>
      )}



      {/* Medium-style articles */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="space-y-0">
          {publishedBlogs &&
            publishedBlogs.map(
              (blog) =>
                (
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

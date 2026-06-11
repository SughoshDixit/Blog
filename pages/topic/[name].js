import React from "react";
import { getAllBlogPosts, getAllTopics, getProminentTopics } from "../../Lib/Data";
import { isProminentShelf } from "../../Lib/postVisibility";
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
  const allPublished = (blogs || []).filter((blog) => blog?.data?.isPublished);

  // Filter out playlist blogs from the main topic list
  const publishedBlogs = allPublished
    .filter((blog) => blog.data?.Series !== "Ekadashi and its significance" && blog.data?.prominentShelf !== false)
    .sort((a, b) => {
      const dateA = Date.parse(a?.data?.Date || "");
      const dateB = Date.parse(b?.data?.Date || "");
      const validA = !Number.isNaN(dateA);
      const validB = !Number.isNaN(dateB);
      if (validA && validB) return dateB - dateA;
      if (validA) return -1;
      if (validB) return 1;
      return (Number(b?.data?.Id) || 0) - (Number(a?.data?.Id) || 0);
    });

  const playlistBlogs = allPublished
    .filter((blog) => blog.data?.Series === "Ekadashi and its significance")
    .sort((a, b) => {
      const partA = parseInt(a.data?.SeriesPart || "0");
      const partB = parseInt(b.data?.SeriesPart || "0");
      return partA - partB;
    });

  const startHere = publishedBlogs[0];
  const topicDescriptions = {
    "Data Science":
      "Structured learning notes and practical math from the 30-Day Challenge: robust statistics, nonparametrics, fuzzy logic, and audit-ready thinking.",
    "Personal":
      "Raw, first-person essays from life: family, grief, identity, films, and moments that shape who we become.",
    "Vedic Studies":
      "Reflections that connect śāstra, dharma, and lived experience in the modern world.",
    "Book":
      "Long-form takeaways from books worth revisiting.",
    "Experience":
      "Field notes from work, growth, and learning by doing.",
  };

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
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
              {publishedBlogs.length + playlistBlogs.length}{" "}
              {publishedBlogs.length + playlistBlogs.length === 1 ? "article" : "articles"} about {topicName}
            </p>
            {publishedBlogs.length === 0 && playlistBlogs.length === 0 && (
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

      {/* Custom Series/Playlist for Ekadashi (only on Vedic Studies topic page) */}
      {topicName === "Vedic Studies" && playlistBlogs.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="border-t-2 border-dashed border-[#D97706]/30 pt-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🪔</span>
              <div>
                <h2 className="text-2xl font-bold text-[#D97706] dark:text-[#F59E0B]" style={{ fontFamily: "Charter, Georgia, serif" }}>
                  Ekadashi & Its Significance Playlist
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  A curated chronological series explaining the history, stories, rituals, and spiritual takeaways of holy Ekadashi fasts.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {playlistBlogs.map((blog, idx) => (
                <div key={blog.data.Id} className="bg-gradient-to-r from-amber-50 to-orange-50/70 dark:from-amber-950/10 dark:to-orange-950/10 rounded-2xl border border-amber-200/50 dark:border-amber-900/20 p-6 shadow-sm hover:shadow-md transition-all duration-355 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97706]/10 text-[#D97706] dark:text-[#F59E0B] text-xs font-semibold mb-4">
                      Part {blog.data.SeriesPart || idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug" style={{ fontFamily: "Charter, Georgia, serif" }}>
                      <a href={`/blogs/${generateSlug(blog.data.Title)}`} className="hover:underline">
                        {blog.data.Title}
                      </a>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {blog.data.Abstract}
                    </p>
                  </div>
                  <a href={`/blogs/${generateSlug(blog.data.Title)}`} className="text-sm font-semibold text-[#D97706] dark:text-[#F59E0B] hover:underline flex items-center gap-1 mt-auto">
                    Read explainer →
                  </a>
                </div>
              ))}
            </div>
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

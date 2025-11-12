import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getAllTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import { useState, useEffect, useMemo } from "react";

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const allTopics = getAllTopics();
  
  // Remove content from blogs to reduce page data size
  // Content is only needed on individual blog pages, not the home page listing
  const blogsWithoutContent = allBlogs
    .filter((blog) => blog && blog.data && blog.readTime)
    .map((blog) => ({
      data: blog.data,
      readTime: blog.readTime,
    }));
  
  return {
    props: {
      blogs: blogsWithoutContent,
      topics: allTopics || [],
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
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
        <span className="text-xs text-gray-600 dark:text-gray-300">{engagement.likes}</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        <span className="text-xs text-gray-600 dark:text-gray-300">{engagement.comments}</span>
      </div>
    </div>
  );
}

export default function Home({ blogs, topics }) {
  const publishedBlogs = useMemo(() => {
    const withPublishFlag = Array.isArray(blogs)
      ? blogs.filter((blog) => blog?.data?.isPublished)
      : [];

    return withPublishFlag.sort((a, b) => {
      const dateA = Date.parse(a?.data?.Date);
      const dateB = Date.parse(b?.data?.Date);

      const isValidDateA = !Number.isNaN(dateA);
      const isValidDateB = !Number.isNaN(dateB);

      if (isValidDateA && isValidDateB) {
        return dateB - dateA;
      }

      if (isValidDateA) {
        return -1;
      }

      if (isValidDateB) {
        return 1;
      }

      const idA = Number(a?.data?.Id) || 0;
      const idB = Number(b?.data?.Id) || 0;
      return idB - idA;
    });
  }, [blogs]);

  const [engagementMap, setEngagementMap] = useState({});

  useEffect(() => {
    let isCancelled = false;

    const loadEngagement = async () => {
      if (!Array.isArray(publishedBlogs) || publishedBlogs.length === 0) {
        return;
      }

      try {
        const entries = await Promise.all(
          publishedBlogs.map(async (blog) => {
            const slug = generateSlug(blog?.data?.Title);
            if (!slug) return null;

            try {
              const [likesRes, commentsRes] = await Promise.all([
                fetch(`/api/likes/${slug}`).catch(() => null),
                fetch(`/api/comments/${slug}`).catch(() => null)
              ]);

              const likesJson = likesRes && likesRes.ok ? await likesRes.json() : {};
              const commentsJson = commentsRes && commentsRes.ok ? await commentsRes.json() : {};

              const likes = Number(likesJson?.totalLikes) || 0;
              const comments = Array.isArray(commentsJson?.comments)
                ? commentsJson.comments.length
                : Number(commentsJson?.count) || 0;

              return [slug, { likes, comments }];
            } catch (error) {
              console.error(`Error fetching engagement for ${slug}`, error);
              return [slug, { likes: 0, comments: 0 }];
            }
          })
        );

        if (!isCancelled) {
          setEngagementMap(Object.fromEntries(entries.filter(Boolean)));
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error loading engagement data', error);
          setEngagementMap({});
        }
      }
    };

    loadEngagement();

    return () => {
      isCancelled = true;
    };
  }, [publishedBlogs]);

  const rankedBlogs = useMemo(() => {
    return publishedBlogs
      .map((blog) => {
        const slug = generateSlug(blog?.data?.Title);
        const engagement = engagementMap[slug] || { likes: 0, comments: 0 };
        const dateValue = Date.parse(blog?.data?.Date);
        const recencyScore = Number.isNaN(dateValue) ? 0 : dateValue;
        const popularityScore = engagement.likes * 5000 + engagement.comments * 2000;
        const compositeScore = recencyScore + popularityScore;

        return {
          ...blog,
          _score: compositeScore
        };
      })
      .sort((a, b) => b._score - a._score);
  }, [publishedBlogs, engagementMap]);
 
  const trendingPosts = useMemo(
    () => rankedBlogs.slice(0, 6),
    [rankedBlogs]
  );
  
  // Feature the most recent post by date (or ID if no date) to ensure latest content is highlighted
  const featureHighlight = useMemo(() => {
    const sortedByRecency = [...publishedBlogs].sort((a, b) => {
      const dateA = Date.parse(a?.data?.Date);
      const dateB = Date.parse(b?.data?.Date);
      
      const isValidDateA = !Number.isNaN(dateA);
      const isValidDateB = !Number.isNaN(dateB);
      
      if (isValidDateA && isValidDateB) {
        return dateB - dateA; // Most recent first
      }
      
      if (isValidDateA) return -1;
      if (isValidDateB) return 1;
      
      // Fallback to ID if no dates
      const idA = Number(a?.data?.Id) || 0;
      const idB = Number(b?.data?.Id) || 0;
      return idB - idA; // Highest ID first
    });
    
    return sortedByRecency[0];
  }, [publishedBlogs]);
  
  const recentPosts = useMemo(
    () => rankedBlogs.slice(0, 5),
    [rankedBlogs]
  );

  const remainingPosts = useMemo(
    () =>
      rankedBlogs.filter((blog) => {
        // Exclude posts that are in recentPosts or the featureHighlight
        const isInRecent = recentPosts.some((recent) => recent?.data?.Id === blog?.data?.Id);
        const isFeatured = featureHighlight?.data?.Id === blog?.data?.Id;
        return !isInRecent && !isFeatured;
      }),
    [rankedBlogs, recentPosts, featureHighlight]
  );

  const POSTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [remainingPosts.length]);

  const paginatedPosts = useMemo(
    () => remainingPosts.slice(0, currentPage * POSTS_PER_PAGE),
    [remainingPosts, currentPage]
  );

  const totalPages = useMemo(
    () => Math.ceil(remainingPosts.length / POSTS_PER_PAGE) || 1,
    [remainingPosts.length]
  );

  const canLoadMore = paginatedPosts.length < remainingPosts.length;

  const tagPills = useMemo(
    () =>
      topics
        .filter((topic) => topic && typeof topic === "string")
        .sort((a, b) => a.localeCompare(b)),
    [topics]
  );

  const getImageForBlog = (blog) => {
    const header = blog?.data?.HeaderImage;
    if (header && header.trim().length > 0) {
      return header;
    }
    return "https://miro.medium.com/v2/resize:fit:640/1*9dZCMV2XpN7dBDEHMyC-qA.png";
  };

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

      <div className="min-h-screen relative bg-[#f7f5f2] dark:bg-[#050810] transition-colors duration-300">
        <Navbar topics={topics} />
        {/* best-effort site visit counter */}
        <script dangerouslySetInnerHTML={{__html:`fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({})}).catch(()=>{})`}} />

        <main className="pt-24 pb-16 bg-[#f7f5f2] dark:bg-[#050810] transition-colors duration-300">
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-[#e6dfd3] dark:border-[#141b2c] bg-gradient-to-br from-[#fdfaf5] via-[#fbf7ef] to-[#f7f5f2] dark:from-[#0b1220] dark:via-[#101830] dark:to-[#0d1324]">
            <div className="absolute inset-0 opacity-[0.18] dark:opacity-30 pointer-events-none mix-blend-plus-lighter">
              <div className="absolute -top-32 -right-12 w-80 h-80 bg-[#e8dcc0] rounded-full blur-3xl dark:bg-[#28b981]/40"></div>
              <div className="absolute -bottom-40 left-0 w-96 h-96 bg-[#f3e7d0] rounded-full blur-3xl dark:bg-[#2563eb]/20"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center py-16">
                <div>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f0e9dd] text-[#6b5d44] text-sm font-medium mb-6 shadow-sm shadow-[#cebfa4]/40 dark:bg-white/10 dark:text-[#f2ecd7] dark:shadow-none backdrop-blur">
                    Stay curious — welcome back to the chronicles
                  </div>
                  <h1
                    className="text-4xl md:text-5xl lg:text-[56px] font-semibold leading-tight text-[#191919] dark:text-[#f8f6ff] mb-6 drop-shadow-[0_12px_32px_rgba(255,255,255,0.15)]"
                    style={{ fontFamily: "Charter, Georgia, serif" }}
                  >
                    Stories on technology, data, and imagination.
                  </h1>
                  <p className="text-lg md:text-xl text-[#615947] dark:text-[#c5cbe3] max-w-2xl leading-relaxed mb-10">
                    Dive into thoughtful essays, data science breakdowns, and playful experiments. Fresh reads land here every week, crafted for curious builders and creative thinkers.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="#latest-posts"
                      className="medium-button inline-flex items-center justify-center px-8 py-3 text-base shadow-sm shadow-[#1a8917]/30"
                    >
                      Start reading
                    </a>
                    <a
                      href="/about"
                      className="medium-button-outline inline-flex items-center justify-center px-8 py-3 text-base"
                    >
                      Meet the author
                    </a>
                  </div>
                </div>

                {featureHighlight && (
                  <article className="rounded-3xl border border-[#e6dfd3] dark:border-[#1b263d] bg-white dark:bg-[#121c2f]/95 shadow-soft">
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-3 text-sm text-[#6e6553] dark:text-[#c3cbe4]/80">
                        <span className="font-semibold">
                          {featureHighlight.data.Author || "Sughosh Dixit"}
                        </span>
                        <span>•</span>
                        <span>{featureHighlight.data.Date}</span>
                      </div>
                      <h2
                        className="text-2xl md:text-3xl text-[#191919] dark:text-[#f5f7ff] font-semibold leading-tight"
                        style={{ fontFamily: "Charter, Georgia, serif" }}
                      >
                        <a
                          href={`/blogs/${generateSlug(featureHighlight.data.Title)}`}
                          className="hover:underline"
                        >
                          {featureHighlight.data.Title}
                        </a>
                      </h2>
                      <p className="text-base text-[#403a2f] dark:text-[#d1d6eb] leading-relaxed line-clamp-4">
                        {featureHighlight.data.Abstract}
                      </p>
                      <div className="flex justify-between items-center pt-2 text-sm text-[#736b58] dark:text-[#94a3c6]">
                        <span>{featureHighlight.readTime.text}</span>
                        <BlogEngagement blogId={generateSlug(featureHighlight.data.Title)} />
                      </div>
                    </div>
                    <img
                      src={getImageForBlog(featureHighlight)}
                      alt={featureHighlight.data.Title}
                      className="w-full h-56 object-cover rounded-b-3xl"
                    />
                  </article>
                )}
              </div>
            </div>
          </section>

          {/* Topics rail */}
          {tagPills.length > 0 && (
            <section className="border-b border-[#e6dfd3] dark:border-[#141b2c] bg-[#fdfaf5] dark:bg-[#0a121f]">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                  <span className="uppercase tracking-wider text-xs font-semibold text-[#8c8169] dark:text-[#a0abc7]">
                    Explore topics
                  </span>
                  {tagPills.map((topic) => (
                    <a
                      key={topic}
                      href={`/topic/${topic}`}
                      className="inline-flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-white text-[#4f4636] border border-[#e6dfd3] hover:border-[#cbbf9f] hover:bg-[#faf5ec] transition-colors dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800/80"
                    >
                      {topic}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Trending */}
          {trendingPosts.length > 0 && (
            <section className="border-b border-[#e6dfd3] dark:border-[#141b2c]">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="flex items-center gap-3 mb-10 text-[#191919] dark:text-[#f5f6ff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                  <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "Charter, Georgia, serif" }}>
                    Trending on Sughosh's Chronicles
                  </h2>
                </div>
                <div className="grid gap-10 md:grid-cols-2">
                  {trendingPosts.map((post, index) => (
                    <article key={post.data.Id} className="flex space-x-6">
                      <span className="text-3xl md:text-[42px] font-bold text-[#d4c5a7] leading-none dark:text-[#f3d6a8]">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-[#6e6553] dark:text-[#aab5d5]">
                          <span className="font-medium">
                            {post.data.Author || "Sughosh Dixit"}
                          </span>
                          <span>•</span>
                          <span>{post.data.Date}</span>
                        </div>
                        <h3
                          className="text-xl md:text-2xl font-semibold text-[#191919] dark:text-[#f5f6ff] leading-tight hover:underline"
                          style={{ fontFamily: "Charter, Georgia, serif" }}
                        >
                          <a href={`/blogs/${generateSlug(post.data.Title)}`}>
                            {post.data.Title}
                          </a>
                        </h3>
                        <p className="text-sm text-[#494132] dark:text-[#c1c8e5] line-clamp-3">
                          {post.data.Abstract}
                        </p>
                        <div className="flex items-center justify-between text-sm text-[#7c7461] dark:text-[#92a0c2]">
                          <span>{post.readTime.text}</span>
                          <BlogEngagement blogId={generateSlug(post.data.Title)} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Main feed */}
          <section id="latest-posts" className="py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid gap-16 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
              <div className="space-y-14">
                {paginatedPosts.map((blog) => (
                  <article
                    key={blog.data.Id}
                    className="group rounded-3xl border border-transparent hover:border-[#dfd2b7] bg-white/85 dark:bg-[#101a2d]/90 hover:bg-white transition-all duration-300 shadow-lg shadow-transparent hover:shadow-[0_16px_60px_-30px_rgba(0,0,0,0.45)] dark:hover:bg-[#162338]"
                  >
                    <div className="p-8 flex flex-col lg:flex-row gap-10">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6e6553] dark:text-[#a4afcc] mb-4">
                          <span className="font-medium">
                            {blog.data.Author || "Sughosh Dixit"}
                          </span>
                          <span>•</span>
                          <span>{blog.data.Date}</span>
                        </div>
                        <h3
                          className="text-2xl md:text-3xl font-semibold text-[#191919] dark:text-[#f6f7ff] mb-4 leading-tight"
                          style={{ fontFamily: "Charter, Georgia, serif" }}
                        >
                          <a
                            href={`/blogs/${generateSlug(blog.data.Title)}`}
                            className="hover:underline decoration-2 decoration-[#1a8917]/50"
                          >
                            {blog.data.Title}
                          </a>
                        </h3>
                        <p className="text-base md:text-lg text-[#4b4334] dark:text-[#c4cce6] leading-relaxed line-clamp-4">
                          {blog.data.Abstract}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 text-sm text-[#7c7461] dark:text-[#8fa0c3]">
                          <div className="flex flex-wrap items-center gap-3">
                            <span>{blog.readTime.text}</span>
                            {blog.data.Tags && (
                              <div className="flex flex-wrap gap-2">
                                {blog.data.Tags.split(" ")
                                  .filter(Boolean)
                                  .slice(0, 3)
                                  .map((tag, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 rounded-full bg-[#f0e9dd] text-[#5b5241] text-xs font-medium dark:bg-[#1f2a44] dark:text-[#d1d7ef]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <BlogEngagement blogId={generateSlug(blog.data.Title)} />
                            <a
                              href={`/blogs/${generateSlug(blog.data.Title)}`}
                              className="text-[#1a8917] hover:text-[#0f730c] font-semibold dark:text-[#26c281] dark:hover:text-[#1fb877]"
                            >
                              Continue reading →
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="lg:w-64 w-full">
                        <img
                          src={getImageForBlog(blog)}
                          alt={blog.data.Title}
                          className="w-full h-52 object-cover rounded-2xl shadow-md"
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="space-y-12">
                <div className="rounded-3xl border border-[#e6dfd3] dark:border-[#1b263d] bg-white dark:bg-[#0f1b31] p-8 shadow-soft">
                  <h2
                    className="text-xl font-semibold text-[#191919] dark:text-[#f5f6ff] mb-6"
                    style={{ fontFamily: "Charter, Georgia, serif" }}
                  >
                    Recent Posts
                  </h2>
                  <div className="space-y-6">
                    {recentPosts.map((post) => (
                      <article key={post.data.Id} className="space-y-2">
                        <a
                          href={`/blogs/${generateSlug(post.data.Title)}`}
                          className="text-lg font-semibold text-[#191919] dark:text-[#f4f6ff] hover:underline leading-snug"
                          style={{ fontFamily: "Charter, Georgia, serif" }}
                        >
                          {post.data.Title}
                        </a>
                        <p className="text-sm text-[#5e5645] dark:text-[#a9b6d8] line-clamp-2">
                          {post.data.Abstract}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#7c7461] dark:text-[#8fa0c3]">
                          <span>{post.data.Author || "Sughosh Dixit"}</span>
                          <span>•</span>
                          <span>{post.readTime.text}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#e6dfd3] dark:border-[#1b263d] bg-[#fdfaf5] dark:bg-[#10192e] p-8 shadow-soft">
                  <h2 className="text-xl font-semibold text-[#191919] dark:text-[#f4f6ff] mb-4" style={{ fontFamily: "Charter, Georgia, serif" }}>
                    Weekly digest
                  </h2>
                  <p className="text-sm text-[#5e5645] dark:text-[#aab4d1] mb-6">
                    Get the top three stories in your inbox every Sunday along with new experiments from the lab.
                  </p>
                  <form className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-3 rounded-full border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                    />
                    <button
                      type="submit"
                      className="w-full medium-button inline-flex items-center justify-center px-6 py-3 text-sm"
                    >
                      Sign me up
                    </button>
                  </form>
                  <p className="text-xs text-[#9a8f75] dark:text-[#7f8bae] mt-4">
                    No spam, unsubscribe anytime.
                  </p>
                </div>

                <div className="rounded-3xl border border-[#e6dfd3] dark:border-[#1b263d] bg-white dark:bg-[#0f192d] p-6 shadow-soft space-y-4">
                  <h3 className="text-sm font-semibold text-[#7a705a] dark:text-[#97a3c7] uppercase tracking-widest">
                    Follow along
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="/ai-gallery"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#d7ddf5] hover:text-[#1a8917] dark:hover:text-[#2bd48d] transition-colors"
                    >
                      AI Gallery
                      <span className="text-xs text-[#9a8f75] dark:text-[#7f8bae]">New drops weekly</span>
                    </a>
                    <a
                      href="/dashboard"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#d7ddf5] hover:text-[#1a8917] dark:hover:text-[#2bd48d] transition-colors"
                    >
                      Dashboard
                      <span className="text-xs text-[#9a8f75] dark:text-[#7f8bae]">Behind the scenes</span>
                    </a>
                    <a
                      href="/key"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#d7ddf5] hover:text-[#1a8917] dark:hover:text-[#2bd48d] transition-colors"
                    >
                      Key Terms
                      <span className="text-xs text-[#9a8f75] dark:text-[#7f8bae]">Data glossary</span>
                    </a>
                  </div>
                </div>
              </aside>
            </div>
            {remainingPosts.length > 0 && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 flex justify-center">
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-[#e6dfd3] dark:border-[#141b2c] bg-white/90 dark:bg-[#0f192d]/90 text-sm text-[#695f4b] dark:text-[#bcc6e7] shadow-soft">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#8794bc]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-full border border-transparent disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#d9cdb2] hover:bg-[#faf5ec] dark:hover:border-[#1f2c47] dark:hover:bg-[#151f35]"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => (canLoadMore ? prev + 1 : prev))}
                      disabled={!canLoadMore}
                      className="px-4 py-2 rounded-full bg-[#1a8917] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#1a8917]/40 dark:bg-[#26c281]"
                    >
                      {canLoadMore ? "Load more" : "All stories loaded"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

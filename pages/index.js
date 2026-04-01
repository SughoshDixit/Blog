import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getAllTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import { useState, useEffect, useMemo } from "react";
import RecentlyViewed from "../Components/RecentlyViewed";
import ReadingStreak from "../Components/ReadingStreak";
import useScrollReveal from "../Lib/useScrollReveal";
import {
  SITE_URL,
  SITE_TITLE_HOME,
  SITE_DESCRIPTION,
} from "../Lib/siteConfig";

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

  // Wire scroll-reveal: re-observe whenever blog list changes
  useScrollReveal([publishedBlogs.length]);

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
        <title>{SITE_TITLE_HOME}</title>
        <meta name="title" content={SITE_TITLE_HOME} />
        <meta name="description" content={SITE_DESCRIPTION} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:title" content={SITE_TITLE_HOME} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/SughoshDixit/Blog/main/Extra/sc.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${SITE_URL}/`} />
        <meta property="twitter:title" content={SITE_TITLE_HOME} />
        <meta property="twitter:description" content={SITE_DESCRIPTION} />
        <meta
          property="twitter:image"
          content="https://raw.githubusercontent.com/SughoshDixit/Blog/main/Extra/sc.png"
        />
      </Head>

      <div className="min-h-screen relative bg-[#FAF8F6] dark:bg-[#201E1C] transition-colors duration-300">
        <Navbar topics={topics} />
        {/* best-effort site visit counter */}
        <script dangerouslySetInnerHTML={{__html:`fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({})}).catch(()=>{})`}} />

        <main className="pt-24 pb-16 bg-[#FAF8F6] dark:bg-[#201E1C] transition-colors duration-300">
          {/* Hero — Oracle Redwood: dark ocean/teal + organic blob shapes */}
          <section className="relative overflow-hidden border-b border-[#E0DDD9] dark:border-[#3D3A36] rw-hero">
            {/* Organic blob shapes — Redwood signature visual */}
            <div className="rw-blob rw-blob-1" aria-hidden="true" />
            <div className="rw-blob rw-blob-2" aria-hidden="true" />
            <div className="rw-blob rw-blob-3" aria-hidden="true" />
            {/* Subtle dot texture overlay */}
            <div className="rw-dots" aria-hidden="true" />

            <div className="relative max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center py-20">
                <div>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F5E4D3]/20 border border-[#F5E4D3]/30 text-[#F5E4D3] text-sm font-medium mb-6 backdrop-blur">
                    Data • dharma • stories • football — welcome to the chronicles
                  </div>
                  <h1
                    className="text-4xl md:text-5xl lg:text-[56px] font-semibold leading-tight text-white mb-6"
                    style={{ fontFamily: "Charter, Georgia, serif" }}
                  >
                    Where Numbers Meet Stories
                  </h1>
                  <p className="text-lg md:text-xl text-[#B8E0D8] max-w-2xl leading-relaxed mb-10">
                    A long-form blog by Sughosh Dixit: the 30-Day Data Science Challenge and deep dives into statistics &amp; AI, plus personal essays (family, marriage, cinema), Vedic studies, books, football, heritage, and life in India — one chronicle at a time.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="#latest-posts"
                      className="rw-btn-primary inline-flex items-center justify-center px-8 py-3 text-base font-medium"
                    >
                      Start reading
                    </a>
                    <a
                      href="/about"
                      className="rw-btn-ghost inline-flex items-center justify-center px-8 py-3 text-base font-medium"
                    >
                      Meet the author
                    </a>
                  </div>
                </div>

                {featureHighlight && (
                  <article className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl shadow-black/20">
                    <div className="p-8 space-y-5">
                      <div className="flex items-center gap-3 text-sm text-[#B8E0D8]/80">
                        <span className="font-semibold">
                          {featureHighlight.data.Author || "Sughosh Dixit"}
                        </span>
                        <span>•</span>
                        <span>{featureHighlight.data.Date}</span>
                      </div>
                      <h2
                        className="text-2xl md:text-3xl text-white font-semibold leading-tight"
                        style={{ fontFamily: "Charter, Georgia, serif" }}
                      >
                        <a
                          href={`/blogs/${generateSlug(featureHighlight.data.Title)}`}
                          className="hover:text-[#F5E4D3] transition-colors"
                        >
                          {featureHighlight.data.Title}
                        </a>
                      </h2>
                      <p className="text-base text-[#B8E0D8] leading-relaxed line-clamp-4">
                        {featureHighlight.data.Abstract}
                      </p>
                      <div className="flex justify-between items-center pt-2 text-sm text-[#B8E0D8]/70">
                        <span>{featureHighlight.readTime.text}</span>
                        <span className="px-3 py-1 rounded-full bg-[#C74634] text-white text-xs font-semibold">Latest</span>
                      </div>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </section>

          {/* What to Expect / Trailer Section */}
          <section className="py-16 border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#201E1C]">
             <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12 reveal">
                   <h2 className="text-3xl md:text-4xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={{ fontFamily: "Charter, Georgia, serif" }}>
                      What's Inside The Chronicles?
                   </h2>
                   <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] max-w-3xl mx-auto">
                      Rigorous data science, intimate personal essays, śāstra and cinema, football and books — browse by topic below or jump into the latest post.
                   </p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
                   {/* Data Science Card */}
                   <div className="reveal stagger-1 p-8 rounded-3xl bg-[#FAF8F6] dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] rw-card hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-[#C74634]/10 flex items-center justify-center text-3xl mb-6">
                         📊
                      </div>
                      <h3 className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-3">Data Science &amp; AI</h3>
                      <p className="text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
                         The <strong>30-Day Challenge</strong> and beyond: Boolean logic, fuzzy systems, robustness, sampling — the math that powers modern ML, explained without hand-waving.
                      </p>
                   </div>

                   {/* Life & personal stories */}
                   <div className="reveal stagger-2 p-8 rounded-3xl bg-[#FAF8F6] dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] rw-card hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-[#C74634]/10 flex items-center justify-center text-3xl mb-6">
                         💌
                      </div>
                      <h3 className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-3">Life &amp; Memory</h3>
                      <p className="text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
                         Love stories, family tributes, career reflections, and film — the personal threads that sit alongside the technical work.
                      </p>
                   </div>

                   {/* Dharma / Vedic / civilization */}
                   <div className="reveal stagger-3 p-8 rounded-3xl bg-[#FAF8F6] dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] rw-card hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-[#C74634]/10 flex items-center justify-center text-3xl mb-6">
                         📿
                      </div>
                      <h3 className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-3">Dharma &amp; Śāstra</h3>
                      <p className="text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
                         <strong>Vedic studies</strong>, civilization, heritage, and Chanakya — how ancient frameworks meet modern questions.
                      </p>
                   </div>

                   {/* Football & books */}
                   <div className="reveal stagger-4 p-8 rounded-3xl bg-[#FAF8F6] dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] rw-card hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-[#C74634]/10 flex items-center justify-center text-3xl mb-6">
                         ⚽
                      </div>
                      <h3 className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-3">Football &amp; Books</h3>
                      <p className="text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
                         <strong>Liverpool</strong>, the beautiful game, and long-form <strong>book notes</strong> — passion, strategy, and what I&apos;m reading.
                      </p>
                   </div>
                </div>
             </div>
          </section>

          {/* 30-Day Data Science Challenge Showcase */}
          <section className="relative overflow-hidden border-b border-[#E0DDD9] dark:border-[#3D3A36]">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br rw-section-teal"></div>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C74634]/20 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0f3460]/40 rounded-full blur-[80px]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#533483]/15 rounded-full blur-[120px]"></div>
            </div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
            
            <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C74634]/20 border border-[#C74634]/30 text-[#E8572A] text-sm font-semibold mb-6 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C74634] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8572A]"></span>
                  </span>
                  FLAGSHIP SERIES
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: "Charter, Georgia, serif" }}>
                  30-Day Data Science Challenge
                </h2>
                <p className="text-lg md:text-xl text-[#a8b2d1] max-w-3xl mx-auto leading-relaxed">
                  A comprehensive journey through <span className="text-[#64ffda]">nonparametric statistics</span>, <span className="text-[#E8572A]">robust methods</span>, <span className="text-[#bd93f9]">fuzzy logic</span>, and <span className="text-[#f1fa8c]">sampling theory</span>. 
                  From Boolean algebra to complete audit blueprints.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="reveal stagger-1 text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                  <div className="text-4xl md:text-5xl font-bold text-[#64ffda] mb-2 group-hover:scale-110 transition-transform">30</div>
                  <div className="text-sm text-[#8892b0] uppercase tracking-wider">Days</div>
                </div>
                <div className="reveal stagger-2 text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                  <div className="text-4xl md:text-5xl font-bold text-[#E8572A] mb-2 group-hover:scale-110 transition-transform">6</div>
                  <div className="text-sm text-[#8892b0] uppercase tracking-wider">Pillars</div>
                </div>
                <div className="reveal stagger-3 text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                  <div className="text-4xl md:text-5xl font-bold text-[#bd93f9] mb-2 group-hover:scale-110 transition-transform">100+</div>
                  <div className="text-sm text-[#8892b0] uppercase tracking-wider">Formulas</div>
                </div>
                <div className="reveal stagger-4 text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                  <div className="text-4xl md:text-5xl font-bold text-[#f1fa8c] mb-2 group-hover:scale-110 transition-transform">∞</div>
                  <div className="text-sm text-[#8892b0] uppercase tracking-wider">Applications</div>
                </div>
              </div>

              {/* Pillars Preview */}
              <div className="grid md:grid-cols-3 gap-4 mb-12">
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#64ffda]/10 to-transparent border border-[#64ffda]/20 hover:border-[#64ffda]/40 transition-all duration-300">
                  <div className="text-2xl mb-3">📊</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Nonparametric Statistics</h3>
                  <p className="text-sm text-[#8892b0]">Percentiles, quantiles, KDE, and distribution-free methods</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#E8572A]/10 to-transparent border border-[#E8572A]/20 hover:border-[#E8572A]/40 transition-all duration-300">
                  <div className="text-2xl mb-3">🛡️</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Robust Methods</h3>
                  <p className="text-sm text-[#8892b0]">MAD, adjusted boxplots, outlier detection, and safe ratios</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#bd93f9]/10 to-transparent border border-[#bd93f9]/20 hover:border-[#bd93f9]/40 transition-all duration-300">
                  <div className="text-2xl mb-3">🔮</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Fuzzy Logic</h3>
                  <p className="text-sm text-[#8892b0]">T-norms, membership functions, and soft decision boundaries</p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="/learning-path"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#C74634] to-[#E8572A] text-white font-semibold text-lg shadow-lg shadow-[#C74634]/30 hover:shadow-[#C74634]/50 hover:scale-105 transition-all duration-300"
                  >
                    <span>View Learning Path</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a
                    href="/blogs/day-1-boolean-logic-to-numbers-and-as-min-or-as-max"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                  >
                    <span>Start Day 1</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </div>
                <p className="mt-4 text-sm text-[#8892b0]">Track your progress • 6 Modules • No prerequisites required</p>
              </div>
            </div>
          </section>

          {/* Football & Life Section */}
          <section className="relative overflow-hidden border-b border-[#E0DDD9] dark:border-[#3D3A36]">
            {/* Grass-like gradient with stadium feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#40916c] dark:from-[#081c15] dark:via-[#1b4332] dark:to-[#2d6a4f]"></div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#b7e4c7]/30 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#95d5b2]/20 rounded-full blur-[80px]"></div>
            </div>
            
            {/* Field lines pattern */}
            <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 100px, rgba(255,255,255,0.3) 100px, rgba(255,255,255,0.3) 102px)'}}></div>
            
            <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="reveal-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#b7e4c7] text-sm font-semibold mb-6 backdrop-blur-sm">
                    ⚽ THE BEAUTIFUL GAME
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: "Charter, Georgia, serif" }}>
                    More Than Just A Sport
                  </h2>
                  <p className="text-lg text-[#b7e4c7]/90 leading-relaxed mb-6">
                    "Supporting Liverpool is not like supporting any ordinary club—it's a way of life."
                  </p>
                  <p className="text-base text-[#95d5b2]/80 leading-relaxed mb-8">
                     Inspired by the passion of <strong>Jurgen Klopp</strong> and the leadership of <strong>Steven Gerrard</strong>, I explore why Football beats the "Lazy Game" (Cricket) every single time. It's about strategy, physical excellence, and the global unity of YNWA.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="/blogs/why-support-liverpool-f.c-the-beautiful-game-vs-the-lazy-game"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C74634] text-white font-semibold hover:bg-[#A73A2C] transition-all duration-300 shadow-lg shadow-[#C74634]/30"
                    >
                      <span>⚽</span>
                      <span>Why Liverpool?</span>
                    </a>
                    <a
                      href="https://youtu.be/vX5sqN4Wl78"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-300"
                    >
                      <span>▶️</span>
                      <span>Watch My Skills</span>
                    </a>
                  </div>
                </div>
                
                <div className="relative reveal-right">
                  {/* Stylized football card */}
                  <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                    <div className="aspect-video bg-gradient-to-br from-[#081c15] to-[#1b4332] flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="text-8xl mb-4 animate-bounce">⚽</div>
                        <div className="text-2xl font-bold text-white mb-2">You'll Never Walk Alone</div>
                        <div className="text-[#b7e4c7] text-sm">Liverpool FC • YNWA</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#C74634] flex items-center justify-center text-white font-bold text-xl">S</div>
                        <div>
                          <div className="text-white font-semibold">Sughosh Dixit</div>
                          <div className="text-[#b7e4c7] text-sm">Midfielder • Data Scientist</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating stats */}
                  <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-[#C74634] text-white font-bold shadow-lg transform rotate-3">
                    🏆 Passionate
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reading Streak & Recently Viewed */}
          <section className="border-b border-[#E0DDD9] dark:border-[#3D3A36]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
              <div className="grid gap-6 md:grid-cols-2">
                <ReadingStreak />
                <RecentlyViewed maxPosts={3} />
              </div>
            </div>
          </section>

          {/* Topics rail */}
          {tagPills.length > 0 && (
            <section className="border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C]">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                  <span className="uppercase tracking-wider text-xs font-semibold text-[#8c8169] dark:text-[#a0abc7]">
                    Explore topics
                  </span>
                  {tagPills.map((topic) => (
                    <a
                      key={topic}
                      href={`/topic/${topic}`}
                      className="inline-flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-white text-[#4f4636] border border-[#E0DDD9] hover:border-[#cbbf9f] hover:bg-[#faf5ec] transition-colors dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800/80"
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
            <section className="border-b border-[#E0DDD9] dark:border-[#3D3A36]">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="flex items-center gap-3 mb-10 text-[#161513] dark:text-[#f5f6ff] reveal">
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
                    <article key={post.data.Id} className={`flex space-x-6 reveal stagger-${Math.min(index + 1, 6)}`}>
                      <span className="text-3xl md:text-[42px] font-bold text-[#d4c5a7] leading-none dark:text-[#f3d6a8]">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-[#6E6B68] dark:text-[#aab5d5]">
                          <span className="font-medium">
                            {post.data.Author || "Sughosh Dixit"}
                          </span>
                          <span>•</span>
                          <span>{post.data.Date}</span>
                        </div>
                        <h3
                          className="text-xl md:text-2xl font-semibold text-[#161513] dark:text-[#f5f6ff] leading-tight hover:underline"
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
                    className="reveal group rounded-3xl border border-transparent hover:border-[#dfd2b7] bg-white/85 dark:bg-[#101a2d]/90 hover:bg-white transition-all duration-300 shadow-lg shadow-transparent hover:shadow-[0_16px_60px_-30px_rgba(0,0,0,0.45)] dark:hover:bg-[#162338]"
                  >
                    <div className="p-8 flex flex-col lg:flex-row gap-10">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6E6B68] dark:text-[#a4afcc] mb-4">
                          <span className="font-medium">
                            {blog.data.Author || "Sughosh Dixit"}
                          </span>
                          <span>•</span>
                          <span>{blog.data.Date}</span>
                        </div>
                        <h3
                          className="text-2xl md:text-3xl font-semibold text-[#161513] dark:text-[#f6f7ff] mb-4 leading-tight"
                          style={{ fontFamily: "Charter, Georgia, serif" }}
                        >
                          <a
                            href={`/blogs/${generateSlug(blog.data.Title)}`}
                            className="hover:underline decoration-2 decoration-[#C74634]/50"
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
                            <a
                              href={`/blogs/${generateSlug(blog.data.Title)}`}
                              className="text-[#C74634] hover:text-[#A73A2C] font-semibold dark:text-[#26c281] dark:hover:text-[#1fb877]"
                            >
                              Continue reading →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="space-y-12">
                <div className="reveal-right rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#0f1b31] p-8 shadow-soft">
                  <h2
                    className="text-xl font-semibold text-[#161513] dark:text-[#f5f6ff] mb-6"
                    style={{ fontFamily: "Charter, Georgia, serif" }}
                  >
                    Recent Posts
                  </h2>
                  <div className="space-y-6">
                    {recentPosts.map((post) => (
                      <article key={post.data.Id} className="space-y-2">
                        <a
                          href={`/blogs/${generateSlug(post.data.Title)}`}
                          className="text-lg font-semibold text-[#161513] dark:text-[#f4f6ff] hover:underline leading-snug"
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

                <div className="reveal-right stagger-2 rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#2C2A27] p-8 shadow-soft">
                  <h2 className="text-xl font-semibold text-[#161513] dark:text-[#f4f6ff] mb-4" style={{ fontFamily: "Charter, Georgia, serif" }}>
                    Weekly digest
                  </h2>
                  <p className="text-sm text-[#5e5645] dark:text-[#aab4d1] mb-6">
                    Get the top three stories in your inbox every Sunday along with new experiments from the lab.
                  </p>
                  <form className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-3 rounded-full border border-[#E0DDD9] focus:outline-none focus:border-[#C74634] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
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

                <div className="reveal-right stagger-3 rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#0f192d] p-6 shadow-soft space-y-4">
                  <h3 className="text-sm font-semibold text-[#7a705a] dark:text-[#97a3c7] uppercase tracking-widest">
                    Follow along
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="/ai-gallery"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#d7ddf5] hover:text-[#C74634] dark:hover:text-[#2bd48d] transition-colors"
                    >
                      AI Gallery
                      <span className="text-xs text-[#9a8f75] dark:text-[#7f8bae]">New drops weekly</span>
                    </a>
                    <a
                      href="/dashboard"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#d7ddf5] hover:text-[#C74634] dark:hover:text-[#2bd48d] transition-colors"
                    >
                      Dashboard
                      <span className="text-xs text-[#9a8f75] dark:text-[#7f8bae]">Behind the scenes</span>
                    </a>
                    <a
                      href="/key"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#d7ddf5] hover:text-[#C74634] dark:hover:text-[#2bd48d] transition-colors"
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
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] bg-white/90 dark:bg-[#0f192d]/90 text-sm text-[#695f4b] dark:text-[#bcc6e7] shadow-soft">
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
                      className="px-4 py-2 rounded-full bg-[#C74634] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#C74634]/40 dark:bg-[#26c281]"
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

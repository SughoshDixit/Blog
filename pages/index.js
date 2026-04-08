import Head from "next/head";
import Image from "next/image";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getProminentTopics } from "../Lib/Data";
import { isProminentShelf } from "../Lib/postVisibility";
import { generateSlug } from "../Lib/utils";
import { useState, useEffect, useMemo } from "react";
import useScrollReveal from "../Lib/useScrollReveal";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE_HOME,
  SITE_DESCRIPTION,
  siteOgImageUrl,
  SITE_OG_IMAGE_WIDTH,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_ALT,
} from "../Lib/siteConfig";
import TechPodcastsShelf from "../Components/TechPodcastsShelf";
import FootballShelf from "../Components/FootballShelf";
import DataScienceYouTubeShelf from "../Components/DataScienceYouTubeShelf";

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const allTopics = getProminentTopics();
  
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

  const shelfBlogs = useMemo(
    () => publishedBlogs.filter((b) => isProminentShelf(b)),
    [publishedBlogs]
  );

  const [engagementMap, setEngagementMap] = useState({});

  useEffect(() => {
    let isCancelled = false;

    const loadEngagement = async () => {
      if (!Array.isArray(shelfBlogs) || shelfBlogs.length === 0) return;

      const slugs = shelfBlogs
        .map((b) => generateSlug(b?.data?.Title))
        .filter(Boolean);

      try {
        const res = await fetch("/api/engagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slugs }),
        });

        if (!isCancelled && res.ok) {
          setEngagementMap(await res.json());
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error loading engagement data", error);
          setEngagementMap({});
        }
      }
    };

    loadEngagement();
    return () => { isCancelled = true; };
  }, [shelfBlogs]);

  useEffect(() => {
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).catch(() => {});
  }, []);

  const rankedBlogs = useMemo(() => {
    return shelfBlogs
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
  }, [shelfBlogs, engagementMap]);
 
  const isDSPost = (blog) => blog?.data?.Topic === "Data Science";

  const trendingPosts = useMemo(
    () => rankedBlogs.slice(0, 6),
    [rankedBlogs]
  );

  const featureHighlight = useMemo(() => {
    const sortedByRecency = [...shelfBlogs].sort((a, b) => {
      const dateA = Date.parse(a?.data?.Date);
      const dateB = Date.parse(b?.data?.Date);
      const isValidDateA = !Number.isNaN(dateA);
      const isValidDateB = !Number.isNaN(dateB);
      if (isValidDateA && isValidDateB) return dateB - dateA;
      if (isValidDateA) return -1;
      if (isValidDateB) return 1;
      const idA = Number(a?.data?.Id) || 0;
      const idB = Number(b?.data?.Id) || 0;
      return idB - idA;
    });
    return sortedByRecency[0];
  }, [shelfBlogs]);

  const recentPosts = useMemo(
    () =>
      [...shelfBlogs]
        .filter((b) => !isDSPost(b))
        .sort((a, b) => {
          const da = Date.parse(a?.data?.Date);
          const db = Date.parse(b?.data?.Date);
          if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
          if (!Number.isNaN(da)) return -1;
          if (!Number.isNaN(db)) return 1;
          return (Number(b?.data?.Id) || 0) - (Number(a?.data?.Id) || 0);
        })
        .slice(0, 5),
    [shelfBlogs]
  );

  const remainingPosts = useMemo(
    () =>
      shelfBlogs
        .filter((blog) => {
          if (isDSPost(blog)) return false;
          const isInRecent = recentPosts.some((r) => r?.data?.Id === blog?.data?.Id);
          const isFeatured = featureHighlight?.data?.Id === blog?.data?.Id;
          return !isInRecent && !isFeatured;
        })
        .sort((a, b) => {
          const da = Date.parse(a?.data?.Date);
          const db = Date.parse(b?.data?.Date);
          if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
          if (!Number.isNaN(da)) return -1;
          if (!Number.isNaN(db)) return 1;
          return (Number(b?.data?.Id) || 0) - (Number(a?.data?.Id) || 0);
        }),
    [shelfBlogs, recentPosts, featureHighlight]
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

  // Re-observe whenever the visible post count changes (including Load More)
  useScrollReveal([paginatedPosts.length, trendingPosts.length]);

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

        <link rel="canonical" href={`${SITE_URL}/`} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:title" content={SITE_TITLE_HOME} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:image" content={siteOgImageUrl()} />
        <meta property="og:image:width" content={String(SITE_OG_IMAGE_WIDTH)} />
        <meta property="og:image:height" content={String(SITE_OG_IMAGE_HEIGHT)} />
        <meta property="og:image:alt" content={SITE_OG_IMAGE_ALT} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${SITE_URL}/`} />
        <meta property="twitter:title" content={SITE_TITLE_HOME} />
        <meta property="twitter:description" content={SITE_DESCRIPTION} />
        <meta property="twitter:image" content={siteOgImageUrl()} />
        <meta name="twitter:image:alt" content={SITE_OG_IMAGE_ALT} />

        {/* Person schema — enables Google Knowledge Panel for "Sughosh Dixit" */}
        <script
          id="ld-json-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Sughosh Dixit",
              url: SITE_URL,
              image: `${SITE_URL}/og/social-share.jpg`,
              jobTitle: "Data Scientist",
              worksFor: {
                "@type": "Organization",
                name: "Oracle",
              },
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "BITS Pilani",
              },
              description:
                "Data Scientist at Oracle, M.Tech from BITS Pilani. Long-form writer on data science, AI, football, Vedic studies, and life in India.",
              sameAs: [
                "https://www.youtube.com/@sughoshdixit",
                "https://github.com/SughoshDixit",
                "https://www.linkedin.com/in/sughosh-dixit/",
                "https://twitter.com/PSughosh",
              ],
            }),
          }}
        />
        {/* WebSite schema — enables sitelinks search box */}
        <script
          id="ld-json-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/topic/{search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </Head>

      <div className="min-h-screen relative bg-[#FAF8F6] dark:bg-[#201E1C] transition-colors duration-300">
        <Navbar topics={topics} />

        <main className="pt-24 pb-16 bg-[#FAF8F6] dark:bg-[#201E1C] transition-colors duration-300">
          {/* Hero — Refined personal brand */}
          <section className="relative overflow-hidden border-b border-[#E0DDD9] dark:border-[#3D3A36] rw-hero">
            <div className="rw-blob rw-blob-1" aria-hidden="true" />
            <div className="rw-blob rw-blob-2" aria-hidden="true" />
            <div className="rw-dots" aria-hidden="true" />

            <div className="relative max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center py-20">
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-[#B8E0D8]/70 mb-4">
                    Data Science &middot; Football &middot; Personal Essays &middot; Ideas
                  </p>
                  <h1
                    className="text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.15] text-white mb-6"
                    style={{ fontFamily: "Charter, Georgia, serif" }}
                  >
                    Hi, I&apos;m <span className="text-[#F5E4D3]">Sughosh Dixit</span>.
                  </h1>
                  <p className="text-lg md:text-xl text-[#B8E0D8] max-w-xl leading-relaxed mb-10">
                    Data scientist at Oracle. I write long-form pieces on statistics, AI, Vedic studies, football, and life in India — and document it all on YouTube.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="#latest-posts"
                      className="rw-btn-primary inline-flex items-center justify-center px-8 py-3 text-base font-medium"
                    >
                      Read the latest
                    </a>
                    <a
                      href="https://www.youtube.com/@sughoshdixit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rw-btn-ghost inline-flex items-center gap-2 justify-center px-8 py-3 text-base font-medium"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      YouTube
                    </a>
                    <a
                      href="/about"
                      className="rw-btn-ghost inline-flex items-center justify-center px-8 py-3 text-base font-medium"
                    >
                      About me
                    </a>
                  </div>
                </div>

                {featureHighlight && (
                  <article className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl shadow-black/20">
                    {featureHighlight.data.HeaderImage && featureHighlight.data.HeaderImage.trim() && (
                      <div className="relative aspect-[2/1] overflow-hidden rounded-t-2xl">
                        <Image
                          src={featureHighlight.data.HeaderImage}
                          alt=""
                          layout="fill"
                          objectFit="cover"
                          objectPosition="top"
                          priority
                        />
                      </div>
                    )}
                    <div className="p-8 space-y-4">
                      <div className="flex items-center gap-3 text-sm text-[#B8E0D8]/80">
                        <span className="font-semibold">
                          {featureHighlight.data.Author || "Sughosh Dixit"}
                        </span>
                        <span>&middot;</span>
                        <span>{featureHighlight.data.Date}</span>
                        <span>&middot;</span>
                        <span>{featureHighlight.readTime.text}</span>
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
                      <p className="text-base text-[#B8E0D8] leading-relaxed line-clamp-3">
                        {featureHighlight.data.Abstract}
                      </p>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#C74634] text-white text-xs font-semibold">Latest</span>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </section>

          {/* Featured documentary */}
          <section className="border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
              <div className="reveal rounded-3xl overflow-hidden border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] shadow-soft">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                  <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      title="Veer Savarkar AI cinematic documentary"
                      src="https://www.youtube.com/embed/5fBTT9MwQio?rel=0&modestbranding=1"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-3">
                      Featured Documentary
                    </p>
                    <h2
                      className="text-2xl md:text-3xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4"
                      style={{ fontFamily: "Charter, Georgia, serif" }}
                    >
                      Veer Savarkar — AI Cinematic Documentary
                    </h2>
                    <p className="text-[#5e5645] dark:text-[#B8B4B0] leading-relaxed mb-6">
                      A NotebookLM-powered documentary that captures the civilizational thread in one cinematic narrative.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="/savarkar-documentary"
                        className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#C74634] text-white font-medium hover:bg-[#A73A2C] transition-colors"
                      >
                        Explore documentary
                      </a>
                      <a
                        href="https://youtu.be/5fBTT9MwQio?si=ENxM8fQhtUCEOrm4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-[#4f4636] dark:text-[#F5F4F2] hover:border-[#cbbf9f] transition-colors"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Compact 30-Day DS Challenge banner */}
          <section className="relative overflow-hidden border-b border-[#E0DDD9] dark:border-[#3D3A36]">
            <div className="absolute inset-0 bg-gradient-to-br rw-section-teal"></div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C74634]/20 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0f3460]/40 rounded-full blur-[80px]"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C74634]/20 border border-[#C74634]/30 text-[#E8572A] text-xs font-semibold mb-4 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C74634] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8572A]"></span>
                    </span>
                    FLAGSHIP SERIES
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "Charter, Georgia, serif" }}>
                    30-Day Data Science Challenge
                  </h2>
                  <p className="text-base text-[#a8b2d1] leading-relaxed">
                    Nonparametric statistics, robust methods, fuzzy logic, and sampling theory — from Boolean algebra to complete audit blueprints. <strong className="text-white">30 days. 6 pillars. 100+ formulas.</strong>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <a
                    href="/learning-path"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C74634] to-[#E8572A] text-white font-semibold shadow-lg shadow-[#C74634]/30 hover:shadow-[#C74634]/50 hover:scale-105 transition-all duration-300"
                  >
                    View Learning Path
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </a>
                  <a
                    href="/blogs/day-1-boolean-logic-to-numbers-and-as-min-or-as-max"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    Start Day 1
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Topics rail */}
          {tagPills.length > 0 && (
            <section className="border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C]">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                  <span className="uppercase tracking-wider text-xs font-semibold text-[#8c8169] dark:text-[#B8B4B0]">
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
                <div className="flex items-center gap-3 mb-10 text-[#161513] dark:text-[#F5F4F2] reveal">
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
                    Trending
                  </h2>
                </div>
                <div className="grid gap-10 md:grid-cols-2">
                  {trendingPosts.map((post, index) => (
                    <article key={post.data.Id} className={`flex space-x-6 reveal stagger-${Math.min(index + 1, 6)}`}>
                      <span className="text-3xl md:text-[42px] font-bold text-[#d4c5a7] leading-none dark:text-[#f3d6a8]">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-[#6E6B68] dark:text-[#B8B4B0]">
                          <span className="font-medium">
                            {post.data.Author || "Sughosh Dixit"}
                          </span>
                          <span>•</span>
                          <span>{post.data.Date}</span>
                        </div>
                        <h3
                          className="text-xl md:text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] leading-tight hover:underline"
                          style={{ fontFamily: "Charter, Georgia, serif" }}
                        >
                          <a href={`/blogs/${generateSlug(post.data.Title)}`}>
                            {post.data.Title}
                          </a>
                        </h3>
                        <p className="text-sm text-[#494132] dark:text-[#B8B4B0] line-clamp-3">
                          {post.data.Abstract}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-[#7c7461] dark:text-[#6E6B68]">
                          <span>{post.readTime.text}</span>
                          {(() => {
                            const slug = generateSlug(post.data.Title);
                            const eng = engagementMap[slug];
                            if (!eng) return null;
                            return (
                              <span className="flex items-center gap-3">
                                {eng.likes > 0 && (
                                  <span className="flex items-center gap-1" title="Likes">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                                    {eng.likes}
                                  </span>
                                )}
                                {eng.comments > 0 && (
                                  <span className="flex items-center gap-1" title="Comments">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    {eng.comments}
                                  </span>
                                )}
                              </span>
                            );
                          })()}
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
                <DataScienceYouTubeShelf />
                <FootballShelf />
                <TechPodcastsShelf />
                {paginatedPosts.map((blog) => (
                  <article
                    key={blog.data.Id}
                    className="reveal group rounded-3xl border border-transparent hover:border-[#dfd2b7] bg-white/85 dark:bg-[#2C2A27]/90 hover:bg-white transition-all duration-300 shadow-lg shadow-transparent hover:shadow-[0_16px_60px_-30px_rgba(0,0,0,0.45)] dark:hover:bg-[#2C2A27]"
                  >
                    {getImageForBlog(blog) && (
                      <a href={`/blogs/${generateSlug(blog.data.Title)}`} className="relative block aspect-[2/1] overflow-hidden rounded-t-3xl">
                        <Image
                          src={getImageForBlog(blog)}
                          alt=""
                          layout="fill"
                          objectFit="cover"
                          objectPosition="top"
                          className="group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </a>
                    )}
                    <div className="p-8">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-[#6E6B68] dark:text-[#B8B4B0] mb-4">
                        <span className="font-medium">
                          {blog.data.Author || "Sughosh Dixit"}
                        </span>
                        <span>&middot;</span>
                        <span>{blog.data.Date}</span>
                        <span>&middot;</span>
                        <span>{blog.readTime.text}</span>
                      </div>
                      <h3
                        className="text-2xl md:text-3xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4 leading-tight"
                        style={{ fontFamily: "Charter, Georgia, serif" }}
                      >
                        <a
                          href={`/blogs/${generateSlug(blog.data.Title)}`}
                          className="hover:underline decoration-2 decoration-[#C74634]/50"
                        >
                          {blog.data.Title}
                        </a>
                      </h3>
                      <p className="text-base md:text-lg text-[#4b4334] dark:text-[#B8B4B0] leading-relaxed line-clamp-3">
                        {blog.data.Abstract}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-sm text-[#7c7461] dark:text-[#6E6B68]">
                        <div className="flex flex-wrap items-center gap-2">
                          {blog.data.Tags && blog.data.Tags.split(" ")
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-[#f0e9dd] text-[#5b5241] text-xs font-medium dark:bg-[#3D3A36] dark:text-[#F5F4F2]"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                          {(() => {
                            const slug = generateSlug(blog.data.Title);
                            const eng = engagementMap[slug];
                            if (!eng) return null;
                            return (
                              <span className="flex items-center gap-3">
                                {eng.likes > 0 && (
                                  <span className="flex items-center gap-1" title="Likes">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                                    {eng.likes}
                                  </span>
                                )}
                                {eng.comments > 0 && (
                                  <span className="flex items-center gap-1" title="Comments">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    {eng.comments}
                                  </span>
                                )}
                              </span>
                            );
                          })()}
                          <a
                            href={`/blogs/${generateSlug(blog.data.Title)}`}
                            className="text-[#C74634] hover:text-[#A73A2C] font-semibold dark:text-[#E8572A] dark:hover:text-[#C74634]"
                          >
                            Continue reading &rarr;
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="space-y-12">
                <div className="reveal-right rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-8 shadow-soft">
                  <h2
                    className="text-xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-6"
                    style={{ fontFamily: "Charter, Georgia, serif" }}
                  >
                    Recent Posts
                  </h2>
                  <div className="space-y-6">
                    {recentPosts.map((post) => (
                      <article key={post.data.Id} className="space-y-2">
                        <a
                          href={`/blogs/${generateSlug(post.data.Title)}`}
                          className="text-lg font-semibold text-[#161513] dark:text-[#F5F4F2] hover:underline leading-snug"
                          style={{ fontFamily: "Charter, Georgia, serif" }}
                        >
                          {post.data.Title}
                        </a>
                        <p className="text-sm text-[#5e5645] dark:text-[#B8B4B0] line-clamp-2">
                          {post.data.Abstract}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#7c7461] dark:text-[#6E6B68]">
                          <span>{post.data.Author || "Sughosh Dixit"}</span>
                          <span>•</span>
                          <span>{post.readTime.text}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="reveal-right stagger-2 rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#2C2A27] p-8 shadow-soft">
                  <h2 className="text-xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4" style={{ fontFamily: "Charter, Georgia, serif" }}>
                    Weekly digest
                  </h2>
                  <p className="text-sm text-[#5e5645] dark:text-[#B8B4B0] mb-6">
                    Get the top three stories in your inbox every Sunday along with new experiments from the lab.
                  </p>
                  <form className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-3 rounded-full border border-[#E0DDD9] focus:outline-none focus:border-[#C74634] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#201E1C] dark:text-[#F5F4F2] dark:border-[#3D3A36] dark:placeholder:text-[#6E6B68]"
                    />
                    <button
                      type="submit"
                      className="w-full medium-button inline-flex items-center justify-center px-6 py-3 text-sm"
                    >
                      Sign me up
                    </button>
                  </form>
                  <p className="text-xs text-[#9a8f75] dark:text-[#6E6B68] mt-4">
                    No spam, unsubscribe anytime.
                  </p>
                </div>

                <div className="reveal-right stagger-3 rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-6 shadow-soft space-y-4">
                  <h3 className="text-sm font-semibold text-[#7a705a] dark:text-[#B8B4B0] uppercase tracking-widest">
                    Follow along
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="/ai-gallery"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#F5F4F2] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors"
                    >
                      AI Gallery
                      <span className="text-xs text-[#9a8f75] dark:text-[#6E6B68]">New drops weekly</span>
                    </a>
                    <a
                      href="/dashboard"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#F5F4F2] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors"
                    >
                      Dashboard
                      <span className="text-xs text-[#9a8f75] dark:text-[#6E6B68]">Behind the scenes</span>
                    </a>
                    <a
                      href="/key"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#F5F4F2] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors"
                    >
                      Key Terms
                      <span className="text-xs text-[#9a8f75] dark:text-[#6E6B68]">Data glossary</span>
                    </a>
                    <a
                      href="/archive"
                      className="flex items-center justify-between text-sm text-[#4f4636] dark:text-[#F5F4F2] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors"
                    >
                      Archive
                      <span className="text-xs text-[#9a8f75] dark:text-[#6E6B68]">Off the main shelf</span>
                    </a>
                  </div>
                </div>
              </aside>
            </div>
            {remainingPosts.length > 0 && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 flex justify-center">
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] bg-white/90 dark:bg-[#2C2A27]/90 text-sm text-[#695f4b] dark:text-[#B8B4B0] shadow-soft">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-full border border-transparent disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#d9cdb2] hover:bg-[#faf5ec] dark:hover:border-[#3D3A36] dark:hover:bg-[#201E1C]"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => (canLoadMore ? prev + 1 : prev))}
                      disabled={!canLoadMore}
                      className="px-4 py-2 rounded-full bg-[#C74634] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#C74634]/40"
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

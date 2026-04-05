import Head from "next/head";
import Image from "next/image";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FiYoutube, FiExternalLink, FiArrowRight } from "react-icons/fi";
import { FaFutbol } from "react-icons/fa";
import { getAllBlogPosts, getProminentTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import {
  FOOTBALL_VIDEOS,
  FOOTBALL_HERO_VIDEO_ID,
  FOOTBALL_PLAYLIST_URL,
  YOUTUBE_CHANNEL_URL,
} from "../Lib/footballYouTubeData";
import {
  SITE_URL,
  SITE_NAME,
  siteOgImageUrl,
  SITE_OG_IMAGE_WIDTH,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_ALT,
} from "../Lib/siteConfig";

export const getStaticProps = () => {
  const allTopics = getProminentTopics();
  const allBlogs = getAllBlogPosts();

  const footballPosts = allBlogs
    .filter((b) => {
      if (!b?.data?.isPublished) return false;
      const topic = b?.data?.Topic || "";
      const tags = b?.data?.Tags || "";
      return (
        topic.toLowerCase().includes("football") ||
        tags.toLowerCase().includes("football") ||
        tags.toLowerCase().includes("liverpool") ||
        tags.toLowerCase().includes("soccer")
      );
    })
    .map((b) => ({ data: b.data, readTime: b.readTime }));

  return { props: { topics: allTopics || [], footballPosts } };
};

const PAGE_TITLE = "Football — Sughosh Dixit";
const PAGE_DESCRIPTION =
  "Sughosh Dixit on football: analysis, passion pieces, goal highlights, and the beautiful game — from Liverpool FC to data-driven match insights.";

export default function FootballPage({ topics, footballPosts }) {
  const embedSrc = `https://www.youtube.com/embed/${FOOTBALL_HERO_VIDEO_ID}?modestbranding=1&rel=0`;

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="title" content={PAGE_TITLE} />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={`${SITE_URL}/football`} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/football`} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={siteOgImageUrl()} />
        <meta property="og:image:width" content={String(SITE_OG_IMAGE_WIDTH)} />
        <meta property="og:image:height" content={String(SITE_OG_IMAGE_HEIGHT)} />
        <meta property="og:image:alt" content={SITE_OG_IMAGE_ALT} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${SITE_URL}/football`} />
        <meta property="twitter:title" content={PAGE_TITLE} />
        <meta property="twitter:description" content={PAGE_DESCRIPTION} />
        <meta property="twitter:image" content={siteOgImageUrl()} />

        <script
          id="ld-json-football"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Football — Sughosh Dixit",
              description: PAGE_DESCRIPTION,
              url: `${SITE_URL}/football`,
              author: {
                "@type": "Person",
                name: "Sughosh Dixit",
                url: SITE_URL,
              },
              about: {
                "@type": "SportsOrganization",
                sport: "Football",
              },
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-[#FAF8F6] dark:bg-[#201E1C] transition-colors duration-300">
        <Navbar topics={topics} />

        <main className="pt-24 pb-16">
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-[#E0DDD9] dark:border-[#3D3A36] rw-hero">
            <div className="rw-blob rw-blob-1" aria-hidden="true" />
            <div className="rw-blob rw-blob-2" aria-hidden="true" />
            <div className="rw-dots" aria-hidden="true" />
            <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20">
              <div className="flex items-center gap-3 text-[#C74634] dark:text-[#E8572A] mb-4">
                <FaFutbol className="w-6 h-6" aria-hidden />
                <span className="text-sm font-semibold uppercase tracking-widest">Football</span>
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.15] text-white mb-6 max-w-3xl"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                The Beautiful Game
              </h1>
              <p className="text-lg md:text-xl text-[#B8E0D8] max-w-xl leading-relaxed mb-10">
                Goals, analysis, and the passion for football — from Liverpool FC to data-driven match insights on YouTube.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rw-btn-primary inline-flex items-center gap-2 justify-center px-8 py-3 text-base font-medium"
                >
                  <FiYoutube className="w-5 h-5" />
                  Watch on YouTube
                </a>
                <a
                  href="#football-videos"
                  className="rw-btn-ghost inline-flex items-center justify-center px-8 py-3 text-base font-medium"
                >
                  See videos
                </a>
              </div>
            </div>
          </section>

          {/* YouTube Section */}
          <section id="football-videos" className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="flex items-center gap-3 mb-10 text-[#161513] dark:text-[#F5F4F2]">
              <FiYoutube className="w-6 h-6 text-[#C74634]" aria-hidden />
              <h2
                className="text-2xl font-semibold tracking-tight"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                Football on YouTube
              </h2>
            </div>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              {/* Main embed */}
              <div>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 shadow-xl mb-6">
                  <iframe
                    title="Football video by Sughosh Dixit"
                    src={embedSrc}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <a
                  href={FOOTBALL_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C74634] text-white text-sm font-medium hover:bg-[#A73A2C] transition-colors"
                >
                  <FiYoutube className="w-4 h-4" />
                  Full channel
                  <FiExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Video list */}
              <div>
                <p className="text-xs uppercase tracking-widest text-[#9a8f75] dark:text-[#6E6B68] mb-5">
                  All football videos
                </p>
                <ul className="space-y-4">
                  {FOOTBALL_VIDEOS.map(({ id, title }) => (
                    <li key={id}>
                      <a
                        href={`https://www.youtube.com/watch?v=${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex gap-4 rounded-xl border border-transparent hover:border-[#dfd2b7] dark:hover:border-[#3D3A36] p-3 -mx-3 transition-colors"
                      >
                        <div className="relative w-32 shrink-0 aspect-video rounded-lg overflow-hidden bg-[#E0DDD9] dark:bg-[#3D3A36]">
                          <Image
                            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                            alt=""
                            layout="fill"
                            objectFit="cover"
                            sizes="128px"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiYoutube className="w-8 h-8 text-white drop-shadow" />
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[#161513] dark:text-[#F5F4F2] group-hover:text-[#C74634] dark:group-hover:text-[#E8572A] leading-snug line-clamp-3 pt-1">
                          {title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Football blog posts */}
          {footballPosts.length > 0 && (
            <section className="border-t border-[#E0DDD9] dark:border-[#3D3A36]">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <h2
                  className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-10"
                  style={{ fontFamily: "Charter, Georgia, serif" }}
                >
                  Football Essays
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {footballPosts.map((post) => {
                    const slug = generateSlug(post.data.Title);
                    return (
                      <article
                        key={post.data.Id}
                        className="group rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] overflow-hidden hover:shadow-lg hover:border-[#cbbf9f] dark:hover:border-[#4a4640] transition-all duration-300"
                      >
                        {post.data.HeaderImage && post.data.HeaderImage.trim() && (
                          <a href={`/blogs/${slug}`} className="relative block aspect-[2/1] overflow-hidden">
                            <Image
                              src={post.data.HeaderImage}
                              alt=""
                              layout="fill"
                              objectFit="cover"
                              objectPosition="top"
                              className="group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </a>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-xs text-[#6E6B68] dark:text-[#B8B4B0] mb-3">
                            <span>{post.data.Date}</span>
                            <span>·</span>
                            <span>{post.readTime.text}</span>
                          </div>
                          <h3
                            className="text-xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-3 leading-tight"
                            style={{ fontFamily: "Charter, Georgia, serif" }}
                          >
                            <a href={`/blogs/${slug}`} className="hover:underline decoration-2 decoration-[#C74634]/50">
                              {post.data.Title}
                            </a>
                          </h3>
                          <p className="text-sm text-[#4b4334] dark:text-[#B8B4B0] leading-relaxed line-clamp-3 mb-4">
                            {post.data.Abstract}
                          </p>
                          <a
                            href={`/blogs/${slug}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#C74634] dark:text-[#E8572A] hover:underline"
                          >
                            Read essay <FiArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* CTA to channel */}
          <section className="border-t border-[#E0DDD9] dark:border-[#3D3A36]">
            <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 text-center">
              <FaFutbol className="w-10 h-10 text-[#C74634] mx-auto mb-6" aria-hidden />
              <h2
                className="text-2xl md:text-3xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                More football content on YouTube
              </h2>
              <p className="text-base text-[#5e5645] dark:text-[#B8B4B0] mb-8">
                Subscribe to the channel for goal highlights, match analysis, and the intersection of football and data science.
              </p>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#C74634] text-white font-semibold hover:bg-[#A73A2C] transition-colors shadow-lg shadow-[#C74634]/30"
              >
                <FiYoutube className="w-5 h-5" />
                Subscribe on YouTube
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

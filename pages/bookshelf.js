import Head from "next/head";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getProminentTopics } from "../Lib/Data";
import { generateSlug, sortByDateDesc } from "../Lib/utils";
import { isUnlisted } from "../Lib/postVisibility";
import { SITE_URL, siteOgImageUrl } from "../Lib/siteConfig";

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

const READING_QUEUE = [
  {
    title: "Dopamine Detox",
    theme: "Focus, Attention & Deliberate Work",
    status: "Notes in Draft",
    why: "Resetting overstimulation so hard analytical work, long reading, and slow compounding feel rewarding again.",
    keywords: ["dopamine detox"],
  },
  {
    title: "A Content Creator's Handbook",
    theme: "Writing & Digital Consistency",
    status: "On the Shelf",
    why: "Sharpening structure, cadence, and sustainable habits for turning rough observations into durable essays.",
    keywords: ["content creator"],
  },
  {
    title: "Pyjama Profit",
    theme: "Careers & Skill Compounding",
    status: "Read · Notes Planned",
    why: "Pragmatic thinking on independent skill leverage, building early proof of work, and career optionality.",
    keywords: ["pyjama profit"],
  },
  {
    title: "Build, Don't Talk",
    theme: "Execution & Mindset",
    status: "Read · Notes Planned",
    why: "Unfiltered reminders on bias toward action, clear communication, and shipping before over-polishing.",
    keywords: ["build, don't talk", "build dont talk"],
  },
];

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const topics = getProminentTopics() || [];

  const publishedPosts = allBlogs.filter((b) => b?.data?.isPublished && !isUnlisted(b));

  const bookPosts = publishedPosts
    .filter((b) => {
      const topic = (b?.data?.Topic || "").toLowerCase();
      const tags = (b?.data?.Tags || "").toLowerCase();
      return topic === "book" || tags.includes("book");
    })
    .sort(sortByDateDesc)
    .map((b) => ({
      title: b.data.Title,
      slug: generateSlug(b.data.Title),
      abstract: b.data.Abstract || "",
      date: b.data.Date || "",
      topic: b.data.Topic || "Book",
      headerImage: b.data.HeaderImage || null,
      readTime: b.readTime?.text || "",
    }));

  const publishedTitleIndex = publishedPosts.map((b) => ({
    titleLower: (b?.data?.Title || "").toLowerCase(),
    slug: generateSlug(b.data.Title),
  }));

  const queueItems = READING_QUEUE.map((item) => {
    const match = publishedTitleIndex.find((p) =>
      item.keywords.some((kw) => p.titleLower.includes(kw))
    );
    return {
      title: item.title,
      theme: item.theme,
      status: match ? "Published" : item.status,
      why: item.why,
      publishedSlug: match ? match.slug : null,
    };
  }).filter((item) => !item.publishedSlug);

  return {
    props: {
      bookPosts,
      queueItems,
      topics,
    },
  };
};

export default function Bookshelf({ bookPosts = [], queueItems = [], topics = [] }) {
  const description =
    "Books that shaped my thinking across geopolitics, discipline, careers, and craft — paired with distilled notes and upcoming reads.";

  return (
    <>
      <Head>
        <title>Bookshelf — Sughosh Dixit</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/bookshelf`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/bookshelf`} />
        <meta property="og:title" content="Bookshelf — Sughosh Dixit" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={siteOgImageUrl()} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bookshelf — Sughosh Dixit" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={siteOgImageUrl()} />
      </Head>

      <div className="min-h-screen bg-[#FAF8F6] dark:bg-[#201E1C]">
        <Navbar topics={topics} />

        <main className="pt-28 pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <header className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C74634] dark:text-[#E8572A] mb-3">
                Curated Library
              </p>
              <h1
                className="text-4xl md:text-5xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-5"
                style={CHARTER}
              >
                Bookshelf
              </h1>
              <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed max-w-2xl mb-6">
                {description}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#C74634] dark:bg-[#E8572A]" />
                  {bookPosts.length} Published {bookPosts.length === 1 ? "Note" : "Notes"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] text-[#6E6B68] dark:text-[#B8B4B0] font-medium">
                  {queueItems.length} Up Next in Queue
                </span>
                <Link
                  href="/topic/Book"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[#C74634] dark:text-[#E8572A] hover:underline font-semibold"
                >
                  Browse Book topic →
                </Link>
              </div>
            </header>

            <section className="mb-16">
              <div className="flex items-baseline justify-between mb-6 border-b border-[#E0DDD9] dark:border-[#3D3A36] pb-3">
                <h2
                  className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2]"
                  style={CHARTER}
                >
                  Published Book Notes
                </h2>
                <span className="text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
                  Long-form takeaways
                </span>
              </div>

              {bookPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookPosts.map((post) => (
                    <article
                      key={post.slug}
                      className="group rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                      {post.headerImage && (
                        <Link href={`/blogs/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-[#F0EDE9] dark:bg-[#1B1917]">
                          <img
                            src={post.headerImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </Link>
                      )}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#6E6B68] dark:text-[#B8B4B0] mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#FAF8F6] dark:bg-[#201E1C] border border-[#E0DDD9] dark:border-[#3D3A36] text-[#C74634] dark:text-[#E8572A] font-medium">
                              {post.topic}
                            </span>
                            {post.readTime && <span>· {post.readTime}</span>}
                            {post.date && <span>· {post.date}</span>}
                          </div>
                          <Link href={`/blogs/${post.slug}`}>
                            <h3
                              className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2] group-hover:text-[#C74634] dark:group-hover:text-[#E8572A] transition-colors mb-2"
                              style={CHARTER}
                            >
                              {post.title}
                            </h3>
                          </Link>
                          {post.abstract && (
                            <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed line-clamp-3">
                              {post.abstract}
                            </p>
                          )}
                        </div>
                        <Link
                          href={`/blogs/${post.slug}`}
                          className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-[#C74634] dark:text-[#E8572A] hover:gap-2.5 transition-all"
                        >
                          Read book notes →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] p-6 rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27]">
                  Published book reviews will appear here automatically.
                </p>
              )}
            </section>

            {queueItems.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-6 border-b border-[#E0DDD9] dark:border-[#3D3A36] pb-3">
                  <h2
                    className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2]"
                    style={CHARTER}
                  >
                    On the Shelf & Reading Queue
                  </h2>
                  <span className="text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
                    Upcoming essays & takeaways
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {queueItems.map((book) => (
                    <div
                      key={book.title}
                      className="p-5 rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[11px] font-medium text-[#6E6B68] dark:text-[#B8B4B0]">
                            {book.theme}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF8F6] dark:bg-[#201E1C] border border-[#E0DDD9] dark:border-[#3D3A36] text-[#C74634] dark:text-[#E8572A]">
                            {book.status}
                          </span>
                        </div>
                        <h3
                          className="text-lg font-bold text-[#161513] dark:text-[#F5F4F2] mb-2"
                          style={CHARTER}
                        >
                          {book.title}
                        </h3>
                        <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
                          {book.why}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

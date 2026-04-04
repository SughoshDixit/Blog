import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getProminentTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import { SITE_URL } from "../Lib/siteConfig";

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

const CURATED = [
  {
    section: "The 30-Day Data Science Challenge",
    desc: "My flagship series — a comprehensive journey through nonparametric statistics, robust methods, fuzzy logic, and sampling theory.",
    picks: [
      { title: "Day 1 — Boolean Logic to Numbers: AND as min, OR as max", why: "Where it all begins. The foundation for everything that follows." },
      { title: "Day 14 — Hypergeometric Distribution and Sample Size: Finding Needles in Haystacks", why: "The most-visited post in the series. Practical sampling theory made intuitive." },
      { title: "Day 30 — The Audit Blueprint: Bringing It All Together", why: "The grand finale — every concept unified into a real-world audit framework." },
    ],
    cta: { label: "See the full learning path", href: "/learning-path" },
  },
  {
    section: "Personal Essays",
    desc: "Long-form pieces about family, marriage, career, and the things that matter beyond code.",
    picks: [
      { title: "I too had a Love Story", why: "The most personal piece on this site. A story of gratitude." },
      { title: "A heartfelt Ode and a Tribute to Ajjju", why: "A tribute to the person who shaped who I am." },
      { title: "Five Years at Oracle: From Cloud Analyst to Data Scientist", why: "The career arc — lessons learned, pivots made." },
    ],
  },
  {
    section: "Culture, Dharma & the World",
    desc: "Vedic studies, Indian civilization, books, and thinking about the world we live in.",
    picks: [
      { title: "Gratitude for Being Born in the Ancient Civilization of Bharatavarsha", why: "Starting with gratitude — a reflection on heritage." },
      { title: "Vedic Studies on Marriage Part 1", why: "What the Atharva Veda says about marriage — an underexplored topic." },
      { title: "India in a Shifting Global Order — Book Notes", why: "Notes on India's place in the current world order." },
    ],
  },
  {
    section: "Football & Entertainment",
    desc: "Liverpool FC, the beautiful game, and why it matters.",
    picks: [
      { title: "Why Support Liverpool F.C? The Beautiful Game vs The Lazy Game", why: "My manifesto on football, Klopp, and why YNWA is a way of life." },
    ],
  },
];

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const allTopics = getProminentTopics();
  const blogMap = {};
  allBlogs
    .filter((b) => b?.data?.isPublished)
    .forEach((b) => {
      const slug = generateSlug(b.data.Title);
      blogMap[b.data.Title] = { slug, readTime: b.readTime, data: b.data };
    });
  return { props: { blogMap, topics: allTopics || [] } };
};

export default function StartHere({ blogMap, topics }) {
  return (
    <>
      <Head>
        <title>Start Here — Sughosh Dixit</title>
        <meta name="description" content="New here? This curated guide walks you through the best posts across data science, personal essays, culture, and football." />
        <link rel="canonical" href={`${SITE_URL}/start-here`} />
      </Head>

      <div className="min-h-screen bg-[#FAF8F6] dark:bg-[#201E1C]">
        <Navbar topics={topics} />

        <main className="pt-28 pb-20">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <header className="mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-6" style={CHARTER}>
                Start Here
              </h1>
              <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed max-w-2xl">
                New to the site? This page is a curated guide to the best writing across every topic I cover.
                Think of it as the table of contents for this entire blog.
              </p>
            </header>

            <div className="space-y-16">
              {CURATED.map(({ section, desc, picks, cta }) => (
                <section key={section}>
                  <h2 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-2" style={CHARTER}>
                    {section}
                  </h2>
                  <p className="text-[#6E6B68] dark:text-[#B8B4B0] mb-8">
                    {desc}
                  </p>

                  <div className="space-y-6">
                    {picks.map(({ title, why }) => {
                      const blog = blogMap[title];
                      const slug = blog?.slug || generateSlug(title);
                      return (
                        <article
                          key={title}
                          className="group p-6 rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] hover:shadow-lg transition-all duration-300"
                        >
                          <a href={`/blogs/${slug}`} className="block">
                            <h3 className="text-lg font-semibold text-[#161513] dark:text-[#F5F4F2] mb-2 group-hover:text-[#C74634] dark:group-hover:text-[#E8572A] transition-colors" style={CHARTER}>
                              {title}
                            </h3>
                            <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] italic mb-3">
                              {why}
                            </p>
                            {blog?.readTime && (
                              <span className="text-xs text-[#9a8f75] dark:text-[#6E6B68]">
                                {blog.readTime.text}
                              </span>
                            )}
                          </a>
                        </article>
                      );
                    })}
                  </div>

                  {cta && (
                    <a
                      href={cta.href}
                      className="inline-flex items-center gap-2 mt-6 text-[#C74634] dark:text-[#E8572A] font-semibold hover:gap-3 transition-all text-sm"
                    >
                      {cta.label}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  )}
                </section>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

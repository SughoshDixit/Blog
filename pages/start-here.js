import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getProminentTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import { isUnlisted } from "../Lib/postVisibility";
import { SITE_URL, siteOgImageUrl } from "../Lib/siteConfig";

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

const GOAL_TRACKS = [
  {
    section: "I want Data Science, Systems & Career Insights",
    desc: "Reflections on data science models, corporate compounding, and analytical thinking.",
    outcome: "You get practical takeaways from engineering, statistics, and career growth.",
    picks: [
      { title: "Empirical Absolutism: The Limits of Scientific Reductionism", why: "Explore the limits of pure reductionist models in real-world data science." },
      { title: "Five Years at Oracle: From Cloud Analyst to Data Scientist", why: "Career compounding, skill bets, and technical evolution." },
    ],
    cta: { label: "Browse Data Science essays", href: "/topic/Data%20Science" },
  },
  {
    section: "I want history, civilization, and national thought",
    desc: "Long-form essays connecting civilizational memory, identity, and present-day context.",
    outcome: "You gain historical context with argument-driven reading instead of noisy takes.",
    picks: [
      { title: "Gratitude for Being Born in the Ancient Civilization of Bharatavarsha", why: "Begin from a cultural lens and civilizational self-understanding." },
      { title: "Dr. Vinayak Damodar Savarkar: The Underrated Colossus of Bharat's Freedom Struggle", why: "Study a key historical figure with depth and perspective." },
      { title: "Reflections from the Akhila Bharateeya Pratinidhi Sabha 2025", why: "Synthesis of national themes, events, and broader societal vision." },
    ],
    cta: { label: "Browse Civilization topic", href: "/topic/Civilization" },
  },
  {
    section: "I want Dharma, Philosophy & Personal Essays",
    desc: "Thoughtful writing on scriptural interpretation, family, and personal journeys.",
    outcome: "You get grounded perspectives on classical thought and lived experiences.",
    picks: [
      { title: "Stop Defending Hindu Rituals with Pseudoscience", why: "Classical scriptural interpretation vs superficial science claims." },
      { title: "A heartfelt Ode and a Tribute to Ajjju", why: "A personal tribute on family, memory, and enduring values." },
    ],
    cta: { label: "Browse Vedic Studies topic", href: "/topic/Vedic%20Studies" },
  },
  {
    section: "I want concise book summaries and brand case studies",
    desc: "Synthesis from impactful books, geopolitics, and business histories.",
    outcome: "You get key ideas quickly with practical takeaways.",
    picks: [
      { title: "India in a Shifting Global Order — Book Notes", why: "A distilled strategic read on geopolitics and policy." },
      { title: "Titan: A Made-in-India Brand Story", why: "A strategic case analysis of brand building and Indian enterprise." },
    ],
    cta: { label: "Browse Book topic", href: "/topic/Book" },
  },
  {
    section: "I want football with deeper thinking",
    desc: "Football posts that mix emotion, tactics, and identity beyond match-day reactions.",
    outcome: "You understand the game and what it reveals about values and culture.",
    picks: [
      { title: "Why Support Liverpool F.C? The Beautiful Game vs The Lazy Game", why: "A foundational football essay: identity, philosophy, and style." },
    ],
    cta: { label: "Visit Football hub", href: "/football" },
  },
];

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const allTopics = getProminentTopics();
  const blogMap = {};
  allBlogs
    .filter((b) => b?.data?.isPublished && !isUnlisted(b))
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
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/start-here`} />
        <meta property="og:title" content="Start Here — Sughosh Dixit" />
        <meta property="og:description" content="New here? This curated guide walks you through the best posts across data science, personal essays, culture, and football." />
        <meta property="og:image" content={siteOgImageUrl()} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Start Here — Sughosh Dixit" />
        <meta name="twitter:description" content="New here? This curated guide walks you through the best posts across data science, personal essays, culture, and football." />
        <meta name="twitter:image" content={siteOgImageUrl()} />
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
                Choose your goal, then follow a guided path through the best existing writing.
                Each track is organized for outcome first: learn, reflect, apply, and continue.
              </p>
            </header>

            <div className="space-y-16">
              {GOAL_TRACKS.map(({ section, desc, outcome, picks, cta }) => (
                <section key={section}>
                  <h2 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-2" style={CHARTER}>
                    {section}
                  </h2>
                  <p className="text-[#6E6B68] dark:text-[#B8B4B0] mb-8">
                    {desc}
                  </p>
                  <p className="text-sm text-[#7f735f] dark:text-[#9d978d] mb-6 p-4 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27]">
                    <strong>Outcome:</strong> {outcome}
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

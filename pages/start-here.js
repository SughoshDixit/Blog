import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getProminentTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import { SITE_URL } from "../Lib/siteConfig";

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

const GOAL_TRACKS = [
  {
    section: "I want to become stronger in Data Science & AI",
    desc: "A structured progression from first principles to practical robustness in real analysis workflows.",
    outcome: "You leave with a learning sequence, not random isolated posts.",
    picks: [
      { title: "Day 1 — Boolean Logic to Numbers: AND as min, OR as max", why: "Start with intuition and notation that power the rest of the series." },
      { title: "Day 14 — Hypergeometric Distribution & Sample Size: Finding Needles in Haystacks", why: "Master practical sampling choices for real-world data constraints." },
      { title: "Day 30: A Mathematical Blueprint for Robust Decision Frameworks", why: "Consolidate all concepts into one applied, decision-ready framework." },
    ],
    cta: { label: "See the full learning path", href: "/learning-path" },
  },
  {
    section: "I want history, civilization, and national thought",
    desc: "Long-form essays connecting civilizational memory, identity, and present-day context.",
    outcome: "You gain historical context with argument-driven reading instead of noisy takes.",
    picks: [
      { title: "Gratitude for Being Born in the Ancient Civilization of Bharatavarsha", why: "Begin from cultural lens and civilizational self-understanding." },
      { title: "Vedic Studies on Marriage Part 1", why: "See classical thought translated into modern life questions." },
      { title: "Dr. Vinayak Damodar Savarkar: The Underrated Colossus of Bharat's Freedom Struggle", why: "Study a key historical figure with depth and perspective." },
    ],
  },
  {
    section: "I want better decisions in finance and life",
    desc: "Decision-oriented writing where risk, incentives, and long-horizon thinking are central.",
    outcome: "You get practical frameworks for evaluating trade-offs under uncertainty.",
    picks: [
      { title: "Five Years at Oracle: From Cloud Analyst to Data Scientist", why: "Career compounding, skill bets, and long-term payoff." },
      { title: "India in a Shifting Global Order — Book Notes", why: "Macro lens for policy, risk, and strategic positioning." },
      { title: "Day 14 — Hypergeometric Distribution and Sample Size: Finding Needles in Haystacks", why: "Think in probabilities before taking high-confidence decisions." },
    ],
  },
  {
    section: "I want concise book summaries and intellectual takeaways",
    desc: "Fast synthesis from books and long-form notes you can apply immediately.",
    outcome: "You get key ideas quickly, then can dive deeper with linked essays.",
    picks: [
      { title: "India in a Shifting Global Order — Book Notes", why: "A distilled strategic read with clear, memorable takeaways." },
      { title: "Reflection on Ramayana and Mahabharata from Ajamila", why: "Civilizational narratives decoded through practical interpretation." },
      { title: "Reflections from the Akhila Bharateeya Pratinidhi Sabha 2025", why: "Synthesis of events, themes, and broader relevance." },
    ],
    cta: { label: "Browse Book topic", href: "/topic/Book" },
  },
  {
    section: "I want football with deeper thinking",
    desc: "Football posts that mix emotion, tactics, and identity beyond match-day reactions.",
    outcome: "You understand the game and what it reveals about values and culture.",
    picks: [
      { title: "Why Support Liverpool F.C? The Beautiful Game vs The Lazy Game", why: "A foundational football essay: identity, philosophy, and style." },
      { title: "The HYPE IS REAL — Dhurandhar 2 Hit Me Where It Hurts the Most 🇮🇳🔥", why: "Sports emotion and narrative intensity through a personal lens." },
    ],
    cta: { label: "Visit Football hub", href: "/football" },
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

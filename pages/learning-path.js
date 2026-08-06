import Head from "next/head";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getProminentTopics } from "../Lib/Data";
import { SITE_URL } from "../Lib/siteConfig";
import { FiBookOpen, FiArrowRight, FiCompass } from "react-icons/fi";

export const getStaticProps = () => {
  const allTopics = getProminentTopics();
  return {
    props: {
      topics: allTopics || [],
    },
  };
};

const READING_PATHS = [
  {
    title: "Civilization & National Thought",
    description: "Deep historical analysis and reflections on Indian civilization, heritage, and the colossi of Bharat's freedom struggle.",
    topic: "Civilization",
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Dharma & Vedic Studies",
    description: "Word-by-word stotra exegesis, scriptural commentary, and deep dives into Sri Madhvacharya's philosophy.",
    topic: "Vedic Studies",
    color: "from-redwood-500 to-orange-600",
  },
  {
    title: "Personal Essays & Life",
    description: "Reflections on football, personal journeys, life off the keyboard, and tributes to family.",
    topic: "Personal",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Book Notes & Reviews",
    description: "Distilled takeaways and notes from impactful books on geopolitics, history, and strategy.",
    topic: "Book",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function LearningPath({ topics }) {
  return (
    <>
      <Head>
        <title>Curated Reading Paths | Sughosh Dixit</title>
        <meta name="description" content="Explore curated reading paths across civilization, Vedic studies, personal essays, and books by Sughosh Dixit." />
        <link rel="canonical" href={`${SITE_URL}/learning-path`} />
      </Head>

      <Navbar topics={topics} />

      <main className="min-h-screen bg-[#FAF8F6] dark:bg-[#201E1C] pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <header className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C74634]/10 text-[#C74634] dark:text-[#E8572A] text-xs font-semibold mb-4">
              <FiCompass className="w-4 h-4" />
              <span>CURATED GUIDES</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={{ fontFamily: "Charter, Georgia, serif" }}>
              Reading Paths &amp; Topics
            </h1>
            <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
              Explore curated entry points into the blog archive organized by civilizational thought, philosophy, personal essays, and book notes.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2 mb-16">
            {READING_PATHS.map((path) => (
              <div key={path.title} className="rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-8 shadow-sm hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${path.color} flex items-center justify-center text-white text-xl mb-6 shadow-md`}>
                  <FiBookOpen />
                </div>
                <h2 className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-3" style={{ fontFamily: "Charter, Georgia, serif" }}>
                  {path.title}
                </h2>
                <p className="text-[#6E6B68] dark:text-[#B8B4B0] mb-6 leading-relaxed text-sm">
                  {path.description}
                </p>
                <Link href={`/topic/${encodeURIComponent(path.topic)}`}>
                  <a className="inline-flex items-center gap-2 text-sm font-semibold text-[#C74634] dark:text-[#E8572A] hover:gap-3 transition-all">
                    Explore topic essays <FiArrowRight />
                  </a>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-2" style={{ fontFamily: "Charter, Georgia, serif" }}>
              Looking for full archive?
            </h3>
            <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] mb-6">
              Browse the complete list of published essays, search by keyword, or filter by release date.
            </p>
            <Link href="/archive">
              <a className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C74634] text-white font-semibold text-sm hover:bg-[#A73A2C] transition-colors">
                View Full Archive <FiArrowRight />
              </a>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}


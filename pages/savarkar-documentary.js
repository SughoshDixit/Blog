import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getProminentTopics } from "../Lib/Data";
import { SITE_URL } from "../Lib/siteConfig";

const VIDEO_ID = "5fBTT9MwQio";
const VIDEO_URL = `https://youtu.be/${VIDEO_ID}`;
const EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1`;

export const getStaticProps = () => {
  const topics = getProminentTopics();
  return { props: { topics: topics || [] } };
};

export default function SavarkarDocumentaryPage({ topics }) {
  const title = "Veer Savarkar — AI Cinematic Documentary";
  const description =
    "An AI-generated cinematic documentary built with NotebookLM, summarizing the Veer Savarkar research track on this site.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/savarkar-documentary`} />
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/savarkar-documentary`} />
      </Head>

      <div className="min-h-screen bg-[#FAF8F6] dark:bg-[#201E1C] transition-colors duration-300">
        <Navbar topics={topics} />

        <main className="pt-24 pb-16 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-3">
                Featured Documentary
              </p>
              <h1
                className="text-3xl md:text-5xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                Veer Savarkar — AI Cinematic Documentary
              </h1>
              <p className="text-[#5e5645] dark:text-[#B8B4B0] text-lg leading-relaxed max-w-3xl">
                This short film is the visual and narrative capsule of the Savarkar thread on this
                blog, created using NotebookLM and AI-first storytelling workflows.
              </p>
            </div>

            <div className="rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-black overflow-hidden shadow-xl mb-10">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  title="Veer Savarkar AI documentary"
                  src={EMBED_URL}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-6 md:p-8">
              <h2
                className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-3"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                Why this sits at the center
              </h2>
              <p className="text-[#5e5645] dark:text-[#B8B4B0] leading-relaxed mb-6">
                The documentary consolidates long-form notes into a single cinematic artifact.
                It lets new visitors understand your civilizational lens quickly before diving into
                written essays.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={VIDEO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#C74634] text-white font-medium hover:bg-[#A73A2C] transition-colors"
                >
                  Watch on YouTube
                </a>
                <a
                  href="/topic/Civilization"
                  className="inline-flex items-center px-5 py-2.5 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-[#4f4636] dark:text-[#F5F4F2] hover:border-[#cbbf9f] transition-colors"
                >
                  Read related essays
                </a>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Head from "next/head";
import { getProminentTopics } from "../Lib/Data";
import { SITE_URL } from "../Lib/siteConfig";
import { FiClock, FiTag, FiBookOpen, FiExternalLink } from "react-icons/fi";
import { FaSeedling } from "react-icons/fa";

export const getStaticProps = () => {
  const allTopics = getProminentTopics();
  return { props: { topics: allTopics } };
};

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

const notes = [
  {
    id: "4",
    date: "April 29, 2026",
    title: "Antimatter (IOP) — Why does reality prefer matter?",
    category: "Physics / Curiosity Stack",
    content:
      "Half-baked idea: if antimatter is the mirror twin, maybe the universe has a cosmic bias setting hidden in plain sight. I want to read this and see whether my intuition is deep or just expensive sci-fi fan fiction in a blazer.",
    tags: ["Antimatter", "Cosmology", "Fundamental Physics"],
    paperUrl: "https://www.iop.org/sites/default/files/2019-06/Antimatter%202013_0.pdf",
    visual: "antimatter",
  },
  {
    id: "3",
    date: "April 29, 2026",
    title: "A&A 2018 Paper — Star formation, but with receipts",
    category: "Astrophysics / Data Curiosity",
    content:
      "Half-baked idea: every stellar nursery is basically a chaotic startup incubator with gravity as the VC. I want to decode how they model this and see if some of those inference tricks can inspire better uncertainty thinking in ML pipelines.",
    tags: ["Astrophysics", "A&A", "Modeling"],
    paperUrl: "https://www.aanda.org/articles/aa/pdf/2018/12/aa32898-18.pdf",
    visual: "stellar",
  },
  {
    id: "2",
    date: "April 29, 2026",
    title: "IAEA SEP_03 — Serious science with reactor-grade consequences",
    category: "Nuclear Science / Applied Systems",
    content:
      "Half-baked idea: nuclear literature reads like systems engineering with no room for vibes, and that is exactly why I like it. I want to mine this paper for how experts reason when the error budget is basically 'do not explode'.",
    tags: ["IAEA", "Nuclear", "Safety Systems"],
    paperUrl: "https://www-pub.iaea.org/mtcd/publications/pdf/csp_008c/pdf/sep_03.pdf",
    visual: "reactor",
  },
  {
    id: "1",
    date: "April 29, 2026",
    title: "IEEE 9783210 — Engineering signal from chaos",
    category: "IEEE / Applied Intelligence",
    content:
      "Half-baked idea: this looks like one of those papers where the abstract feels innocent, but equation 7 quietly changes your worldview. I want to unpack the core method and see where it can plug directly into my production ML workflows.",
    tags: ["IEEE", "Algorithms", "Applied AI"],
    paperUrl: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=9783210",
    visual: "ieee",
  },
];

function GardenVisual({ type }) {
  if (type === "antimatter") {
    return (
      <div className="garden-visual garden-visual-antimatter" aria-hidden="true">
        <span className="matter-orb matter-orb-a" />
        <span className="matter-orb matter-orb-b" />
        <span className="matter-orb matter-orb-c" />
      </div>
    );
  }
  if (type === "stellar") {
    return (
      <div className="garden-visual garden-visual-stellar" aria-hidden="true">
        <span className="star star-a" />
        <span className="star star-b" />
        <span className="star star-c" />
        <span className="star star-d" />
      </div>
    );
  }
  if (type === "reactor") {
    return (
      <div className="garden-visual garden-visual-reactor" aria-hidden="true">
        <span className="reactor-bar reactor-bar-1" />
        <span className="reactor-bar reactor-bar-2" />
        <span className="reactor-bar reactor-bar-3" />
        <span className="reactor-ring" />
      </div>
    );
  }
  return (
    <div className="garden-visual garden-visual-ieee" aria-hidden="true">
      <span className="signal-line signal-line-a" />
      <span className="signal-line signal-line-b" />
      <span className="signal-line signal-line-c" />
    </div>
  );
}

function DigitalGarden({ topics }) {
  return (
    <div className="min-h-screen relative bg-[#F9F8F6] dark:bg-[#161513] transition-colors duration-300">
      <Head>
        <title>Digital Garden — Sughosh Dixit</title>
        <meta
          name="description"
          content="A collection of rough notes, Today-I-Learned (TIL) snippets, and continuous learning logs."
        />
        <link rel="canonical" href={`${SITE_URL}/garden`} />
      </Head>

      <Navbar topics={topics} />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Header */}
          <div className="mb-16 border-b border-[#E0DDD9] dark:border-[#3D3A36] pb-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#2d6a4f]/10 border border-[#2d6a4f]/20 text-[#2d6a4f] mb-6">
              <FaSeedling className="text-lg" />
              <span className="text-sm font-semibold tracking-wide uppercase">Digital Garden</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-6 tracking-tight" style={CHARTER}>
              Learning in Public.
            </h1>
            <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
              Not everything needs to be a polished, 3,000-word essay. This is my digital garden—a place for raw notes, code snippets, paper summaries, and half-baked ideas. It grows over time.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-[#E0DDD9] dark:border-[#3D3A36] pl-8 md:pl-12 space-y-16">
            {notes.map((note) => (
              <div key={note.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] md:-left-[57px] top-1 w-5 h-5 rounded-full bg-white dark:bg-[#161513] border-4 border-[#2d6a4f] group-hover:scale-125 transition-transform duration-300"></div>
                
                {/* Content Card */}
                <div className="bg-white dark:bg-[#2C2A27] rounded-2xl p-6 md:p-8 border border-[#E0DDD9] dark:border-[#3D3A36] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[#6E6B68] dark:text-[#B8B4B0]">
                    <div className="flex items-center gap-1.5 font-medium text-[#2d6a4f]">
                      <FiBookOpen />
                      {note.category}
                    </div>
                    <span>&middot;</span>
                    <div className="flex items-center gap-1.5">
                      <FiClock />
                      {note.date}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
                    {note.title}
                  </h2>

                  <GardenVisual type={note.visual} />
                  
                  <div className="prose dark:prose-invert max-w-none text-[#6E6B68] dark:text-[#B8B4B0] mb-6 leading-relaxed">
                    <p>{note.content}</p>
                  </div>

                  <a
                    href={note.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-[#2d6a4f] text-white text-sm font-medium hover:bg-[#255640] transition-colors"
                  >
                    Open paper
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                  
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-[#3D3A36] text-gray-700 dark:text-gray-300">
                        <FiTag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DigitalGarden;
